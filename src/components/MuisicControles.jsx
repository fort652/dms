import React from 'react';
import Image from 'next/image';
import { Box } from '@mui/material';
import { ColorLinearProgress } from './MusicPlayer';
const MusicControls = ({ isPlaying, togglePlay, skipBackward, skipForward, currentSong, progress, songDuration, handleProgressBarClick }) => {
  return (
    <>
      <Box mt={2}>{currentSong.title}</Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '70%',
          mt: 3,
          alignItems: 'center',
          maxWidth: 300,
        }}
      >
        <Image src="/skip-previous.svg" alt="Previous" width={20} height={20} onClick={skipBackward}/>
        <Image src={!isPlaying ? '/play.svg' : 'pause.svg'} alt="Play Icon" width={40} height={40} onClick={togglePlay}/>
        <Image src="/skip-next.svg" alt="next" width={20} height={20} onClick={skipForward}/>
      </Box>
      <Box sx={{color: 'white'}} mt={4}>{currentSong.title}</Box>
      <ColorLinearProgress
        onClick={handleProgressBarClick}
        sx={{ height: 10, width: {xs: '90%', md: '40%'}, borderRadius: 5, border: '1px solid orange', mt: 4}}
        variant="determinate"
        value={(progress / songDuration) * 100}
      />
    </>
  );
};

export default MusicControls;