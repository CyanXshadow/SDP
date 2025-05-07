import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  MenuItem, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  TablePagination,
  CircularProgress,
  IconButton,
  Tooltip
} from '@mui/material';
import { Refresh, Warning, CheckCircle } from '@mui/icons-material';
import Papa from 'papaparse';

const MyData = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [plates, setPlates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPlateData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/ml-data/all_license_plates.csv');
      if (!response.ok) throw new Error(`Failed to load data: ${response.status}`);
      
      const csvText = await response.text();
      
      return new Promise((resolve, reject) => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            // Process and sort by timestamp in descending order (newest first)
            const processedData = results.data
              .filter(row => row.timestamp && row.license_plate)
              .map(row => ({
                id: `${row.timestamp}-${row.license_plate}`,
                plateNumber: formatPlateNumber(row.license_plate),
                isOffender: row.is_offender?.toLowerCase() === 'yes',
                timestamp: new Date(row.timestamp), // Keep as Date object for sorting
                displayTimestamp: formatTimestamp(new Date(row.timestamp)),
                confidence: row.confidence ? `${parseFloat(row.confidence).toFixed(1)}%` : 'N/A'
              }))
              // Sort by timestamp in descending order (newest first)
              .sort((a, b) => b.timestamp - a.timestamp);
              
            resolve(processedData);
          },
          error: (error) => reject(error)
        });
      });
    } catch (err) {
      throw err;
    }
  };

  const formatPlateNumber = (plate) => {
    return plate.replace(/([A-Za-z]+)(\d+)/, '$1 $2');
  };

  const formatTimestamp = (date) => {
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const loadData = async () => {
    try {
      const data = await fetchPlateData();
      setPlates(data);
    } catch (err) {
      console.error('Error loading plate data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRefresh = () => {
    loadData();
  };

  const filteredPlates = filter === 'offenders' 
    ? plates.filter(plate => plate.isOffender) 
    : plates;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
          sx={{ mb: 2 }}
        >
          Back to Dashboard
        </Button>
        <Paper sx={{ 
          p: 3, 
          textAlign: 'center',
          backgroundColor: 'error.light'
        }}>
          <Typography variant="h5" color="error" gutterBottom>
            Error Loading Data
          </Typography>
          <Typography sx={{ mb: 2 }}>{error}</Typography>
          <Button 
            variant="contained" 
            color="error"
            startIcon={<Refresh />}
            onClick={handleRefresh}
          >
            Retry
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/')}
        sx={{ mb: 2 }}
      >
        Back to Dashboard
      </Button>
      
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 3
      }}>
        <Typography variant="h4" gutterBottom>
          License Plate Database
        </Typography>
        <Tooltip title="Refresh data">
          <IconButton onClick={handleRefresh}>
            <Refresh />
          </IconButton>
        </Tooltip>
      </Box>
      
      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <TextField
          select
          label="Filter Plates"
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            setPage(0);
          }}
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="all">All Plates ({plates.length})</MenuItem>
          <MenuItem value="offenders">
            Offenders Only ({plates.filter(p => p.isOffender).length})
          </MenuItem>
        </TextField>
      </Box>
      
      <TableContainer component={Paper} sx={{ maxHeight: 'calc(100vh - 250px)' }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', width: '35%' }}>License Plate</TableCell>
              <TableCell sx={{ fontWeight: 'bold', width: '35%' }}>Timestamp</TableCell>
              <TableCell sx={{ fontWeight: 'bold', width: '20%' }}>Confidence</TableCell>
              <TableCell sx={{ fontWeight: 'bold', width: '10%' }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPlates.length > 0 ? (
              filteredPlates
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((plate) => (
                  <TableRow 
                    key={plate.id}
                    hover
                    sx={{ 
                      backgroundColor: plate.isOffender ? 'rgba(255, 0, 0, 0.05)' : 'inherit'
                    }}
                  >
                    <TableCell 
                      sx={{ 
                        fontFamily: 'monospace',
                        fontSize: '1.1rem',
                        color: plate.isOffender ? 'error.main' : 'inherit',
                        fontWeight: plate.isOffender ? 'bold' : 'normal'
                      }}
                    >
                      {plate.plateNumber}
                    </TableCell>
                    <TableCell>{plate.displayTimestamp}</TableCell>
                    <TableCell>{plate.confidence}</TableCell>
                    <TableCell>
                      {plate.isOffender ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', color: 'error.main' }}>
                          <Warning fontSize="small" sx={{ mr: 1 }} />
                          Offender
                        </Box>
                      ) : (
                        <Box sx={{ display: 'flex', alignItems: 'center', color: 'success.main' }}>
                          <CheckCircle fontSize="small" sx={{ mr: 1 }} />
                          Normal
                        </Box>
                      )}
                    </TableCell>
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body1">
                    {filter === 'offenders' 
                      ? 'No offender plates found' 
                      : 'No license plate data available'}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      <TablePagination
        rowsPerPageOptions={[10, 25, 50, 100]}
        component="div"
        count={filteredPlates.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{ mt: 1 }}
      />
    </Box>
  );
};

export default MyData;