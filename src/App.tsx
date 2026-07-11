import { useState, useEffect, lazy, Suspense } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { LessonNav } from "@/components/ui/LessonNav";

import Home from "@/pages/Home";
import NotFound from "@/pages/not-found";

const Historia = lazy(() => import("@/pages/Historia"));
const Instalacao = lazy(() => import("@/pages/Instalacao"));
const PrimeirosPassos = lazy(() => import("@/pages/PrimeirosPassos"));
const Parametros = lazy(() => import("@/pages/Parametros"));
const Ajuda = lazy(() => import("@/pages/Ajuda"));
const Variaveis = lazy(() => import("@/pages/Variaveis"));
const Operadores = lazy(() => import("@/pages/Operadores"));
const Strings = lazy(() => import("@/pages/Strings"));
const DataHora = lazy(() => import("@/pages/DataHora"));
const Arrays = lazy(() => import("@/pages/Arrays"));
const Hashtables = lazy(() => import("@/pages/Hashtables"));
const Objetos = lazy(() => import("@/pages/Objetos"));
const Pipeline = lazy(() => import("@/pages/Pipeline"));
const Filtros = lazy(() => import("@/pages/Filtros"));
const Formatacao = lazy(() => import("@/pages/Formatacao"));
const Regex = lazy(() => import("@/pages/Regex"));
const Navegacao = lazy(() => import("@/pages/Navegacao"));
const Arquivos = lazy(() => import("@/pages/Arquivos"));
const ConteudoArquivos = lazy(() => import("@/pages/ConteudoArquivos"));
const Permissoes = lazy(() => import("@/pages/Permissoes"));
const Compressao = lazy(() => import("@/pages/Compressao"));
const Processos = lazy(() => import("@/pages/Processos"));
const Servicos = lazy(() => import("@/pages/Servicos"));
const Usuarios = lazy(() => import("@/pages/Usuarios"));
const Agendamento = lazy(() => import("@/pages/Agendamento"));
const EventoLog = lazy(() => import("@/pages/EventoLog"));
const Registro = lazy(() => import("@/pages/Registro"));
const WmiCim = lazy(() => import("@/pages/WmiCim"));
const FluxoControle = lazy(() => import("@/pages/FluxoControle"));
const Loops = lazy(() => import("@/pages/Loops"));
const Funcoes = lazy(() => import("@/pages/Funcoes"));
const Scripts = lazy(() => import("@/pages/Scripts"));
const Erros = lazy(() => import("@/pages/Erros"));
const Classes = lazy(() => import("@/pages/Classes"));
const Performance = lazy(() => import("@/pages/Performance"));
const JSON_ = lazy(() => import("@/pages/JSON"));
const XML = lazy(() => import("@/pages/XML"));
const CSV = lazy(() => import("@/pages/CSV"));
const WebApi = lazy(() => import("@/pages/WebApi"));
const Rede = lazy(() => import("@/pages/Rede"));
const NetworkAdv = lazy(() => import("@/pages/NetworkAdv"));
const Email = lazy(() => import("@/pages/Email"));
const Seguranca = lazy(() => import("@/pages/Seguranca"));
const Criptografia = lazy(() => import("@/pages/Criptografia"));
const BitLocker = lazy(() => import("@/pages/BitLocker"));
const Modulos = lazy(() => import("@/pages/Modulos"));
const Pacotes = lazy(() => import("@/pages/Pacotes"));
const PSGallery = lazy(() => import("@/pages/PSGallery"));
const Remoting = lazy(() => import("@/pages/Remoting"));
const Jobs = lazy(() => import("@/pages/Jobs"));
const ActiveDirectory = lazy(() => import("@/pages/ActiveDirectory"));
const GPO = lazy(() => import("@/pages/GPO"));
const HyperV = lazy(() => import("@/pages/HyperV"));
const SQL = lazy(() => import("@/pages/SQL"));
const Azure = lazy(() => import("@/pages/Azure"));
const DSC = lazy(() => import("@/pages/DSC"));
const Debug = lazy(() => import("@/pages/Debug"));
const Pester = lazy(() => import("@/pages/Pester"));
const CICD = lazy(() => import("@/pages/CICD"));
const PS7 = lazy(() => import("@/pages/PS7"));
const WPF = lazy(() => import("@/pages/WPF"));
const Perfil = lazy(() => import("@/pages/Perfil"));
const Dicas = lazy(() => import("@/pages/Dicas"));
const Referencias = lazy(() => import("@/pages/Referencias"));
const RefRapida = lazy(() => import("@/pages/RefRapida"));
const PSReadLine = lazy(() => import("@/pages/PSReadLine"));
const Splatting = lazy(() => import("@/pages/Splatting"));
const ArgumentCompleters = lazy(() => import("@/pages/ArgumentCompleters"));
const PSStyle = lazy(() => import("@/pages/PSStyle"));
const ThreadJob = lazy(() => import("@/pages/ThreadJob"));
const PSDrives = lazy(() => import("@/pages/PSDrives"));
const UpdateHelp = lazy(() => import("@/pages/UpdateHelp"));

const queryClient = new QueryClient();

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-muted-foreground font-mono text-sm flex items-center gap-2">
        <span className="inline-block w-2 h-2 bg-primary rounded-full animate-pulse" />
        carregando capítulo…
      </div>
    </div>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [location] = useHashLocation();
  useEffect(() => {
    setIsSidebarOpen(false);
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className="min-h-screen bg-[#001D4A] text-white flex">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0 transition-all duration-300">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-1 pb-16">
          {children}
        </main>
      </div>
      <LessonNav />
    </div>
  );
}

function Router() {
  return (
    <Layout>
      <Suspense fallback={<PageLoader />}>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/historia" component={Historia} />
          <Route path="/instalacao" component={Instalacao} />
          <Route path="/primeiros-passos" component={PrimeirosPassos} />
          <Route path="/parametros" component={Parametros} />
          <Route path="/ajuda" component={Ajuda} />
          <Route path="/variaveis" component={Variaveis} />
          <Route path="/operadores" component={Operadores} />
          <Route path="/strings" component={Strings} />
          <Route path="/data-hora" component={DataHora} />
          <Route path="/arrays" component={Arrays} />
          <Route path="/hashtables" component={Hashtables} />
          <Route path="/objetos" component={Objetos} />
          <Route path="/pipeline" component={Pipeline} />
          <Route path="/filtros" component={Filtros} />
          <Route path="/formatacao" component={Formatacao} />
          <Route path="/regex" component={Regex} />
          <Route path="/navegacao" component={Navegacao} />
          <Route path="/arquivos" component={Arquivos} />
          <Route path="/conteudo-arquivos" component={ConteudoArquivos} />
          <Route path="/permissoes" component={Permissoes} />
          <Route path="/compressao" component={Compressao} />
          <Route path="/processos" component={Processos} />
          <Route path="/servicos" component={Servicos} />
          <Route path="/usuarios" component={Usuarios} />
          <Route path="/agendamento" component={Agendamento} />
          <Route path="/evento-log" component={EventoLog} />
          <Route path="/registro" component={Registro} />
          <Route path="/wmi-cim" component={WmiCim} />
          <Route path="/fluxo-controle" component={FluxoControle} />
          <Route path="/loops" component={Loops} />
          <Route path="/funcoes" component={Funcoes} />
          <Route path="/scripts" component={Scripts} />
          <Route path="/erros" component={Erros} />
          <Route path="/classes" component={Classes} />
          <Route path="/performance" component={Performance} />
          <Route path="/json" component={JSON_} />
          <Route path="/xml" component={XML} />
          <Route path="/csv" component={CSV} />
          <Route path="/web-api" component={WebApi} />
          <Route path="/rede" component={Rede} />
          <Route path="/network-avancado" component={NetworkAdv} />
          <Route path="/email" component={Email} />
          <Route path="/seguranca" component={Seguranca} />
          <Route path="/criptografia" component={Criptografia} />
          <Route path="/bitlocker" component={BitLocker} />
          <Route path="/modulos" component={Modulos} />
          <Route path="/pacotes" component={Pacotes} />
          <Route path="/ps-gallery" component={PSGallery} />
          <Route path="/remoting" component={Remoting} />
          <Route path="/jobs" component={Jobs} />
          <Route path="/active-directory" component={ActiveDirectory} />
          <Route path="/gpo" component={GPO} />
          <Route path="/hyper-v" component={HyperV} />
          <Route path="/sql" component={SQL} />
          <Route path="/azure" component={Azure} />
          <Route path="/dsc" component={DSC} />
          <Route path="/debug" component={Debug} />
          <Route path="/pester" component={Pester} />
          <Route path="/cicd" component={CICD} />
          <Route path="/ps7" component={PS7} />
          <Route path="/wpf" component={WPF} />
          <Route path="/perfil" component={Perfil} />
          <Route path="/dicas" component={Dicas} />
          <Route path="/referencias" component={Referencias} />
          <Route path="/ref-rapida" component={RefRapida} />
          <Route path="/psreadline" component={PSReadLine} />
          <Route path="/splatting" component={Splatting} />
          <Route path="/argument-completers" component={ArgumentCompleters} />
          <Route path="/psstyle" component={PSStyle} />
          <Route path="/threadjob" component={ThreadJob} />
          <Route path="/psdrives" component={PSDrives} />
          <Route path="/update-help" component={UpdateHelp} />
          <Route component={NotFound} />
        </Switch>
      </Suspense>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WouterRouter hook={useHashLocation}>
        <Router />
      </WouterRouter>
    </QueryClientProvider>
  );
}

export default App;
