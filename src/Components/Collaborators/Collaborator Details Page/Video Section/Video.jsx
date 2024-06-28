import React, { useEffect, useState } from "react";
import classes from "./Video.module.css";

const Video = () => {
    
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    // Function to fetch videos from YouTube API
    const fetchVideos = async () => {
      const channelId = 'UCaGxr3QOrcyYCJX6mIye4fw'; // Channel ID for albouraqeditionstv145
      const apiKey = 'AIzaSyDtz3a1CEQVm3uwT9mUStsZ85zzsmKCu3Q';
      const maxResults = 50; // Maximum number of videos to fetch
      const apiUrl = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&part=snippet&channelId=${channelId}&order=date&maxResults=${maxResults}`;
      
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setVideos(data.items);
        if (data.items.length > 0) {
          setSelectedVideo(data.items[0].id.videoId); // Set the first video as default
        }
      } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
      }
    };

    fetchVideos();
  }, []);// Empty dependency array ensures the effect runs only once

  console.log(videos)

  const handleVideoSelect = (videoId) => {
    setSelectedVideo(videoId);
  };

  
  const videosWithTruncatedResume = videos.map((video) => ({
    ...video,
    title:
      video.snippet.title && typeof video.snippet.title === "string"
        ? video.snippet.title.substring(0, 20) +
          (video.snippet.title.length > 20 ? "..." : "")
        : "",
        description:
          video.snippet.description && typeof video.snippet.title === "string"
            ? video.snippet.description.substring(0, 40) +
              (video.snippet.description.length > 40 ? "..." : "")
            : "",
  }));

  return (
    <div className={classes.video}>
      <div className={classes.content}>
        <div className={classes.video_con}>
        <iframe
  width="100%"
  height="450"
  src={`https://www.youtube.com/embed/${selectedVideo}`}
  frameBorder="0"
  allowFullScreen
  title="Embedded YouTube Video"
></iframe>
        </div>
        <div className={classes.scroll_con}>
          <div className={classes. list_con}>
          {videosWithTruncatedResume.map(video => (
              <>
                <div key={video.id.videoId} className={`${selectedVideo === video.id.videoId ? classes.videoRow_selected : classes.videoRow}`}
                onClick={() => handleVideoSelect(video.id.videoId)}
                >
                {/* Small video on the left */}
                <div className={classes.smallVideo}>
                <img
                  src={video.snippet.thumbnails.default.url}
                  alt={video.snippet.title}
                  className={classes.videoThumbnail}
                />
                </div>
                {/* Name and description on the right */}
                <div className={classes.videoDetails}>
                  <h2>{video.title}</h2>
                  <p>{video.description}</p>
                </div>
              </div>
              <div className={classes.line}/>
              </>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Video;
