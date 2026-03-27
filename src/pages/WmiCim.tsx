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
        O <strong>WMI</strong> (Windows Management Instrumentation) e o <strong>CIM</strong> (Common Information Model) são tecnologias que permitem consultar e gerenciar quase tudo no Windows: desde a temperatura da CPU até os patches de segurança instalados.
      </p>

      <AlertBox type="info" title="WMI vs CIM">
        O WMI é a implementação legada da Microsoft baseada em DCOM. O <strong>CIM</strong> (introduzido no PowerShell 3.0) é o padrão moderno, mais rápido, funciona em Linux (via WinRM/SSH) e deve ser sua escolha preferida sempre que possível.
      </AlertBox>

      <h2>Consultando Informações com Get-CimInstance</h2>
      <p>
        Este é o comando principal. Você fornece o nome de uma "Classe" e ele retorna os objetos correspondentes.
      </p>

      <CodeBlock
        title="Consultas básicas de hardware"
        code={`# Informações do Sistema Operacional
Get-CimInstance -ClassName Win32_OperatingSystem | Select-Object Caption, Version, LastBootUpTime

# Informações da BIOS
Get-CimInstance -ClassName Win32_BIOS

# Lista de discos físicos
Get-CimInstance -ClassName Win32_DiskDrive | Select-Object Model, Size, InterfaceType

# Processadores instalados
Get-CimInstance -ClassName Win32_Processor | Select-Object Name, NumberOfCores, MaxClockSpeed`}
      />

      <h2>Filtragem com WQL (WMI Query Language)</h2>
      <p>
        Em vez de baixar todos os objetos e filtrar no PowerShell, você pode usar o parâmetro <code>-Filter</code> ou <code>-Query</code> para filtrar diretamente na fonte (mais rápido).
      </p>

      <CodeBlock
        title="Usando filtros eficientes"
        code={`# Filtro simples
Get-CimInstance -ClassName Win32_Process -Filter "Name = 'notepad.exe'"

# Consulta complexa usando WQL (estilo SQL)
$query = "SELECT * FROM Win32_LogicalDisk WHERE DriveType = 3 AND FreeSpace < 1000000000"
Get-CimInstance -Query $query`}
      />

      <h2>Classes WMI Indispensáveis</h2>
      <p>Aqui estão algumas das classes mais úteis para administradores:</p>
      <ul>
        <li><strong>Win32_Service:</strong> Gerenciamento detalhado de serviços.</li>
        <li><strong>Win32_NetworkAdapterConfiguration:</strong> Configurações de IP, DNS, MAC.</li>
        <li><strong>Win32_ComputerSystem:</strong> Memória RAM total, fabricante do PC, domínio.</li>
        <li><strong>Win32_Product:</strong> Softwares instalados (cuidado: lento para consultar).</li>
        <li><strong>Win32_QuickFixEngineering:</strong> Atualizações (Hotfixes) do Windows.</li>
      </ul>

      <h2>Executando Métodos</h2>
      <p>Algumas classes CIM não apenas fornecem dados, mas também permitem realizar ações, como encerrar processos ou alterar configurações.</p>

      <CodeBlock
        title="Invocando métodos"
        code={`# Exemplo: Encerrar um processo via WMI/CIM
$processo = Get-CimInstance -ClassName Win32_Process -Filter "Name = 'calc.exe'"
Invoke-CimMethod -InputObject $processo -MethodName "Terminate"

# Exemplo: Mudar o nome do computador
$cs = Get-CimInstance -ClassName Win32_ComputerSystem
Invoke-CimMethod -InputObject $cs -MethodName "Rename" -Arguments @{ Name = "NovoNome-PC" }`}
      />

      <h2>Explorando Classes (Descoberta)</h2>
      <p>Não sabe o nome da classe? Você pode listar todas as disponíveis.</p>

      <CodeBlock
        title="Descobrindo novas classes"
        code={`# Listar classes relacionadas a 'disk'
Get-CimClass -ClassName *disk*

# Ver quais métodos e propriedades uma classe específica possui
Get-CimClass -ClassName Win32_Service | Select-Object -ExpandProperty CimClassMethods
Get-CimClass -ClassName Win32_Service | Select-Object -ExpandProperty CimClassProperties`}
      />

      <AlertBox type="warning" title="Win32_Product">
        Evite usar <code>Get-CimInstance Win32_Product</code> em massa. Essa consulta dispara uma verificação de consistência do Windows Installer em cada aplicativo instalado, o que é extremamente lento e gera logs de eventos desnecessários.
      </AlertBox>

      <h2>CIM Sessions (Gerenciamento Remoto)</h2>
      <p>Uma das maiores vantagens do CIM é a facilidade de criar sessões persistentes para gerenciar múltiplos servidores simultaneamente.</p>

      <CodeBlock
        title="Gerenciamento remoto"
        code={`# Criar uma sessão com um servidor remoto
$sessao = New-CimSession -ComputerName "Servidor01"

# Usar a sessão para consultar dados
Get-CimInstance -CimSession $sessao -ClassName Win32_OperatingSystem

# Fechar a sessão
Remove-CimSession $sessao`}
      />

      <AlertBox type="success" title="Dica Profissional">
        As propriedades de data no WMI/CIM vêm em um formato estranho (ex: 20231027...). O PowerShell converte isso automaticamente para <code>DateTime</code> quando você usa <code>Get-CimInstance</code>, facilitando muito a vida em comparação com o antigo <code>Get-WmiObject</code>.
      </AlertBox>
    </PageContainer>
  );
}
