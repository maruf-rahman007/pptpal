"use client";

import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "../../../../components/ui/sidebar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
} from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { RoomCard } from "./roomcard";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import DialogDemo from "./dialogdemo";

export function SidebarDemo() {
  const router = useRouter();
  const session = useSession();
  console.log("Session :", session);
  if (session.status === 'unauthenticated') {
    router.push('/usersignin')
  }
  const links = [
    {
      label: "Dashboard",
      href: "#",
      icon: <IconBrandTabler className="text-neutral-900 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Profile",
      href: "#",
      icon: <IconUserBolt className="text-neutral-900 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Settings",
      href: "#",
      icon: <IconSettings className="text-neutral-900 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Logout",
      href: "#",
      icon: <IconArrowLeft className="text-neutral-900 h-5 w-5 flex-shrink-0" />,
      onClick: () => signOut(),
    },
  ];

  const [open, setOpen] = useState(false);

  return (
    <div
      className={cn(
        "rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 bor dark:border-neutral-900 overflow-hidden",
        "h-screen"
      )}
    >
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
                label: session.data?.user?.name || "Murshid",
                href: "#",
                icon: (
                  <Image
                    src={session.data?.user?.image || "https://assets.aceternity.com/manu.png"}
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
      <Dashboard />
    </div>
  );
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
);

export const LogoIcon = () => (
  <Link
    href="#"
    className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
  >
    <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
  </Link>
);

// Dummy dashboard component with content
const Dashboard = () => {
  const [rooms, setRooms] = useState([
    { id: 1, name: 'Room 1', description: 'Description for Room 1' },
    { id: 2, name: 'Room 2', description: 'Description for Room 2' },
    { id: 3, name: 'Room 3', description: 'Description for Room 3' },
    { id: 4, name: 'Room 4', description: 'Description for Room 4' },
    { id: 5, name: 'Room 5', description: 'Description for Room 5' },
    { id: 6, name: 'Room 6', description: 'Description for Room 6' },
    { id: 7, name: 'Room 7', description: 'Description for Room 7' },
  ]);
  return (
    <div className="bg-customColor w-full h-full border">
      <div className="flex flex-col items-end mt-10 mr-10 p-4">
        <DialogDemo/>
      </div>
      <div className="p-4 max-h-[calc(100vh-150px)] overflow-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {rooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SidebarDemo;
