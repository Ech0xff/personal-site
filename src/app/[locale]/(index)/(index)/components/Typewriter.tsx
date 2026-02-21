"use client";
import { useEffect, useState } from "react";

import Stack from "@/components/ui/Stack";

export default function HeroTypewriter() {
  const [currentText, setCurrentText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(100);

  useEffect(() => {
    const texts = [
      "N 30.57° | E 104.06° | UTC/GMT +08:00",
      'echo "Hello World"',
    ];
    const fullText = texts[currentIndex] || "";

    const timer = setTimeout(() => {
      if (isDeleting) {
        setCurrentText((prev) => prev.substring(0, prev.length - 1));
        setTypingSpeed(50);
      } else {
        setCurrentText((prev) => fullText.substring(0, prev.length + 1));
        setTypingSpeed(100);
      }

      if (!isDeleting && currentText === fullText) {
        setTypingSpeed(2500);
        setIsDeleting(true);
      } else if (isDeleting && currentText === "") {
        setIsDeleting(false);
        setCurrentIndex((prev) => (prev + 1) % texts.length);
        setTypingSpeed(500);
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentIndex, typingSpeed]);

  return (
    <Stack
      x
      className="items-center gap-2 font-mono tracking-widest text-gray-500 dark:text-gray-500"
    >
      <div className="flex items-center gap-1 text-[1.2em] font-black">
        {currentText}
        <span className="typing-cursor">▋</span>
      </div>
    </Stack>
  );
}
