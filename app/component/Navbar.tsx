"use client"

import { useSession, signIn, signOut } from "next-auth/react"

export default function Navbar() {
    const { data: session } = useSession()

    return (
        <div className="font-mono text-5xl flex justify-between items-center italic font-extrabold bg-customColor p-6 border border-b-slate-500">
            
            <a href="/">
                <img src="/navlogo.png" alt="Logo" className="h-12" />
            </a>

            <div className="text-base not-italic font-semibold">
                {session ? (
                    <button
                        onClick={() => signOut()}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
                    >
                        Logout
                    </button>
                ) : (
                    <button
                        onClick={() => signIn()}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
                    >
                        Login
                    </button>
                )}
            </div>
        </div>
    )
}