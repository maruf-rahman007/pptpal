"use client"
import React, { useState } from "react"
import axios from "axios"
import { Sidebar, SidebarBody, SidebarLink } from "../../../../components/ui/sidebar"
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
} from "@tabler/icons-react"
import Link from "next/link"
import { motion } from "framer-motion"
import Image from "next/image"
import { cn } from "@/app/lib/utils"
import { Button } from "@/components/ui/button"
import { RoomCard } from "./roomcard"
import { signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import DialogDemo from "./dialogdemo"

interface Room {
  title: string,
  id: string
  roomname: string
  allowedaccess: string[]
}

interface SidebarDemoProps {
  initialRooms: Room[]
}

export function SidebarDemo({ initialRooms }: SidebarDemoProps) {
  const [rooms, setRooms] = useState<Room[]>(initialRooms)
  const [refreshing, setRefreshing] = useState(false)
  const router = useRouter()
  const { data: session } = useSession()
  console.log(session);
  if (session?.user?.role==="guest") {
    router.push(`/dashboard/${session.user.id}`);
  }

  const refreshRooms = async () => {
    setRefreshing(true)
    try {
      console.log("Sending get request");
      const { data } = await axios.get('/api/room', {
        withCredentials: true,
        timeout: 5000,
      })
      setRooms(data.rooms)
    } catch (error) {
      console.error('Failed to refresh rooms:', error)
    } finally {
      setRefreshing(false)
    }
  }

  const handleSignOut = () => {
    signOut({ callbackUrl: '/usersignin' })
  }

  const links = [
    { label: "Dashboard", href: "#", icon: <IconBrandTabler className="text-neutral-900 h-5 w-5 flex-shrink-0" /> },
    { label: "Profile", href: "#", icon: <IconUserBolt className="text-neutral-900 h-5 w-5 flex-shrink-0" /> },
    { label: "Settings", href: "#", icon: <IconSettings className="text-neutral-900 h-5 w-5 flex-shrink-0" /> },
    { 
      label: "Logout", 
      href: "#", 
      icon: <IconArrowLeft className="text-neutral-900 h-5 w-5 flex-shrink-0" />,
      onClick: handleSignOut,
    },
  ]

  const [open, setOpen] = useState(false)

  return (
    <div className={cn("rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 h-screen")}>
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink
                  key={idx}
                  link={link}
                  onClick={link.label === "Logout" ? link.onClick : undefined}
                />
              ))}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: session?.user?.name || "User",
                href: "#",
                icon: (
                  <Image
                    src={session?.user?.image || "/default-avatar.png"}
                    className="h-7 w-7 flex-shrink-0 rounded-full"
                    width={50}
                    height={50}
                    alt="Avatar"
                  />
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
      
      <Dashboard 
        rooms={rooms} 
        refreshRooms={refreshRooms}
        refreshing={refreshing}
        session={session}
        onSignOut={handleSignOut}
      />
    </div>
  )
}

export const Logo = () => (
  <Link
    href="#"
    className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
  >
    <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="font-medium text-black dark:text-white whitespace-pre"
    >
      Rooms
    </motion.span>
  </Link>
)

export const LogoIcon = () => (
  <Link
    href="#"
    className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
  >
    <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
  </Link>
)

interface DashboardProps {
  rooms: Room[]
  refreshRooms: () => void
  refreshing: boolean
  session: any
  onSignOut: () => void
}

const Dashboard: React.FC<DashboardProps> = ({
  rooms,
  refreshRooms,
  refreshing,
  session,
  onSignOut,
}) => {
  return (
    <div className="bg-customColor w-full h-full border">
      
      <div className="flex flex-col items-end mt-10 mr-10 p-4">
        <DialogDemo onRoomCreated={refreshRooms} />
      </div>
      <div className="pl-8 ml-6">
          <h1 className="text-4xl font-bold text-gray-900">
            Welcome, {session?.user?.name || 'User'}!
          </h1>
      </div>
      <div className="p-4 max-h-[calc(100vh-150px)] overflow-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {rooms.length > 0 ? (
            rooms.map((room) => (
              <RoomCard 
                key={room.id} 
                room={{ ...room, name: room.roomname, title: room.title }} 
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-gray-500">
              No rooms yet. Create your first room!
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
