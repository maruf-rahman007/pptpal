"use client";

import React from "react";
import { InfiniteMovingCards } from "./infinite-moving-cards";

export function InfiniteMovingCardsDemo() {
  return (
    <div className="h-[40rem] rounded-md flex flex-col antialiased dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden">
      <InfiniteMovingCards
        items={testimonials}
        direction="right"
        speed="slow"
      />
    </div>
  );
}

const testimonials = [
  { imageUrl: "/Business Meeting Illustration.jpeg" },
  { imageUrl: "/Business Presentation.jpeg" },
  { imageUrl: "/Seminar-bro.png" },
  { imageUrl: "/Consulting-bro.png" },
  { imageUrl: "/Seminar-pana.png" },
  { imageUrl: "/Digital presentation-bro.png" },
  { imageUrl: "/Digital presentation-cuate.png" },
];