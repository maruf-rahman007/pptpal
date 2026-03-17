'use client'
import { useSession, signOut, signIn } from 'next-auth/react'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { SidebarDemo } from '../component/ui/dashboard/dashboard'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const [rooms, setRooms] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

    // Redirect if unauthenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      signIn(undefined, { callbackUrl: '/usersignin' })
    }
  }, [status])

  // fetching rooms after authentication
  useEffect(() => {
    const fetchRooms = async () => {
      if (status === 'authenticated' && session?.user?.id) {
        try {
          setLoading(true)
          const { data } = await axios.get('/api/room', {
            withCredentials: true,
            timeout: 5000,
          })
          setRooms(data.rooms)
        } catch (error) {
          console.error('Failed to fetch rooms:', error)
          setRooms([])
        } finally {
          setLoading(false)
        }
      }
    }

    fetchRooms()
  }, [status, session?.user?.id])

  // Show loading while session or rooms are loading
  if (status === 'loading' || loading) {
    console.log({ status, loading });
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-xl">Loading dashboard...</div>
      </div>
    )
  }


  return (
    <div className="h-screen min-h-screen bg-gray-50">
      <SidebarDemo initialRooms={rooms} />
    </div>
  )
}
