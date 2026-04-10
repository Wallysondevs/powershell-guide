import { PageContainer } from "@/components/layout/PageContainer";
  import { CodeBlock } from "@/components/ui/CodeBlock";
  import { AlertBox } from "@/components/ui/AlertBox";

  export default function EventoLog() {
    return (
      <PageContainer
        title="Windows Event Log"
        subtitle="Leia, filtre, crie e gerencie logs de eventos do Windows para monitoramento e auditoria."
        difficulty="intermediário"
        timeToRead="28 min"
      >
        <p>
          O Windows Event Log é a principal fonte de informação sobre o que acontece no sistema.
          PowerShell oferece dois cmdlets: o moderno <code>Get-WinEvent</code> (rápido, com XPath e XML)
          e o legado <code>Get-EventLog</code> — além de suporte para criar eventos personalizados e
          exportar logs para auditoria.
        </p>

        <h2>Consultando Eventos com Get-WinEvent</h2>
        <CodeBlock title="Filtrando e inspecionando logs de eventos" code={`# Logs disponíveis no sistema
  Get-WinEvent -ListLog * | Select-Object LogName, RecordCount, LogMode, IsEnabled |
      Sort-Object RecordCount -Descending | Select-Object -First 20

  # Ler eventos de um log específico (mais recentes primeiro)
  Get-WinEvent -LogName "System" -MaxEvents 50 |
      Select-Object TimeCreated, Id, ProviderName, LevelDisplayName, Message |
      Format-Table -AutoSize

  # Filtrar por data e nível (1=Crítico, 2=Erro, 3=Aviso, 4=Info, 5=Verbose)
  Get-WinEvent -FilterHashtable @{
      LogName   = "System"
      Level     = 1,2           # Crítico e Erro
      StartTime = (Get-Date).AddDays(-7)
      EndTime   = Get-Date
  } | Select-Object TimeCreated, Id, ProviderName, Message | Format-Table -Wrap

  # Buscar por Event ID
  Get-WinEvent -FilterHashtable @{ LogName = "System"; Id = 41 }  # Unexpected shutdown

  # Buscar em múltiplos logs ao mesmo tempo
  Get-WinEvent -FilterHashtable @{
      LogName = "System","Application","Security"
      Level   = 2
  } -MaxEvents 100

  # Busca por texto na mensagem (usando Where-Object)
  Get-WinEvent -LogName "Application" -MaxEvents 500 |
      Where-Object Message -like "*OutOfMemory*" |
      Select-Object TimeCreated, Id, Message
  `} />

        <h2>XPath e Filtros Avançados</h2>
        <CodeBlock title="Consultas XPath para filtragem precisa e rápida" code={`# XPath é muito mais rápido que Where-Object para grandes logs
  # Eventos de erro das últimas 24 horas
  $ontem = [System.DateTime]::UtcNow.AddDays(-1).ToString("yyyy-MM-ddTHH:mm:ss.000Z")
  $xPath = "*[System[Level=2 and TimeCreated[@SystemTime>='$ontem']]]"
  Get-WinEvent -LogName "System" -FilterXPath $xPath

  # XPath com múltiplos EventIDs (falha de logon = 4625, logon = 4624)
  Get-WinEvent -LogName "Security" -FilterXPath "*[System[EventID=4625 or EventID=4624]]" -MaxEvents 100

  # Filtrar por provedor E EventID
  Get-WinEvent -LogName "System" `
    -FilterXPath "*[System[Provider[@Name='Microsoft-Windows-Kernel-Power'] and EventID=41]]"

  # Filtrar por dado dentro do evento (XML)
  # Ex: logons de um usuário específico
  $usuario = "administrator"
  $xPath = "*[System[EventID=4624] and EventData[Data[@Name='TargetUserName']='$usuario']]"
  Get-WinEvent -LogName "Security" -FilterXPath $xPath -MaxEvents 50 |
      ForEach-Object {
          $xml = [xml]$_.ToXml()
          [PSCustomObject]@{
              Hora      = $_.TimeCreated
              Usuário   = ($xml.Event.EventData.Data | Where-Object Name -eq "TargetUserName")."#text"
              IP        = ($xml.Event.EventData.Data | Where-Object Name -eq "IpAddress")."#text"
              TipoLogon = ($xml.Event.EventData.Data | Where-Object Name -eq "LogonType")."#text"
          }
      } | Format-Table
  `} />

        <h2>Análise de Falhas de Login</h2>
        <CodeBlock title="Detectando ataques de força bruta e logons suspeitos" code={`# Listar falhas de logon nas últimas 24h (EventID 4625)
  $falhas = Get-WinEvent -FilterHashtable @{
      LogName   = "Security"
      Id        = 4625
      StartTime = (Get-Date).AddHours(-24)
  } -ErrorAction SilentlyContinue

  $relatorio = $falhas | ForEach-Object {
      $xml = [xml]$_.ToXml()
      $dados = $xml.Event.EventData.Data
      [PSCustomObject]@{
          Hora     = $_.TimeCreated
          Usuário  = ($dados | Where-Object Name -eq "TargetUserName")."#text"
          Domínio  = ($dados | Where-Object Name -eq "TargetDomainName")."#text"
          IP       = ($dados | Where-Object Name -eq "IpAddress")."#text"
          Motivo   = ($dados | Where-Object Name -eq "FailureReason")."#text"
      }
  }

  # Top IPs com mais falhas (possível ataque de força bruta)
  $relatorio | Group-Object IP |
      Sort-Object Count -Descending |
      Select-Object -First 10 |
      Format-Table Name, Count

  # Contas com mais falhas
  $relatorio | Group-Object Usuário |
      Sort-Object Count -Descending |
      Select-Object -First 10 |
      Format-Table Name, Count

  # Alertar se algum IP tiver mais de 50 falhas
  $ipsSuspeitos = $relatorio | Group-Object IP | Where-Object Count -gt 50
  if ($ipsSuspeitos) {
      Write-Warning "IPs suspeitos detectados:"
      $ipsSuspeitos | Format-Table Name, Count
  }
  `} />

        <h2>Criando Eventos Personalizados</h2>
        <CodeBlock title="Registrando eventos de aplicativos nos logs do Windows" code={`# Registrar uma fonte de evento personalizada (admin - fazer 1x)
  New-EventLog -Source "MeuScript" -LogName Application

  # Escrever eventos de diferentes níveis
  Write-EventLog -LogName Application -Source "MeuScript" `
    -EntryType Information -EventId 1000 `
    -Message "Backup iniciado às $(Get-Date -Format 'HH:mm:ss')"

  Write-EventLog -LogName Application -Source "MeuScript" `
    -EntryType Warning -EventId 1001 `
    -Message "Espaço em disco abaixo de 10%: 8.2 GB livres"

  Write-EventLog -LogName Application -Source "MeuScript" `
    -EntryType Error -EventId 1002 `
    -Message "Falha ao conectar ao servidor de banco de dados: timeout após 30s"

  # Alternativa moderna: Write-WinEvent (PS7+, logs estruturados)
  New-WinEvent -ProviderName Microsoft-Windows-Application-Experience `
    -Id 500 -Payload @("MeuApp","Iniciado","v2.1.0")

  # Verificar se a fonte existe antes de criar
  if (-not [System.Diagnostics.EventLog]::SourceExists("MeuScript")) {
      New-EventLog -Source "MeuScript" -LogName Application
  }

  # Remover fonte personalizada
  Remove-EventLog -Source "MeuScript"
  `} />

        <h2>Exportando e Arquivando Logs</h2>
        <CodeBlock title="Exportar, limpar e arquivar logs de eventos" code={`# Exportar log para arquivo .evtx (formato nativo)
  wevtutil.exe epl System "C:\\Logs\\System-$(Get-Date -Format 'yyyyMMdd').evtx"
  wevtutil.exe epl Security "C:\\Logs\\Security-$(Get-Date -Format 'yyyyMMdd').evtx"

  # Exportar eventos para CSV (análise em Excel)
  Get-WinEvent -FilterHashtable @{ LogName="System"; Level=2; StartTime=(Get-Date).AddDays(-30) } |
      Select-Object TimeCreated, Id, ProviderName, LevelDisplayName, Message |
      Export-Csv "erros-sistema-30dias.csv" -NoTypeInformation -Encoding UTF8

  # Limpar log (use com cuidado — irreversível sem backup)
  Clear-EventLog -LogName Application    # Limpa o log Application
  wevtutil.exe cl System                 # Via wevtutil (mais rápido)

  # Rotação de logs — script de arquivamento automático
  function Invoke-LogRotation {
      param([string]$ArquivoDestino = "C:\\LogArchive")
      $data = Get-Date -Format "yyyyMMdd"
      New-Item -ItemType Directory -Force "$ArquivoDestino\\$data" | Out-Null

      foreach ($log in @("System","Application","Security")) {
          $arquivo = "$ArquivoDestino\\$data\\$log.evtx"
          wevtutil.exe epl $log $arquivo /ow:true  # /ow:true sobrescreve se existir
          wevtutil.exe cl $log                      # Limpar após exportar
          Write-Host "Log '$log' arquivado: $arquivo" -ForegroundColor Green
      }
  }
  `} />

        <AlertBox type="warning" title="Permissão para Ler Security Log">
          O log de Segurança (<code>Security</code>) só pode ser lido por Administradores.
          Em ambientes corporativos, considere usar soluções SIEM (Microsoft Sentinel,
          Splunk, Elastic) que coletam esses eventos automaticamente.
        </AlertBox>

        <AlertBox type="info" title="Get-WinEvent vs Get-EventLog">
          Prefira sempre <code>Get-WinEvent</code> ao <code>Get-EventLog</code>.
          O Get-WinEvent suporta logs de aplicativos, logs de diagnóstico, filtros XPath
          e é significativamente mais rápido. O Get-EventLog é legado e não acessa logs
          de aplicativos como <code>Microsoft-Windows-PowerShell/Operational</code>.
        </AlertBox>
      </PageContainer>
    );
  }
  