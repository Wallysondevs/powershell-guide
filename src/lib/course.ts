/**
 * Curso de PowerShell — estrutura de módulos e progresso.
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
      { id: "registro", path: "/registro", title: "Registro do Windows" },
      { id: "eventos", path: "/eventos", title: "Event Logs" },
      { id: "desempenho", path: "/desempenho", title: "Desempenho" },
    ],
  },
  {
    id: "rede",
    title: "Rede e Internet",
    description: "HTTP, web requests e netsh",
    icon: "Network",
    lessons: [
      { id: "rede", path: "/rede", title: "Rede e Netsh" },
      { id: "web", path: "/web", title: "Web Requests (Invoke-WebRequest)" },
      { id: "rest", path: "/rest", title: "REST APIs (Invoke-RestMethod)" },
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
      { id: "escopo", path: "/escopo", title: "Escopo de Variáveis" },
    ],
  },
  {
    id: "fluxo",
    title: "Fluxo de Controle",
    description: "Condicionais, loops e tratamento de erros",
    icon: "GitBranch",
    lessons: [
      { id: "condicionais", path: "/condicionais", title: "Condicionais (if, switch)" },
      { id: "loops", path: "/loops", title: "Loops (for, foreach, while)" },
      { id: "erros", path: "/erros", title: "Tratamento de Erros" },
      { id: "debug", path: "/debug", title: "Debug e Breakpoints" },
    ],
  },
  {
    id: "seguranca",
    title: "Segurança",
    description: "Execution policy, assinatura e credenciais",
    icon: "Shield",
    lessons: [
      { id: "execucao", path: "/execucao", title: "Execution Policy" },
      { id: "assinatura", path: "/assinatura", title: "Assinatura de Scripts" },
      { id: "credenciais", path: "/credenciais", title: "Credenciais Seguras" },
      { id: "criptografia", path: "/criptografia", title: "Criptografia" },
    ],
  },
  {
    id: "remoting",
    title: "PowerShell Remoting",
    description: "Invoke-Command, sessões e JEA",
    icon: "Globe",
    lessons: [
      { id: "remoting", path: "/remoting", title: "Remoting Básico" },
      { id: "sessoes", path: "/sessoes", title: "Sessões Remotas" },
      { id: "jea", path: "/jea", title: "JEA (Just Enough Admin)" },
    ],
  },
  {
    id: "active-directory",
    title: "Active Directory",
    description: "Usuários, grupos e OU",
    icon: "Users",
    lessons: [
      { id: "active-directory", path: "/active-directory", title: "Módulo AD" },
      { id: "usuarios-ad", path: "/usuarios-ad", title: "Usuários e Grupos" },
    ],
  },
  {
    id: "azure",
    title: "Azure e Cloud",
    description: "Az module e Azure AD",
    icon: "Cloud",
    lessons: [
      { id: "azure", path: "/azure", title: "Azure PowerShell" },
    ],
  },
  {
    id: "exchange-sql",
    title: "Exchange & SQL Server",
    description: "Administração via PowerShell",
    icon: "Database",
    lessons: [
      { id: "exchange", path: "/exchange", title: "Exchange Online" },
      { id: "sql", path: "/sql", title: "SQL Server" },
    ],
  },
  {
    id: "csv-json-xml",
    title: "Formatos de Dados",
    description: "CSV, JSON, XML e YAML",
    icon: "FileText",
    lessons: [
      { id: "csv", path: "/csv", title: "CSV" },
      { id: "json", path: "/json", title: "JSON" },
      { id: "xml", path: "/xml", title: "XML" },
      { id: "yaml", path: "/yaml", title: "YAML" },
    ],
  },
  {
    id: "agendamento",
    title: "Agendamento",
    description: "Scheduled Tasks e cron",
    icon: "Clock",
    lessons: [
      { id: "agendamento", path: "/agendamento", title: "Scheduled Tasks" },
    ],
  },
  {
    id: "dsc",
    title: "DSC e Configuração",
    description: "Desired State Configuration",
    icon: "Wrench",
    lessons: [
      { id: "dsc", path: "/dsc", title: "DSC Básico" },
    ],
  },
  {
    id: "classes",
    title: "Classes e OO",
    description: "POO no PowerShell",
    icon: "Box",
    lessons: [
      { id: "classes", path: "/classes", title: "Classes PowerShell" },
    ],
  },
  {
    id: "email",
    title: "Email e Comunicação",
    description: "Send-MailMessage",
    icon: "Mail",
    lessons: [
      { id: "email", path: "/email", title: "Email" },
    ],
  },
  {
    id: "cicd",
    title: "CI/CD e Automação",
    description: "Pipelines e workflows",
    icon: "Workflow",
    lessons: [
      { id: "cicd", path: "/cicd", title: "CI/CD com PowerShell" },
    ],
  },
  {
    id: "extras",
    title: "Extras",
    description: "Dicas e referências",
    icon: "Star",
    lessons: [
      { id: "bitlocker", path: "/bitlocker", title: "BitLocker" },
      { id: "dicas", path: "/dicas", title: "Dicas e Truques" },
      { id: "referencias", path: "/referencias", title: "Referências" },
    ],
  },
];

const STORAGE_KEY = "powershell…esso";

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
