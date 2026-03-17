"use client"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"

interface DialogDemoProps {
  onRoomCreated: () => void
}

const DialogDemo = ({ onRoomCreated }: DialogDemoProps) => {
  const [roomname, setRoomname] = useState("")
  const [roompassword, setRoompassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const onClickHandler = async () => {
    if (!roomname.trim() || !roompassword.trim()) {
      setError("Please fill all fields")
      return
    }

    setLoading(true)
    setError("")

    try {
      console.log("Sending post request to create db room");
      // console.log("All sent datas are,", roomname, roompassword);
      const { data } = await axios.post('/api/room', {
        roomname: roomname.trim(),
        roompassword: roompassword.trim()
      }, {
        withCredentials: true,
        timeout: 5000,
        headers: {
          'Content-Type': 'application/json',
        }
      })

      console.log("Room created:", data)
      onRoomCreated() // Refresh rooms list
      setRoomname("")
      setRoompassword("")
      router.refresh()
    } catch (err: any) {
      console.error("Error creating room:", err)
      setError(err.response?.data?.error || "Failed to create room")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Create New Room</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Room</DialogTitle>
          <DialogDescription>Fill in the details for your new room.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {error && (
            <div className="text-red-500 text-sm p-2 bg-red-50 rounded">
              {error}
            </div>
          )}
          <div className="grid gap-2">
            <Label htmlFor="roomName">Room Name</Label>
            <Input
              id="roomName"
              value={roomname}
              onChange={(e) => setRoomname(e.target.value)}
              className="w-full py-3 text-lg"
              placeholder="Enter room name"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="roomPassword">Room Password</Label>
            <Input
              id="roomPassword"
              type="password"
              value={roompassword}
              onChange={(e) => setRoompassword(e.target.value)}
              className="w-full py-3 text-lg"
              placeholder="Enter room password"
            />
          </div>
        </div>
        <DialogFooter>
          <Button path="submit" onClick={onClickHandler} disabled={loading}>
            {loading ? "Creating..." : "Create Room"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DialogDemo
