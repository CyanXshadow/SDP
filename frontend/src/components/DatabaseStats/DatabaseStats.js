import React from 'react';
import { Box, Typography, Paper, Divider, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const DatabaseStats = () => {
  const navigate = useNavigate();
  return (
    <Paper elevation={3} sx={{ 
      height: '100%',
      p: 2,
      display: 'flex',
      position: 'Sticky',
      flexDirection: 'column',
      gap: 2
    }}>
      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
        Database Statistics
      </Typography>
      
      <Box>
        <Typography variant="subtitle1">Total Records</Typography>
        <Typography variant="h4" color="primary">1,248</Typography>
      </Box>
      
      <Divider />
      
      <Box>
        <Typography variant="subtitle1">Offenders Today</Typography>
        <Typography variant="h4" color="error">12</Typography>
      </Box>
      
      <Divider />
      
      <Box>
        <Typography variant="subtitle1">Cameras Active</Typography>
        <Typography variant="h4" color="success.main">2/2</Typography>
      </Box>
      
      <Divider />
      
      <Box>
        <Typography variant="subtitle1">Last Alert</Typography>
        <Typography>AP 29 FT 2110</Typography>
        <Typography variant="caption" color="text.secondary">
          15 minutes ago
        </Typography>
      </Box>
      <Button 
        variant="contained" 
        color="primary"
        onClick={() => navigate('/mydata')}
        sx={{ mt: 2 }}
      >
        View MyData
      </Button>
    </Paper>
  );
};

export default DatabaseStats;