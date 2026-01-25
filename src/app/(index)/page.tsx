import { cn } from "@/lib/utils";
import FooterSection from "@/components/FooterSection";
import HeroSection from "./components/HeroSection";
import { Bilibili, Github, Email, Qq } from "@/components/icons";

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

function AboutMeCard() {
  return (
    <Card title="Hi there 👋">
      <div className="space-y-4 leading-relaxed mb-8 text-sm sm:text-base">
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
}

function PostsCard() {
  return (
    <Card title="Latest Posts">
      <div className="space-y-4 text-slate-600 leading-relaxed mb-8 text-sm sm:text-base">
        <p style={{ textIndent: "2em" }}>Coming Soon...</p>
      </div>
    </Card>
  );
}

function StatsCard() {
  return (
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
}

function IntroductionSection() {
  return (
    <div className="px-4 flex flex-col">
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
      <div className="relative flex flex-col w-full gap-3 pt-[10svh]">
        {/* background */}
        <div
          className={cn(
            "absolute w-screen left-1/2 -translate-x-1/2 bottom-0 top-0 transition-all duration-(--duration-fast)",
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
