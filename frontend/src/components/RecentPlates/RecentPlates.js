import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Box,
  IconButton,
  Tooltip
} from '@mui/material';
import { Refresh, ErrorOutline, Info } from '@mui/icons-material';
import Papa from 'papaparse';
import './RecentPlates.css';

const RecentPlates = () => {
  const [plates, setPlates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchPlateData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/ml-data/all_license_plates.csv');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const csvText = await response.text();
      
      return new Promise((resolve, reject) => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            if (results.errors.length > 0) {
              console.warn('CSV parsing warnings:', results.errors);
            }
            
            const processedData = results.data
              .filter(row => row.timestamp && row.license_plate)
              .map(row => ({
                id: `${row.timestamp}-${row.license_plate}`,
                plateNumber: formatPlateNumber(row.license_plate),
                isOffender: row.is_offender?.toLowerCase() === 'yes',
                timestamp: new Date(row.timestamp),
                confidence: row.confidence ? `${parseFloat(row.confidence).toFixed(1)}%` : 'N/A'
              }))
              .sort((a, b) => b.timestamp - a.timestamp)
              .slice(0, 10);
              
            resolve(processedData);
          },
          error: (error) => reject(new Error(`CSV parse error: ${error.message}`))
        });
      });
    } catch (err) {
      throw new Error(`Failed to load plate data: ${err.message}`);
    }
  };

  const formatPlateNumber = (plate) => {
    // Add spaces for better readability if needed
    return plate.replace(/([A-Za-z]+)(\d+)/, '$1 $2');
  };

  const formatTimestamp = (date) => {
    return date.toLocaleString('en-US', {
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
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error loading plate data:', err);
      setError(err.message);
      setPlates([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    
    const intervalId = setInterval(loadData, 15000); // Refresh every 15 seconds
    
    return () => clearInterval(intervalId);
  }, []);

  const handleRefresh = () => {
    loadData();
  };

  if (loading && plates.length === 0) {
    return (
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '300px',
        gap: 2
      }}>
        <CircularProgress size={60} />
        <Typography variant="h6" color="text.secondary">
          Loading license plate data...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Paper elevation={3} sx={{
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        mt: 2,
        backgroundColor: 'error.light'
      }}>
        <ErrorOutline color="error" sx={{ fontSize: 60, mb: 2 }} />
        <Typography variant="h6" color="error.dark" gutterBottom>
          Error Loading Data
        </Typography>
        <Typography paragraph sx={{ mb: 2 }}>
          {error}
        </Typography>
        <Tooltip title="Retry loading data">
          <IconButton 
            color="error" 
            onClick={handleRefresh}
            size="large"
          >
            <Refresh fontSize="inherit" />
          </IconButton>
        </Tooltip>
      </Paper>
    );
  }

  if (plates.length === 0) {
    return (
      <Paper elevation={3} sx={{
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        mt: 2
      }}>
        <Info color="info" sx={{ fontSize: 60, mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          No License Plates Detected
        </Typography>
        <Typography paragraph sx={{ mb: 2 }}>
          The system has not recorded any license plates yet.
        </Typography>
        <Tooltip title="Refresh data">
          <IconButton 
            color="primary" 
            onClick={handleRefresh}
            size="large"
          >
            <Refresh fontSize="inherit" />
          </IconButton>
        </Tooltip>
      </Paper>
    );
  }

  return (
    <>
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 2
      }}>
        <Typography variant="h6" component="h2">
          Recent License Plates
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {lastUpdated && (
            <Typography variant="caption" color="text.secondary">
              Last updated: {formatTimestamp(lastUpdated)}
            </Typography>
          )}
          <Tooltip title="Refresh data">
            <IconButton 
              onClick={handleRefresh}
              size="small"
              disabled={loading}
            >
              <Refresh fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      
      <TableContainer 
        component={Paper} 
        sx={{ 
          maxHeight: 'calc(100vh - 200px)',
          overflow: 'auto',
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px'
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0,0,0,0.2)',
            borderRadius: '4px'
          }
        }}
      >
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', width: '30%' }}>License Plate</TableCell>
              <TableCell sx={{ fontWeight: 'bold', width: '30%' }}>Timestamp</TableCell>
              <TableCell sx={{ fontWeight: 'bold', width: '20%' }}>Confidence</TableCell>
              <TableCell sx={{ fontWeight: 'bold', width: '20%' }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {plates.map((plate) => (
              <TableRow
                key={plate.id}
                sx={{
                  '&:hover': { backgroundColor: 'action.hover' },
                  backgroundColor: plate.isOffender ? 'rgba(255, 0, 0, 0.05)' : 'inherit'
                }}
              >
                <TableCell 
                  sx={{ 
                    fontWeight: plate.isOffender ? 'bold' : 'normal',
                    color: plate.isOffender ? 'error.main' : 'inherit',
                    fontFamily: 'monospace',
                    fontSize: '1.1rem'
                  }}
                >
                  {plate.plateNumber}
                </TableCell>
                <TableCell>{formatTimestamp(plate.timestamp)}</TableCell>
                <TableCell>{plate.confidence}</TableCell>
                <TableCell>
                  {plate.isOffender ? (
                    <Typography 
                      color="error" 
                      variant="body2"
                      sx={{
                        fontWeight: 'bold',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 0.5
                      }}
                    >
                      <span>⚠️</span> Offender
                    </Typography>
                  ) : (
                    <Typography 
                      color="text.secondary" 
                      variant="body2"
                      sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}
                    >
                      <span>✓</span> Normal
                    </Typography>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default RecentPlates;