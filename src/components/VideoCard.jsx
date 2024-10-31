import React from 'react';
import { useRouter } from 'next/router';
import { Box, Typography } from '@mui/material';

const VideoCard = ({ video }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/video/${video.title}`);
  };

  return (
    <Box  sx={{ cursor: 'pointer'}}  onClick={handleClick}>
        <Box pb={5}>
      <video src={video.url} style={{ maxWidth: '90%', maxHeight: '100%', display: 'block', borderRadius: 10 }} />
      <Typography color={'white'} sx={{ fontSize: { xs: '16px', md: '20px' } }}>{video.title}</Typography>
      <Typography color={'gray'} sx={{ fontSize: { xs: '14px', md: '16px' } }}>Dieoutjiemuisic</Typography>
      </Box>
    </Box >
  );
};

export default VideoCard;
