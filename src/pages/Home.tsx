import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";
import { motion } from "framer-motion";
import { 
  Terminal, 
  BookOpen, 
  Settings, 
  Code2, 
  HelpCircle, 
  ChevronRight,
  Cpu,
  Globe,
  Shield,
  Layers
} from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const categories = [
    {
      title: "Fundamentos",
      icon: <Terminal className="w-6 h-6" />,
      description: "História, instalação e primeiros passos no terminal.",
      links: [
        { name: "História e Conceitos", href: "/historia" },
        { name: "Instalação", href: "/instalacao" },
        { name: "Primeiros Passos", href: "/primeiros-passos" },
        { name: "Sistema de Ajuda", href: "/ajuda" },
      ]
    },
    {
      title: "Linguagem",
      icon: <Code2 className="w-6 h-6" />,
      description: "Variáveis, operadores, tipos de dados e lógica.",
      links: [
        { name: "Variáveis e Escopo", href: "/variaveis" },
        { name: "Operadores", href: "/operadores" },
        { name: "Manipulação de Strings", href: "/strings" },
        { name: "Arrays e Coleções", href: "/arrays" },
        { name: "Hashtables", href: "/hashtables" },
      ]
    },
    {
      title: "Pipeline e Objetos",
      icon: <Layers className="w-6 h-6" />,
      description: "O poder do pipeline e processamento de objetos.",
      links: [
        { name: "Entendendo o Pipeline", href: "/pipeline" },
        { name: "Filtros e Seleção", href: "/filtros" },
        { name: "Formatação e Saída", href: "/formatacao" },
      ]
    },
    {
      title: "Sistema de Arquivos",
      icon: <BookOpen className="w-6 h-6" />,
      description: "Navegação, gerenciamento de arquivos e permissões.",
      links: [
        { name: "Navegação", href: "/navegacao" },
        { name: "Manipulação de Arquivos", href: "/arquivos" },
        { name: "Conteúdo de Arquivos", href: "/conteudo-arquivos" },
        { name: "Permissões ACL", href: "/permissoes" },
      ]
    },
    {
      title: "Administração",
      icon: <Settings className="w-6 h-6" />,
      description: "Processos, serviços, usuários e agendamentos.",
      links: [
        { name: "Processos", href: "/processos" },
        { name: "Serviços", href: "/servicos" },
        { name: "Usuários e Grupos", href: "/usuarios" },
        { name: "Tarefas Agendadas", href: "/agendamento" },
      ]
    },
    {
      title: "Rede e Web",
      icon: <Globe className="w-6 h-6" />,
      description: "Diagnóstico de rede e consumo de APIs REST.",
      links: [
        { name: "Comandos de Rede", href: "/rede" },
        { name: "Trabalhando com Web APIs", href: "/web-api" },
      ]
    },
    {
      title: "Automação Profissional",
      icon: <Shield className="w-6 h-6" />,
      description: "Tratamento de erros, módulos e segurança.",
      links: [
        { name: "Tratamento de Erros", href: "/erros" },
        { name: "Módulos", href: "/modulos" },
        { name: "Scripts e Segurança", href: "/scripts" },
      ]
    },
    {
      title: "Recursos Avançados",
      icon: <Cpu className="w-6 h-6" />,
      description: "Registro, WMI/CIM e gerenciamento de pacotes.",
      links: [
        { name: "Registro do Windows", href: "/registro" },
        { name: "WMI e CIM", href: "/wmi-cim" },
        { name: "Gerenciamento de Pacotes", href: "/pacotes" },
      ]
    }
  ];

  return (
    <PageContainer
      title="Guia Definitivo do PowerShell"
      subtitle="Domine a automação de sistemas com o shell mais poderoso do mercado. Do básico ao avançado."
    >
      <section className="mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-primary/5 border border-primary/10 rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Terminal className="text-primary" /> Por que PowerShell?
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Diferente de shells tradicionais baseados em texto (como Bash ou CMD), o PowerShell é baseado em <strong>objetos</strong>. 
              Isso significa que, ao invés de manipular strings complexas, você lida com estruturas de dados ricas, 
              tornando a automação muito mais robusta e menos propensa a erros.
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <ChevronRight className="w-4 h-4 text-primary" /> Integração profunda com .NET
              </li>
              <li className="flex items-center gap-2">
                <ChevronRight className="w-4 h-4 text-primary" /> Multiplataforma (Windows, Linux, macOS)
              </li>
              <li className="flex items-center gap-2">
                <ChevronRight className="w-4 h-4 text-primary" /> Consistência incrível de comandos (Verbo-Substantivo)
              </li>
            </ul>
          </div>
          <div className="bg-accent/5 border border-accent/10 rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <HelpCircle className="text-accent" /> Como usar este guia?
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Este material foi estruturado para ser tanto um curso sequencial quanto uma referência rápida. 
              Cada página contém exemplos práticos que você pode copiar e colar diretamente no seu terminal.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full text-xs font-medium">Iniciante</span>
              <span className="px-3 py-1 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded-full text-xs font-medium">Intermediário</span>
              <span className="px-3 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded-full text-xs font-medium">Avançado</span>
            </div>
          </div>
        </div>

        <AlertBox type="info" title="Dica de Ouro">
          O PowerShell não é apenas um shell, é um motor de automação. Se você faz algo mais de duas vezes manualmente, existe um cmdlet para automatizar isso.
        </AlertBox>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8">Navegue pelas Categorias</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {categories.map((cat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              viewport={{ once: true }}
              className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 shadow-sm"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  {cat.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">{cat.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{cat.description}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                    {cat.links.map((link, li) => (
                      <Link 
                        key={li} 
                        to={link.href}
                        className="text-sm text-primary hover:underline flex items-center gap-1"
                      >
                        <ChevronRight className="w-3 h-3" /> {link.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mb-16 bg-[#1e1e1e] rounded-3xl p-8 border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Terminal size={120} />
        </div>
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-4">Experimente Agora</h2>
          <p className="text-gray-400 mb-6 max-w-2xl">
            Abra seu terminal e digite este comando para ver a versão instalada e começar sua jornada.
          </p>
          <CodeBlock
            title="Verificando a versão do PowerShell"
            code={`# Mostra informações detalhadas sobre a versão do PowerShell
$PSVersionTable

# Tente também listar os processos que mais consomem memória
Get-Process | Sort-Object WorkingSet64 -Descending | Select-Object -First 5
`}
          />
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-6">Próximos Passos</h2>
        <p className="text-muted-foreground leading-relaxed mb-6">
          Se você é novo no PowerShell, recomendamos começar pela seção de <strong>História</strong> para entender a diferença entre o Windows PowerShell (5.1) e o PowerShell moderno (7+), e depois seguir para a <strong>Instalação</strong>.
        </p>
        <div className="flex gap-4">
          <Link to="/historia">
            <button className="px-6 py-3 bg-primary text-primary-foreground rounded-full font-bold hover:opacity-90 transition-opacity">
              Começar a Ler
            </button>
          </Link>
          <Link to="/dicas">
            <button className="px-6 py-3 bg-secondary text-secondary-foreground rounded-full font-bold hover:opacity-90 transition-opacity">
              Dicas Rápidas
            </button>
          </Link>
        </div>
      </section>
    </PageContainer>
  );
}
