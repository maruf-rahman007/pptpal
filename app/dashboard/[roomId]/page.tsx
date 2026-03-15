"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import axios from "axios"
import UploadButtonComp from "@/app/component/addfile"

interface FileType {
  id: string
  name: string
  url: string
  sId: string
  size?: string
  uploadedAt?: string
}

// Simple file type icons (no external dependencies)
const FileIcon = ({ name }: { name: string }) => {
  const ext = name.split('.').pop()?.toLowerCase()
  
  const colors: Record<string, string> = {
    pdf: 'text-red-400',
    ppt: 'text-orange-400',
    pptx: 'text-orange-400',
    doc: 'text-blue-400',
    docx: 'text-blue-400',
    xls: 'text-green-400',
    xlsx: 'text-green-400',
    img: 'text-purple-400',
    jpg: 'text-purple-400',
    jpeg: 'text-purple-400',
    png: 'text-purple-400',
    zip: 'text-yellow-400',
    default: 'text-gray-400'
  }
  
  const color = colors[ext || 'default'] || colors.default
  
  return (
    <div className={`w-12 h-12 rounded-xl bg-neutral-800 flex items-center justify-center ${color} mb-4`}>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <line x1="10" y1="9" x2="8" y2="9"/>
      </svg>
    </div>
  )
}

// Skeleton loader component
const FileCardSkeleton = () => (
  <div className="bg-neutral-900/50 p-6 rounded-2xl animate-pulse border border-neutral-800">
    <div className="w-12 h-12 bg-neutral-800 rounded-xl mb-4"></div>
    <div className="h-4 bg-neutral-800 rounded w-3/4 mb-2"></div>
    <div className="h-3 bg-neutral-800 rounded w-1/2 mb-6"></div>
    <div className="flex justify-between items-center mt-auto">
      <div className="h-8 bg-neutral-800 rounded w-16"></div>
      <div className="h-8 bg-neutral-800 rounded w-16"></div>
    </div>
  </div>
)

export default function RoomPage() {
  const params = useParams()
  const roomId = params.roomId as string

  const [room, setRoom] = useState<any>(null)
  const [files, setFiles] = useState<FileType[]>([])
  const [role, setRole] = useState<"owner" | "guest">("guest")
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Fetch Room Data
  const fetchRoom = async () => {
    try {
      const res = await axios.get(`/api/room/${roomId}`)
      setRoom(res.data.room)
      setFiles(res.data.files)
      setRole(res.data.role)
    } catch (err) {
      console.error("Error fetching room", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!roomId) return
    fetchRoom()
  }, [roomId])

  // Delete File
  const deleteFile = async (pptId: string) => {
    try {
      await axios.patch(`/api/room/${roomId}`, { pptId })
      setFiles(prev => prev.filter(file => file.id !== pptId))
    } catch (err) {
      console.error("Delete failed", err)
    }
  }

  // Format file size
  const formatFileSize = (bytes?: string) => {
    if (!bytes) return 'Unknown size'
    const sizes = ['B', 'KB', 'MB', 'GB']
    const num = parseFloat(bytes)
    if (isNaN(num)) return 'Unknown size'
    const i = Math.floor(Math.log(num) / Math.log(1024))
    return `${(num / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`
  }

  // Format date
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'Recently'
    return new Date(dateStr).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-customColor p-6 md:p-10">
        <div className="max-w-7xl mx-auto">
          {/* Header Skeleton */}
          <div className="flex justify-between items-center mb-12">
            <div>
              <div className="h-10 bg-neutral-800 rounded w-64 mb-2 animate-pulse"></div>
              <div className="h-4 bg-neutral-800 rounded w-32 animate-pulse"></div>
            </div>
            <div className="h-10 bg-neutral-800 rounded w-32 animate-pulse"></div>
          </div>
          
          {/* Upload Area Skeleton */}
          <div className="mb-12 bg-neutral-900/50 p-6 rounded-2xl border border-neutral-800 animate-pulse">
            <div className="flex items-center justify-between">
              <div>
                <div className="h-5 bg-neutral-800 rounded w-48 mb-2"></div>
                <div className="h-3 bg-neutral-800 rounded w-64"></div>
              </div>
              <div className="h-10 bg-neutral-800 rounded w-32"></div>
            </div>
          </div>
          
          {/* File Grid Skeleton */}
          <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
            {[...Array(8)].map((_, i) => (
              <FileCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-customColor p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white">
                {room?.roomname?.charAt(0).toUpperCase() || 'R'}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                {room?.roomname}
              </h1>
            </div>
            <p className="text-gray-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              {files.length} {files.length === 1 ? 'file' : 'files'} • {role === 'owner' ? 'Owner' : 'Guest'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* View Toggle */}
            <div className="flex bg-neutral-900 rounded-lg p-1 border border-neutral-800">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-neutral-700 text-white' : 'text-gray-400 hover:text-white'}`}
                title="Grid view"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                  <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-neutral-700 text-white' : 'text-gray-400 hover:text-white'}`}
                title="List view"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
                  <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
                </svg>
              </button>
            </div>
            
            {role === "owner" && (
              <button 
                className="bg-red-500/10 text-red-400 px-4 py-2.5 rounded-xl hover:bg-red-500/20 transition border border-red-500/20 flex items-center gap-2"
                onClick={() => confirm('Are you sure you want to delete this room?') && console.log('Delete room')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                </svg>
                Delete Room
              </button>
            )}
          </div>
        </div>

        {/* UPLOAD AREA */}
        <div className="mb-10 bg-gradient-to-br from-neutral-900 to-neutral-900/50 p-6 md:p-8 rounded-2xl border border-neutral-800 hover:border-neutral-700 transition-all group">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white mb-1">Upload Presentation</h2>
                <p className="text-sm text-gray-400 max-w-md">
                  Drag & drop PPT, PDF, or DOC files here, or click to browse. Files are instantly available to all room members.
                </p>
              </div>
            </div>
            <div className="flex-shrink-0">
              <UploadButtonComp />
            </div>
          </div>
        </div>

        {/* FILE GRID/LIST */}
        {files.length === 0 ? (
          <div className="text-center py-20 px-6">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-neutral-900/50 flex items-center justify-center text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No files yet</h3>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              Upload your first presentation to get started. Your files will appear here instantly.
            </p>
            <div className="inline-block">
              <UploadButtonComp />
            </div>
          </div>
        ) : (
          <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
            {files.map(file => (
              <div
                key={file.id}
                className={`group bg-neutral-900/50 rounded-2xl border border-neutral-800 hover:border-neutral-600 hover:bg-neutral-900/80 transition-all duration-200 ${viewMode === 'list' ? 'flex items-center p-4 gap-4' : 'p-6 flex flex-col'}`}
              >
                {viewMode === 'grid' ? (
                  <>
                    <FileIcon name={file.name} />
                    <div className="flex-1 min-w-0 mb-4">
                      <p className="text-sm font-medium text-white truncate mb-1" title={file.name}>
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-500"></span>
                        {file.sId}
                      </p>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-neutral-800">
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                        </svg>
                        Open
                      </a>
                      {role === "owner" && (
                        <button
                          onClick={() => deleteFile(file.id)}
                          className="text-gray-500 hover:text-red-400 p-2 rounded-lg hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"
                          title="Delete file"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                          </svg>
                        </button>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <FileIcon name={file.name} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate" title={file.name}>
                        {file.name}
                      </p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                        <span>{file.sId}</span>
                        <span>•</span>
                        <span>{formatFileSize(file.size)}</span>
                        <span>•</span>
                        <span>{formatDate(file.uploadedAt)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-indigo-400 hover:text-indigo-300 font-medium px-3 py-1.5 rounded-lg hover:bg-indigo-500/10 transition-colors"
                      >
                        Open
                      </a>
                      {role === "owner" && (
                        <button
                          onClick={() => deleteFile(file.id)}
                          className="text-gray-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
                          title="Delete file"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                          </svg>
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}