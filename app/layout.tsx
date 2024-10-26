import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Providers from "./component/provider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "PPTPal - Easy & Secure PPT Sharing for Students",
  description: "PPTPal is a student-friendly platform that enables seamless sharing of PowerPoint presentations. Create a room, upload your PPT, and access it with just a room ID and password. No email login needed—perfect for hassle-free classroom presentations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="shortcut icon" href="/1.png" type="image/x-icon" />
      </head>
      <body
        className="bg-customColor2"
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
