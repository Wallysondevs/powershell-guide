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
import Arrays from "@/pages/Arrays";
import Hashtables from "@/pages/Hashtables";
import Pipeline from "@/pages/Pipeline";
import Filtros from "@/pages/Filtros";
import Formatacao from "@/pages/Formatacao";
import Navegacao from "@/pages/Navegacao";
import Arquivos from "@/pages/Arquivos";
import ConteudoArquivos from "@/pages/ConteudoArquivos";
import Permissoes from "@/pages/Permissoes";
import Processos from "@/pages/Processos";
import Servicos from "@/pages/Servicos";
import Usuarios from "@/pages/Usuarios";
import Agendamento from "@/pages/Agendamento";
import Rede from "@/pages/Rede";
import WebApi from "@/pages/WebApi";
import FluxoControle from "@/pages/FluxoControle";
import Funcoes from "@/pages/Funcoes";
import Erros from "@/pages/Erros";
import Modulos from "@/pages/Modulos";
import Scripts from "@/pages/Scripts";
import Registro from "@/pages/Registro";
import WmiCim from "@/pages/WmiCim";
import Pacotes from "@/pages/Pacotes";
import Dicas from "@/pages/Dicas";
import Referencias from "@/pages/Referencias";
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
        <Route path="/arrays" component={Arrays} />
        <Route path="/hashtables" component={Hashtables} />
        <Route path="/pipeline" component={Pipeline} />
        <Route path="/filtros" component={Filtros} />
        <Route path="/formatacao" component={Formatacao} />
        <Route path="/navegacao" component={Navegacao} />
        <Route path="/arquivos" component={Arquivos} />
        <Route path="/conteudo-arquivos" component={ConteudoArquivos} />
        <Route path="/permissoes" component={Permissoes} />
        <Route path="/processos" component={Processos} />
        <Route path="/servicos" component={Servicos} />
        <Route path="/usuarios" component={Usuarios} />
        <Route path="/agendamento" component={Agendamento} />
        <Route path="/rede" component={Rede} />
        <Route path="/web-api" component={WebApi} />
        <Route path="/fluxo-controle" component={FluxoControle} />
        <Route path="/funcoes" component={Funcoes} />
        <Route path="/erros" component={Erros} />
        <Route path="/modulos" component={Modulos} />
        <Route path="/scripts" component={Scripts} />
        <Route path="/registro" component={Registro} />
        <Route path="/wmi-cim" component={WmiCim} />
        <Route path="/pacotes" component={Pacotes} />
        <Route path="/dicas" component={Dicas} />
        <Route path="/referencias" component={Referencias} />
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
