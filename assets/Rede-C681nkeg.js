import{n as e,t}from"./CodeBlock-DVOG-hPm.js";import{t as n}from"./AlertBox-q8pQIQ07.js";import{a as r}from"./index-D0tfvO9Z.js";var i=r();function a(){return(0,i.jsxs)(e,{title:`Rede e Conectividade`,subtitle:`Dominando ferramentas de diagnóstico, configuração e monitoramento de rede no PowerShell.`,difficulty:`intermediario`,timeToRead:`20 min`,children:[(0,i.jsx)(`p`,{children:`O PowerShell oferece um conjunto robusto de cmdlets para gerenciar quase todos os aspectos da conectividade de rede no Windows e, em muitos casos, no Linux/macOS. Desde simples testes de ping até a configuração detalhada de adaptadores e regras de firewall, você pode automatizar tarefas que anteriormente exigiam ferramentas externas ou interfaces gráficas complexas.`}),(0,i.jsx)(`h2`,{children:`Testando Conectividade (Ping Moderno)`}),(0,i.jsxs)(`p`,{children:[`O comando clássico `,(0,i.jsx)(`code`,{children:`ping`}),` ainda funciona, mas o PowerShell introduz o `,(0,i.jsx)(`code`,{children:`Test-Connection`}),`, que retorna objetos ricos e é muito mais fácil de usar em scripts.`]}),(0,i.jsx)(t,{title:`Testando a conexão com hosts remotos`,code:`# Teste básico de conectividade (semelhante ao ping)
Test-Connection -ComputerName "google.com"

# Teste silencioso que retorna apenas Booleano ($true/$false)
# Útil para estruturas de decisão (if)
if (Test-Connection -ComputerName "8.8.8.8" -Count 1 -Quiet) {
    Write-Host "Internet está acessível" -ForegroundColor Green
}

# Teste com contagem específica e timeout reduzido
Test-Connection -ComputerName "192.168.1.1" -Count 2 -TimeoutSeconds 2
`}),(0,i.jsxs)(n,{type:`info`,title:`Dica de Performance`,children:[`Use o parâmetro `,(0,i.jsx)(`code`,{children:`-Quiet`}),` quando precisar apenas saber se o host está vivo. Isso evita a criação de objetos complexos e torna o script mais rápido.`]}),(0,i.jsx)(`h2`,{children:`Test-NetConnection: O Canivete Suíço`}),(0,i.jsxs)(`p`,{children:[`O `,(0,i.jsx)(`code`,{children:`Test-NetConnection`}),` (ou `,(0,i.jsx)(`code`,{children:`tnc`}),`) é uma das ferramentas mais poderosas para diagnóstico. Ele permite testar portas TCP específicas, realizar traceroutes e obter detalhes da interface.`]}),(0,i.jsx)(t,{title:`Diagnósticos avançados com Test-NetConnection`,code:`# Testar se uma porta específica (ex: HTTP 80) está aberta
Test-NetConnection -ComputerName "web-server" -Port 80

# Realizar um TraceRoute para identificar onde a conexão falha
Test-NetConnection -ComputerName "google.com" -TraceRoute

# Verificar informações detalhadas de roteamento
Test-NetConnection -ComputerName "8.8.8.8" -InformationLevel Detailed
`}),(0,i.jsx)(`h2`,{children:`Resolução de DNS`}),(0,i.jsxs)(`p`,{children:[`Substituindo o antigo `,(0,i.jsx)(`code`,{children:`nslookup`}),`, o `,(0,i.jsx)(`code`,{children:`Resolve-DnsName`}),` oferece suporte completo a diversos tipos de registros DNS e retorna objetos manipuláveis.`]}),(0,i.jsx)(t,{title:`Consultas DNS detalhadas`,code:`# Resolução básica de nome para IP
Resolve-DnsName -Name "github.com"

# Consultar registros específicos (MX para servidores de e-mail)
Resolve-DnsName -Name "microsoft.com" -Type MX

# Consultar registros TXT (comumente usados para verificação de domínio)
Resolve-DnsName -Name "google.com" -Type TXT

# Consultar um servidor DNS específico (ex: DNS do Cloudflare)
Resolve-DnsName -Name "example.com" -Server "1.1.1.1"
`}),(0,i.jsx)(`h2`,{children:`Gerenciando Adaptadores de Rede`}),(0,i.jsxs)(`p`,{children:[`Para listar e configurar as placas de rede físicas e virtuais do sistema, utilizamos o módulo `,(0,i.jsx)(`code`,{children:`NetAdapter`}),`.`]}),(0,i.jsx)(t,{title:`Listagem e status de adaptadores`,code:`# Listar todos os adaptadores de rede
Get-NetAdapter

# Listar apenas adaptadores físicos que estão ativos (Up)
Get-NetAdapter | Where-Object Status -eq "Up"

# Obter estatísticas de tráfego de um adaptador
Get-NetAdapterStatistics -Name "Ethernet"

# Desabilitar e reabilitar um adaptador (requer privilégios de Admin)
Disable-NetAdapter -Name "Wi-Fi" -Confirm:$false
Enable-NetAdapter -Name "Wi-Fi"
`}),(0,i.jsx)(`h2`,{children:`Configuração de IP e Rotas`}),(0,i.jsx)(`p`,{children:`Visualizar e configurar endereços IP, gateways e rotas estáticas diretamente pelo console.`}),(0,i.jsx)(t,{title:`Trabalhando com endereços IP`,code:`# Mostrar todos os endereços IP (IPv4 e IPv6)
Get-NetIPAddress

# Filtrar apenas endereços IPv4 da interface Ethernet
Get-NetIPAddress -InterfaceAlias "Ethernet" -AddressFamily IPv4

# Adicionar um novo endereço IP estático
New-NetIPAddress -InterfaceAlias "Ethernet" -IPAddress "192.168.1.50" -PrefixLength 24 -DefaultGateway "192.168.1.1"

# Configurar servidores DNS para a interface
Set-DnsClientServerAddress -InterfaceAlias "Ethernet" -ServerAddresses ("1.1.1.1", "8.8.8.8")
`}),(0,i.jsx)(n,{type:`warning`,title:`Atenção`,children:`Alterar configurações de IP e DNS exige que o PowerShell seja executado como **Administrador**. Caso contrário, você receberá um erro de acesso negado.`}),(0,i.jsx)(`h2`,{children:`Conexões Ativas (Netstat Moderno)`}),(0,i.jsxs)(`p`,{children:[`O `,(0,i.jsx)(`code`,{children:`Get-NetTCPConnection`}),` é a alternativa ao `,(0,i.jsx)(`code`,{children:`netstat`}),`, permitindo filtrar conexões por porta, estado ou processo proprietário.`]}),(0,i.jsx)(t,{title:`Monitorando conexões TCP`,code:`# Listar todas as conexões TCP estabelecidas
Get-NetTCPConnection -State Established

# Encontrar qual processo está ouvindo em uma porta específica (ex: 8080)
Get-NetTCPConnection -LocalPort 8080 | Select-Object LocalPort, State, OwningProcess

# Resolver o nome do processo associado à conexão
Get-NetTCPConnection -LocalPort 443 | Select-Object LocalPort, State, @{Name="ProcessName"; Expression={(Get-Process -Id $_.OwningProcess).Name}}
`}),(0,i.jsx)(`h2`,{children:`Firewall do Windows`}),(0,i.jsx)(`p`,{children:`Gerenciar regras de entrada e saída sem precisar da interface gráfica do Firewall com Segurança Avançada.`}),(0,i.jsx)(t,{title:`Manipulação de regras de firewall`,code:`# Listar todas as regras de firewall ativas
Get-NetFirewallRule -Enabled True

# Criar uma nova regra para permitir tráfego na porta 8080
New-NetFirewallRule -DisplayName "Permitir App Customizada" -Direction Inbound -LocalPort 8080 -Protocol TCP -Action Allow

# Bloquear um endereço IP específico
New-NetFirewallRule -DisplayName "Bloquear IP Malicioso" -Direction Inbound -RemoteAddress "192.168.1.100" -Action Block

# Remover uma regra existente
Remove-NetFirewallRule -DisplayName "Permitir App Customizada"
`}),(0,i.jsx)(`h2`,{children:`Comparativo: PowerShell vs Comandos Legados`}),(0,i.jsx)(`p`,{children:`Muitos administradores ainda usam comandos antigos. Veja como eles se traduzem para o mundo moderno do PowerShell:`}),(0,i.jsx)(`div`,{className:`overflow-x-auto`,children:(0,i.jsxs)(`table`,{className:`min-w-full border-collapse border border-border`,children:[(0,i.jsx)(`thead`,{children:(0,i.jsxs)(`tr`,{className:`bg-muted`,children:[(0,i.jsx)(`th`,{className:`border border-border p-2 text-left`,children:`Comando Antigo`}),(0,i.jsx)(`th`,{className:`border border-border p-2 text-left`,children:`Cmdlet PowerShell`}),(0,i.jsx)(`th`,{className:`border border-border p-2 text-left`,children:`Vantagem`})]})}),(0,i.jsxs)(`tbody`,{children:[(0,i.jsxs)(`tr`,{children:[(0,i.jsx)(`td`,{className:`border border-border p-2`,children:(0,i.jsx)(`code`,{children:`ping`})}),(0,i.jsx)(`td`,{className:`border border-border p-2`,children:(0,i.jsx)(`code`,{children:`Test-Connection`})}),(0,i.jsx)(`td`,{className:`border border-border p-2`,children:`Retorna objetos, parâmetro -Quiet`})]}),(0,i.jsxs)(`tr`,{children:[(0,i.jsx)(`td`,{className:`border border-border p-2`,children:(0,i.jsx)(`code`,{children:`ipconfig`})}),(0,i.jsx)(`td`,{className:`border border-border p-2`,children:(0,i.jsx)(`code`,{children:`Get-NetIPAddress`})}),(0,i.jsx)(`td`,{className:`border border-border p-2`,children:`Filtragem avançada por propriedades`})]}),(0,i.jsxs)(`tr`,{children:[(0,i.jsx)(`td`,{className:`border border-border p-2`,children:(0,i.jsx)(`code`,{children:`nslookup`})}),(0,i.jsx)(`td`,{className:`border border-border p-2`,children:(0,i.jsx)(`code`,{children:`Resolve-DnsName`})}),(0,i.jsx)(`td`,{className:`border border-border p-2`,children:`Suporte a DNSSEC e objetos ricos`})]}),(0,i.jsxs)(`tr`,{children:[(0,i.jsx)(`td`,{className:`border border-border p-2`,children:(0,i.jsx)(`code`,{children:`netstat`})}),(0,i.jsx)(`td`,{className:`border border-border p-2`,children:(0,i.jsx)(`code`,{children:`Get-NetTCPConnection`})}),(0,i.jsx)(`td`,{className:`border border-border p-2`,children:`Fácil integração com Stop-Process`})]}),(0,i.jsxs)(`tr`,{children:[(0,i.jsx)(`td`,{className:`border border-border p-2`,children:(0,i.jsx)(`code`,{children:`tracert`})}),(0,i.jsx)(`td`,{className:`border border-border p-2`,children:(0,i.jsx)(`code`,{children:`Test-NetConnection -TraceRoute`})}),(0,i.jsx)(`td`,{className:`border border-border p-2`,children:`Unifica vários testes em um comando`})]})]})]})})]})}export{a as default};