import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function NetworkAdv() {
  return (
    <PageContainer
      title="Rede Avançada"
      subtitle="DNS, DHCP, roteamento, adaptadores, firewall e diagnóstico avançado de rede com PowerShell."
      difficulty="avançado"
      timeToRead="30 min"
    >
      <p>
        Além dos comandos básicos de rede, o PowerShell oferece módulos completos para
        gerenciar DNS, DHCP, adaptadores de rede, firewall do Windows e diagnóstico
        detalhado de conectividade.
      </p>

      <h2>Adaptadores de Rede</h2>
      <CodeBlock title="Configurando interfaces de rede" code={`# Listar adaptadores e configurações IP
Get-NetAdapter | Format-Table Name, InterfaceDescription, Status, LinkSpeed
Get-NetIPAddress | Where-Object AddressFamily -eq IPv4 |
    Select-Object InterfaceAlias, IPAddress, PrefixLength, AddressState

# Configurar IP estático
New-NetIPAddress -InterfaceAlias "Ethernet"  -IPAddress "192.168.1.100"  -PrefixLength 24  -DefaultGateway "192.168.1.1"

# Configurar DNS
Set-DnsClientServerAddress -InterfaceAlias "Ethernet"  -ServerAddresses "192.168.1.10","8.8.8.8"

# Remover configuração IP (voltar para DHCP)
Remove-NetIPAddress -InterfaceAlias "Ethernet" -Confirm:$false
Remove-NetRoute -InterfaceAlias "Ethernet" -Confirm:$false
Set-NetIPInterface -InterfaceAlias "Ethernet" -Dhcp Enabled
Set-DnsClientServerAddress -InterfaceAlias "Ethernet" -ResetServerAddresses

# Habilitar/desabilitar adaptador
Disable-NetAdapter -Name "Ethernet" -Confirm:$false
Enable-NetAdapter  -Name "Ethernet" -Confirm:$false
`} />

      <h2>DNS</h2>
      <CodeBlock title="Gerenciando DNS no Windows Server" code={`Import-Module DnsServer

# Listar zonas DNS
Get-DnsServerZone | Format-Table ZoneName, ZoneType, IsAutoCreated

# Criar zona
Add-DnsServerPrimaryZone -Name "empresa.local"  -ReplicationScope Domain  -DynamicUpdate Secure

# Adicionar registros A
Add-DnsServerResourceRecordA -ZoneName "empresa.local"  -Name "servidor-web"  -IPv4Address "192.168.1.50"  -TimeToLive 01:00:00

# Adicionar CNAME
Add-DnsServerResourceRecordCName -ZoneName "empresa.local"  -Name "www"  -HostNameAlias "servidor-web.empresa.local."

# Listar registros de uma zona
Get-DnsServerResourceRecord -ZoneName "empresa.local" |
    Select-Object HostName, RecordType, RecordData |
    Format-Table -AutoSize

# Consultas DNS avançadas
Resolve-DnsName "google.com" -Type MX    # Registros de e-mail
Resolve-DnsName "google.com" -Type NS    # Name servers
Resolve-DnsName "google.com" -Type TXT   # Registros de texto

# Flush cache DNS
Clear-DnsClientCache
`} />

      <h2>Firewall do Windows</h2>
      <CodeBlock title="Gerenciando regras de firewall" code={`# Listar regras habilitadas
Get-NetFirewallRule | Where-Object { $_.Enabled -eq "True" -and $_.Direction -eq "Inbound" } |
    Select-Object DisplayName, Action, Profile | Format-Table -AutoSize

# Criar regra para permitir porta
New-NetFirewallRule -DisplayName "Permitir HTTPS Entrada"  -Direction Inbound  -Protocol TCP  -LocalPort 443  -Action Allow  -Profile Domain,Private

# Criar regra para bloquear IP específico
New-NetFirewallRule -DisplayName "Bloquear IP Suspeito"  -Direction Inbound  -RemoteAddress "203.0.113.0/24"  -Action Block

# Desabilitar regra existente
Disable-NetFirewallRule -DisplayName "Permitir HTTPS Entrada"

# Remover regra
Remove-NetFirewallRule -DisplayName "Bloquear IP Suspeito"

# Habilitar/desabilitar Firewall
Set-NetFirewallProfile -Profile Domain,Public,Private -Enabled True
`} />

      <h2>Diagnóstico Avançado de Rede</h2>
      <CodeBlock title="Ferramentas de diagnóstico" code={`# Test-NetConnection — substituto ao ping+telnet
Test-NetConnection -ComputerName "servidor01" -Port 443  # Testa TCP
Test-NetConnection -ComputerName "8.8.8.8" -InformationLevel Detailed

# Port scan de servidor (verificar portas abertas)
$servidor = "192.168.1.10"
$portas   = 21,22,25,80,443,3306,3389,8080,8443

$portas | ForEach-Object -Parallel {
    $res = Test-NetConnection -ComputerName $Using:servidor -Port $_ -WarningAction SilentlyContinue
    [PSCustomObject]@{
        Porta    = $_
        Status   = if ($res.TcpTestSucceeded) { "ABERTA" } else { "FECHADA" }
        Latencia = $res.PingReplyDetails?.RoundtripTime
    }
} -ThrottleLimit 10 | Sort-Object Porta | Format-Table

# Monitorar conexões ativas
Get-NetTCPConnection -State Established |
    Where-Object LocalPort -ne 0 |
    Select-Object LocalAddress, LocalPort, RemoteAddress, RemotePort, OwningProcess |
    Sort-Object RemoteAddress |
    Format-Table -AutoSize

# Rota de rede
Get-NetRoute -AddressFamily IPv4 | Where-Object DestinationPrefix -ne "0.0.0.0/0" |
    Format-Table DestinationPrefix, NextHop, RouteMetric, InterfaceAlias
`} />

      <AlertBox type="info" title="Módulos de Rede Disponíveis">
        <strong>NetAdapter:</strong> Adaptadores e interfaces.
        <strong>NetTCPIP:</strong> Configurações IP, rotas e DNS.
        <strong>NetSecurity:</strong> Firewall e IPsec.
        <strong>DnsServer/DnsClient:</strong> Servidor e cliente DNS.
        <strong>DhcpServer:</strong> Servidor DHCP (Windows Server).
      </AlertBox>
    </PageContainer>
  );
}
