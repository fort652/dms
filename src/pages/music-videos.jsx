import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import VideoCard from '../components/VideoCard';
import VideoData from '../components/VideoData';

const VideoPage = () => {
  return (
    <Box>
      <Typography variant="h5" sx={{ fontSize: { xs: '20px', md: '24px' }, color: 'white', my: 3, textAlign: 'center' }}>
        Enjoy The Music Videos!
      </Typography>
      <Grid container spacing={0} ml={3}>
        {VideoData.map((video, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <VideoCard video={video} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default VideoPage;
