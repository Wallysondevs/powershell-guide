import { PageContainer } from "@/components/layout/PageContainer";
  import { CodeBlock } from "@/components/ui/CodeBlock";
  import { AlertBox } from "@/components/ui/AlertBox";

  export default function NetworkAdv() {
    return (
      <PageContainer
        title="Rede Avançada"
        subtitle="DNS, DHCP, roteamento, adaptadores, firewall, proxy e diagnóstico avançado de rede com PowerShell."
        difficulty="avançado"
        timeToRead="35 min"
      >
        <p>
          Além dos comandos básicos de rede, o PowerShell oferece módulos completos para
          gerenciar DNS, DHCP, adaptadores de rede, firewall do Windows, roteamento e diagnóstico
          detalhado de conectividade — tudo de forma automatizada e escalável.
        </p>

        <h2>Adaptadores de Rede</h2>
        <CodeBlock title="Configurando interfaces de rede" code={`# Listar adaptadores e configurações IP
  Get-NetAdapter | Format-Table Name, InterfaceDescription, Status, LinkSpeed, MacAddress
  Get-NetIPAddress | Where-Object AddressFamily -eq IPv4 |
      Select-Object InterfaceAlias, IPAddress, PrefixLength, AddressState

  # Configurar IP estático
  New-NetIPAddress `
    -InterfaceAlias "Ethernet" `
    -IPAddress "192.168.1.100" `
    -PrefixLength 24 `
    -DefaultGateway "192.168.1.1"

  # Configurar DNS
  Set-DnsClientServerAddress -InterfaceAlias "Ethernet" `
    -ServerAddresses "192.168.1.10","8.8.8.8"

  # Voltar para DHCP
  Remove-NetIPAddress  -InterfaceAlias "Ethernet" -Confirm:$false
  Remove-NetRoute      -InterfaceAlias "Ethernet" -Confirm:$false
  Set-NetIPInterface   -InterfaceAlias "Ethernet" -Dhcp Enabled
  Set-DnsClientServerAddress -InterfaceAlias "Ethernet" -ResetServerAddresses

  # Renomear adaptador
  Rename-NetAdapter -Name "Ethernet 2" -NewName "LAN-Producao"

  # Configurar MTU (resolução de problemas de fragmentação)
  Set-NetIPInterface -InterfaceAlias "Ethernet" -NlMtuBytes 1400

  # Habilitar/desabilitar adaptador
  Disable-NetAdapter -Name "Wi-Fi" -Confirm:$false
  Enable-NetAdapter  -Name "Wi-Fi" -Confirm:$false

  # Obter estatísticas do adaptador (bytes enviados/recebidos)
  Get-NetAdapterStatistics | Select-Object Name, ReceivedBytes, SentBytes | Format-Table
  `} />

        <h2>DNS — Servidor e Cliente</h2>
        <CodeBlock title="Gerenciando DNS no Windows Server" code={`Import-Module DnsServer

  # Listar e gerenciar zonas DNS
  Get-DnsServerZone | Format-Table ZoneName, ZoneType, IsAutoCreated, DynamicUpdate

  # Criar zona primária
  Add-DnsServerPrimaryZone -Name "empresa.local" `
    -ReplicationScope Domain `
    -DynamicUpdate Secure

  # Criar zona de stub (aponta para outro DNS)
  Add-DnsServerStubZone -Name "filial.local" `
    -MasterServers "10.10.1.10" `
    -ReplicationScope Domain

  # Registros DNS — A, CNAME, MX, PTR
  Add-DnsServerResourceRecordA    -ZoneName "empresa.local" -Name "web01" -IPv4Address "192.168.1.50"
  Add-DnsServerResourceRecordCName -ZoneName "empresa.local" -Name "www"   -HostNameAlias "web01.empresa.local."
  Add-DnsServerResourceRecordMX   -ZoneName "empresa.local" -Name "@"      -MailExchange "mail.empresa.local." -Preference 10
  Add-DnsServerResourceRecordPtr  -ZoneName "1.168.192.in-addr.arpa" -Name "50" -PtrDomainName "web01.empresa.local."

  # Listar registros e remover
  Get-DnsServerResourceRecord -ZoneName "empresa.local" |
      Select-Object HostName, RecordType | Format-Table
  Remove-DnsServerResourceRecord -ZoneName "empresa.local" `
    -RRType "A" -Name "web01" -Confirm:$false

  # Diagnóstico DNS (cliente)
  Resolve-DnsName "google.com" -Type MX -Server "8.8.8.8"  # Registros de e-mail via servidor externo
  Resolve-DnsName "empresa.local" -Type NS                   # Nameservers
  Clear-DnsClientCache                                        # Limpar cache local
  Get-DnsClientCache | Format-Table Entry, RecordType, TimeToLive
  `} />

        <h2>DHCP</h2>
        <CodeBlock title="Gerenciando servidor DHCP" code={`Import-Module DhcpServer

  # Listar escopos DHCP
  Get-DhcpServerv4Scope | Format-Table ScopeId, Name, StartRange, EndRange, State, LeaseDuration

  # Criar escopo
  Add-DhcpServerv4Scope `
    -Name "Escritório Principal" `
    -StartRange "192.168.1.100" `
    -EndRange   "192.168.1.200" `
    -SubnetMask  "255.255.255.0" `
    -LeaseDuration "1.00:00:00"  # 1 dia

  # Configurar opções do escopo (gateway, DNS)
  Set-DhcpServerv4OptionValue -ScopeId "192.168.1.0" `
    -Router     "192.168.1.1" `
    -DnsServer  "192.168.1.10","8.8.8.8" `
    -DnsDomain  "empresa.local"

  # Exclusões (IPs que o DHCP não vai distribuir)
  Add-DhcpServerv4ExclusionRange -ScopeId "192.168.1.0" `
    -StartRange "192.168.1.1" `
    -EndRange   "192.168.1.20"

  # Reservas (MAC → IP fixo)
  Add-DhcpServerv4Reservation `
    -ScopeId      "192.168.1.0" `
    -IPAddress    "192.168.1.50" `
    -ClientId     "00-11-22-33-44-55" `
    -Description  "Servidor Web"

  # Listar concessões ativas
  Get-DhcpServerv4Lease -ScopeId "192.168.1.0" |
      Select-Object IPAddress, HostName, ClientId, AddressState, LeaseExpiryTime |
      Sort-Object IPAddress | Format-Table

  # Exportar e importar configuração DHCP (migração/backup)
  Export-DhcpServer -ComputerName "DHCP-01" -File "C:\\Backup\\dhcp-backup.xml" -Leases
  Import-DhcpServer -File "C:\\Backup\\dhcp-backup.xml" -BackupPath "C:\\DhcpBackup"
  `} />

        <h2>Firewall do Windows</h2>
        <CodeBlock title="Gerenciando regras de firewall" code={`# Listar regras habilitadas (entrada)
  Get-NetFirewallRule |
      Where-Object { $_.Enabled -eq "True" -and $_.Direction -eq "Inbound" } |
      Select-Object DisplayName, Action, Profile | Format-Table -AutoSize

  # Criar regras
  New-NetFirewallRule -DisplayName "Permitir HTTPS Entrada" `
    -Direction Inbound -Protocol TCP -LocalPort 443 -Action Allow -Profile Any

  New-NetFirewallRule -DisplayName "Bloquear IP Suspeito" `
    -Direction Inbound -RemoteAddress "203.0.113.0/24" -Action Block

  New-NetFirewallRule -DisplayName "Permitir App Específico" `
    -Direction Inbound -Program "C:\\Apps\\MeuApp\\app.exe" -Action Allow

  # Modificar e remover regras
  Set-NetFirewallRule    -DisplayName "Permitir HTTPS Entrada" -Profile Domain
  Disable-NetFirewallRule -DisplayName "Permitir HTTPS Entrada"
  Remove-NetFirewallRule  -DisplayName "Bloquear IP Suspeito"

  # Habilitar/desabilitar Firewall por perfil
  Set-NetFirewallProfile -Profile Domain,Public,Private -Enabled True

  # Exportar e importar regras
  netsh advfirewall export "C:\\Backup\\firewall.wfw"
  netsh advfirewall import "C:\\Backup\\firewall.wfw"
  `} />

        <h2>Diagnóstico Avançado de Rede</h2>
        <CodeBlock title="Ferramentas de diagnóstico e monitoramento" code={`# Test-NetConnection — substituto ao ping + telnet
  Test-NetConnection -ComputerName "servidor01" -Port 443   # TCP
  Test-NetConnection -ComputerName "8.8.8.8" -InformationLevel Detailed

  # Port scan paralelo (verificar múltiplas portas de uma vez)
  $servidor = "192.168.1.10"
  $portas   = 21,22,25,53,80,443,3306,3389,8080,8443

  $resultado = $portas | ForEach-Object -Parallel {
      $r = Test-NetConnection -ComputerName $Using:servidor -Port $_ -WarningAction SilentlyContinue
      [PSCustomObject]@{
          Porta  = $_
          Status = if ($r.TcpTestSucceeded) { "ABERTA" } else { "FECHADA" }
      }
  } -ThrottleLimit 10

  $resultado | Sort-Object Porta | Format-Table

  # Medir latência com múltiplas sondas
  $stats = 1..10 | ForEach-Object {
      Test-Connection "8.8.8.8" -Count 1 -ErrorAction SilentlyContinue |
          Select-Object -ExpandProperty Latency
  }
  "Latência média: $([math]::Round(($stats | Measure-Object -Average).Average, 1)) ms"
  "Máximo: $($stats | Measure-Object -Maximum | Select-Object -ExpandProperty Maximum) ms"

  # Rastrear rota (equivalente ao tracert)
  Test-NetConnection -ComputerName "google.com" -TraceRoute

  # Monitorar tráfego de rede em tempo real
  Get-NetTCPConnection -State Established |
      Select-Object LocalAddress, LocalPort, RemoteAddress, RemotePort, State, OwningProcess |
      Sort-Object OwningProcess | Format-Table

  # Conexões de um processo específico
  $pid = (Get-Process -Name "chrome" -ErrorAction SilentlyContinue | Select-Object -First 1).Id
  Get-NetTCPConnection | Where-Object OwningProcess -eq $pid

  # Estatísticas de rede por protocolo
  Get-NetTCPConnection | Group-Object State |
      Select-Object Name, Count | Sort-Object Count -Descending

  # Verificar rota de roteamento
  Get-NetRoute | Where-Object { $_.DestinationPrefix -eq "0.0.0.0/0" } |
      Format-Table InterfaceAlias, NextHop, RouteMetric, Protocol
  `} />

        <AlertBox type="info" title="Executar como Administrador">
          A maioria dos cmdlets de rede (New-NetIPAddress, New-NetFirewallRule, DHCP, DNS)
          requer privilégios elevados. Execute o PowerShell como Administrador ou use
          <code>Start-Process pwsh -Verb RunAs</code>.
        </AlertBox>
      </PageContainer>
    );
  }
  