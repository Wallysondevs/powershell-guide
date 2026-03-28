import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function WmiCim() {
  return (
    <PageContainer
      title="WMI e CIM"
      subtitle="Explore as entranhas do hardware e software do Windows com consultas poderosas."
      difficulty="avancado"
      timeToRead="25 min"
    >
      <p>
        O <strong>WMI</strong> (Windows Management Instrumentation) e o <strong>CIM</strong> (Common Information Model) são tecnologias que permitem consultar e gerenciar quase tudo no Windows: desde a temperatura da CPU até os patches de segurança instalados, passando por processos, serviços, usuários, hardware e configurações de rede.
      </p>

      <AlertBox type="info" title="WMI vs CIM — Qual Usar?">
        O WMI é a implementação legada da Microsoft baseada em DCOM. O <strong>CIM</strong> (introduzido no PowerShell 3.0) é o padrão moderno, mais rápido, funciona remotamente via WinRM/SSH (inclusive em Linux) e deve ser sua escolha preferida. Use <code>Get-CimInstance</code> em vez de <code>Get-WmiObject</code> sempre que possível.
      </AlertBox>

      <h2>Consultando Informações com Get-CimInstance</h2>
      <p>
        Este é o comando principal. Você fornece o nome de uma "Classe" CIM e ele retorna os objetos correspondentes com suas propriedades.
      </p>

      <CodeBlock
        title="Consultas básicas de hardware e sistema"
        language="powershell"
        code={`# Informações do Sistema Operacional
Get-CimInstance -ClassName Win32_OperatingSystem |
    Select-Object Caption, Version, BuildNumber, LastBootUpTime, FreePhysicalMemory

# Informações da BIOS e firmware
Get-CimInstance -ClassName Win32_BIOS |
    Select-Object Manufacturer, SMBIOSBIOSVersion, ReleaseDate

# Lista de discos físicos e capacidade
Get-CimInstance -ClassName Win32_DiskDrive |
    Select-Object Model, @{N="Tamanho(GB)"; E={[math]::Round($_.Size/1GB, 2)}}, InterfaceType

# Processadores instalados (detalhado)
Get-CimInstance -ClassName Win32_Processor |
    Select-Object Name, NumberOfCores, NumberOfLogicalProcessors, MaxClockSpeed, CurrentVoltage

# Informações de RAM por módulo (slots de memória)
Get-CimInstance -ClassName Win32_PhysicalMemory |
    Select-Object Tag, @{N="Capacidade(GB)"; E={$_.Capacity/1GB}}, Speed, Manufacturer

# Placas de rede
Get-CimInstance -ClassName Win32_NetworkAdapter -Filter "NetEnabled = True" |
    Select-Object Name, MACAddress, Speed`}
      />

      <h2>Filtragem com WQL (WMI Query Language)</h2>
      <p>
        Em vez de baixar todos os objetos e filtrar no PowerShell, você pode usar o parâmetro <code>-Filter</code> ou <code>-Query</code> para filtrar diretamente na fonte. Isso é muito mais eficiente em redes lentas ou com grandes volumes de dados.
      </p>

      <CodeBlock
        title="Filtros eficientes com WQL"
        language="powershell"
        code={`# Filtro simples com -Filter (sintaxe WQL, semelhante ao SQL)
Get-CimInstance -ClassName Win32_Process -Filter "Name = 'notepad.exe'"

# Buscar processos com mais de 100MB de RAM
Get-CimInstance -ClassName Win32_Process -Filter "WorkingSetSize > 104857600" |
    Select-Object Name, ProcessId, @{N="RAM(MB)"; E={[math]::Round($_.WorkingSetSize/1MB,1)}}

# Consulta WQL completa com -Query (máxima flexibilidade)
$query = "SELECT Name, FreeSpace, Size FROM Win32_LogicalDisk WHERE DriveType = 3 AND FreeSpace < 5368709120"
Get-CimInstance -Query $query |
    Select-Object Name, @{N="Livre(GB)"; E={[math]::Round($_.FreeSpace/1GB,2)}}, @{N="Total(GB)"; E={[math]::Round($_.Size/1GB,2)}}

# Encontrar serviços parados que iniciam automaticamente
Get-CimInstance -ClassName Win32_Service -Filter "StartMode = 'Auto' AND State != 'Running'" |
    Select-Object Name, DisplayName, State`}
      />

      <h2>Classes WMI/CIM Indispensáveis</h2>
      <p>Um mapa das classes mais úteis para administradores de sistemas Windows:</p>

      <CodeBlock
        title="Referência rápida de classes"
        language="powershell"
        code={`# SISTEMA E HARDWARE
Win32_OperatingSystem     # Info do SO, versão, uptime, memória
Win32_ComputerSystem      # Fabricante, modelo, RAM total, domínio
Win32_Processor           # CPU: núcleos, velocidade, uso
Win32_PhysicalMemory      # Módulos de RAM físicos
Win32_BIOS                # Fabricante da BIOS, versão, data
Win32_DiskDrive           # Discos físicos (HDD/SSD)
Win32_DiskPartition       # Partições dos discos
Win32_LogicalDisk         # Unidades lógicas (C:, D:, etc.)
Win32_VideoController     # Placa de vídeo, resolução, VRAM

# REDE
Win32_NetworkAdapter                # Placas de rede
Win32_NetworkAdapterConfiguration   # IPs, DNS, Gateway, MAC

# PROCESSOS E SERVIÇOS
Win32_Process             # Todos os processos em execução
Win32_Service             # Serviços do Windows
Win32_StartupCommand      # Programas de inicialização

# SEGURANÇA E USUÁRIOS
Win32_UserAccount         # Contas de usuário locais
Win32_Group               # Grupos locais
Win32_LogonSession        # Sessões ativas no sistema

# MANUTENÇÃO
Win32_QuickFixEngineering # Hotfixes/Updates instalados
Win32_Product             # Softwares instalados (LENTO!)
Win32_ScheduledJob        # Tarefas agendadas (via schtasks)

Write-Host "Listando todas as classes disponíveis:"
Get-CimClass -Namespace root/CIMV2 | Measure-Object`}
      />

      <h2>Executando Métodos (Ações)</h2>
      <p>Algumas classes CIM não apenas fornecem dados, mas também permitem realizar ações: encerrar processos, renomear computadores, reiniciar serviços, e muito mais.</p>

      <CodeBlock
        title="Invocando métodos de classes CIM"
        language="powershell"
        code={`# Encerrar um processo via CIM (mais limpo que Stop-Process em alguns cenários)
$processo = Get-CimInstance -ClassName Win32_Process -Filter "Name = 'calc.exe'"
Invoke-CimMethod -InputObject $processo -MethodName "Terminate"

# Criar um novo processo
Invoke-CimMethod -ClassName Win32_Process -MethodName "Create" -Arguments @{
    CommandLine = "notepad.exe C:\\Temp\\log.txt"
}

# Renomear o computador (requer reinicialização)
$cs = Get-CimInstance -ClassName Win32_ComputerSystem
Invoke-CimMethod -InputObject $cs -MethodName "Rename" -Arguments @{
    Name     = "NovoNome-PC"
    UserName = "DOMINIO\\Admin"
    Password = "senha_segura"
}

# Alterar configuração de IP de uma interface de rede
$nic = Get-CimInstance Win32_NetworkAdapterConfiguration -Filter "Description LIKE '%Intel%'"
Invoke-CimMethod -InputObject $nic -MethodName "EnableStatic" -Arguments @{
    IPAddress  = @("192.168.1.100")
    SubnetMask = @("255.255.255.0")
}`}
      />

      <h2>Explorando Classes (Descoberta)</h2>
      <p>Não sabe o nome exato da classe que precisa? O PowerShell permite explorar o universo de classes disponíveis.</p>

      <CodeBlock
        title="Descobrindo novas classes"
        language="powershell"
        code={`# Listar classes que contenham 'disk' no nome
Get-CimClass -ClassName *disk*

# Listar classes relacionadas à GPU/vídeo
Get-CimClass -ClassName *Video*

# Ver quais MÉTODOS uma classe possui (ações que você pode chamar)
Get-CimClass -ClassName Win32_Service |
    Select-Object -ExpandProperty CimClassMethods |
    Select-Object Name, ReturnType

# Ver todas as PROPRIEDADES disponíveis em uma classe
Get-CimClass -ClassName Win32_Process |
    Select-Object -ExpandProperty CimClassProperties |
    Select-Object Name, CimType

# Explorar namespaces disponíveis (além de root/CIMV2)
Get-CimInstance -Namespace root -ClassName __Namespace |
    Select-Object Name`}
      />

      <h2>CIM Sessions — Gerenciamento Remoto Eficiente</h2>
      <p>Uma das maiores vantagens do CIM é a criação de sessões persistentes para gerenciar múltiplos servidores simultaneamente sem criar nova conexão a cada comando.</p>

      <CodeBlock
        title="Gerenciamento remoto com CIM Sessions"
        language="powershell"
        code={`# Criar sessões com múltiplos servidores de uma vez
$sessoes = New-CimSession -ComputerName "SRV01", "SRV02", "SRV03" -Credential (Get-Credential)

# Consultar dados em todos simultaneamente
Get-CimInstance -CimSession $sessoes -ClassName Win32_OperatingSystem |
    Select-Object PSComputerName, Caption, LastBootUpTime |
    Sort-Object LastBootUpTime

# Verificar espaço em disco de todos os servidores
Get-CimInstance -CimSession $sessoes -ClassName Win32_LogicalDisk -Filter "DriveType=3" |
    Select-Object PSComputerName, DeviceID,
        @{N="Livre(GB)"; E={[math]::Round($_.FreeSpace/1GB,1)}},
        @{N="Total(GB)"; E={[math]::Round($_.Size/1GB,1)}}

# Fechar todas as sessões ao terminar (importante liberar recursos)
$sessoes | Remove-CimSession

# Sessão via SSH (PS 7+ sem precisar de WinRM)
$sessaoLinux = New-CimSession -ComputerName "linux-server" -SessionOption (New-CimSessionOption -Protocol DCOM)`}
      />

      <AlertBox type="warning" title="Cuidado com Win32_Product">
        Evite usar <code>Get-CimInstance Win32_Product</code> em larga escala. Essa consulta dispara uma verificação de consistência do Windows Installer em cada software instalado, sendo extremamente lenta e gerando logs de eventos desnecessários. Para listar programas instalados de forma eficiente, prefira consultar o Registro do Windows.
      </AlertBox>

      <CodeBlock
        title="Alternativa rápida para listar softwares instalados"
        language="powershell"
        code={`# Listar softwares instalados via Registro (muito mais rápido que Win32_Product)
$caminhos = @(
    "HKLM:\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\*",
    "HKLM:\\Software\\WOW6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\*"
)

Get-ItemProperty $caminhos |
    Where-Object { $_.DisplayName } |
    Select-Object DisplayName, DisplayVersion, Publisher, InstallDate |
    Sort-Object DisplayName |
    Format-Table -AutoSize`}
      />

      <AlertBox type="success" title="Dica Profissional">
        As propriedades de data no WMI/CIM vêm em formato <code>CimDateTime</code>. O PowerShell converte isso automaticamente para <code>DateTime</code> quando você usa <code>Get-CimInstance</code>, tornando comparações com datas nativas muito simples: <code>Where-Object LastBootUpTime -gt (Get-Date).AddDays(-7)</code>.
      </AlertBox>
    </PageContainer>
  );
}
