import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "wouter";
import {
  Terminal, BookOpen, ChevronRight, Sparkles, Play, ArrowRight,
  CheckCircle2, Circle, Rocket, Cpu, Shield, Settings
} from "lucide-react";
import { COURSE_MODULES, getCourseProgress, type Module } from "@/lib/course";

// Animação de terminal PowerShell ao vivo
function LiveTerminal() {
  const steps = [
    { cmd: "PS C:\\> Get-Process | Sort-Object CPU -Descending | Select-Object -First 5", out: "Handles  NPM(K)    PM(K)      WS(K)     CPU(s)     Id  SI ProcessName\n-------  ------    -----      -----     ------     --  -- -----------\n   1245      85   125420     132458     245.12   4521   1 chrome\n    892      42    85642      92456     189.45   2134   1 code", delay: 1200 },
    { cmd: "PS C:\\> Get-Service | Where-Object {$_.Status -eq 'Running'}", out: "Status   Name               DisplayName\n------   ----               -----------\nRunning  XboxGipSvc         Xbox Accessory Management\nRunning  WpnService         Windows Push Notifications...\nRunning  Winmgmt            Windows Management Instrumentation", delay: 1400 },
    { cmd: "PS C:\\> Invoke-WebRequest -Uri 'https://api.github.com' | ConvertFrom-Json", out: "{current_user_url: https://api.github.com/user, emails_url: https://api.github.com/user/emails...}", delay: 1000 },
    { cmd: "PS C:\\> Get-ADUser -Filter * | Measure-Object", out: "Count    : 1247\nAverage  :\nSum      :\nMax      :\nMin      :", delay: 1100 },
    { cmd: "PS C:\\> Start-Job -ScriptBlock { Get-ChildItem C:\\ -Recurse }", out: "Id     Name            PSJobTypeName   State         HasMoreData   Location\n--     ----            -------------   -----         -----------   --------\n1      Job1            BackgroundJob   Running       True          localhost", delay: 900 },
  ];

  const [step, setStep] = useState(0);
  const [showOut, setShowOut] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;
    if (step >= steps.length) {
      const timer = setTimeout(() => { setStep(0); setShowOut(false); }, 3000);
      return () => clearTimeout(timer);
    }
    const timer = setTimeout(() => setShowOut(true), steps[step].delay);
    const nextTimer = setTimeout(() => { setStep((s) => s + 1); setShowOut(false); }, steps[step].delay + 2000);
    return () => { clearTimeout(timer); clearTimeout(nextTimer); };
  }, [step, isInView]);

  const currentCmd = steps[Math.min(step, steps.length - 1)];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="rounded-none overflow-hidden border border-[#3A8EE4]/30 shadow-2xl shadow-black/40 text-left"
    >
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-2 bg-[#001D4A] border-b border-[#3A8EE4]/20">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
          <div className="w-3 h-3 rounded-full bg-[#28c840]" />
        </div>
        <span className="ml-2 text-xs font-mono text-gray-400">Windows PowerShell</span>
      </div>
      {/* Terminal body */}
      <div className="bg-[#012456] p-5 font-mono text-sm min-h-[220px] text-white">
        {steps.slice(0, step).map((s, i) => (
          <div key={i} className="mb-3">
            <div className="text-[#FFFF00]">{s.cmd}</div>
            {s.out && <div className="text-gray-300 whitespace-pre-line mt-1 pl-2">{s.out}</div>}
          </div>
        ))}
        {step < steps.length && (
          <div>
            <span className="text-[#FFFF00]">{currentCmd.cmd}</span>
            <span className="inline-block w-2 h-4 ml-1 bg-white animate-pulse" />
            {showOut && currentCmd.out && (
              <div className="text-gray-300 whitespace-pre-line mt-1 pl-2">{currentCmd.out}</div>
            )}
          </div>
        )}
        {step >= steps.length && (
          <div className="text-[#3A8EE4]">✓ Demo completa — reiniciando...</div>
        )}
      </div>
    </motion.div>
  );
}

// Card de módulo com progresso
function ModuleCard({ module, index, completedLessons }: { module: Module; index: number; completedLessons: Set<string> }) {
  const total = module.lessons.length;
  const done = module.lessons.filter((l) => completedLessons.has(l.id)).length;
  const percentage = total > 0 ? (done / total) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.03 }}
      className="group relative p-5 bg-[#001D4A]/40 border border-[#3A8EE4]/20 rounded-lg hover:border-[#3A8EE4]/50 transition-all overflow-hidden"
    >
      {/* Progress bar atrás */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#3A8EE4]/10 to-transparent pointer-events-none" style={{ width: `${percentage}%` }} />

      <div className="flex items-start justify-between mb-3 relative z-10">
        <div className="w-10 h-10 rounded-lg bg-[#3A8EE4]/20 border border-[#3A8EE4]/30 flex items-center justify-center text-[#3A8EE4]">
          <Terminal className="w-5 h-5" />
        </div>
        <span className="text-xs font-mono text-gray-400 tabular-nums">
          {done}/{total}
        </span>
      </div>

      <h3 className="font-bold text-white mb-1 relative z-10">{module.title}</h3>
      <p className="text-sm text-gray-400 mb-3 relative z-10">{module.description}</p>

      {/* Progress bar */}
      <div className="h-1.5 bg-[#001D4A] rounded-full overflow-hidden mb-4 relative z-10">
        <motion.div
          className="h-full bg-[#3A8EE4]"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.6, delay: 0.2 }}
        />
      </div>

      {/* Aulas */}
      <ul className="space-y-1 relative z-10">
        {module.lessons.slice(0, 4).map((lesson) => (
          <li key={lesson.id}>
            <Link
              href={lesson.path}
              className="flex items-center gap-2 text-sm text-gray-300/70 hover:text-[#3A8EE4] transition-colors py-0.5"
            >
              {completedLessons.has(lesson.id) ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-[#3A8EE4]" />
              ) : (
                <Circle className="w-3.5 h-3.5 opacity-30" />
              )}
              <span className="truncate">{lesson.title}</span>
            </Link>
          </li>
        ))}
        {module.lessons.length > 4 && (
          <li className="text-xs text-gray-500">+{module.lessons.length - 4} mais</li>
        )}
      </ul>
    </motion.div>
  );
}

export default function Home() {
  const progress = getCourseProgress();
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());

  useEffect(() => {
    const saved = localStorage.getItem("powershell-curso-progresso");
    if (saved) setCompletedLessons(new Set(JSON.parse(saved)));
  }, []);

  const STATS = [
    { value: "74", label: "Capítulos" },
    { value: "500+", label: "Cmdlets" },
    { value: "7.4", label: "PowerShell Versão" },
    { value: "100%", label: "Português BR" },
  ];

  return (
    <div className="min-h-screen relative bg-[#001D4A]">
      {/* HERO animado */}
      <section className="relative overflow-hidden pt-16 pb-24 px-4">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <motion.div
            className="absolute inset-0 opacity-60"
            animate={{
              background: [
                "radial-gradient(800px 400px at 20% 10%, hsl(215 90% 50% / 0.15), transparent 60%)",
                "radial-gradient(800px 400px at 80% 20%, hsl(215 90% 40% / 0.12), transparent 60%)",
                "radial-gradient(800px 400px at 50% 0%, hsl(215 90% 45% / 0.18), transparent 60%)",
              ],
            }}
            transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
            style={{ background: "radial-gradient(800px 400px at 20% 10%, hsl(215 90% 50% / 0.18), transparent 60%)" }}
          />
        </div>

        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            {/* Badge */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#3A8EE4]/15 border border-[#3A8EE4]/30 mb-7"
            >
              <Sparkles className="w-4 h-4 text-[#3A8EE4]" />
              <span className="font-medium text-[#3A8EE4] text-sm">Curso completo · 74 capítulos · 2026</span>
            </motion.div>

            {/* Título */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.05] mb-6">
              <span className="text-white">Domine o</span>{" "}
              <span className="text-[#3A8EE4]">PowerShell</span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              Do <code className="text-[#3A8EE4] bg-black/30 px-2 py-0.5 rounded">Get-Command</code> ao Active Directory, Azure, DSC e automação avançada — <strong>em português</strong>.
            </p>

            {/* Progresso geral */}
            {progress.completed > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-8 max-w-md mx-auto"
              >
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-400">Seu progresso</span>
                  <span className="font-mono font-bold text-[#3A8EE4]">{progress.percentage}%</span>
                </div>
                <div className="h-2 bg-[#001D4A] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-[#3A8EE4]"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress.percentage}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>
              </motion.div>
            )}

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
              <Link
                href="/instalacao"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-[#3A8EE4] text-white font-bold no-underline hover:bg-[#2D7BD6] hover:scale-[1.02] transition-all shadow-lg shadow-[#3A8EE4]/25"
              >
                {progress.completed > 0 ? (
                  <>
                    <Play className="w-4 h-4" /> Continuar curso
                  </>
                ) : (
                  <>
                    <Rocket className="w-4 h-4" /> Começar agora
                  </>
                )}
              </Link>
              <Link
                href="/historia"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#001D4A]/80 border border-[#3A8EE4]/30 text-white font-semibold no-underline hover:bg-[#001D4A] transition-colors"
              >
                <BookOpen className="w-4 h-4" /> O que é PowerShell?
              </Link>
            </div>

            {/* Terminal ao vivo */}
            <LiveTerminal />
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-14"
          >
            {STATS.map((s, i) => (
              <div key={i} className="p-4 rounded-lg bg-[#001D4A]/60 border border-[#3A8EE4]/20 text-center">
                <div className="text-3xl font-extrabold text-[#3A8EE4]">{s.value}</div>
                <div className="text-xs text-gray-400 mt-1 uppercase tracking-wider font-mono">
                  {s.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Trilha de módulos */}
      <div className="max-w-5xl mx-auto px-4 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Trilha de aprendizado
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Progresso salvo automaticamente. Marque cada capítulo como concluído e avance no seu ritmo.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {COURSE_MODULES.map((module, i) => (
            <ModuleCard key={module.id} module={module} index={i} completedLessons={completedLessons} />
          ))}
        </div>

        {/* CTA final */}
        <section className="mt-20 relative rounded-2xl overflow-hidden border border-[#3A8EE4]/30 p-10 text-center bg-gradient-to-br from-[#3A8EE4]/10 via-[#001D4A] to-[#001D4A]">
          <Sparkles className="w-8 h-8 text-[#3A8EE4] mx-auto mb-4" />
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Pronto para começar?
          </h2>
          <p className="text-gray-400 mb-6 max-w-xl mx-auto">
            A jornada do <code>Get-Command</code> ao monorepo de automação começa agora.
          </p>
          <Link
            href="/instalacao"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#3A8EE4] text-white font-bold no-underline hover:bg-[#2D7BD6] hover:scale-[1.02] transition-all shadow-lg shadow-[#3A8EE4]/25"
          >
            Início Rápido
            <ArrowRight className="w-4 h-4" />
          </Link>
        </section>
      </div>
    </div>
  );
}
