import './Database.css';
import React, { useState } from 'react';
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
  Tooltip,
  IconButton
} from '@mui/material';
import { 
  Warning as WarningIcon,
  FilterList as FilterListIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';

const Database = () => {
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Sample data - will be replaced with real API data
  const plates = [
    { id: 1, plateNumber: 'AP 31 EY 3382', isOffender: false, timestamp: new Date('2023-05-15T09:23:45').toLocaleString(), cameraId: 'CAM-1207' },
    { id: 2, plateNumber: 'AP 29 FT 2110', isOffender: true, timestamp: new Date('2023-05-15T10:15:22').toLocaleString(), cameraId: 'CAM-1208' },
    { id: 3, plateNumber: 'TS 09 WS 4104', isOffender: false, timestamp: new Date('2023-05-15T11:07:33').toLocaleString(), cameraId: 'CAM-1207' },
    { id: 4, plateNumber: 'KL 03 OP 5005', isOffender: true, timestamp: new Date('2023-05-15T12:45:18').toLocaleString(), cameraId: 'CAM-1209' },
    { id: 5, plateNumber: 'MH 12 AB 1234', isOffender: false, timestamp: new Date('2023-05-15T13:30:55').toLocaleString(), cameraId: 'CAM-1210' },
    { id: 6, plateNumber: 'DL 04 CD 5678', isOffender: true, timestamp: new Date('2023-05-15T14:22:10').toLocaleString(), cameraId: 'CAM-1211' },
    { id: 7, plateNumber: 'KA 05 EF 9012', isOffender: false, timestamp: new Date('2023-05-15T15:18:42').toLocaleString(), cameraId: 'CAM-1212' },
    { id: 8, plateNumber: 'TN 22 GH 3456', isOffender: false, timestamp: new Date('2023-05-15T16:05:29').toLocaleString(), cameraId: 'CAM-1213' },
    { id: 9, plateNumber: 'GJ 01 IJ 7890', isOffender: true, timestamp: new Date('2023-05-15T17:11:37').toLocaleString(), cameraId: 'CAM-1214' },
    { id: 10, plateNumber: 'RJ 14 KL 2468', isOffender: false, timestamp: new Date('2023-05-15T18:33:19').toLocaleString(), cameraId: 'CAM-1215' },
    { id: 11, plateNumber: 'MP 25 MN 1357', isOffender: false, timestamp: new Date('2023-05-15T19:45:01').toLocaleString(), cameraId: 'CAM-1216' },
    { id: 12, plateNumber: 'UP 16 OP 8024', isOffender: true, timestamp: new Date('2023-05-15T20:12:48').toLocaleString(), cameraId: 'CAM-1217' },
  ];

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

  const handleRefresh = () => {
    // Will be implemented with actual data fetching
    console.log('Refreshing data...');
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          License Plate Database
        </Typography>
        
        <Box>
          <Tooltip title="Refresh Data">
            <IconButton onClick={handleRefresh} color="primary" sx={{ mr: 2 }}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          
          <TextField
            select
            label="Filter Plates"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            sx={{ minWidth: 200 }}
            InputProps={{
              startAdornment: <FilterListIcon color="action" sx={{ mr: 1 }} />
            }}
          >
            <MenuItem value="all">All Plates</MenuItem>
            <MenuItem value="offenders">Offenders Only</MenuItem>
          </TextField>
        </Box>
      </Box>
      
      <TableContainer component={Paper} sx={{ maxHeight: 'calc(100vh - 200px)' }}>
        <Table stickyHeader aria-label="license plate database">
          <TableHead>
            <TableRow>
              <TableCell>Plate Number</TableCell>
              <TableCell>Camera ID</TableCell>
              <TableCell>Timestamp</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPlates
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((plate) => (
                <TableRow 
                  key={plate.id}
                  hover
                  sx={{ 
                    '&:last-child td, &:last-child th': { border: 0 },
                    backgroundColor: plate.isOffender ? 'rgba(255, 0, 0, 0.05)' : 'inherit'
                  }}
                >
                  <TableCell 
                    sx={{ 
                      color: plate.isOffender ? 'error.main' : 'inherit',
                      fontWeight: plate.isOffender ? 'bold' : 'normal'
                    }}
                  >
                    {plate.plateNumber}
                  </TableCell>
                  <TableCell>{plate.cameraId}</TableCell>
                  <TableCell>{plate.timestamp}</TableCell>
                  <TableCell>
                    {plate.isOffender && (
                      <Tooltip title="Registered Offender">
                        <WarningIcon color="error" />
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredPlates.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{ mt: 2 }}
      />
    </Box>
  );
};

export default Database;