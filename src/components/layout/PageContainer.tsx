import { ReactNode, useEffect, useState } from "react";
import { DifficultyBadge } from "../ui/DifficultyBadge";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";

interface PageContainerProps {
  title: string;
  subtitle?: string;
  difficulty?: "iniciante" | "intermediario" | "avancado";
  timeToRead?: string;
  children: ReactNode;
}

export function PageContainer({ title, subtitle, difficulty, timeToRead, children }: PageContainerProps) {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scroll = windowHeight > 0 ? totalScroll / windowHeight : 0;
      setScrollProgress(scroll);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-10 pb-32">
      <div
        className="fixed top-0 left-0 h-[3px] z-50 transition-[width] duration-150 ease-out"
        style={{
          width: `${scrollProgress * 100}%`,
          background: 'linear-gradient(90deg, hsl(var(--primary)), hsl(var(--secondary)))',
          boxShadow: '0 0 12px hsl(var(--primary) / 0.6)',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        <header className="mb-12">
          {(difficulty || timeToRead) && (
            <div className="flex flex-wrap items-center gap-3 mb-5">
              {difficulty && <DifficultyBadge level={difficulty} />}
              {timeToRead && (
                <span className="text-xs text-muted-foreground font-mono flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted/50 border border-border/60">
                  <Clock className="w-3 h-3" />
                  {timeToRead} de leitura
                </span>
              )}
            </div>
          )}
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground mb-4 leading-[1.1]">
            {title}
          </h1>
          {subtitle && (
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-3xl">
              {subtitle}
            </p>
          )}
          <div className="mt-8 h-px bg-gradient-to-r from-primary/40 via-border to-transparent" />
        </header>

        <div className="prose prose-invert max-w-none">
          {children}
        </div>
      </motion.div>
    </div>
  );
}
