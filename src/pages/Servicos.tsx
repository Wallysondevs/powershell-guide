import { PageContainer } from "@/components/layout/PageContainer";
  import { CodeBlock } from "@/components/ui/CodeBlock";
  import { AlertBox } from "@/components/ui/AlertBox";

  export default function Servicos() {
    return (
      <PageContainer
        title="Gerenciamento de Serviços"
        subtitle="Controle, monitore, configure e automatize serviços do Windows com PowerShell."
        difficulty="intermediario"
        timeToRead="28 min"
      >
        <p>
          Serviços são programas que rodam em segundo plano, independentemente de um usuário estar logado.
          O PowerShell oferece cmdlets completos para gerenciar o ciclo de vida de serviços — desde
          consulta e controle básico até monitoramento avançado e criação de serviços personalizados.
        </p>

        <h2>Consultando Serviços</h2>
        <CodeBlock title="Listando e inspecionando serviços" code={`# Listar todos os serviços
  Get-Service | Format-Table Name, DisplayName, Status, StartType -AutoSize

  # Filtrar por nome ou padrão
  Get-Service -Name *sql*
  Get-Service -DisplayName "*Windows Update*"

  # Apenas serviços em execução
  Get-Service | Where-Object Status -eq "Running" | Sort-Object DisplayName

  # Serviços parados que deveriam estar rodando (StartType = Automatic)
  Get-Service |
      Where-Object { $_.StartType -eq "Automatic" -and $_.Status -ne "Running" } |
      Select-Object Name, DisplayName, Status

  # Informações detalhadas via CIM (mais completo que Get-Service)
  Get-CimInstance Win32_Service |
      Where-Object State -eq "Running" |
      Select-Object Name, DisplayName, StartMode, PathName, StartName |
      Format-Table -AutoSize

  # Obter PID de um serviço (para cruzar com Get-Process)
  $svc = Get-WmiObject Win32_Service -Filter "Name='Spooler'"
  Get-Process -Id $svc.ProcessId
  `} />

        <h2>Controlando o Estado</h2>
        <CodeBlock title="Iniciar, parar, reiniciar e pausar" code={`# Iniciar, parar e reiniciar
  Start-Service   -Name "Spooler"
  Stop-Service    -Name "Spooler" -Force         # -Force para parar com dependentes
  Restart-Service -Name "wuauserv"               # Windows Update

  # Pausar e retomar (apenas serviços que suportam pausa)
  Suspend-Service -Name "Spooler"
  Resume-Service  -Name "Spooler"

  # Aguardar um serviço iniciar com timeout
  $timeout = 60  # segundos
  $inicio  = Get-Date
  Start-Service "W3SVC"
  do {
      Start-Sleep -Seconds 2
      $status = (Get-Service "W3SVC").Status
      if ((New-TimeSpan -Start $inicio).TotalSeconds -gt $timeout) {
          throw "Timeout: W3SVC não iniciou em $timeout segundos"
      }
  } while ($status -ne "Running")
  Write-Host "W3SVC está rodando" -ForegroundColor Green

  # Parar e reiniciar múltiplos serviços
  $servicos = "MSSQLSERVER","SQLSERVERAGENT","SQLBrowser"
  $servicos | ForEach-Object { Stop-Service $_ -Force -ErrorAction SilentlyContinue }
  Start-Sleep -Seconds 5
  $servicos | ForEach-Object { Start-Service $_ -ErrorAction SilentlyContinue }
  `} />

        <h2>Configurando Serviços</h2>
        <CodeBlock title="Alterando tipo de inicialização e outras configurações" code={`# Mudar tipo de inicialização
  Set-Service -Name "Spooler"    -StartupType Automatic
  Set-Service -Name "XboxGipSvc" -StartupType Disabled
  Set-Service -Name "wuauserv"   -StartupType Manual

  # Mudar descrição
  Set-Service -Name "MeuServico" -Description "Serviço de monitoramento de infraestrutura v2"

  # Alterar conta de serviço (requer sc.exe no PS5.1)
  sc.exe config "MeuServico" obj= "EMPRESA\\svc-monitor" password= "Senha@123"
  # No PS7 e Windows Server 2019+:
  Set-Service -Name "MeuServico" -Credential (Get-Credential "EMPRESA\\svc-monitor")

  # Configurar recuperação automática (restart em falha)
  sc.exe failure "MeuServico" reset= 86400 actions= restart/60000/restart/60000/restart/60000
  # Argumentos: reset=secs antes de zerar contador, actions= ação/delay(ms) para cada falha

  # Via WMI — configurar múltiplos parâmetros
  $wmi = Get-WmiObject -Class Win32_Service -Filter "Name='MeuServico'"
  $wmi.Change($null,$null,$null,$null,$null,$null,$null,"novasenha") | Out-Null
  `} />

        <h2>Dependências de Serviços</h2>
        <CodeBlock title="Visualizando árvore de dependências" code={`# O que este serviço precisa para funcionar
  (Get-Service -Name LanmanWorkstation).ServicesDependedOn |
      Select-Object Name, DisplayName, Status

  # Quem depende deste serviço
  (Get-Service -Name LanmanServer).DependentServices |
      Select-Object Name, DisplayName, Status

  # Árvore completa de dependências (recursiva)
  function Get-ServiceTree {
      param([string]$Nome, [int]$Nivel = 0)
      $svc = Get-Service -Name $Nome
      $indent = "  " * $Nivel
      Write-Host "$indent→ $($svc.DisplayName) [$($svc.Status)]"
      foreach ($dep in $svc.DependentServices) {
          Get-ServiceTree -Nome $dep.Name -Nivel ($Nivel + 1)
      }
  }
  Get-ServiceTree "LanmanServer"

  # Parar um serviço e todos que dependem dele (na ordem correta)
  function Stop-ServiceComDependentes {
      param([string]$Nome)
      $svc = Get-Service -Name $Nome
      foreach ($dep in $svc.DependentServices) {
          Stop-ServiceComDependentes -Nome $dep.Name
      }
      if ($svc.Status -eq "Running") {
          Stop-Service -Name $Nome -Force
          Write-Host "Parado: $($svc.DisplayName)"
      }
  }
  `} />

        <h2>Criando Serviços Personalizados</h2>
        <CodeBlock title="Registrando e removendo serviços" code={`# Criar novo serviço
  New-Service `
    -Name "MonitorInfra" `
    -BinaryPathName "C:\\Apps\\Monitor\\monitor.exe --config C:\\Apps\\Monitor\\config.json" `
    -DisplayName "Monitor de Infraestrutura" `
    -Description "Monitora servidores e envia alertas via e-mail" `
    -StartupType Automatic `
    -Credential (Get-Credential "NT AUTHORITY\\LocalService")

  # Verificar se foi criado
  Get-Service "MonitorInfra" | Select-Object Name, Status, StartType

  # Iniciar imediatamente
  Start-Service "MonitorInfra"

  # Remover serviço
  Stop-Service "MonitorInfra" -Force -ErrorAction SilentlyContinue
  # PS 6+:
  Remove-Service -Name "MonitorInfra"
  # PS 5.1:
  sc.exe delete "MonitorInfra"
  `} />

        <h2>Monitoramento e Alertas</h2>
        <CodeBlock title="Script de monitoramento de serviços críticos" code={`function Watch-ServicoCritico {
      param(
          [string[]]$Servicos,
          [int]$IntervaloSegundos = 60,
          [string]$EmailAlerta = "ti@empresa.com"
      )

      Write-Host "Monitorando $($Servicos.Count) serviços..." -ForegroundColor Cyan

      while ($true) {
          foreach ($nome in $Servicos) {
              $svc = Get-Service -Name $nome -ErrorAction SilentlyContinue
              if (-not $svc) {
                  Write-Warning "Serviço não encontrado: $nome"
                  continue
              }

              if ($svc.Status -ne "Running") {
                  Write-Warning "$nome está $($svc.Status) — tentando reiniciar..."
                  try {
                      Start-Service -Name $nome -ErrorAction Stop
                      Write-Host "$nome reiniciado com sucesso" -ForegroundColor Green

                      # Log do evento
                      Write-EventLog -LogName Application -Source "MonitorPS" `
                          -EntryType Warning -EventId 1001 `
                          -Message "Serviço $nome foi reiniciado automaticamente"
                  } catch {
                      Write-Error "Falha ao reiniciar $nome: $_"
                  }
              }
          }
          Start-Sleep -Seconds $IntervaloSegundos
      }
  }

  # Monitorar serviços críticos
  Watch-ServicoCritico -Servicos @("W3SVC","MSSQLSERVER","WinRM") -IntervaloSegundos 30
  `} />

        <AlertBox type="warning" title="Privilégios Administrativos">
          Quase todas as operações que alteram o estado de um serviço (iniciar, parar, configurar) 
          exigem que o PowerShell seja executado como Administrador.
          Use <code>Start-Process pwsh -Verb RunAs</code> para elevar.
        </AlertBox>

        <AlertBox type="info" title="sc.exe vs Set-Service">
          Para configurações avançadas não disponíveis em <code>Set-Service</code> (como
          política de recuperação em falha, contas de serviço com senha, ou tipo de serviço),
          use diretamente o <code>sc.exe</code> que ainda está disponível no PowerShell.
        </AlertBox>
      </PageContainer>
    );
  }
  