import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Rede() {
  return (
    <PageContainer
      title="Rede e Conectividade"
      subtitle="Dominando ferramentas de diagnóstico, configuração e monitoramento de rede no PowerShell."
      difficulty="intermediario"
      timeToRead="20 min"
    >
      <p>
        O PowerShell oferece um conjunto robusto de cmdlets para gerenciar quase todos os aspectos da conectividade de rede no Windows e, em muitos casos, no Linux/macOS. Desde simples testes de ping até a configuração detalhada de adaptadores e regras de firewall, você pode automatizar tarefas que anteriormente exigiam ferramentas externas ou interfaces gráficas complexas.
      </p>

      <h2>Testando Conectividade (Ping Moderno)</h2>
      <p>
        O comando clássico <code>ping</code> ainda funciona, mas o PowerShell introduz o <code>Test-Connection</code>, que retorna objetos ricos e é muito mais fácil de usar em scripts.
      </p>

      <CodeBlock
        title="Testando a conexão com hosts remotos"
        code={`# Teste básico de conectividade (semelhante ao ping)
Test-Connection -ComputerName "google.com"

# Teste silencioso que retorna apenas Booleano ($true/$false)
# Útil para estruturas de decisão (if)
if (Test-Connection -ComputerName "8.8.8.8" -Count 1 -Quiet) {
    Write-Host "Internet está acessível" -ForegroundColor Green
}

# Teste com contagem específica e timeout reduzido
Test-Connection -ComputerName "192.168.1.1" -Count 2 -TimeoutSeconds 2
`}
      />

      <AlertBox type="info" title="Dica de Performance">
        Use o parâmetro <code>-Quiet</code> quando precisar apenas saber se o host está vivo. Isso evita a criação de objetos complexos e torna o script mais rápido.
      </AlertBox>

      <h2>Test-NetConnection: O Canivete Suíço</h2>
      <p>
        O <code>Test-NetConnection</code> (ou <code>tnc</code>) é uma das ferramentas mais poderosas para diagnóstico. Ele permite testar portas TCP específicas, realizar traceroutes e obter detalhes da interface.
      </p>

      <CodeBlock
        title="Diagnósticos avançados com Test-NetConnection"
        code={`# Testar se uma porta específica (ex: HTTP 80) está aberta
Test-NetConnection -ComputerName "web-server" -Port 80

# Realizar um TraceRoute para identificar onde a conexão falha
Test-NetConnection -ComputerName "google.com" -TraceRoute

# Verificar informações detalhadas de roteamento
Test-NetConnection -ComputerName "8.8.8.8" -InformationLevel Detailed
`}
      />

      <h2>Resolução de DNS</h2>
      <p>
        Substituindo o antigo <code>nslookup</code>, o <code>Resolve-DnsName</code> oferece suporte completo a diversos tipos de registros DNS e retorna objetos manipuláveis.
      </p>

      <CodeBlock
        title="Consultas DNS detalhadas"
        code={`# Resolução básica de nome para IP
Resolve-DnsName -Name "github.com"

# Consultar registros específicos (MX para servidores de e-mail)
Resolve-DnsName -Name "microsoft.com" -Type MX

# Consultar registros TXT (comumente usados para verificação de domínio)
Resolve-DnsName -Name "google.com" -Type TXT

# Consultar um servidor DNS específico (ex: DNS do Cloudflare)
Resolve-DnsName -Name "example.com" -Server "1.1.1.1"
`}
      />

      <h2>Gerenciando Adaptadores de Rede</h2>
      <p>
        Para listar e configurar as placas de rede físicas e virtuais do sistema, utilizamos o módulo <code>NetAdapter</code>.
      </p>

      <CodeBlock
        title="Listagem e status de adaptadores"
        code={`# Listar todos os adaptadores de rede
Get-NetAdapter

# Listar apenas adaptadores físicos que estão ativos (Up)
Get-NetAdapter | Where-Object Status -eq "Up"

# Obter estatísticas de tráfego de um adaptador
Get-NetAdapterStatistics -Name "Ethernet"

# Desabilitar e reabilitar um adaptador (requer privilégios de Admin)
Disable-NetAdapter -Name "Wi-Fi" -Confirm:$false
Enable-NetAdapter -Name "Wi-Fi"
`}
      />

      <h2>Configuração de IP e Rotas</h2>
      <p>
        Visualizar e configurar endereços IP, gateways e rotas estáticas diretamente pelo console.
      </p>

      <CodeBlock
        title="Trabalhando com endereços IP"
        code={`# Mostrar todos os endereços IP (IPv4 e IPv6)
Get-NetIPAddress

# Filtrar apenas endereços IPv4 da interface Ethernet
Get-NetIPAddress -InterfaceAlias "Ethernet" -AddressFamily IPv4

# Adicionar um novo endereço IP estático
New-NetIPAddress -InterfaceAlias "Ethernet" -IPAddress "192.168.1.50" -PrefixLength 24 -DefaultGateway "192.168.1.1"

# Configurar servidores DNS para a interface
Set-DnsClientServerAddress -InterfaceAlias "Ethernet" -ServerAddresses ("1.1.1.1", "8.8.8.8")
`}
      />

      <AlertBox type="warning" title="Atenção">
        Alterar configurações de IP e DNS exige que o PowerShell seja executado como **Administrador**. Caso contrário, você receberá um erro de acesso negado.
      </AlertBox>

      <h2>Conexões Ativas (Netstat Moderno)</h2>
      <p>
        O <code>Get-NetTCPConnection</code> é a alternativa ao <code>netstat</code>, permitindo filtrar conexões por porta, estado ou processo proprietário.
      </p>

      <CodeBlock
        title="Monitorando conexões TCP"
        code={`# Listar todas as conexões TCP estabelecidas
Get-NetTCPConnection -State Established

# Encontrar qual processo está ouvindo em uma porta específica (ex: 8080)
Get-NetTCPConnection -LocalPort 8080 | Select-Object LocalPort, State, OwningProcess

# Resolver o nome do processo associado à conexão
Get-NetTCPConnection -LocalPort 443 | Select-Object LocalPort, State, @{Name="ProcessName"; Expression={(Get-Process -Id $_.OwningProcess).Name}}
`}
      />

      <h2>Firewall do Windows</h2>
      <p>
        Gerenciar regras de entrada e saída sem precisar da interface gráfica do Firewall com Segurança Avançada.
      </p>

      <CodeBlock
        title="Manipulação de regras de firewall"
        code={`# Listar todas as regras de firewall ativas
Get-NetFirewallRule -Enabled True

# Criar uma nova regra para permitir tráfego na porta 8080
New-NetFirewallRule -DisplayName "Permitir App Customizada" -Direction Inbound -LocalPort 8080 -Protocol TCP -Action Allow

# Bloquear um endereço IP específico
New-NetFirewallRule -DisplayName "Bloquear IP Malicioso" -Direction Inbound -RemoteAddress "192.168.1.100" -Action Block

# Remover uma regra existente
Remove-NetFirewallRule -DisplayName "Permitir App Customizada"
`}
      />

      <h2>Comparativo: PowerShell vs Comandos Legados</h2>
      <p>
        Muitos administradores ainda usam comandos antigos. Veja como eles se traduzem para o mundo moderno do PowerShell:
      </p>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-border">
          <thead>
            <tr className="bg-muted">
              <th className="border border-border p-2 text-left">Comando Antigo</th>
              <th className="border border-border p-2 text-left">Cmdlet PowerShell</th>
              <th className="border border-border p-2 text-left">Vantagem</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-border p-2"><code>ping</code></td>
              <td className="border border-border p-2"><code>Test-Connection</code></td>
              <td className="border border-border p-2">Retorna objetos, parâmetro -Quiet</td>
            </tr>
            <tr>
              <td className="border border-border p-2"><code>ipconfig</code></td>
              <td className="border border-border p-2"><code>Get-NetIPAddress</code></td>
              <td className="border border-border p-2">Filtragem avançada por propriedades</td>
            </tr>
            <tr>
              <td className="border border-border p-2"><code>nslookup</code></td>
              <td className="border border-border p-2"><code>Resolve-DnsName</code></td>
              <td className="border border-border p-2">Suporte a DNSSEC e objetos ricos</td>
            </tr>
            <tr>
              <td className="border border-border p-2"><code>netstat</code></td>
              <td className="border border-border p-2"><code>Get-NetTCPConnection</code></td>
              <td className="border border-border p-2">Fácil integração com Stop-Process</td>
            </tr>
            <tr>
              <td className="border border-border p-2"><code>tracert</code></td>
              <td className="border border-border p-2"><code>Test-NetConnection -TraceRoute</code></td>
              <td className="border border-border p-2">Unifica vários testes em um comando</td>
            </tr>
          </tbody>
        </table>
      </div>

    </PageContainer>
  );
}
