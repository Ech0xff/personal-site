import FooterSection from "@/components/FooterSection";
import { Bilibili, Email, Github, Qq } from "@/components/icons";
import { cn } from "@/lib/utils";

import HeroSection from "./components/HeroSection";

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="z-1 flex w-full flex-col">
      <h3 className="mb-4 flex items-center gap-2 text-xl font-bold">
        <div className="h-5 w-1 rounded-full bg-gray-600" />
        {title}
      </h3>
      {children}
    </div>
  );
}

function AboutMeCard() {
  return (
    <Card title="Hi there 👋">
      <div className="mb-8 space-y-4 text-sm leading-relaxed sm:text-base">
        <p style={{ textIndent: "2em" }}>
          I am <span className="font-bold">BBLF</span>, a Junior Software
          Engineering student and a{" "}
          <span className="font-medium">Frontend Engineer</span>
          &nbsp;currently based in Chengdu. It is a genuine pleasure to cross
          paths with you in this vast digital landscape. I believe technology
          serves as a bridge between imagination and reality—existing not for
          its own sake, but to empower our ability to create and solve. Guided
          by the spirit of{" "}
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
}

function FindMeCard() {
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
  return (
    <Card title="Find me on">
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {socialLinks.map((item) => (
          <a
            key={item.name}
            href={item.link}
            target={item.link.startsWith("mailto") ? undefined : "_blank"}
            rel={
              item.link.startsWith("mailto") ? undefined : "noopener noreferrer"
            }
            className={cn(
              "group relative flex h-24 flex-col justify-between overflow-hidden rounded-2xl p-4 transition-all duration-300",
              "bg-slate-50 hover:bg-slate-100 dark:bg-white/5 dark:hover:bg-white/10",
            )}
          >
            <div className="relative z-10 flex h-full flex-col justify-between">
              <div className="text-xs font-medium text-slate-400">
                {item.name}
              </div>
              <div
                className={cn(
                  "text-base font-bold text-slate-700 transition-colors dark:text-slate-200",
                )}
              >
                {item.value}
              </div>
            </div>
            <item.icon
              className={cn(
                "absolute top-[50%] right-5 h-20 w-20 translate-y-[-50%] opacity-50 transition-transform duration-300 group-hover:scale-110",
                "text-slate-400 dark:text-slate-500",
              )}
            />
          </a>
        ))}
      </div>
    </Card>
  );
}

function PostsCard() {
  return (
    <Card title="Latest Posts">
      <div className="mb-8 space-y-4 text-sm leading-relaxed text-slate-600 sm:text-base">
        <p style={{ textIndent: "2em" }}>Coming Soon...</p>
      </div>
    </Card>
  );
}

function StatsCard() {
  return (
    <Card title="Statistics">
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="flex flex-col rounded-2xl bg-slate-50 p-4 transition-transform duration-300 hover:scale-105 dark:bg-white/5">
          <span className="text-xs font-medium tracking-wider text-slate-400 uppercase">
            Days Online
          </span>
          <span className="mt-1 text-2xl font-bold text-slate-700 dark:text-slate-200">
            None
          </span>
        </div>
        <div className="flex flex-col rounded-2xl bg-slate-50 p-4 transition-transform duration-300 hover:scale-105 dark:bg-white/5">
          <span className="text-xs font-medium tracking-wider text-slate-400 uppercase">
            Total Visits
          </span>
          <span className="mt-1 text-2xl font-bold text-slate-700 dark:text-slate-200">
            None
          </span>
        </div>
        <div className="flex flex-col rounded-2xl bg-slate-50 p-4 transition-transform duration-300 hover:scale-105 dark:bg-white/5">
          <span className="text-xs font-medium tracking-wider text-slate-400 uppercase">
            Articles
          </span>
          <span className="mt-1 text-2xl font-bold text-slate-700 dark:text-slate-200">
            None
          </span>
        </div>
        <div className="flex flex-col rounded-2xl bg-slate-50 p-4 transition-transform duration-300 hover:scale-105 dark:bg-white/5">
          <span className="text-xs font-medium tracking-wider text-slate-400 uppercase">
            Words
          </span>
          <span className="mt-1 text-2xl font-bold text-slate-700 dark:text-slate-200">
            None
          </span>
        </div>
      </div>
    </Card>
  );
}

function IntroductionSection() {
  return (
    <div className="flex flex-col px-4">
      <AboutMeCard />
      <FindMeCard />
      <PostsCard />
      <StatsCard />
    </div>
  );
}

export default async function HomePage() {
  return (
    <>
      <HeroSection />
      <div className="relative flex w-full flex-col gap-3 pt-[10svh]">
        {/* background */}
        <div
          className={cn(
            "absolute top-0 bottom-0 left-1/2 w-screen -translate-x-1/2 transition-all duration-(--duration-fast)",
            "bg-linear-to-b from-(--theme-bg)/0 to-(--theme-bg) to-[18svh]",
            "group-data-[scrolled=true]:top-[-18svh]",
          )}
        />
        <IntroductionSection />
        <FooterSection />
      </div>
    </>
  );
}
