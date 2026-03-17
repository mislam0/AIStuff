"use client"

import { useEffect, useState } from "react"

type Video = {
  name: string
  url: string
}

export default function VideoGallery() {

  const [videos, setVideos] = useState<Video[]>([])
  const deleteVideo = async (name: string) => {
    const confirmDelete = confirm("Are you sure you want to delete this video?");

  if (!confirmDelete) return;
  await fetch(`http://127.0.0.1:8000/video?object_name=${name}`, {
    method: "DELETE"
  });

  setVideos(videos.filter(v => v.name !== name));
};
  useEffect(() => {
    fetch("http://127.0.0.1:8000/videos")
      .then(res => res.json())
      .then(data => setVideos(data))
      .catch(err => console.error(err))
  }, [])
  

  return (
    <div style={{marginTop:"40px"}}>

      <h2>Your Highlight Videos</h2>

      {videos.map(video => (

  <div key={video.name} style={{marginBottom:"30px"}}>

    <video width="500" controls>
      <source src={video.url} type="video/mp4"/>
    </video>

    <p>{video.name}</p>

    <div style={{marginTop:"10px"}}>

      <a href={video.url} download>
        Download
      </a>

      <button
        onClick={() => deleteVideo(video.name)}
        style={{marginLeft:"10px"}}
      >
        Delete
      </button>

    </div>

  </div>

))}

    </div>
  )
}