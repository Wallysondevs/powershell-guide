import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  BookOpen, Terminal, HardDrive, Shield, Settings,
  FileText, Users, Network, Cpu, Clock, History,
  X, Package, Code, Layers, Filter, Database,
  FolderOpen, Key, Globe, Zap, Wrench, ChevronRight,
  Box, ToggleLeft, Lock, Cloud, Bug, TestTube,
  GitBranch, Monitor, Archive, Server, Mail,
  Activity, Workflow, Search, Star, List
} from "lucide-react";

const NAVIGATION = [
  {
    title: "Introdução",
    items: [
      { path: "/", label: "Início", icon: BookOpen },
      { path: "/historia", label: "O que é PowerShell", icon: History },
      { path: "/instalacao", label: "Instalação e Setup", icon: HardDrive },
    ]
  },
  {
    title: "Fundamentos",
    items: [
      { path: "/primeiros-passos", label: "Primeiros Passos", icon: Clock },
      { path: "/parametros", label: "Parâmetros e Flags", icon: ToggleLeft },
      { path: "/ajuda", label: "Sistema de Ajuda", icon: BookOpen },
      { path: "/variaveis", label: "Variáveis e Tipos", icon: Database },
      { path: "/operadores", label: "Operadores", icon: Code },
      { path: "/strings", label: "Strings e Texto", icon: FileText },
      { path: "/data-hora", label: "Data e Hora", icon: Clock },
    ]
  },
  {
    title: "Coleções de Dados",
    items: [
      { path: "/arrays", label: "Arrays e Listas", icon: Layers },
      { path: "/hashtables", label: "Hashtables", icon: Box },
      { path: "/objetos", label: "Objetos Personalizados", icon: Box },
    ]
  },
  {
    title: "Pipeline e Processamento",
    items: [
      { path: "/pipeline", label: "Pipeline (|)", icon: Filter },
      { path: "/filtros", label: "Filtros e Seleção", icon: Filter },
      { path: "/formatacao", label: "Formatação e Exportação", icon: FileText },
      { path: "/regex", label: "Expressões Regulares", icon: Search },
    ]
  },
  {
    title: "Sistema de Arquivos",
    items: [
      { path: "/navegacao", label: "Navegação", icon: FolderOpen },
      { path: "/arquivos", label: "Manipulação de Arquivos", icon: FileText },
      { path: "/conteudo-arquivos", label: "Conteúdo de Arquivos", icon: FileText },
      { path: "/permissoes", label: "Permissões e ACLs", icon: Shield },
      { path: "/compressao", label: "Compressão e ZIP", icon: Archive },
    ]
  },
  {
    title: "Administração do Sistema",
    items: [
      { path: "/processos", label: "Processos", icon: Cpu },
      { path: "/servicos", label: "Serviços", icon: Settings },
      { path: "/usuarios", label: "Usuários e Grupos", icon: Users },
      { path: "/agendamento", label: "Agendamento de Tarefas", icon: Clock },
      { path: "/evento-log", label: "Event Log", icon: Activity },
      { path: "/registro", label: "Registro do Windows", icon: Key },
      { path: "/wmi-cim", label: "WMI e CIM", icon: Cpu },
    ]
  },
  {
    title: "Rede e Internet",
    items: [
      { path: "/rede", label: "Rede e Conectividade", icon: Network },
      { path: "/network-avancado", label: "Rede Avançada", icon: Network },
      { path: "/web-api", label: "Web e APIs REST", icon: Globe },
      { path: "/email", label: "Envio de E-mails", icon: Mail },
    ]
  },
  {
    title: "Scripting Avançado",
    items: [
      { path: "/fluxo-controle", label: "Controle de Fluxo", icon: Code },
      { path: "/loops", label: "Loops Avançados", icon: List },
      { path: "/funcoes", label: "Funções e Parâmetros", icon: Zap },
      { path: "/scripts", label: "Scripts .ps1", icon: Terminal },
      { path: "/erros", label: "Tratamento de Erros", icon: Shield },
      { path: "/classes", label: "Classes e OOP", icon: Box },
      { path: "/performance", label: "Otimização de Performance", icon: Activity },
    ]
  },
  {
    title: "Formatos de Dados",
    items: [
      { path: "/json", label: "JSON", icon: Code },
      { path: "/xml", label: "XML", icon: Code },
      { path: "/csv", label: "CSV e Excel", icon: FileText },
    ]
  },
  {
    title: "Segurança",
    items: [
      { path: "/seguranca", label: "Segurança e Políticas", icon: Shield },
      { path: "/criptografia", label: "Criptografia", icon: Lock },
      { path: "/bitlocker", label: "BitLocker", icon: Lock },
    ]
  },
  {
    title: "Módulos e Pacotes",
    items: [
      { path: "/modulos", label: "Módulos e Perfil", icon: Package },
      { path: "/pacotes", label: "Gerenciadores de Pacotes", icon: Package },
      { path: "/ps-gallery", label: "PowerShell Gallery", icon: Star },
    ]
  },
  {
    title: "Execução Remota e Paralela",
    items: [
      { path: "/remoting", label: "PowerShell Remoting", icon: Server },
      { path: "/jobs", label: "Jobs e Paralelismo", icon: Workflow },
    ]
  },
  {
    title: "Ferramentas Corporativas",
    items: [
      { path: "/active-directory", label: "Active Directory", icon: Users },
      { path: "/gpo", label: "Group Policy (GPO)", icon: Settings },
      { path: "/hyper-v", label: "Hyper-V", icon: Monitor },
      { path: "/sql", label: "SQL Server", icon: Database },
      { path: "/azure", label: "Azure PowerShell", icon: Cloud },
      { path: "/dsc", label: "Desired State Config", icon: Workflow },
    ]
  },
  {
    title: "Qualidade e CI/CD",
    items: [
      { path: "/debug", label: "Depuração", icon: Bug },
      { path: "/pester", label: "Testes com Pester", icon: TestTube },
      { path: "/cicd", label: "CI/CD e Automação", icon: GitBranch },
    ]
  },
  {
    title: "PowerShell Moderno",
    items: [
      { path: "/ps7", label: "PowerShell 7 — Novidades", icon: Zap },
      { path: "/wpf", label: "GUIs com WPF/WinForms", icon: Monitor },
      { path: "/perfil", label: "Perfil e Customização", icon: Settings },
    ]
  },
  {
    title: "Referências",
    items: [
      { path: "/dicas", label: "Dicas e Truques", icon: Wrench },
      { path: "/ref-rapida", label: "Referência Rápida", icon: FileText },
      { path: "/referencias", label: "Links e Recursos", icon: BookOpen },
    ]
  }
];

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
}

export function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const [location] = useLocation();

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={cn(
        "fixed top-0 bottom-0 left-0 z-50 w-72 bg-card border-r border-border transition-transform duration-300 ease-in-out lg:translate-x-0 overflow-y-auto",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6">
          <div className="flex items-center justify-between lg:justify-center mb-8">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Terminal className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-bold mt-0 mb-0 pb-0 border-0 leading-tight">PowerShell</h2>
                <p className="text-xs text-muted-foreground">Guia Completo</p>
              </div>
            </Link>
            <button className="lg:hidden p-2 text-muted-foreground hover:text-foreground" onClick={() => setIsOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="space-y-8">
            {NAVIGATION.map((section, idx) => (
              <div key={idx}>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-3 mt-0 border-0 pb-0">
                  {section.title}
                </h4>
                <ul className="space-y-1">
                  {section.items.map((item, i) => {
                    const isActive = location === item.path;
                    const Icon = item.icon;
                    return (
                      <li key={i}>
                        <Link
                          href={item.path}
                          onClick={() => setIsOpen(false)}
                          className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200",
                            isActive
                              ? "bg-primary/10 text-primary font-medium"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          )}
                        >
                          <Icon className={cn("w-4 h-4", isActive ? "text-primary" : "opacity-70")} />
                          {item.label}
                          {isActive && <ChevronRight className="w-3 h-3 ml-auto text-primary" />}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
}
