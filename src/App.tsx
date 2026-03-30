import { useState, useEffect } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

import Home from "@/pages/Home";
import Historia from "@/pages/Historia";
import Instalacao from "@/pages/Instalacao";
import PrimeirosPassos from "@/pages/PrimeirosPassos";
import Parametros from "@/pages/Parametros";
import Ajuda from "@/pages/Ajuda";
import Variaveis from "@/pages/Variaveis";
import Operadores from "@/pages/Operadores";
import Strings from "@/pages/Strings";
import DataHora from "@/pages/DataHora";
import Arrays from "@/pages/Arrays";
import Hashtables from "@/pages/Hashtables";
import Objetos from "@/pages/Objetos";
import Pipeline from "@/pages/Pipeline";
import Filtros from "@/pages/Filtros";
import Formatacao from "@/pages/Formatacao";
import Regex from "@/pages/Regex";
import Navegacao from "@/pages/Navegacao";
import Arquivos from "@/pages/Arquivos";
import ConteudoArquivos from "@/pages/ConteudoArquivos";
import Permissoes from "@/pages/Permissoes";
import Compressao from "@/pages/Compressao";
import Processos from "@/pages/Processos";
import Servicos from "@/pages/Servicos";
import Usuarios from "@/pages/Usuarios";
import Agendamento from "@/pages/Agendamento";
import EventoLog from "@/pages/EventoLog";
import Registro from "@/pages/Registro";
import WmiCim from "@/pages/WmiCim";
import FluxoControle from "@/pages/FluxoControle";
import Loops from "@/pages/Loops";
import Funcoes from "@/pages/Funcoes";
import Scripts from "@/pages/Scripts";
import Erros from "@/pages/Erros";
import Classes from "@/pages/Classes";
import Performance from "@/pages/Performance";
import JSON_ from "@/pages/JSON";
import XML from "@/pages/XML";
import CSV from "@/pages/CSV";
import WebApi from "@/pages/WebApi";
import Rede from "@/pages/Rede";
import NetworkAdv from "@/pages/NetworkAdv";
import Email from "@/pages/Email";
import Seguranca from "@/pages/Seguranca";
import Criptografia from "@/pages/Criptografia";
import BitLocker from "@/pages/BitLocker";
import Modulos from "@/pages/Modulos";
import Pacotes from "@/pages/Pacotes";
import PSGallery from "@/pages/PSGallery";
import Remoting from "@/pages/Remoting";
import Jobs from "@/pages/Jobs";
import ActiveDirectory from "@/pages/ActiveDirectory";
import GPO from "@/pages/GPO";
import HyperV from "@/pages/HyperV";
import SQL from "@/pages/SQL";
import Azure from "@/pages/Azure";
import DSC from "@/pages/DSC";
import Debug from "@/pages/Debug";
import Pester from "@/pages/Pester";
import CICD from "@/pages/CICD";
import PS7 from "@/pages/PS7";
import WPF from "@/pages/WPF";
import Perfil from "@/pages/Perfil";
import Dicas from "@/pages/Dicas";
import Referencias from "@/pages/Referencias";
import RefRapida from "@/pages/RefRapida";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function Layout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [location] = useHashLocation();
  useEffect(() => {
    setIsSidebarOpen(false);
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0 transition-all duration-300">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}

function Router() {
  return (
    <Layout>
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
        <Route component={NotFound} />
      </Switch>
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
