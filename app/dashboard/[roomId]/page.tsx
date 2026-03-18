"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  LayoutGrid,
  List,
  Trash2,
  Users,
  FileText,
  Shield,
  Crown,
  Loader2,
  FolderOpen,
  Upload,
  X,
  Download,
  File,
  FileSpreadsheet,
  ArrowLeft,
  LogOut
} from "lucide-react"
import { cn } from "@/app/lib/utils"
import { useUploadThing } from "@/app/lib/uploadthing"
import axios from "axios"
import { useSession, signOut } from "next-auth/react";


interface FileType {
  id: string
  name: string
  url: string
  sId: string
  size?: number
  uploadedAt?: string
}

interface RoomData {
  id: string
  roomname: string
  ownerId: string
}

type UserRole = "owner" | "guest"

const ALLOWED_TYPES = [
  "application/pdf",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
]

const ALLOWED_EXTENSIONS = [".pdf", ".ppt", ".pptx"]

function getFileType(name: string): "pdf" | "ppt" {
  const ext = name.toLowerCase().split(".").pop()
  return ext === "pdf" ? "pdf" : "ppt"
}

function formatFileSize(bytes?: number): string {
  if (!bytes) return ""
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function RoomPage() {
  const params = useParams()
  const router = useRouter()
  const roomId = params.roomId as string
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [room, setRoom] = useState<RoomData | null>(null)
  const [files, setFiles] = useState<FileType[]>([])
  const [role, setRole] = useState<UserRole>("guest")
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  // const [isUploading, setIsUploading] = useState(false)
  const [isDeletingRoom, setIsDeletingRoom] = useState(false)
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const { startUpload, isUploading } = useUploadThing("fileUploader")
  const { data: session } = useSession()
  const isOwner = role === "owner"
  console.log(session?.user.role);
  const fetchRoom = useCallback(async () => {
    try {
      const res = await fetch(`/api/room/${roomId}`)
      const data = await res.json()
      setRoom(data.room)
      setFiles(data.files || [])
      setRole(data.role)
    } catch (err) {
      console.error("Error fetching room", err)
    } finally {
      setLoading(false)
    }
  }, [roomId])

  useEffect(() => {
    if (roomId) fetchRoom()
  }, [roomId, fetchRoom])

  const validateFile = (file: File): boolean => {
    const ext = "." + file.name.split(".").pop()?.toLowerCase()
    if (!ALLOWED_EXTENSIONS.includes(ext) && !ALLOWED_TYPES.includes(file.type)) {
      setUploadError("Only PDF, PPT, and PPTX files are allowed")
      return false
    }
    if (file.size > 50 * 1024 * 1024) {
      setUploadError("File size must be less than 50MB")
      return false
    }
    setUploadError(null)
    return true
  }

  const handleFileSelect = (file: File) => {
    if (validateFile(file)) setSelectedFile(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFileSelect(file)
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    try {
      // upload to UploadThing
      const res = await startUpload([selectedFile])

      if (!res || res.length === 0) {
        setUploadError("Upload failed")
        return
      }

      const file = res[0]

      // saving to db 
      const response = await axios.post(`/api/room/${roomId}`, {
        name: file.name,
        url: file.ufsUrl,
        key: file.key,
      })

      // update ui
      setFiles((prev) => [...prev, response.data])
      setSelectedFile(null)
      setUploadDialogOpen(false)
    } catch (err: any) {
      console.error("Upload error:", err)
      setUploadError(err?.response?.data?.error || "Upload failed")
    }
  }

  const handleDeleteFile = async (fileId: string) => {
    if (!isOwner) return
    try {
      await fetch(`/api/room/${roomId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pptId: fileId }),
      })
      setFiles((prev) => prev.filter((f) => f.id !== fileId))
    } catch (err) {
      console.error("Delete failed", err)
    }
  }

  const handleDeleteRoom = async () => {
    if (!isOwner) return
    setIsDeletingRoom(true)
    try {
      await fetch(`/api/room/${roomId}`, { method: "DELETE" })
      router.push("/dashboard")
    } catch (err) {
      console.error("Delete room failed", err)
    } finally {
      setIsDeletingRoom(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-customColor">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="size-14 animate-pulse rounded-2xl bg-white/10" />
              <div className="space-y-2">
                <div className="h-8 w-48 animate-pulse rounded-lg bg-white/10" />
                <div className="h-4 w-32 animate-pulse rounded bg-white/10" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-40 animate-pulse rounded-xl bg-white/5" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-customColor">
      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div
                onClick={() => {
                  if (session?.user?.role !== "guest") {
                    router.back();
                  } else {
                    signOut({ callbackUrl: "/roomsignin" });
                  }
                }}
                className="flex size-14 cursor-pointer items-center justify-center rounded-2xl bg-black text-sm font-semibold text-white shadow-lg hover:scale-105 transition"
              >
                {session?.user?.role !== "guest" ? (
                  <>
                    <ArrowLeft className="size-4" />
                    Back
                  </>
                ) : (
                  <>
                    
                    <LogOut className="size-4" />
                    Logout
                  </>
                )}
              </div>
              <div>
                <h1 className="text-balance text-2xl font-bold text-black sm:text-3xl">
                  {room?.roomname || "Room"}
                </h1>
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium",
                      isOwner
                        ? "border-black bg-amber-500/10 text-green-600"
                        : "border-blue-500/20 bg-blue-500/10 text-blue-400"
                    )}
                  >
                    {isOwner ? <Crown className="size-3" /> : <Users className="size-3" />}
                    {isOwner ? "Owner" : "Guest"}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-sm text-black-400">
                    <FileText className="size-4" />
                    {files.length} {files.length === 1 ? "file" : "files"}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-sm text-black-400">
                    <Shield className="size-4 text-emerald-500" />
                    Protected
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center rounded-lg border border-white/10 bg-white/20 p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={cn(
                    "rounded-md p-2 transition-all",
                    viewMode === "grid" ? "bg-black text-white" : "text-slate-400 hover:text-white"
                  )}
                >
                  <LayoutGrid className="size-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={cn(
                    "rounded-md p-2 transition-all",
                    viewMode === "list" ? "bg-white/10 text-white" : "text-slate-400 hover:text-black"
                  )}
                >
                  <List className="size-4" />
                </button>
              </div>

              {/* Upload Dialog */}
              <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 text-black hover:from-emerald-600 hover:to-teal-600">
                    <Upload className="size-4" />
                    Upload
                  </Button>
                </DialogTrigger>
                <DialogContent className="border-white/10 bg-slate-900 sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-white">Upload File</DialogTitle>
                  </DialogHeader>
                  <div
                    onDragOver={(e) => { e.preventDefault(); setDragActive(true) }}
                    onDragLeave={() => setDragActive(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={cn(
                      "relative cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-all",
                      dragActive
                        ? "border-emerald-500 bg-emerald-500/10"
                        : "border-white/20 bg-white/5 hover:border-emerald-500/50 hover:bg-white/10"
                    )}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      accept=".pdf,.ppt,.pptx"
                      onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                    />
                    <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20">
                      <Upload className="size-8 text-emerald-400" />
                    </div>
                    <p className="mb-2 text-sm font-medium text-white">
                      {dragActive ? "Drop file here" : "Drag & drop or click to browse"}
                    </p>
                    <p className="text-xs text-slate-400">PDF, PPT, PPTX up to 50MB</p>
                  </div>

                  {selectedFile && (
                    <div className="flex items-center gap-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3">
                      <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-500/20">
                        <File className="size-5 text-emerald-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-white">{selectedFile.name}</p>
                        <p className="text-xs text-slate-400">{formatFileSize(selectedFile.size)}</p>
                      </div>
                      <button onClick={() => setSelectedFile(null)} className="text-slate-400 hover:text-white">
                        <X className="size-4" />
                      </button>
                    </div>
                  )}

                  {uploadError && (
                    <p className="text-center text-sm text-red-400">{uploadError}</p>
                  )}

                  <Button
                    onClick={handleUpload}
                    disabled={!selectedFile || isUploading}
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 disabled:opacity-50"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="size-4" />
                        Upload File
                      </>
                    )}
                  </Button>
                </DialogContent>
              </Dialog>

              {isOwner && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" className="border-red-500/10 text-red-400 hover:bg-red-500/10">
                      <Trash2 className="size-4" />
                      <span className="hidden sm:inline">Delete Room</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="border-white/10 bg-slate-900">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-white">Delete Room</AlertDialogTitle>
                      <AlertDialogDescription className="text-slate-400">
                        This will permanently delete &quot;{room?.roomname}&quot; and all its files.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="border-white/10 text-white hover:bg-white/10">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteRoom}
                        disabled={isDeletingRoom}
                        className="bg-red-500 text-white hover:bg-red-600"
                      >
                        {isDeletingRoom ? <Loader2 className="size-4 animate-spin" /> : "Delete"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </div>
        </header>

        {/* Files Grid */}
        {files.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-4 py-20">
            <div className="mb-6 flex size-20 items-center justify-center rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-teal-500/10">
              <FolderOpen className="size-10 text-emerald-500" />
            </div>
            <h2 className="mb-2 text-center text-xl font-bold text-black">No files yet</h2>
            <p className="mb-6 max-w-md text-center text-black font-semibold">
              Upload your first presentation. Only PDF, PPT, and PPTX files are supported.
            </p>
          </div>
        ) : (
          <div
            className={cn(
              "grid gap-4",
              viewMode === "grid"
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "mx-auto max-w-3xl grid-cols-1"
            )}
          >
            {files.map((file) => {
              const fileType = getFileType(file.name)
              return (
                <div
                  key={file.id}
                  className="group relative overflow-hidden rounded-xl border border-black/10 bg-[#4b433c] p-6 backdrop-blur-sm transition-all hover:border-emerald-500/30 hover:bg-[#776c62] mb-0 lg:mb-20"
                >
                  <div className="mb-3 flex items-start justify-between">
                    <div
                      className={cn(
                        "flex size-12 items-center justify-center rounded-xl",
                        fileType === "pdf"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-orange-500/20 text-orange-400"
                      )}
                    >
                      {fileType === "pdf" ? (
                        <FileText className="size-6" />
                      ) : (
                        <FileSpreadsheet className="size-6" />
                      )}
                    </div>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-xs font-medium uppercase",
                        fileType === "pdf"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-orange-500/20 text-orange-400"
                      )}
                    >
                      {file.name.split(".").pop()}
                    </span>
                  </div>

                  <h3 className="mb-1 truncate text-sm font-medium text-white" title={file.name}>
                    {file.name}
                  </h3>
                  <p className="mb-3 text-xs text-slate-400">
                    {formatFileSize(file.size)}
                    {file.uploadedAt && ` • ${new Date(file.uploadedAt).toLocaleDateString()}`}
                  </p>

                  <div className="flex items-center gap-2">
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-white/10 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-white/20"
                    >
                      <Download className="size-3.5" />
                      Download
                    </a>
                    {isOwner && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button className="rounded-lg bg-[#4b433c] p-2 text-red-400 transition-colors hover:bg-red-500/20">
                            <Trash2 className="size-4" />
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="border-white/10 bg-slate-900">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-white">Delete File</AlertDialogTitle>
                            <AlertDialogDescription className="text-white slate-400">
                              Delete &quot;{file.name}&quot;? This cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="border-white/10 text-black">
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteFile(file.id)}
                              className="bg-red-500 text-white hover:bg-red-600"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Permissions Panel */}
        <div className="mt-20 rounded-2xl border border-white/10 bg-[#4b433c] p-10">
          <h3 className="mb-4 flex items-center gap-2 font-medium text-white">
            <Shield className="size-5 text-emerald-500" />
            Your Permissions
          </h3>
          <div className="grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "View all files", allowed: true },
              { label: "Upload files", allowed: true },
              { label: "Delete any file", allowed: isOwner },
              { label: "Delete room", allowed: isOwner },
            ].map((perm) => (
              <div key={perm.label} className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex size-8 items-center justify-center rounded-lg text-sm",
                    perm.allowed ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                  )}
                >
                  {perm.allowed ? "✓" : "✗"}
                </div>
                <span className="text-white">{perm.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
