import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";
import { motion } from "framer-motion";
import {
  Terminal,
  BookOpen,
  Settings,
  Code2,
  ChevronRight,
  Cpu,
  Globe,
  Shield,
  Layers,
  Sparkles,
  ArrowRight,
  Zap,
} from "lucide-react";
import { Link } from "wouter";

const categories = [
  {
    title: "Fundamentos",
    icon: Terminal,
    description: "História, instalação e primeiros passos no terminal.",
    links: [
      { name: "História e Conceitos", href: "/historia" },
      { name: "Instalação", href: "/instalacao" },
      { name: "Primeiros Passos", href: "/primeiros-passos" },
      { name: "Sistema de Ajuda", href: "/ajuda" },
    ],
  },
  {
    title: "Linguagem",
    icon: Code2,
    description: "Variáveis, operadores, tipos de dados e lógica.",
    links: [
      { name: "Variáveis e Escopo", href: "/variaveis" },
      { name: "Operadores", href: "/operadores" },
      { name: "Manipulação de Strings", href: "/strings" },
      { name: "Arrays e Coleções", href: "/arrays" },
      { name: "Hashtables", href: "/hashtables" },
    ],
  },
  {
    title: "Pipeline e Objetos",
    icon: Layers,
    description: "O poder do pipeline e processamento de objetos.",
    links: [
      { name: "Entendendo o Pipeline", href: "/pipeline" },
      { name: "Filtros e Seleção", href: "/filtros" },
      { name: "Formatação e Saída", href: "/formatacao" },
    ],
  },
  {
    title: "Sistema de Arquivos",
    icon: BookOpen,
    description: "Navegação, gerenciamento de arquivos e permissões.",
    links: [
      { name: "Navegação", href: "/navegacao" },
      { name: "Manipulação de Arquivos", href: "/arquivos" },
      { name: "Conteúdo de Arquivos", href: "/conteudo-arquivos" },
      { name: "Permissões ACL", href: "/permissoes" },
    ],
  },
  {
    title: "Administração",
    icon: Settings,
    description: "Processos, serviços, usuários e agendamentos.",
    links: [
      { name: "Processos", href: "/processos" },
      { name: "Serviços", href: "/servicos" },
      { name: "Usuários e Grupos", href: "/usuarios" },
      { name: "Tarefas Agendadas", href: "/agendamento" },
    ],
  },
  {
    title: "Rede e Web",
    icon: Globe,
    description: "Diagnóstico de rede e consumo de APIs REST.",
    links: [
      { name: "Comandos de Rede", href: "/rede" },
      { name: "Trabalhando com Web APIs", href: "/web-api" },
    ],
  },
  {
    title: "Automação Profissional",
    icon: Shield,
    description: "Tratamento de erros, módulos e segurança.",
    links: [
      { name: "Tratamento de Erros", href: "/erros" },
      { name: "Módulos", href: "/modulos" },
      { name: "Scripts e Segurança", href: "/scripts" },
    ],
  },
  {
    title: "Recursos Avançados",
    icon: Cpu,
    description: "Registro, WMI/CIM e gerenciamento de pacotes.",
    links: [
      { name: "Registro do Windows", href: "/registro" },
      { name: "WMI e CIM", href: "/wmi-cim" },
      { name: "Gerenciamento de Pacotes", href: "/pacotes" },
    ],
  },
];

const stats = [
  { label: "Capítulos", value: "66" },
  { label: "Exemplos prontos", value: "500+" },
  { label: "Idioma", value: "PT-BR" },
  { label: "Dependência externa", value: "0" },
];

export default function Home() {
  return (
    <PageContainer
      title=""
      subtitle=""
    >
      {/* HERO */}
      <section className="relative -mt-12 mb-20">
        <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card/40 backdrop-blur-sm p-8 sm:p-12 lg:p-16">
          {/* Background mesh */}
          <div
            className="absolute inset-0 -z-10 opacity-90"
            style={{
              background: `
                radial-gradient(ellipse 600px 400px at 20% 30%, hsl(195 100% 50% / 0.20), transparent 60%),
                radial-gradient(ellipse 500px 350px at 90% 80%, hsl(270 80% 65% / 0.18), transparent 60%),
                radial-gradient(ellipse 400px 300px at 60% 10%, hsl(195 100% 60% / 0.10), transparent 60%)
              `,
            }}
          />
          {/* Subtle grid overlay */}
          <div
            className="absolute inset-0 -z-10 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
              maskImage: "radial-gradient(ellipse 80% 60% at 50% 30%, black, transparent)",
            }}
          />

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 rounded-full border border-primary/30 bg-primary/10 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-mono font-semibold text-primary uppercase tracking-wider">
                Guia Definitivo · PT-BR
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.05] mb-6 mt-0 pb-0 border-0">
              Domine o{" "}
              <span className="bg-gradient-to-r from-primary via-cyan-300 to-secondary bg-clip-text text-transparent text-glow-primary">
                PowerShell
              </span>
              <br />
              do básico ao{" "}
              <span className="font-mono text-primary cursor-blink">avançado</span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mb-8">
              66 capítulos com exemplos prontos para colar no terminal.
              Aprenda automação de sistemas com o shell mais poderoso do mercado —
              do <code>Get-Process</code> ao Active Directory, Azure e CI/CD.
            </p>

            <div className="flex flex-wrap gap-3 mb-10">
              <Link href="/historia">
                <button className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5">
                  Começar a ler
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
              <Link href="/ref-rapida">
                <button className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold border border-border bg-card/50 hover:bg-card hover:border-primary/40 transition-all">
                  <Zap className="w-4 h-4 text-primary" />
                  Referência rápida
                </button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-border/40">
              {stats.map((s) => (
                <div key={s.label}>
                  <div className="text-2xl sm:text-3xl font-bold font-mono text-foreground tracking-tight">
                    {s.value}
                  </div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1 font-medium">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* WHY POWERSHELL + HOW TO USE */}
      <section className="mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          <div className="card-premium p-7">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary/15 border border-primary/25 flex items-center justify-center">
                <Terminal className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-xl font-bold mt-0 mb-0 pb-0 border-0">Por que PowerShell?</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Diferente de shells tradicionais baseados em texto (Bash, CMD), o PowerShell é baseado em{" "}
              <strong className="text-foreground">objetos</strong>. Ao invés de manipular strings, você lida com
              estruturas ricas, tornando a automação mais robusta.
            </p>
            <ul className="space-y-1.5 text-sm">
              <li>Integração profunda com .NET</li>
              <li>Multiplataforma (Windows, Linux, macOS)</li>
              <li>Convenção Verbo-Substantivo previsível</li>
            </ul>
          </div>

          <div className="card-premium p-7">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-secondary/15 border border-secondary/25 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-secondary" />
              </div>
              <h3 className="text-xl font-bold mt-0 mb-0 pb-0 border-0">Como usar este guia?</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Estruturado tanto como curso sequencial quanto referência rápida. Cada página traz exemplos
              prontos para colar no terminal — comece pelo básico ou pule direto para o tópico que precisa.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 rounded-md text-[11px] font-mono font-semibold uppercase tracking-wider">Iniciante</span>
              <span className="px-2.5 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/25 rounded-md text-[11px] font-mono font-semibold uppercase tracking-wider">Intermediário</span>
              <span className="px-2.5 py-1 bg-rose-500/10 text-rose-400 border border-rose-500/25 rounded-md text-[11px] font-mono font-semibold uppercase tracking-wider">Avançado</span>
            </div>
          </div>
        </div>

        <AlertBox type="tip" title="Dica de Ouro">
          O PowerShell não é apenas um shell — é um motor de automação. Se você faz algo manualmente mais de duas vezes,
          existe um cmdlet que faz isso por você.
        </AlertBox>
      </section>

      {/* CATEGORIES */}
      <section className="mb-20">
        <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mt-0 mb-2 pb-0 border-0 tracking-tight">
              Navegue pelas categorias
            </h2>
            <p className="text-sm text-muted-foreground">
              {categories.length} áreas temáticas · explore livremente
            </p>
          </div>
          <span className="prompt-tag">
            <span className="opacity-70">PS&gt;</span> ls ./capitulos
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.35 }}
                viewport={{ once: true, margin: "-50px" }}
                className="card-premium p-6 group"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/25 flex items-center justify-center group-hover:scale-110 group-hover:border-primary/50 transition-all shrink-0">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold mt-0 mb-1 pb-0 border-0 tracking-tight">{cat.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{cat.description}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 pt-4 border-t border-border/40">
                  {cat.links.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 group/link no-underline py-0.5"
                    >
                      <ChevronRight className="w-3 h-3 text-primary/50 group-hover/link:text-primary group-hover/link:translate-x-0.5 transition-all" />
                      <span className="truncate">{link.name}</span>
                    </Link>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* TRY NOW */}
      <section className="mb-16">
        <div className="flex items-end justify-between mb-6 flex-wrap gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mt-0 mb-2 pb-0 border-0 tracking-tight">
              Experimente agora
            </h2>
            <p className="text-sm text-muted-foreground">
              Abra seu terminal, cole e veja o resultado.
            </p>
          </div>
        </div>
        <CodeBlock
          title="primeiros-comandos.ps1"
          code={`# Mostra informações detalhadas sobre a versão do PowerShell
$PSVersionTable

# Top 5 processos que mais consomem memória
Get-Process |
  Sort-Object WorkingSet64 -Descending |
  Select-Object -First 5 Name, Id, @{N='RAM (MB)'; E={[math]::Round($_.WorkingSet64/1MB, 2)}}

# E o melhor: tudo isso são objetos .NET, não texto
(Get-Process)[0] | Get-Member | Select-Object -First 10
`}
        />
      </section>
    </PageContainer>
  );
}
