'use client'

import { useState, useRef } from 'react'
import { FiMic, FiUpload, FiTrash2, FiPlay, FiPause, FiVolume2 } from 'react-icons/fi'
import { useApi } from '@/hooks/useApi'

interface AudioPreviewUploaderProps {
  bookId: string
  currentAudio?: string | null
  currentDuration?: number | null
  onAudioUpdate?: (audioUrl: string, duration: number) => void
  isOwner?: boolean
}

export function AudioPreviewUploader({ 
  bookId, 
  currentAudio, 
  currentDuration, 
  onAudioUpdate,
  isOwner = false 
}: AudioPreviewUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(currentAudio || null)
  const [duration, setDuration] = useState<number | null>(currentDuration || null)
  const [recordingTime, setRecordingTime] = useState(0)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  
  const api = useApi()

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validation
    const validTypes = ['audio/mp3', 'audio/wav', 'audio/m4a', 'audio/mpeg']
    if (!validTypes.includes(file.type)) {
      alert('Veuillez sélectionner un fichier audio (MP3, WAV, M4A)')
      return
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB
      alert('Le fichier audio ne doit pas dépasser 10MB')
      return
    }

    setIsUploading(true)
    
    try {
      const formData = new FormData()
      formData.append('audio', file)

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/books/${bookId}/audio-preview`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
        },
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Erreur lors de l\'upload')
      }

      const data = await response.json()
      setAudioUrl(data.audio_preview)
      setDuration(data.audio_duration)
      onAudioUpdate?.(data.audio_preview, data.audio_duration)
      
    } catch (error) {
      console.error('Upload error:', error)
      alert('Erreur lors de l\'upload de l\'audio')
    } finally {
      setIsUploading(false)
    }
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      const chunks: Blob[] = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data)
        }
      }

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'audio/webm' })
        const reader = new FileReader()
        
        reader.onloadend = async () => {
          const base64data = reader.result as string
          
          setIsUploading(true)
          try {
            const response = await api.post(`/api/books/${bookId}/audio-preview/record`, {
              audio_data: base64data.split(',')[1], // Remove data:audio/webm;base64,
              duration: recordingTime
            })

            if (response.data) {
              setAudioUrl(response.data.audio_preview)
              setDuration(response.data.audio_duration)
              onAudioUpdate?.(response.data.audio_preview, response.data.audio_duration)
            }
          } catch (error) {
            console.error('Recording upload error:', error)
            alert('Erreur lors de l\'enregistrement')
          } finally {
            setIsUploading(false)
          }
        }
        
        reader.readAsDataURL(blob)
      }

      mediaRecorderRef.current = mediaRecorder
      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0)

      // Update recording time
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)

    } catch (error) {
      console.error('Recording error:', error)
      alert('Impossible d\'accéder au microphone')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop())
      setIsRecording(false)
      
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current)
      }
    }
  }

  const deleteAudio = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet extrait audio ?')) return

    try {
      await api.delete(`/api/books/${bookId}/audio-preview`)
      setAudioUrl(null)
      setDuration(null)
      onAudioUpdate?.('', 0)
    } catch (error) {
      console.error('Delete error:', error)
      alert('Erreur lors de la suppression')
    }
  }

  const togglePlay = () => {
    if (!audioRef.current || !audioUrl) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getAuthToken = () => {
    if (typeof window !== 'undefined') {
      const authData = localStorage.getItem('BookShell-auth')
      if (authData) {
        try {
          const parsed = JSON.parse(authData)
          return parsed.state?.token || ''
        } catch (e) {
          return ''
        }
      }
    }
    return ''
  }

  if (!isOwner && !audioUrl) {
    return null // Ne pas afficher le composant si ce n'est pas le propriétaire et qu'il n'y a pas d'audio
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <FiVolume2 className="text-primary" />
          Extrait Audio
        </h3>
        
        {isOwner && (
          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="btn-secondary-sm flex items-center gap-2"
            >
              <FiUpload />
              {isUploading ? 'Upload...' : 'Uploader'}
            </button>
            
            <button
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isUploading || isRecording}
              className={`btn-secondary-sm flex items-center gap-2 ${
                isRecording ? 'bg-red-500 hover:bg-red-600 text-white' : ''
              }`}
            >
              <FiMic />
              {isRecording ? `${formatTime(recordingTime)}` : 'Enregistrer'}
            </button>
            
            {audioUrl && (
              <button
                onClick={deleteAudio}
                disabled={isUploading}
                className="btn-danger-sm flex items-center gap-2"
              >
                <FiTrash2 />
              </button>
            )}
          </div>
        )}
      </div>

      {audioUrl && (
        <div className="bg-gray-50 rounded-lg p-4">
          <audio
            ref={audioRef}
            src={audioUrl}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => setIsPlaying(false)}
            className="hidden"
          />
          
          <div className="flex items-center gap-4">
            <button
              onClick={togglePlay}
              className="btn-primary-sm flex items-center gap-2"
            >
              {isPlaying ? <FiPause /> : <FiPlay />}
              {isPlaying ? 'Pause' : 'Écouter'}
            </button>
            
            <div className="flex-1">
              <div className="text-sm text-gray-600">
                {duration ? `Durée: ${formatTime(duration)}` : 'Extrait audio'}
              </div>
              <div className="text-xs text-gray-500">
                Donnez envie aux acheteurs avec un extrait de votre livre !
              </div>
            </div>
          </div>
        </div>
      )}

      {!audioUrl && isOwner && (
        <div className="text-center py-8 text-gray-500">
          <FiMic className="mx-auto text-4xl mb-2 text-gray-300" />
          <p className="text-sm">
            Ajoutez un extrait audio pour donner envie aux acheteurs
          </p>
          <p className="text-xs mt-1">
            Enregistrez directement ou uploadez un fichier MP3/WAV (max 10MB)
          </p>
        </div>
      )}
    </div>
  )
}
