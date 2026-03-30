import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Servicos() {
  return (
    <PageContainer
      title="Gerenciamento de Serviços"
      subtitle="Aprenda a controlar serviços do Windows de forma eficiente usando PowerShell."
      difficulty="intermediario"
      timeToRead="18 min"
    >
      <p>
        Serviços são programas que rodam em segundo plano, independentemente de um usuário estar logado. No PowerShell, o gerenciamento de serviços é feito através de cmdlets simples e consistentes que substituem ferramentas antigas como o <code>sc.exe</code> ou o console <code>services.msc</code>.
      </p>

      <h2>1. Consultando Serviços</h2>
      <p>
        O cmdlet principal é o <code>Get-Service</code> (alias <code>gsv</code>). Ele permite listar todos os serviços ou buscar por nomes específicos.
      </p>

      <CodeBlock
        title="Listando serviços"
        code={`# Listar todos os serviços instalados
Get-Service

# Buscar serviços que contenham "sql" no nome
Get-Service -Name *sql*

# Buscar por nome de exibição (DisplayName)
Get-Service -DisplayName "*Firewall*"

# Listar apenas serviços que estão em execução (Running)
Get-Service | Where-Object { $_.Status -eq "Running" }

# Listar serviços que estão parados (Stopped)
Get-Service | Where-Object Status -eq "Stopped"
`}
      />

      <h2>2. Iniciando e Parando Serviços</h2>
      <p>
        O controle do estado do serviço é feito com os verbos <code>Start</code>, <code>Stop</code> e <code>Restart</code>.
      </p>

      <CodeBlock
        title="Controlando o estado"
        code={`# Iniciar o serviço do Spooler de Impressão
Start-Service -Name Spooler

# Parar o serviço do Spooler
Stop-Service -Name Spooler

# Reiniciar um serviço (comum após mudar configurações)
Restart-Service -Name "wuauserv" # Windows Update

# Parar um serviço e todos os que dependem dele
Stop-Service -Name "NomeDoServicoPai" -Force
`}
      />

      <AlertBox type="warning" title="Privilégios Administrativos">
        Quase todas as operações que alteram o estado de um serviço (iniciar, parar, configurar) exigem que o PowerShell esteja rodando como Administrador.
      </AlertBox>

      <h2>3. Configurando Serviços</h2>
      <p>
        Para alterar como um serviço se comporta (ex: mudar o tipo de inicialização de Manual para Automático), usamos o <code>Set-Service</code>.
      </p>

      <CodeBlock
        title="Alterando configurações"
        code={`# Mudar o tipo de inicialização para Automático
Set-Service -Name "Spooler" -StartupType Automatic

# Desativar um serviço completamente
Set-Service -Name "XboxGipSvc" -StartupType Disabled

# Alterar a descrição de um serviço
Set-Service -Name "MeuServico" -Description "Este é o meu serviço personalizado de backup."
`}
      />

      <h2>4. Dependências de Serviços</h2>
      <p>
        Muitos serviços dependem de outros para funcionar. O PowerShell facilita visualizar essa árvore de dependências.
      </p>

      <CodeBlock
        title="Verificando dependências"
        code={`# Quais serviços este serviço depende?
(Get-Service -Name LanmanWorkstation).ServicesDependedOn

# Quais serviços dependem deste serviço?
(Get-Service -Name LanmanWorkstation).DependentServices
`}
      />

      <h2>5. Criando e Removendo Serviços</h2>
      <p>
        Você pode registrar seus próprios executáveis como serviços do Windows.
      </p>

      <CodeBlock
        title="Gerenciamento avançado"
        code={`# Criar um novo serviço
New-Service -Name "MeuAppService"  -BinaryPathName "C:\\Apps\\MeuApp.exe"  -DisplayName "Meu Aplicativo Personalizado"  -Description "Serviço que roda meu app de monitoramento"  -StartupType Manual

# Remover um serviço (PowerShell 6+ ou Windows PowerShell via sc.exe)
# No Windows PowerShell 5.1, use:
sc.exe delete "MeuAppService"

# No PowerShell 6+, use o cmdlet nativo:
Remove-Service -Name "MeuAppService"
`}
      />

      <h2>6. Estados de Transição e Logs</h2>
      <p>
        Às vezes, um serviço fica "preso" em um estado de transição (ex: <code>StartPending</code>).
      </p>

      <CodeBlock
        title="Investigando problemas"
        code={`# Ver o estado detalhado, incluindo se ele pode ser pausado/parado
Get-Service Spooler | Select-Object Name, Status, CanPauseAndContinue, CanStop

# Verificar logs de erro relacionados a serviços no Event Viewer
Get-WinEvent -LogName System | Where-Object { $_.ProviderName -eq "Service Control Manager" } | Select-Object -First 10
`}
      />

      <AlertBox type="info" title="Dica">
        Se um serviço não parar com <code>Stop-Service</code>, você pode precisar identificar o processo (PID) associado e finalizá-lo com <code>Stop-Process</code>. Use <code>Get-WmiObject Win32_Service | Select-Object Name, ProcessId</code> para encontrar o PID.
      </AlertBox>

    </PageContainer>
  );
}
