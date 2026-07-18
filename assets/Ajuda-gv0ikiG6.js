import{n as e,t}from"./CodeBlock-BuNVzmc1.js";import{t as n}from"./AlertBox-BFckEFwP.js";import{a as r}from"./index-Cqr-t4Fn.js";var i=r();function a(){return(0,i.jsxs)(e,{title:`O Sistema de Ajuda`,subtitle:`Aprenda a descobrir comandos, parâmetros e exemplos sem precisar do Google.`,difficulty:`iniciante`,timeToRead:`15 min`,children:[(0,i.jsxs)(`p`,{children:[`A maior vantagem do PowerShell é que ele é `,(0,i.jsx)(`strong`,{children:`auto-documentado`}),`. Você não precisa decorar milhares de flags. Se você dominar os três cmdlets de descoberta, conseguirá aprender qualquer módulo novo em minutos — sem sair do terminal.`]}),(0,i.jsx)(`h2`,{children:`O Trio de Ouro da Descoberta`}),(0,i.jsxs)(`ol`,{className:`space-y-4 my-6`,children:[(0,i.jsxs)(`li`,{children:[(0,i.jsx)(`strong`,{children:`Get-Command:`}),` "O que eu posso fazer?" — Lista todos os comandos disponíveis no sistema.`]}),(0,i.jsxs)(`li`,{children:[(0,i.jsx)(`strong`,{children:`Get-Help:`}),` "Como eu uso isso?" — Exibe o manual completo de um comando com exemplos reais.`]}),(0,i.jsxs)(`li`,{children:[(0,i.jsx)(`strong`,{children:`Get-Member:`}),` "O que esse comando me devolve?" — Mostra as propriedades e métodos do objeto retornado.`]})]}),(0,i.jsx)(`hr`,{className:`my-8 opacity-20`}),(0,i.jsx)(`h2`,{children:`1. Get-Command: Encontrando Cmdlets`}),(0,i.jsxs)(`p`,{children:[`O `,(0,i.jsx)(`code`,{children:`Get-Command`}),` pesquisa por verbos, substantivos ou padrões em todos os módulos instalados — inclusive os ainda não carregados na sessão.`]}),(0,i.jsx)(t,{title:`Buscando comandos de forma avançada`,language:`powershell`,code:`# Listar todos os comandos que lidam com 'Process'
Get-Command *Process*

# Listar comandos que usam o verbo 'Restart'
Get-Command -Verb Restart

# Listar comandos que lidam com o substantivo 'Service'
Get-Command -Noun Service

# Buscar comandos de um módulo específico
Get-Command -Module NetTCPIP
Get-Command -Module ActiveDirectory

# Descobrir qual o executável real por trás de um alias
Get-Command ls      # → Get-ChildItem
Get-Command dir     # → Get-ChildItem

# Verificar o tipo de um comando (função, alias, cmdlet, aplicativo externo)
Get-Command notepad | Select-Object Name, CommandType, Source

# Encontrar onde um executável está no PATH
Get-Command python | Select-Object -ExpandProperty Source`}),(0,i.jsx)(`h2`,{children:`2. Get-Help: O Manual Completo`}),(0,i.jsx)(`p`,{children:`Ao contrário de outros shells, a ajuda do PowerShell é estruturada, rica em exemplos e pode ser filtrada por seção.`}),(0,i.jsxs)(n,{type:`warning`,title:`Atualize sua ajuda primeiro!`,children:[`A documentação detalhada não vem instalada por padrão para economizar espaço. Execute o comando abaixo como Administrador uma vez para baixar tudo:`,(0,i.jsx)(`code`,{className:`block mt-2 font-mono`,children:`Update-Help -Force -ErrorAction SilentlyContinue`})]}),(0,i.jsx)(t,{title:`Usando Get-Help em todos os níveis`,language:`powershell`,code:`# Ajuda básica — sinopse e sintaxe
Get-Help Get-Service

# Ajuda com exemplos práticos (o mais útil no dia a dia!)
Get-Help Get-Service -Examples

# Ajuda completa — detalhes de cada parâmetro e tipo aceito
Get-Help Get-Service -Full

# Mostrar apenas os parâmetros e suas descrições
Get-Help Get-Service -Parameter *

# Informações sobre um parâmetro específico
Get-Help Get-Service -Parameter Name

# Abrir a documentação oficial no navegador (requer internet)
Get-Help Get-Service -Online

# Mostrar ajuda em uma janela separada (apenas Windows)
Get-Help Get-Service -ShowWindow

# Buscar ajuda sobre um conceito (não apenas cmdlets)
Get-Help about_*          # Lista todos os tópicos conceituais
Get-Help about_Pipeline   # Explica o pipeline em detalhes
Get-Help about_Operators  # Todos os operadores do PS`}),(0,i.jsx)(`h3`,{children:`Entendendo a Sintaxe da Ajuda`}),(0,i.jsxs)(`p`,{children:[`Ao ler a saída de `,(0,i.jsx)(`code`,{children:`Get-Help`}),`, você verá colchetes `,(0,i.jsx)(`code`,{children:`[]`}),`. Eles significam coisas diferentes dependendo de onde aparecem:`]}),(0,i.jsxs)(`ul`,{children:[(0,i.jsxs)(`li`,{children:[(0,i.jsx)(`code`,{children:`[-Name] <string[]>`}),` — O nome do parâmetro está em colchetes: é `,(0,i.jsx)(`strong`,{children:`posicional`}),` (pode omitir `,(0,i.jsx)(`code`,{children:`-Name`}),` e passar o valor direto).`]}),(0,i.jsxs)(`li`,{children:[(0,i.jsx)(`code`,{children:`<string[]>`}),` — O `,(0,i.jsx)(`code`,{children:`[]`}),` após o tipo indica que aceita `,(0,i.jsx)(`strong`,{children:`múltiplos valores`}),` (um array).`]}),(0,i.jsxs)(`li`,{children:[(0,i.jsx)(`code`,{children:`[[-Name] <string>]`}),` — Todo o bloco em colchetes: parâmetro `,(0,i.jsx)(`strong`,{children:`opcional`}),`.`]}),(0,i.jsxs)(`li`,{children:[(0,i.jsx)(`code`,{children:`-Switch`}),` — Parâmetro sem valor: é uma `,(0,i.jsx)(`strong`,{children:`flag`}),` (presente = $true, ausente = $false).`]})]}),(0,i.jsx)(t,{title:`Lendo a sintaxe corretamente`,language:`powershell`,code:`# Get-ChildItem tem este parâmetro: [[-Path] <string[]>]
# Isso significa:
# 1. -Path é POSICIONAL (não precisa escrever -Path)
# 2. Aceita MÚLTIPLOS caminhos (array de strings)
# 3. É OPCIONAL (tem um valor padrão — a pasta atual)

# Todas as formas abaixo são equivalentes:
Get-ChildItem -Path "C:\\Windows"
Get-ChildItem "C:\\Windows"              # posicional
Get-ChildItem "C:\\Windows", "C:\\Temp"  # múltiplos valores`}),(0,i.jsx)(`h2`,{children:`3. Get-Member: Explorando Objetos`}),(0,i.jsxs)(`p`,{children:[`Como o PowerShell passa `,(0,i.jsx)(`strong`,{children:`objetos`}),` pelo pipeline, você precisa saber quais "peças" compõem esses objetos para poder filtrar, formatar e agir sobre eles com precisão.`]}),(0,i.jsx)(t,{title:`Descobrindo propriedades e métodos de objetos`,language:`powershell`,code:`# Quais informações um objeto de Serviço possui?
Get-Service | Get-Member

# Filtrar apenas por tipo de membro
Get-Service | Get-Member -MemberType Property     # Apenas dados/propriedades
Get-Service | Get-Member -MemberType Method       # Apenas ações/métodos
Get-Service | Get-Member -MemberType ScriptMethod # Métodos adicionados pelo PS

# Fluxo de descoberta típico:
# Passo 1: Saber o que o objeto tem
Get-Service | Get-Member

# Passo 2: Usar a propriedade descoberta (ex: 'Status')
Get-Service | Where-Object Status -eq "Running"

# Passo 3: Invocar um método descoberto (ex: 'Stop()')
(Get-Service -Name "Spooler").Stop()

# Ver o tipo real do objeto
Get-Service | ForEach-Object { $_.GetType().FullName }
# System.ServiceProcess.ServiceController`}),(0,i.jsx)(`h2`,{children:`4. Show-Command: Ajuda Visual Interativa`}),(0,i.jsxs)(`p`,{children:[`Pouco conhecido mas extremamente útil para iniciantes: `,(0,i.jsx)(`code`,{children:`Show-Command`}),` abre uma janela gráfica com todos os parâmetros de um cmdlet, permitindo que você preencha os campos e gere o comando.`]}),(0,i.jsx)(t,{title:`Interface gráfica para montar comandos`,language:`powershell`,code:`# Abrir a janela gráfica para Get-EventLog
Show-Command Get-EventLog

# Abrir para qualquer cmdlet
Show-Command Invoke-Command
Show-Command Send-MailMessage

# Sem argumento — abre um catálogo de TODOS os comandos
Show-Command`}),(0,i.jsx)(`h2`,{children:`5. O Parâmetro -? (Atalho Rápido)`}),(0,i.jsxs)(`p`,{children:[`Se você estiver com pressa, adicione `,(0,i.jsx)(`code`,{children:`-?`}),` ao final de qualquer comando para ver uma ajuda rápida e sintaxe sem precisar do `,(0,i.jsx)(`code`,{children:`Get-Help`}),`.`]}),(0,i.jsx)(t,{language:`powershell`,code:`Get-Process -?
Invoke-WebRequest -?
New-Item -?`}),(0,i.jsx)(`h2`,{children:`Fluxo de Aprendizagem de um Módulo Novo`}),(0,i.jsx)(t,{title:`Como dominar qualquer módulo em 5 minutos`,language:`powershell`,code:`# Exemplo: Aprender o módulo de DNS do Windows Server

# 1. Quais comandos existem?
Get-Command -Module DnsServer

# 2. O que o comando principal faz?
Get-Help Get-DnsServerResourceRecord -Examples

# 3. Que tipo de objeto ele retorna?
Get-DnsServerResourceRecord -ZoneName "empresa.local" | Get-Member

# 4. Usar o que descobrimos
Get-DnsServerResourceRecord -ZoneName "empresa.local" |
    Where-Object RecordType -eq "A" |
    Select-Object HostName, TimeToLive, RecordData

# 5. O mesmo padrão funciona para QUALQUER módulo!
# Azure, Active Directory, Exchange, Kubernetes (kubectl wrapping), etc.`}),(0,i.jsxs)(n,{type:`success`,title:`Conselho de Especialista`,children:[`Desenvolva o hábito de sempre rodar `,(0,i.jsx)(`code`,{children:`| Get-Member`}),` quando um comando retornar algo inesperado. Entender o tipo do objeto que você está manipulando resolve 90% das dúvidas de filtragem e formatação — sem precisar pesquisar na internet.`]})]})}export{a as default};