import React from 'react';
import { Box } from '@mui/material';
import CameraFeed from '../components/CameraFeed/CameraFeed';
import RecentPlates from '../components/RecentPlates/RecentPlates';
import DatabaseStats from '../components/DatabaseStats/DatabaseStats';

const Dashboard = () => {
  return (
    <Box sx={{ 
      display: 'flex',
      height: '100vh', // Full viewport height
      p: 2,
      gap: 2,
      overflow: 'hidden' // Prevent double scrolling
    }}>
      {/* Left Panel (30% width - Sticky) */}
      <Box sx={{ 
        width: '30%',
        position: 'sticky',
        top: 0,
        height: '100vh', // Full viewport height
        overflowY: 'auto' // Enable scrolling if content exceeds height
      }}>
        <DatabaseStats />
      </Box>

      {/* Right Panel (70% width - Scrollable) */}
      <Box sx={{ 
        width: '70%',
        overflowY: 'auto', // Enable scrolling
        display: 'flex',
        flexDirection: 'column',
        gap: 2
      }}>
        {/* Camera Feed (Top) */}
        <Box sx={{ 
          flex: 1,
          minHeight: '50%',
          borderRadius: 2,
          overflow: 'hidden',
          boxShadow: 3,
          backgroundColor: 'lightblue'
        }}>
          <CameraFeed />
        </Box>
        
        {/* Recent Plates (Bottom) */}
        <Box sx={{ 
          flex: 1,
          minHeight: '50%',
          borderRadius: 2,
          overflow: 'hidden',
          boxShadow: 3,
          backgroundColor: 'white'
        }}>
          <RecentPlates />
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;