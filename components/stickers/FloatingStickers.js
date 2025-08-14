"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const STICKER_EMOJIS = ["🎨", "✨", "🌟", "💫", "🎯", "🚀", "💜", "🎪", "🌈", "🎭", "🎨", "🦄"];

export default function FloatingStickers() {
  const [stickers, setStickers] = useState([]);

  useEffect(() => {
    const generatedStickers = STICKER_EMOJIS.map((emoji, i) => ({
      id: i,
      emoji,
      x: Math.random() * 100,
      y: Math.random() * 100,
      rotation: Math.random() * 360,
      scale: 0.5 + Math.random() * 0.5,
      duration: 15 + Math.random() * 20,
      delay: Math.random() * 5,
    }));
    setStickers(generatedStickers);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stickers.map((sticker) => (
        <motion.div
          key={sticker.id}
          className="absolute text-4xl md:text-6xl"
          initial={{
            x: `${sticker.x}vw`,
            y: `${sticker.y}vh`,
            rotate: sticker.rotation,
            scale: 0,
            opacity: 0,
          }}
          animate={{
            x: [`${sticker.x}vw`, `${(sticker.x + 30) % 100}vw`, `${sticker.x}vw`],
            y: [`${sticker.y}vh`, `${(sticker.y - 20) % 100}vh`, `${sticker.y}vh`],
            rotate: [sticker.rotation, sticker.rotation + 180, sticker.rotation + 360],
            scale: [0, sticker.scale, sticker.scale, 0],
            opacity: [0, 0.6, 0.6, 0],
          }}
          transition={{
            duration: sticker.duration,
            delay: sticker.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            filter: "blur(0.5px)",
            transform: `perspective(1000px) rotateX(${Math.random() * 20}deg)`,
          }}
        >
          {sticker.emoji}
        </motion.div>
      ))}
    </div>
  );
}