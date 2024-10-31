import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import {
  Dialog,
  Button,
  Container,
  Box,
  Typography,
  LinearProgress,
  styled,
  IconButton,
  Menu,
  MenuItem
} from '@mui/material';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import songs from '../data/songs';

const ColorLinearProgress = styled(LinearProgress)({
  color: '#ffff00',
  '& .MuiLinearProgress-barColorPrimary': {
    backgroundColor: '#ffff00',
  },
});

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isShuffle, setIsShuffle] = useState(false); // Shuffle state
  const [songHistory, setSongHistory] = useState([]); // To store played songs
  const [menuAnchorEl, setMenuAnchorEl] = useState(null); // To open/close menu
  const [menuSong, setMenuSong] = useState(null); // To keep track of which song the menu was opened for
  const [songQueue, setSongQueue] = useState([]); // Song queue
  const audioRef = useRef(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);
  const [songDuration, setSongDuration] = useState(0);

  useEffect(() => {
    // Load queue from localStorage when component mounts
    const storedQueue = JSON.parse(localStorage.getItem('songQueue'));
    const storedShuffle = JSON.parse(localStorage.getItem('isShuffle'));

    if (storedQueue) {
      setSongQueue(storedQueue);
    }

    if (storedShuffle !== null) {
      setIsShuffle(storedShuffle); // Set shuffle state
    }
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener('ended', skipForward);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('ended', skipForward);
      }
    };
  }, [audioRef.current, currentSongIndex, isPlaying]);

  const handleDownload = (url, title) => {
    setSelectedSong({ url, title });
    setOpenDialog(true);
  };

  const confirmDownload = () => {
    const link = document.createElement('a');
    link.href = selectedSong.url;
    link.download = `${selectedSong.title}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setOpenDialog(false);
  };

  const handleProgressBarClick = (event) => {
    const progressBar = event.currentTarget;
    const boundingRect = progressBar.getBoundingClientRect();
    const clickedPositionInPx = event.clientX - boundingRect.left;
    const widthOfProgressBarInPx = boundingRect.width;
    const clickedPositionAsPercentage = clickedPositionInPx / widthOfProgressBarInPx;
    const newCurrentTime = clickedPositionAsPercentage * songDuration;

    if (audioRef.current) {
      audioRef.current.currentTime = newCurrentTime;
      setProgress(newCurrentTime);
    }
  };

  const playSong = (songIndex, startTime = 0, playImmediately = true) => {
    const audioElement = new Audio(songs[songIndex].url);
    audioElement.currentTime = startTime;
    audioElement.onloadedmetadata = () => {
      setSongDuration(audioElement.duration);
    };
    if (playImmediately) {
      audioElement.play();
      setIsPlaying(true);
    }

    setCurrentSongIndex(songIndex);
    audioRef.current = audioElement;
    setProgress(0);
  };

  const togglePlay = () => {
    const audioElement = audioRef.current;

    if (audioElement && isPlaying) {
      audioElement.pause();
      setIsPlaying(false);
    } else {
      if (audioElement) {
        audioElement.play();
        setIsPlaying(true);
      } else {
        playSong(currentSongIndex);
      }
    }
  };

  const skipForward = () => {
    // Check if there's a song in the queue
    if (songQueue.length > 0) {
      const nextSongIndex = songQueue[0]; // Get the first song in the queue
      setSongQueue((prevQueue) => prevQueue.slice(1)); // Remove the song from the queue

      // Update the queue in localStorage
      localStorage.setItem('songQueue', JSON.stringify(songQueue.slice(1)));

      // Pause the current song
      if (audioRef.current) {
        audioRef.current.pause();
      }

      // Play the next song from the queue
      playSong(nextSongIndex);
    } else {
      // No songs in queue, proceed as normal
      let nextSongIndex;
      if (isShuffle) {
        // Shuffle mode: Pick a random song and save the current song to history
        setSongHistory((prevHistory) => [...prevHistory, currentSongIndex]);
        nextSongIndex = Math.floor(Math.random() * songs.length);
      } else {
        // Normal mode: Go to the next song in order
        nextSongIndex = (currentSongIndex + 1) % songs.length;
      }

      if (isPlaying) {
        audioRef.current.pause();
        playSong(nextSongIndex);
      } else {
        playSong(nextSongIndex, 0, false);
      }

      if (!isPlaying && audioRef.current.paused) {
        audioRef.current.play();
        setIsPlaying(true);
      }

      setProgress(0);
      setSongDuration(0);
    }
  };

  const skipBackward = () => {
    if (isShuffle && songHistory.length > 0) {
      // Shuffle mode: Go to the previous song from the history
      const lastSongIndex = songHistory[songHistory.length - 1];
      setSongHistory((prevHistory) => prevHistory.slice(0, -1)); // Remove the last song from history

      // Pause the current song
      if (audioRef.current) {
        audioRef.current.pause();
      }

      // Play the previous song from the history
      playSong(lastSongIndex);
    } else {
      // Normal mode: Go to the previous song
      const audioElement = audioRef.current;
      if (audioElement.currentTime <= 5 && currentSongIndex !== 0) {
        if (isPlaying) {
          audioElement.pause();
        }
        playSong(currentSongIndex - 1, 0);
      } else {
        if (isPlaying) {
          audioElement.pause();
        }
        playSong(currentSongIndex, 0);
      }
    }

    setProgress(0);
    setSongDuration(0);
  };

  const toggleShuffle = () => {
    setIsShuffle((prev) => {
      const newShuffleState = !prev;
      localStorage.setItem('isShuffle', JSON.stringify(newShuffleState)); // Save shuffle state to localStorage
      return newShuffleState;
    }); // Toggle shuffle state
    setSongHistory([]); // Clear song history when toggling shuffle
  };

  const handleMenuOpen = (event, songIndex) => {
    event.stopPropagation(); // Prevent the song from playing when clicking the menu
    setMenuAnchorEl(event.currentTarget);
    setMenuSong(songIndex); // Keep track of the song index for the menu
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setMenuSong(null);
  };

  const addToQueue = (songIndex) => {
    const updatedQueue = [...songQueue, songIndex]; // Add the song to the queue
    setSongQueue(updatedQueue);
    localStorage.setItem('songQueue', JSON.stringify(updatedQueue)); // Update queue in localStorage
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (isPlaying && audioRef.current) {
        setProgress(audioRef.current.currentTime);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  useEffect(() => {
    const currentSongElement = document.getElementById(`song-${currentSongIndex}`);

    if (currentSongElement) {
      currentSongElement.scrollIntoView({ behavior: 'auto', block: 'nearest' });
    }
  }, [currentSongIndex]);

  const handleSongClick = (songIndex) => {
    const isCurrentSong = currentSongIndex === songIndex;
    const audioElement = audioRef.current;

    if (audioElement && isPlaying && !isCurrentSong) {
      audioElement.pause();
      setIsPlaying(false);
    }

    if (!isCurrentSong) {
      playSong(songIndex);
    } else {
      togglePlay();
    }
  };

  return (
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '90vh',
      }}
    >
      <Box mt={3}>
        <Image src={songs[currentSongIndex].cover} alt="Album Cover" width={150} height={150} />
      </Box>
      <Box>{songs[currentSongIndex].title}</Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '70%',
          mt: 1,
          alignItems: 'center',
          maxWidth: 300,
        }}
      >
        <Image src="/skip-previous.svg" alt="Previous" width={20} height={20} onClick={skipBackward} />
        <Image src={!isPlaying ? '/play.svg' : 'pause.svg'} alt="Play Icon" width={40} height={40} onClick={togglePlay} />
        <Image src="/skip-next.svg" alt="Next" width={20} height={20} onClick={skipForward} />
        <IconButton onClick={toggleShuffle} sx={{ color: isShuffle ? 'yellow' : 'white' }}>
          <ShuffleIcon />
        </IconButton>
      </Box>
      <Box sx={{ color: 'white' }} mt={3}>{songs[currentSongIndex].title}</Box>
      <ColorLinearProgress
        onClick={handleProgressBarClick}
        sx={{ height: 10, width: { xs: '90%', md: '40%' }, borderRadius: 5, border: '1px solid orange', mt: 2 }}
        variant="determinate"
        value={(progress / songDuration) * 100}
      />
      <Box sx={{ width: '100%', mt: 3, height: '400px', overflowY: 'auto' }}>
        {songs.map((song, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              mt: 1,
              padding: 0.5,
              bgcolor: currentSongIndex === index ? '#FFD600' : '#FF9900',
              cursor: 'pointer',
            }}
            onClick={() => handleSongClick(index)}
          >
            <Image src={song.cover} alt="Song Cover" width={30} height={30} />
            <Typography
              sx={{
                ml: 2,
                fontSize: 14,
                fontWeight: currentSongIndex === index ? 700 : 400,
                color: 'black',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: 'calc(100% - 32px)',
              }}
            >
              {song.title.length > 25 ? `${song.title.slice(0, 25)}...` : song.title}
            </Typography>
            <IconButton
              onClick={(event) => handleMenuOpen(event, index)}
              sx={{ ml: 'auto', color: 'white' }}
            >
              <MoreVertIcon />
            </IconButton>
          </Box>
        ))}
      </Box>
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem
          onClick={() => {
            handleDownload(songs[menuSong].url, songs[menuSong].title);
            handleMenuClose();
          }}
        >
          Download
        </MenuItem>
        {/* <MenuItem
          onClick={() => {
            addToQueue(menuSong); // Add song to queue
            handleMenuClose();
          }}
        >
          Add to Queue
        </MenuItem> */}
      </Menu>
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{
          textAlign: 'center',
          '& .MuiDialog-paper': {
            width: '400px',
            borderRadius: '10px',
            p: 2,
          },
        }}
      >
        <Typography sx={{ mb: 2, fontWeight: 700 }}>
          Download Song?
        </Typography>
        <Typography sx={{ mb: 2, fontWeight: 100, fontSize: 14 }}>
          {selectedSong?.title}
        </Typography>
        <Box>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={confirmDownload} autoFocus>Download</Button>
        </Box>
      </Dialog>
    </Container>
  );
};

export default MusicPlayer;
