import React, { useState } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const CameraFeed = () => {
  const [activeCamera, setActiveCamera] = useState(0);
  const cameras = [
    { id: 1, name: 'Laptop Camera' },
    { id: 2, name: 'Mobile Camera' }
  ];

  const handlePrev = () => {
    setActiveCamera((prev) => (prev === 0 ? cameras.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveCamera((prev) => (prev === cameras.length - 1 ? 0 : prev + 1));
  };

  return (
    <Box sx={{ 
      width: '96.5%',
      height: '100%',
      position: 'relative',
      border: '1px solid #ddd',
      borderRadius: 2,
      p: 2
    }}>
      <Typography variant="h6" gutterBottom>
        {cameras[activeCamera].name}
      </Typography>
      
      {/* Camera Feed Placeholder */}
      <Box sx={{
        height: 'calc(100% - 100px)',
        bgcolor: '#f0f0f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        mb: 2
      }}>
        <Typography>Camera Feed {activeCamera + 1}</Typography>
      </Box>
      
      {/* Camera Info */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography>Cam ID: {cameras[activeCamera].id}</Typography>
        <Typography>{new Date().toLocaleString()}</Typography>
      </Box>
      
      {/* Navigation Arrows */}
      <IconButton 
        onClick={handlePrev}
        sx={{ position: 'absolute', left: 10, top: '50%' }}
      >
        <ArrowBackIosIcon />
      </IconButton>
      <IconButton 
        onClick={handleNext}
        sx={{ position: 'absolute', right: 10, top: '50%' }}
      >
        <ArrowForwardIosIcon />
      </IconButton>
    </Box>
  );
};

export default CameraFeed;