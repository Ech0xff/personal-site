"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import AnimatedGridBackground from "./components/AnimatedGridBackground";
import { Bilibili, Email, Github, Qq } from "@/components/icons";

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="z-1 w-full flex flex-col">
      <h3 className="flex items-center gap-2 text-xl font-bold mb-4">
        <div className="w-1 h-5 bg-gray-600 rounded-full" />
        {title}
      </h3>
      {children}
    </div>
  );
}

const AboutMeCard = (
  <Card title="Hi there 👋">
    <div className="space-y-4 leading-relaxed mb-8 text-sm sm:text-base">
      <p style={{ textIndent: "2em" }}>
        I am <span className="font-bold">BBLF</span>, a Junior
        Software Engineering student and a{" "}
        <span className="font-medium">Frontend Engineer</span>
        &nbsp;currently based in Chengdu. It is a genuine pleasure to cross
        paths with you in this vast digital landscape. I believe technology
        serves as a bridge between imagination and reality—existing not for its
        own sake, but to empower our ability to create and solve. Guided by the
        spirit of{" "}
        <span className="italic">
          &quot;I want to understand everything,&quot;
        </span>
        &nbsp;I find joy in deconstructing complex systems and uncovering the
        underlying logic behind every tool. My current technical journey is
        built upon Next.js, Vue, TypeScript, Nuxt.js, Java, Node.js, and Bun.
      </p>
    </div>
  </Card>
);

const socialLinks = [
  {
    name: "Bilibili",
    value: "BBLF",
    link: "https://space.bilibili.com/",
    icon: Bilibili,
  },
  {
    name: "GitHub",
    value: "BBLF",
    link: "https://github.com/",
    icon: Github,
  },
  {
    name: "Email",
    value: "Send Me",
    link: "mailto:your@email.com",
    icon: Email,
  },
  {
    name: "QQ",
    value: "Add Me",
    link: "#",
    icon: Qq,
  },
];

const FindMeCard = (
  <Card title="Find me on">
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
      {socialLinks.map((item) => (
        <a
          key={item.name}
          href={item.link}
          target={item.link.startsWith("mailto") ? undefined : "_blank"}
          rel={
            item.link.startsWith("mailto") ? undefined : "noopener noreferrer"
          }
          className={cn(
            "group relative flex flex-col justify-between p-4 h-24 rounded-2xl overflow-hidden transition-all duration-300",
            "bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10",
          )}
        >
          <div className="z-10 relative flex flex-col h-full justify-between">
            <div className="text-xs text-slate-400 font-medium">
              {item.name}
            </div>
            <div
              className={cn(
                "text-base font-bold text-slate-700 dark:text-slate-200 transition-colors",
              )}
            >
              {item.value}
            </div>
          </div>
          <item.icon
            className={cn(
              "absolute right-5 top-[50%] translate-y-[-50%] w-20 h-20 transition-transform duration-300 group-hover:scale-110 opacity-50",
              "text-slate-400 dark:text-slate-500",
            )}
          />
        </a>
      ))}
    </div>
  </Card>
);

const PostsCard = (
  <Card title="Latest Posts">
    <div className="space-y-4 text-slate-600 leading-relaxed mb-8 text-sm sm:text-base">
      <p style={{ textIndent: "2em" }}>Coming Soon...</p>
    </div>
  </Card>
);

const StatsCard = (
  <Card title="Statistics">
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
      <div className="flex flex-col p-4 rounded-2xl bg-slate-50 dark:bg-white/5 hover:scale-105 transition-transform duration-300">
        <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">
          Days Online
        </span>
        <span className="text-2xl font-bold text-slate-700 dark:text-slate-200 mt-1">
          None
        </span>
      </div>
      <div className="flex flex-col p-4 rounded-2xl bg-slate-50 dark:bg-white/5 hover:scale-105 transition-transform duration-300">
        <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">
          Total Visits
        </span>
        <span className="text-2xl font-bold text-slate-700 dark:text-slate-200 mt-1">
          None
        </span>
      </div>
      <div className="flex flex-col p-4 rounded-2xl bg-slate-50 dark:bg-white/5 hover:scale-105 transition-transform duration-300">
        <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">
          Articles
        </span>
        <span className="text-2xl font-bold text-slate-700 dark:text-slate-200 mt-1">
          None
        </span>
      </div>
      <div className="flex flex-col p-4 rounded-2xl bg-slate-50 dark:bg-white/5 hover:scale-105 transition-transform duration-300">
        <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">
          Words
        </span>
        <span className="text-2xl font-bold text-slate-700 dark:text-slate-200 mt-1">
          None
        </span>
      </div>
    </div>
  </Card>
);

const FooterSection = (
  <footer className="w-full mt-12 pb-8 flex flex-col items-center justify-center gap-6">
    <div className="w-full max-w-2xl px-4 mx-auto">
      <div className="w-full h-px bg-linear-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent" />
    </div>

    <div className="flex flex-col items-center gap-2 text-sm text-slate-400 dark:text-slate-500 font-mono">
      <p>© {new Date().getFullYear()} BBLF. All rights reserved.</p>
      <div className="flex items-center gap-3 text-xs opacity-70">
        <span className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-default">
          Designed by BBLF
        </span>
        <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
        <span className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-default">
          Built with Next.js
        </span>
      </div>
    </div>
  </footer>
);

export default function HomePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useAnimate(canvasRef);

  const [currentText, setCurrentText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(100);
  const [inTopSection, setInTopSection] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setInTopSection(window.scrollY <= 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    <>
      <div
        className={cn(
          "w-screen absolute inset-0 flex items-center justify-center snap-start flex-col overflow-hidden bg-brand-gradient h-[60svh] transition-all duration-(--duration-fast)",
          { "h-screen": inTopSection },
        )}
      >
        <AnimatedGridBackground />
        <div className="relative flex-1 flex flex-col justify-center items-center">
          <div className="flex flex-col items-center">
            <h1
              className="text-6xl text-center"
              style={{ fontFamily: '"Titan One", cursive' }}
            >
              BBLF
            </h1>
            <div className="w-full h-px bg-linear-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent my-2" />
            <div className="flex flex-col items-center font-mono text-xs tracking-widest text-gray-500 dark:text-gray-500 space-y-2">
              <div className="flex items-center gap-1 font-black text-xl">
                {currentText}
                <span className="typing-cursor">
                  ▋
                </span>
              </div>
            </div>
            <div className="w-full h-px bg-linear-to-r from-transparentmy-2" />
            <div
              className="mt-8 text-9xl font-black"
              style={{
                fontFamily:
                  '"Savoye LET", "Snell Roundhand", "Segoe Script", "Gabriola", cursive',
              }}
            >
              In code we trust
            </div>
          </div>
        </div>
      </div>
      <div className={cn("h-screen transition-all duration-(--duration-fast)", { "h-[60svh]": !inTopSection })}></div>
      <div className={cn("relative flex flex-col w-full gap-3 pt-[10svh]", {})}>
        <div
          className={cn(
            "absolute w-screen left-1/2 -translate-x-1/2 bottom-0 top-0",
            "bg-linear-to-b from-(--theme-bg)/0 to-(--theme-bg) to-[18svh]",
            { "top-[-18svh]": !inTopSection },
          )}
        />
        {AboutMeCard}
        {FindMeCard}
        {PostsCard}
        {StatsCard}
        {FooterSection}
      </div>
    </>
  );
}
