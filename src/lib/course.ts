/**
 * Curso de PowerShell — estrutura de módulos e progresso.
 * Paths devem bater com as rotas em App.tsx.
 */

export interface Lesson {
  id: string;
  path: string;
  title: string;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  icon: string;
  lessons: Lesson[];
}

export const COURSE_MODULES: Module[] = [
  {
    id: "introducao",
    title: "Introdução",
    description: "O que é PowerShell, história e instalação",
    icon: "BookOpen",
    lessons: [
      { id: "inicio", path: "/", title: "Início" },
      { id: "historia", path: "/historia", title: "O que é PowerShell" },
      { id: "instalacao", path: "/instalacao", title: "Instalação e Setup" },
    ],
  },
  {
    id: "fundamentos",
    title: "Fundamentos",
    description: "Variáveis, tipos, operadores e strings",
    icon: "Terminal",
    lessons: [
      { id: "primeiros-passos", path: "/primeiros-passos", title: "Primeiros Passos" },
      { id: "parametros", path: "/parametros", title: "Parâmetros e Flags" },
      { id: "ajuda", path: "/ajuda", title: "Sistema de Ajuda" },
      { id: "variaveis", path: "/variaveis", title: "Variáveis e Tipos" },
      { id: "operadores", path: "/operadores", title: "Operadores" },
      { id: "strings", path: "/strings", title: "Strings e Texto" },
      { id: "data-hora", path: "/data-hora", title: "Data e Hora" },
    ],
  },
  {
    id: "colecoes",
    title: "Coleções de Dados",
    description: "Arrays, hashtables e objetos",
    icon: "Layers",
    lessons: [
      { id: "arrays", path: "/arrays", title: "Arrays e Listas" },
      { id: "hashtables", path: "/hashtables", title: "Hashtables" },
      { id: "objetos", path: "/objetos", title: "Objetos Personalizados" },
    ],
  },
  {
    id: "pipeline",
    title: "Pipeline e Processamento",
    description: "Filtros, formatação e regex",
    icon: "Filter",
    lessons: [
      { id: "pipeline", path: "/pipeline", title: "Pipeline (|)" },
      { id: "filtros", path: "/filtros", title: "Filtros e Seleção" },
      { id: "formatacao", path: "/formatacao", title: "Formatação e Exportação" },
      { id: "regex", path: "/regex", title: "Expressões Regulares" },
      { id: "splatting", path: "/splatting", title: "Splatting (@hash)" },
    ],
  },
  {
    id: "terminal-ux",
    title: "Terminal e UX",
    description: "PSReadLine, cores e completers",
    icon: "Monitor",
    lessons: [
      { id: "psreadline", path: "/psreadline", title: "PSReadLine" },
      { id: "psstyle", path: "/psstyle", title: "$PSStyle e ANSI" },
      { id: "argument-completers", path: "/argument-completers", title: "Argument Completers" },
      { id: "update-help", path: "/update-help", title: "Update-Help / Save-Help" },
    ],
  },
  {
    id: "sistema-arquivos",
    title: "Sistema de Arquivos",
    description: "Navegação, arquivos e permissões",
    icon: "FolderOpen",
    lessons: [
      { id: "psdrives", path: "/psdrives", title: "PSProviders / PSDrives" },
      { id: "navegacao", path: "/navegacao", title: "Navegação" },
      { id: "arquivos", path: "/arquivos", title: "Manipulação de Arquivos" },
      { id: "conteudo-arquivos", path: "/conteudo-arquivos", title: "Conteúdo de Arquivos" },
      { id: "permissoes", path: "/permissoes", title: "Permissões e ACLs" },
      { id: "compressao", path: "/compressao", title: "Compressão e ZIP" },
    ],
  },
  {
    id: "administração",
    title: "Administração do Sistema",
    description: "Processos, serviços, registro e eventos",
    icon: "Settings",
    lessons: [
      { id: "processos", path: "/processos", title: "Processos" },
      { id: "servicos", path: "/servicos", title: "Serviços" },
      { id: "usuarios", path: "/usuarios", title: "Usuários Locais" },
      { id: "registro", path: "/registro", title: "Registro do Windows" },
      { id: "evento-log", path: "/evento-log", title: "Event Logs" },
      { id: "wmi-cim", path: "/wmi-cim", title: "WMI / CIM" },
      { id: "performance", path: "/performance", title: "Desempenho" },
      { id: "agendamento", path: "/agendamento", title: "Agendamento de Tarefas" },
    ],
  },
  {
    id: "rede",
    title: "Rede e Internet",
    description: "HTTP, web requests e netsh",
    icon: "Network",
    lessons: [
      { id: "rede", path: "/rede", title: "Rede e Netsh" },
      { id: "network-avancado", path: "/network-avancado", title: "Rede Avançada" },
      { id: "web-api", path: "/web-api", title: "Web Requests e REST APIs" },
      { id: "email", path: "/email", title: "Email" },
    ],
  },
  {
    id: "fluxo",
    title: "Fluxo de Controle",
    description: "Condicionais, loops e tratamento de erros",
    icon: "GitBranch",
    lessons: [
      { id: "fluxo-controle", path: "/fluxo-controle", title: "Condicionais (if, switch)" },
      { id: "loops", path: "/loops", title: "Loops (for, foreach, while)" },
      { id: "erros", path: "/erros", title: "Tratamento de Erros" },
      { id: "debug", path: "/debug", title: "Debug e Breakpoints" },
    ],
  },
  {
    id: "scripting",
    title: "Scripting e Funções",
    description: "Funções, scripts e módulos",
    icon: "Code",
    lessons: [
      { id: "funcoes", path: "/funcoes", title: "Funções Avançadas" },
      { id: "scripts", path: "/scripts", title: "Scripts .ps1" },
      { id: "modulos", path: "/modulos", title: "Módulos PowerShell" },
      { id: "classes", path: "/classes", title: "Classes PowerShell" },
      { id: "perfil", path: "/perfil", title: "Perfil do PowerShell" },
    ],
  },
  {
    id: "dados",
    title: "Formatos de Dados",
    description: "CSV, JSON e XML",
    icon: "FileText",
    lessons: [
      { id: "csv", path: "/csv", title: "CSV" },
      { id: "json", path: "/json", title: "JSON" },
      { id: "xml", path: "/xml", title: "XML" },
    ],
  },
  {
    id: "seguranca",
    title: "Segurança",
    description: "Execution policy, credenciais e criptografia",
    icon: "Shield",
    lessons: [
      { id: "seguranca", path: "/seguranca", title: "Segurança e Execution Policy" },
      { id: "criptografia", path: "/criptografia", title: "Criptografia" },
      { id: "bitlocker", path: "/bitlocker", title: "BitLocker" },
    ],
  },
  {
    id: "remoting",
    title: "Remoting e Jobs",
    description: "Invoke-Command, sessões e paralelismo",
    icon: "Globe",
    lessons: [
      { id: "remoting", path: "/remoting", title: "PowerShell Remoting" },
      { id: "jobs", path: "/jobs", title: "Jobs em Background" },
      { id: "threadjob", path: "/threadjob", title: "ThreadJob" },
    ],
  },
  {
    id: "modulos-pacotes",
    title: "Módulos e Pacotes",
    description: "PSGallery e gerenciamento de pacotes",
    icon: "Package",
    lessons: [
      { id: "ps-gallery", path: "/ps-gallery", title: "PowerShell Gallery" },
      { id: "pacotes", path: "/pacotes", title: "Pacotes e PackageManagement" },
    ],
  },
  {
    id: "infra",
    title: "Infraestrutura",
    description: "AD, GPO, Hyper-V e SQL",
    icon: "Server",
    lessons: [
      { id: "active-directory", path: "/active-directory", title: "Active Directory" },
      { id: "gpo", path: "/gpo", title: "GPO" },
      { id: "hyper-v", path: "/hyper-v", title: "Hyper-V" },
      { id: "sql", path: "/sql", title: "SQL Server" },
      { id: "azure", path: "/azure", title: "Azure PowerShell" },
      { id: "dsc", path: "/dsc", title: "DSC" },
    ],
  },
  {
    id: "qualidade",
    title: "Qualidade e Automação",
    description: "Testes, CI/CD e PS7",
    icon: "Workflow",
    lessons: [
      { id: "pester", path: "/pester", title: "Pester (Testes)" },
      { id: "cicd", path: "/cicd", title: "CI/CD com PowerShell" },
      { id: "ps7", path: "/ps7", title: "PowerShell 7+" },
      { id: "wpf", path: "/wpf", title: "WPF e GUIs" },
    ],
  },
  {
    id: "extras",
    title: "Extras",
    description: "Dicas e referências",
    icon: "Star",
    lessons: [
      { id: "dicas", path: "/dicas", title: "Dicas e Truques" },
      { id: "ref-rapida", path: "/ref-rapida", title: "Referência Rápida" },
      { id: "referencias", path: "/referencias", title: "Referências" },
    ],
  },
];

const STORAGE_KEY = "powershell-guide-progress";

export function getProgress(): Set<string> {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? new Set(JSON.parse(saved)) : new Set();
  } catch {
    return new Set();
  }
}

export function saveProgress(completed: Set<string>): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...completed]));
}

export function markLessonComplete(lessonId: string): void {
  const completed = getProgress();
  completed.add(lessonId);
  saveProgress(completed);
}

export function isLessonCompleted(lessonId: string): boolean {
  return getProgress().has(lessonId);
}

export function getCourseProgress(): {
  completed: number;
  total: number;
  percentage: number;
} {
  const completed = getProgress();
  const allLessons = COURSE_MODULES.flatMap((m) => m.lessons);
  const total = allLessons.length;
  const done = allLessons.filter((l) => completed.has(l.id)).length;
  return {
    completed: done,
    total,
    percentage: total > 0 ? Math.round((done / total) * 100) : 0,
  };
}

export function getNextLesson(currentPath: string): Lesson | null {
  const allLessons = COURSE_MODULES.flatMap((m) => m.lessons);
  const idx = allLessons.findIndex((l) => l.path === currentPath);
  return idx >= 0 && idx < allLessons.length - 1 ? allLessons[idx + 1] : null;
}

export function getPrevLesson(currentPath: string): Lesson | null {
  const allLessons = COURSE_MODULES.flatMap((m) => m.lessons);
  const idx = allLessons.findIndex((l) => l.path === currentPath);
  return idx > 0 ? allLessons[idx - 1] : null;
}

export function getLessonByPath(path: string): Lesson | undefined {
  return COURSE_MODULES.flatMap((m) => m.lessons).find((l) => l.path === path);
}
