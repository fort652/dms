// VideoPage.js
import React from 'react';
import VideoCard from './VideoCard';

const VideoPage = () => {
  const videos = [
    {
      title: 'Babalas',
      url: '/videos/Babalas.mp4',
    },
  ];

  return (
    <div>
      <h1>Video Page</h1>
      {videos.map((video, index) => (
        <VideoCard key={index} video={video} />
      ))}
    </div>
  );
};

export default VideoPage;
