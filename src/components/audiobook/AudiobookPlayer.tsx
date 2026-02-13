'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FiPlay, 
  FiPause, 
  FiSkipBack, 
  FiSkipForward, 
  FiVolume2, 
  FiVolumeX,
  FiRepeat,
  FiShuffle,
  FiList,
  FiHeart,
  FiShare2,
  FiDownload,
  FiLock,
  FiClock,
  FiArrowLeft,
  FiHeadphones
} from 'react-icons/fi'
import { useAuth } from '@/hooks/useAuth'

interface Chapter {
  id: string
  title: string
  duration: number
  order: number
  audioUrl?: string
  isFree: boolean
}

interface AudiobookPlayerProps {
  audiobook: {
    id: string
    title: string
    author: string
    narrator?: string
    coverImage?: string
    chapters: Chapter[]
  }
}

export default function AudiobookPlayer({ audiobook }: AudiobookPlayerProps) {
  const { subscription } = useAuth()
  const hasSubscription = subscription?.status === 'ACTIVE'
  
  const audioRef = useRef<HTMLAudioElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentChapter, setCurrentChapter] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const [showChapterList, setShowChapterList] = useState(false)
  const [isRepeat, setIsRepeat] = useState(false)
  
  const chapter = audiobook.chapters[currentChapter]
  const canPlay = chapter?.isFree || hasSubscription
  
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    
    const updateTime = () => setCurrentTime(audio.currentTime)
    const updateDuration = () => setDuration(audio.duration)
    const handleEnded = () => {
      if (isRepeat) {
        audio.currentTime = 0
        audio.play()
      } else if (currentChapter < audiobook.chapters.length - 1) {
        playChapter(currentChapter + 1)
      } else {
        setIsPlaying(false)
      }
    }
    
    audio.addEventListener('timeupdate', updateTime)
    audio.addEventListener('loadedmetadata', updateDuration)
    audio.addEventListener('ended', handleEnded)
    
    return () => {
      audio.removeEventListener('timeupdate', updateTime)
      audio.removeEventListener('loadedmetadata', updateDuration)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [currentChapter, isRepeat, audiobook.chapters.length])
  
  const togglePlay = () => {
    if (!canPlay) return
    
    const audio = audioRef.current
    if (!audio) return
    
    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
    setIsPlaying(!isPlaying)
  }
  
  const playChapter = (index: number) => {
    const targetChapter = audiobook.chapters[index]
    if (!targetChapter) return
    
    if (!targetChapter.isFree && !hasSubscription) {
      return
    }
    
    setCurrentChapter(index)
    setCurrentTime(0)
    setIsPlaying(true)
    
    setTimeout(() => {
      audioRef.current?.play()
    }, 100)
  }
  
  const skipForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(duration, currentTime + 30)
    }
  }
  
  const skipBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, currentTime - 10)
    }
  }
  
  const nextChapter = () => {
    if (currentChapter < audiobook.chapters.length - 1) {
      playChapter(currentChapter + 1)
    }
  }
  
  const previousChapter = () => {
    if (currentChapter > 0) {
      playChapter(currentChapter - 1)
    }
  }
  
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canPlay) return
    
    const rect = progressRef.current?.getBoundingClientRect()
    if (!rect || !audioRef.current) return
    
    const percent = (e.clientX - rect.left) / rect.width
    audioRef.current.currentTime = percent * duration
  }
  
  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }
  
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value)
    setVolume(value)
    if (audioRef.current) {
      audioRef.current.volume = value
    }
  }
  
  const changeSpeed = () => {
    const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2]
    const currentIndex = speeds.indexOf(playbackSpeed)
    const nextIndex = (currentIndex + 1) % speeds.length
    const newSpeed = speeds[nextIndex]
    
    setPlaybackSpeed(newSpeed)
    if (audioRef.current) {
      audioRef.current.playbackRate = newSpeed
    }
  }
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }
  
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    if (hours > 0) {
      return `${hours}h ${mins}min`
    }
    return `${mins}min`
  }
  
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={chapter?.audioUrl || '/demo-audio.mp3'}
        preload="metadata"
      />
      
      {/* Header */}
      <div className="container mx-auto px-4 py-4">
        <Link 
          href="/audiobooks"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <FiArrowLeft className="w-5 h-5" />
          <span>Retour aux audiobooks</span>
        </Link>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start">
            {/* Cover Art */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative"
            >
              <div className="w-64 h-64 md:w-80 md:h-80 rounded-2xl overflow-hidden shadow-2xl">
                {audiobook.coverImage ? (
                  <Image
                    src={audiobook.coverImage}
                    alt={audiobook.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
                    <FiHeadphones className="w-24 h-24 text-gray-400" />
                  </div>
                )}
              </div>
              
              {/* Playing Animation */}
              {isPlaying && (
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex items-end gap-1">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-1 bg-primary rounded-full"
                      animate={{
                        height: [8, 24, 8],
                      }}
                      transition={{
                        duration: 0.5,
                        repeat: Infinity,
                        delay: i * 0.1,
                      }}
                    />
                  ))}
                </div>
              )}
            </motion.div>
            
            {/* Info */}
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-2xl md:text-3xl font-display font-bold mb-2">
                {audiobook.title}
              </h1>
              <p className="text-gray-400 text-lg mb-1">{audiobook.author}</p>
              <p className="text-gray-500 mb-4">Lu par {audiobook.narrator || 'Narrateur'}</p>
              
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start mb-6">
                <button className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                  <FiHeart className="w-5 h-5" />
                </button>
                <button className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                  <FiShare2 className="w-5 h-5" />
                </button>
                {hasSubscription && (
                  <button className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                    <FiDownload className="w-5 h-5" />
                  </button>
                )}
              </div>
              
              {/* Current Chapter */}
              <div className="bg-white/10 rounded-xl p-4 mb-6">
                <p className="text-sm text-gray-400 mb-1">En cours de lecture</p>
                <p className="font-semibold">
                  Chapitre {chapter?.order}: {chapter?.title}
                </p>
              </div>
              
              {/* Subscription Notice */}
              {!hasSubscription && !chapter?.isFree && (
                <div className="bg-primary/20 border border-primary/30 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <FiLock className="w-5 h-5 text-primary" />
                    <span className="font-semibold">Abonnement requis</span>
                  </div>
                  <p className="text-sm text-gray-300 mb-3">
                    Abonnez-vous pour écouter tous les chapitres
                  </p>
                  <Link 
                    href="/subscriptions"
                    className="btn-primary inline-flex items-center gap-2 text-sm"
                  >
                    S'abonner
                  </Link>
                </div>
              )}
            </div>
          </div>
          
          {/* Player Controls */}
          <div className="mt-12 bg-white/5 rounded-2xl p-6 backdrop-blur-sm">
            {/* Progress Bar */}
            <div className="mb-6">
              <div 
                ref={progressRef}
                onClick={handleProgressClick}
                className={`h-2 bg-white/20 rounded-full overflow-hidden ${canPlay ? 'cursor-pointer' : 'cursor-not-allowed'}`}
              >
                <div 
                  className="h-full bg-primary transition-all duration-100"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between mt-2 text-sm text-gray-400">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
            
            {/* Main Controls */}
            <div className="flex items-center justify-center gap-4 md:gap-6">
              {/* Speed */}
              <button 
                onClick={changeSpeed}
                className="px-3 py-1 text-sm bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
              >
                {playbackSpeed}x
              </button>
              
              {/* Skip Back */}
              <button 
                onClick={skipBackward}
                className="p-3 text-gray-400 hover:text-white transition-colors"
                disabled={!canPlay}
              >
                <FiSkipBack className="w-6 h-6" />
              </button>
              
              {/* Previous Chapter */}
              <button 
                onClick={previousChapter}
                disabled={currentChapter === 0}
                className="p-3 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 6h2v12H6V6zm3.5 6l8.5 6V6l-8.5 6z" />
                </svg>
              </button>
              
              {/* Play/Pause */}
              <button 
                onClick={togglePlay}
                disabled={!canPlay}
                className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                  canPlay 
                    ? 'bg-primary hover:bg-primary/90' 
                    : 'bg-gray-600 cursor-not-allowed'
                }`}
              >
                {isPlaying ? (
                  <FiPause className="w-8 h-8" />
                ) : canPlay ? (
                  <FiPlay className="w-8 h-8 ml-1" />
                ) : (
                  <FiLock className="w-6 h-6" />
                )}
              </button>
              
              {/* Next Chapter */}
              <button 
                onClick={nextChapter}
                disabled={currentChapter === audiobook.chapters.length - 1}
                className="p-3 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
                </svg>
              </button>
              
              {/* Skip Forward */}
              <button 
                onClick={skipForward}
                className="p-3 text-gray-400 hover:text-white transition-colors"
                disabled={!canPlay}
              >
                <FiSkipForward className="w-6 h-6" />
              </button>
              
              {/* Repeat */}
              <button 
                onClick={() => setIsRepeat(!isRepeat)}
                className={`p-3 transition-colors ${isRepeat ? 'text-primary' : 'text-gray-400 hover:text-white'}`}
              >
                <FiRepeat className="w-5 h-5" />
              </button>
            </div>
            
            {/* Bottom Controls */}
            <div className="flex items-center justify-between mt-6">
              {/* Volume */}
              <div className="flex items-center gap-2">
                <button onClick={toggleMute} className="p-2 text-gray-400 hover:text-white">
                  {isMuted || volume === 0 ? (
                    <FiVolumeX className="w-5 h-5" />
                  ) : (
                    <FiVolume2 className="w-5 h-5" />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-24 accent-primary"
                />
              </div>
              
              {/* Chapter List Toggle */}
              <button 
                onClick={() => setShowChapterList(!showChapterList)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  showChapterList ? 'bg-primary text-white' : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                <FiList className="w-5 h-5" />
                <span className="hidden md:inline">Chapitres</span>
              </button>
            </div>
          </div>
          
          {/* Chapter List */}
          <AnimatePresence>
            {showChapterList && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 bg-white/5 rounded-2xl overflow-hidden"
              >
                <div className="p-4 border-b border-white/10">
                  <h3 className="font-semibold">Chapitres ({audiobook.chapters.length})</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {audiobook.chapters.map((ch, index) => {
                    const isLocked = !ch.isFree && !hasSubscription
                    const isCurrent = index === currentChapter
                    
                    return (
                      <button
                        key={ch.id}
                        onClick={() => !isLocked && playChapter(index)}
                        disabled={isLocked}
                        className={`w-full flex items-center gap-4 p-4 hover:bg-white/5 transition-colors ${
                          isCurrent ? 'bg-primary/20' : ''
                        } ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          isCurrent ? 'bg-primary' : 'bg-white/10'
                        }`}>
                          {isLocked ? (
                            <FiLock className="w-4 h-4" />
                          ) : isCurrent && isPlaying ? (
                            <FiPause className="w-4 h-4" />
                          ) : (
                            <FiPlay className="w-4 h-4 ml-0.5" />
                          )}
                        </div>
                        <div className="flex-1 text-left">
                          <p className="font-medium">
                            Chapitre {ch.order}: {ch.title}
                          </p>
                          <p className="text-sm text-gray-400">
                            {formatDuration(ch.duration)}
                          </p>
                        </div>
                        {ch.isFree && (
                          <span className="badge badge-success text-xs">Gratuit</span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
