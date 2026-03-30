import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function EventoLog() {
  return (
    <PageContainer
      title="Windows Event Log"
      subtitle="Leia, filtre, crie e gerencie logs de eventos do Windows para monitoramento e auditoria."
      difficulty="intermediário"
      timeToRead="20 min"
    >
      <p>
        O Windows Event Log é a principal fonte de informações de auditoria e diagnóstico 
        do sistema operacional. O PowerShell oferece dois cmdlets principais: 
        <code>Get-EventLog</code> (legado) e <code>Get-WinEvent</code> (moderno, recomendado).
      </p>

      <h2>Consultando Eventos</h2>
      <CodeBlock title="Get-WinEvent - consultas flexíveis" code={`# Listar todos os logs disponíveis
Get-WinEvent -ListLog * | Where-Object RecordCount -gt 0 | Sort-Object RecordCount -Descending | Select-Object -First 20

# Eventos de um log específico
Get-WinEvent -LogName "System" -MaxEvents 50
Get-WinEvent -LogName "Application" -MaxEvents 100 | Where-Object LevelDisplayName -eq "Error"

# Filtrar por tempo
Get-WinEvent -LogName "Security" -MaxEvents 1000 |
    Where-Object { $_.TimeCreated -gt (Get-Date).AddHours(-1) }

# FilterHashtable (muito mais eficiente — filtra no servidor)
Get-WinEvent -FilterHashtable @{
    LogName   = "System"
    Level     = 2          # 1=Critical,2=Error,3=Warning,4=Info
    StartTime = (Get-Date).AddDays(-7)
    EndTime   = Get-Date
}

# Filtrar por ID de evento
Get-WinEvent -FilterHashtable @{
    LogName = "Security"
    Id      = 4624         # Logon bem-sucedido
}

# Múltiplos IDs
Get-WinEvent -FilterHashtable @{
    LogName = "Security"
    Id      = @(4624, 4625, 4648)  # Logon, Falha, Tentativa
}
`} />

      <h2>Análise de Falhas de Login</h2>
      <CodeBlock title="Auditoria de segurança com eventos" code={`# Tentativas de login falhadas (4625)
$falhas = Get-WinEvent -FilterHashtable @{
    LogName   = "Security"
    Id        = 4625
    StartTime = (Get-Date).AddHours(-24)
} | ForEach-Object {
    $xml = [xml]$_.ToXml()
    $ns  = @{ e = "http://schemas.microsoft.com/win/2004/08/events/event" }
    [PSCustomObject]@{
        Hora       = $_.TimeCreated
        Usuario    = ($xml | Select-Xml "//e:Data[@Name='TargetUserName']" -Namespace $ns).Node.InnerText
        Origem     = ($xml | Select-Xml "//e:Data[@Name='IpAddress']" -Namespace $ns).Node.InnerText
        Workstation= ($xml | Select-Xml "//e:Data[@Name='WorkstationName']" -Namespace $ns).Node.InnerText
    }
}

# IPs com mais tentativas falhas
$falhas | Group-Object Origem | Sort-Object Count -Descending |
    Select-Object -First 10 |
    Format-Table @{N="IP Origem";E={$_.Name}}, Count -AutoSize

# Criar alerta se >10 falhas em 5 minutos
$limite = (Get-Date).AddMinutes(-5)
$falhasRecentes = $falhas | Where-Object { $_.Hora -gt $limite }
if ($falhasRecentes.Count -gt 10) {
    Write-Warning "ALERTA: $($falhasRecentes.Count) tentativas falhas nos últimos 5 minutos!"
    # Enviar e-mail ou criar ticket...
}
`} />

      <h2>Criando Eventos Personalizados</h2>
      <CodeBlock title="Write-EventLog e New-EventLog" code={`# Criar fonte personalizada (uma vez, como Administrador)
New-EventLog -LogName "Application" -Source "MinhaAplicacao"

# Escrever eventos — parâmetros na mesma linha
Write-EventLog -LogName "Application" -Source "MinhaAplicacao" -EventId 1000 -EntryType Information -Message "Backup iniciado"

Write-EventLog -LogName "Application" -Source "MinhaAplicacao" -EventId 2000 -EntryType Error -Message "Falha ao conectar ao banco de dados"

# Usando hashtable de splatting (mais legível)
$params = @{
    LogName   = "Application"
    Source    = "MinhaAplicacao"
    EventId   = 3000
    EntryType = "Warning"
    Message   = "Disco com menos de 10% livre"
}
Write-EventLog @params

# Criar log personalizado separado
New-EventLog -LogName "MinhaEmpresa-App" -Source "ServicoAgendador"
Limit-EventLog -LogName "MinhaEmpresa-App" -MaximumSize 50MB -OverflowAction OverwriteOlder

# Remover fonte (limpeza)
Remove-EventLog -Source "MinhaAplicacao"
`} />

      <h2>Exportando e Arquivando Logs</h2>
      <CodeBlock title="Backup e análise de logs" code={`# Exportar eventos para arquivo .evtx
wevtutil.exe epl System "C:\Backup\System-$(Get-Date -Format 'yyyyMMdd').evtx"

# Ler arquivo .evtx exportado
Get-WinEvent -Path "C:\Backup\System-20240115.evtx" -MaxEvents 100

# Exportar para CSV para análise
Get-WinEvent -FilterHashtable @{ LogName="Application"; Level=2 } |
    Select-Object TimeCreated, Id, ProviderName, Message |
    Export-Csv "erros-application.csv" -NoTypeInformation -Encoding UTF8

# Limpar log (cuidado!)
Clear-EventLog -LogName "MinhaEmpresa-App"
wevtutil.exe cl Application  # Alternativa via wevtutil

# Monitorar log em tempo real (como tail -f)
$subscription = Register-ObjectEvent -InputObject ([System.Diagnostics.EventLog]::new("Application")) \ -EventName "EntryWritten" \ -Action {
        $entrada = $Event.SourceEventArgs.Entry
        if ($entrada.EntryType -eq "Error") {
            Write-Host "[ERRO] $($entrada.Message)" -ForegroundColor Red
        }
    }

# Para parar o monitoramento
Unregister-Event -SourceIdentifier $subscription.Name
`} />

      <AlertBox type="info" title="Get-WinEvent vs Get-EventLog">
        Use <code>Get-WinEvent</code> com <code>-FilterHashtable</code> para consultas eficientes —
        o filtro é executado no servidor de log, não na memória. <code>Get-EventLog</code> é mais 
        simples mas mais lento e não suporta todos os logs do Windows moderno.
      </AlertBox>
    </PageContainer>
  );
}