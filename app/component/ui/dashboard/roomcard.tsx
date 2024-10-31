"use client";

import React from "react";
import {
  GlowingStarsBackgroundCard,
  GlowingStarsDescription,
  GlowingStarsTitle,
} from "../../../../components/ui/glowing-stars";

interface Room {
  id: number;
  name: string;
  description: string; // Ensure description is included
}

interface RoomCardProps {
  room: Room; // Define the room prop
}

export function RoomCard({ room }: RoomCardProps) {
  return (
    <div className="flex py-10 items-center justify-center antialiased cursor-pointer" onClick={()=>{
        console.log("Hi from room ",room.name);
    }}> 
      <GlowingStarsBackgroundCard>
        <GlowingStarsTitle className="mb-1">{room.name}</GlowingStarsTitle> 
        <div className="flex justify-between items-end">
          <GlowingStarsDescription className="mb-0"> 
            {room.description}
          </GlowingStarsDescription>
          <div className="h-8 w-8 rounded-full bg-[hsla(0,0%,100%,.1)] flex items-center justify-center">
            <Icon />
          </div>
        </div>
      </GlowingStarsBackgroundCard>
    </div>
  );
}

const Icon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className="h-4 w-4 text-white stroke-2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
      />
    </svg>
  );
};
