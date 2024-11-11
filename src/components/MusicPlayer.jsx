import MoreVertIcon from "@mui/icons-material/MoreVert";
import ShuffleIcon from "@mui/icons-material/Shuffle";
import {
  Box,
  Button,
  Container,
  Dialog,
  IconButton,
  LinearProgress,
  Menu,
  MenuItem,
  Typography,
  styled,
} from "@mui/material";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

import FadeIn from "../components/animations/FadeIn";
import GrowIn from "../components/animations/GrowInView";
import SlideIn from "../components/animations/SlideIn";

import songs from "../data/songs";

const ColorLinearProgress = styled(LinearProgress)({
  color: "#ffff00",
  "& .MuiLinearProgress-barColorPrimary": {
    backgroundColor: "#ffff00",
  },
});

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isShuffle, setIsShuffle] = useState(false);
  const [songHistory, setSongHistory] = useState([]);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [menuSong, setMenuSong] = useState(null);
  const [songQueue, setSongQueue] = useState([]);
  const audioRef = useRef(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);
  const [songDuration, setSongDuration] = useState(0);

  useEffect(() => {
    const storedQueue = JSON.parse(localStorage.getItem("songQueue"));
    const storedShuffle = JSON.parse(localStorage.getItem("isShuffle"));

    if (storedQueue) {
      setSongQueue(storedQueue);
    }

    if (storedShuffle !== null) {
      setIsShuffle(storedShuffle);
    }
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener("ended", skipForward);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("ended", skipForward);
      }
    };
  }, [audioRef.current, currentSongIndex, isPlaying]);

  const handleDownload = (url, title) => {
    setSelectedSong({
      url,
      title,
    });
    setOpenDialog(true);
  };

  const confirmDownload = () => {
    const link = document.createElement("a");
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
    const clickedPositionAsPercentage =
      clickedPositionInPx / widthOfProgressBarInPx;
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
    if (songQueue.length > 0) {
      const nextSongIndex = songQueue[0];
      setSongQueue((prevQueue) => prevQueue.slice(1));

      localStorage.setItem("songQueue", JSON.stringify(songQueue.slice(1)));

      if (audioRef.current) {
        audioRef.current.pause();
      }

      playSong(nextSongIndex);
    } else {
      let nextSongIndex;
      if (isShuffle) {
        setSongHistory((prevHistory) => [...prevHistory, currentSongIndex]);
        nextSongIndex = Math.floor(Math.random() * songs.length);
      } else {
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
      const lastSongIndex = songHistory[songHistory.length - 1];
      setSongHistory((prevHistory) => prevHistory.slice(0, -1));

      if (audioRef.current) {
        audioRef.current.pause();
      }

      playSong(lastSongIndex);
    } else {
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
      localStorage.setItem("isShuffle", JSON.stringify(newShuffleState));
      return newShuffleState;
    });
    setSongHistory([]);
  };

  const handleMenuOpen = (event, songIndex) => {
    event.stopPropagation();
    setMenuAnchorEl(event.currentTarget);
    setMenuSong(songIndex);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setMenuSong(null);
  };

  const addToQueue = (songIndex) => {
    const updatedQueue = [...songQueue, songIndex];
    setSongQueue(updatedQueue);
    localStorage.setItem("songQueue", JSON.stringify(updatedQueue));
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
    const currentSongElement = document.getElementById(
      `song-${currentSongIndex}`
    );

    if (currentSongElement) {
      currentSongElement.scrollIntoView({
        behavior: "auto",
        block: "nearest",
      });
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
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "90vh",
      }}
    >
      <GrowIn delay={0} timeout={750}>
        <Box mt={3}>
          <Image
            src={songs[currentSongIndex].cover}
            alt="Album Cover"
            width={150}
            height={150}
          />
        </Box>
      </GrowIn>

      <Box>{songs[currentSongIndex].title}</Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          width: "70%",
          mt: 1,
          alignItems: "center",
          maxWidth: 300,
        }}
      >
        <GrowIn delay={100} timeout={750}>
          <Image
            src="/svg/skip-previous.svg"
            alt="Previous"
            width={20}
            height={20}
            onClick={skipBackward}
          />
        </GrowIn>
        <GrowIn delay={200} timeout={750}>
          <Image
            src={!isPlaying ? "/svg/play.svg" : "/svg/pause.svg"}
            alt="Play Icon"
            width={40}
            height={40}
            onClick={togglePlay}
          />
        </GrowIn>
        <GrowIn delay={300} timeout={750}>
          <Image
            src="/svg//skip-next.svg"
            alt="Next"
            width={20}
            height={20}
            onClick={skipForward}
          />
        </GrowIn>
        <GrowIn delay={400} timeout={750}>
          <IconButton
            onClick={toggleShuffle}
            sx={{
              color: isShuffle ? "yellow" : "white",
            }}
          >
            <ShuffleIcon />
          </IconButton>
        </GrowIn>
      </Box>

      <FadeIn delay={0} timeout={2000}>
        <ColorLinearProgress
          onClick={handleProgressBarClick}
          sx={{
            minWidth: 310,
            height: 10,
            width: {
              xs: "100%",
              md: "100%",
            },
            borderRadius: 5,
            border: "1px solid orange",
            mt: 5,
          }}
          variant="determinate"
          value={(progress / songDuration) * 100}
        />
        <Box
          sx={{
            color: "white",
          }}
          mt={2}
        >
          {songs[currentSongIndex].title}
        </Box>
      </FadeIn>

      <Box
        sx={{
          width: "100%",
          mt: 3,
          height: "400px",
          overflowY: "auto",
        }}
      >
        {songs.map((song, index) => (
          <SlideIn
            key={index}
            delay={500 + index * 50}
            timeout={500}
            direction="left"
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                mt: 1,
                padding: 0.5,
                bgcolor: currentSongIndex === index ? "#FFD600" : "#FF9900",
                cursor: "pointer",
              }}
              onClick={() => handleSongClick(index)}
            >
              <Image src={song.cover} alt="Song Cover" width={30} height={30} />
              <Typography
                sx={{
                  ml: 2,
                  fontSize: 14,
                  fontWeight: currentSongIndex === index ? 700 : 400,
                  color: "black",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: "calc(100% - 32px)",
                }}
              >
                {song.title.length > 25
                  ? `${song.title.slice(0, 25)}...`
                  : song.title}
              </Typography>
              <IconButton
                onClick={(event) => handleMenuOpen(event, index)}
                sx={{
                  ml: "auto",
                  color: "white",
                }}
              >
                <MoreVertIcon />
              </IconButton>
            </Box>
          </SlideIn>
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
            addToQueue(menuSong);
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
          textAlign: "center",
          "& .MuiDialog-paper": {
            width: "400px",
            borderRadius: "10px",
            p: 2,
          },
        }}
      >
        <Typography
          sx={{
            mb: 2,
            fontWeight: 700,
          }}
        >
          Download Song?
        </Typography>
        <Typography
          sx={{
            mb: 2,
            fontWeight: 100,
            fontSize: 14,
          }}
        >
          {selectedSong?.title}
        </Typography>
        <Box>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={confirmDownload} autoFocus>
            Download
          </Button>
        </Box>
      </Dialog>
    </Container>
  );
};

export default MusicPlayer;
