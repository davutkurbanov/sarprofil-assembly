"use client"

import { useRef, useEffect, useState } from "react"
import { Play, Pause, Volume2, VolumeX, Maximize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

interface VideoPlayerProps {
  src: string
  poster?: string
}

export function VideoPlayer({ src, poster }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const updateTime = () => setCurrentTime(video.currentTime)
    const updateDuration = () => setDuration(video.duration)

    video.addEventListener("timeupdate", updateTime)
    video.addEventListener("loadedmetadata", updateDuration)
    video.addEventListener("ended", () => setIsPlaying(false))

    return () => {
      video.removeEventListener("timeupdate", updateTime)
      video.removeEventListener("loadedmetadata", updateDuration)
      video.removeEventListener("ended", () => setIsPlaying(false))
    }
  }, [])

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.pause()
    } else {
      video.play()
    }
    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return

    video.muted = !isMuted
    setIsMuted(!isMuted)
  }

  const handleSeek = (value: number[]) => {
    const video = videoRef.current
    if (!video) return

    video.currentTime = value[0]
    setCurrentTime(value[0])
  }

  const handleVolumeChange = (value: number[]) => {
    const video = videoRef.current
    if (!video) return

    const newVolume = value[0]
    video.volume = newVolume
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const toggleFullscreen = () => {
    const video = videoRef.current
    if (!video) return

    if (video.requestFullscreen) {
      video.requestFullscreen()
    }
  }

  return (
    <div className="relative bg-black rounded-lg overflow-hidden group">
      <video
        ref={videoRef}
        src={src}
        poster={poster || "/video-thumbnail.png"}
        className="w-full h-96 object-cover"
        onClick={togglePlay}
      />

      {/* Controls Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        {/* Play/Pause Button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Button
            size="lg"
            variant="secondary"
            className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30"
            onClick={togglePlay}
          >
            {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8 ml-1" />}
          </Button>
        </div>

        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
          {/* Progress Bar */}
          <Slider value={[currentTime]} max={duration || 100} step={1} onValueChange={handleSeek} className="w-full" />

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button size="sm" variant="ghost" onClick={togglePlay} className="text-white hover:bg-white/20">
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>

              <Button size="sm" variant="ghost" onClick={toggleMute} className="text-white hover:bg-white/20">
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>

              <div className="w-20">
                <Slider value={[volume]} max={1} step={0.1} onValueChange={handleVolumeChange} className="w-full" />
              </div>

              <span className="text-white text-sm">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <Button size="sm" variant="ghost" onClick={toggleFullscreen} className="text-white hover:bg-white/20">
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
