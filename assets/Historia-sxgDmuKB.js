import{n as e,t}from"./CodeBlock-BuNVzmc1.js";import{t as n}from"./AlertBox-BFckEFwP.js";import{a as r}from"./index-Cqr-t4Fn.js";var i=r();function a(){return(0,i.jsxs)(e,{title:`História e Evolução`,subtitle:`Do Monad ao PowerShell 7: a jornada da shell mais poderosa da Microsoft.`,difficulty:`iniciante`,timeToRead:`18 min`,children:[(0,i.jsx)(`p`,{children:`O PowerShell não surgiu do nada. Ele foi o resultado de anos de frustração com as limitações do CMD e a necessidade de uma ferramenta de automação que pudesse competir com os shells Unix, mas mantendo a filosofia de objetos do ecossistema Windows.`}),(0,i.jsx)(`h2`,{children:`O Nascimento: Projeto Monad (2002)`}),(0,i.jsxs)(`p`,{children:[`Em 2002, `,(0,i.jsx)(`strong`,{children:`Jeffrey Snover`}),` — engenheiro da Microsoft — publicou um documento interno chamado `,(0,i.jsx)(`em`,{children:`"Monad Manifesto"`}),`. Ele descrevia uma abordagem radical para automação de sistemas: em vez de passar texto entre comandos (e precisar de `,(0,i.jsx)(`code`,{children:`awk`}),`,`,(0,i.jsx)(`code`,{children:`sed`}),` e `,(0,i.jsx)(`code`,{children:`grep`}),` para extrair informações), os comandos passariam`,(0,i.jsx)(`strong`,{children:` objetos .NET estruturados`}),` uns para os outros.`]}),(0,i.jsxs)(`p`,{children:[`A visão era simples, mas poderosa: para acessar a data de criação de um arquivo, não era preciso "cortar" a 8ª coluna de um texto formatado — bastava acessar a propriedade `,(0,i.jsx)(`code`,{children:`.CreationTime`}),`do objeto arquivo.`]}),(0,i.jsxs)(n,{type:`info`,title:`O Rebaixamento que Virou Revolução`,children:[`Jeffrey Snover foi `,(0,i.jsx)(`strong`,{children:`rebaixado`}),` na Microsoft por sua ideia. Os executivos acreditavam que a empresa não estava no negócio de criar shells — "o futuro era GUI". Anos depois, o PowerShell tornou-se uma das ferramentas mais estratégicas da Microsoft, e Snover foi reconhecido como Technical Fellow — o mais alto nível técnico da empresa.`]}),(0,i.jsx)(`h2`,{children:`O Lançamento: PowerShell 1.0 (2006)`}),(0,i.jsxs)(`p`,{children:[`Após anos como "Monad", o projeto foi lançado como `,(0,i.jsx)(`strong`,{children:`Windows PowerShell`}),` em novembro de 2006, trazendo:`]}),(0,i.jsxs)(`ul`,{children:[(0,i.jsxs)(`li`,{children:[`Padrão `,(0,i.jsx)(`strong`,{children:`Verbo-Substantivo`}),` para todos os cmdlets (`,(0,i.jsx)(`code`,{children:`Get-Process`}),`, `,(0,i.jsx)(`code`,{children:`Stop-Service`}),`...)`]}),(0,i.jsxs)(`li`,{children:[(0,i.jsx)(`strong`,{children:`Objetos no pipeline`}),` em vez de texto`]}),(0,i.jsxs)(`li`,{children:[`Sistema de `,(0,i.jsx)(`strong`,{children:`ajuda estruturada`}),` e pesquisável`]}),(0,i.jsxs)(`li`,{children:[`Integração nativa com o `,(0,i.jsx)(`strong`,{children:`.NET Framework`})]}),(0,i.jsx)(`li`,{children:`Acesso ao WMI, COM e Registry como drives do sistema de arquivos`})]}),(0,i.jsx)(`h2`,{children:`Linha do Tempo de Versões`}),(0,i.jsxs)(`ul`,{children:[(0,i.jsxs)(`li`,{children:[(0,i.jsx)(`strong`,{children:`PS 1.0 (Nov 2006):`}),` Lançamento inicial. Windows XP SP2 e Server 2003. ~130 cmdlets.`]}),(0,i.jsxs)(`li`,{children:[(0,i.jsx)(`strong`,{children:`PS 2.0 (Out 2009):`}),` Windows 7 e Server 2008 R2. PowerShell Remoting (WinRM), ISE e Background Jobs.`]}),(0,i.jsxs)(`li`,{children:[(0,i.jsx)(`strong`,{children:`PS 3.0 (Ago 2012):`}),` Windows 8. Workflow, CIM, auto-descoberta de módulos, 2000+ cmdlets.`]}),(0,i.jsxs)(`li`,{children:[(0,i.jsx)(`strong`,{children:`PS 4.0 (Out 2013):`}),` Desired State Configuration (DSC) — infraestrutura como código.`]}),(0,i.jsxs)(`li`,{children:[(0,i.jsx)(`strong`,{children:`PS 5.0 (Fev 2016):`}),` Classes e enums, PackageManagement, mais OOP.`]}),(0,i.jsxs)(`li`,{children:[(0,i.jsx)(`strong`,{children:`PS 5.1 (Jan 2017):`}),` Versão final do "Windows PowerShell". Ainda no Windows por padrão. Recebe apenas patches de segurança.`]}),(0,i.jsxs)(`li`,{children:[(0,i.jsx)(`strong`,{children:`PS Core 6.0 (Jan 2018):`}),` Reescrito sobre .NET Core. Open-source no GitHub! Linux e macOS.`]}),(0,i.jsxs)(`li`,{children:[(0,i.jsx)(`strong`,{children:`PS 7.0 (Mar 2020):`}),` Operador ternário, pipeline paralelo (`,(0,i.jsx)(`code`,{children:`ForEach-Object -Parallel`}),`), nulo-condicional.`]}),(0,i.jsxs)(`li`,{children:[(0,i.jsx)(`strong`,{children:`PS 7.2 LTS (Nov 2021):`}),` Versão com suporte estendido. .NET 6.`]}),(0,i.jsxs)(`li`,{children:[(0,i.jsx)(`strong`,{children:`PS 7.4 LTS (Nov 2023):`}),` Versão atual. .NET 8. Mais rápido, mais seguro, PSResourceGet.`]})]}),(0,i.jsx)(`h2`,{children:`A Grande Mudança: Open-Source (2016)`}),(0,i.jsxs)(`p`,{children:[`Em agosto de 2016, a Microsoft tornou o PowerShell `,(0,i.jsx)(`strong`,{children:`open-source no GitHub`}),` e o portou para Linux e macOS. Isso marcou o início do "PowerShell Core" — reimplementação sobre .NET Core — e sinalizou a nova Microsoft: colaborativa, multiplataforma e orientada à comunidade.`]}),(0,i.jsxs)(`p`,{children:[`O código-fonte está disponível em `,(0,i.jsx)(`strong`,{children:`github.com/PowerShell/PowerShell`}),` com mais de 40.000 commits, 3.000+ contribuidores externos e lançamentos mensais.`]}),(0,i.jsx)(t,{title:`Verificando sua versão e edição`,code:`# Informações completas da instalação atual
  $PSVersionTable

  # Propriedades mais importantes:
  $PSVersionTable.PSVersion   # Ex: 7.4.1
  $PSVersionTable.PSEdition   # 'Desktop' (5.1) ou 'Core' (7+)
  $PSVersionTable.OS          # Sistema operacional atual
  $PSVersionTable.Platform    # Win32NT, Unix, MacOSX

  # Detectar versão no código (compatibilidade entre PS5 e PS7)
  if ($PSVersionTable.PSVersion.Major -ge 7) {
      Write-Host "PowerShell moderno — todos os recursos disponíveis!" -ForegroundColor Green
  } else {
      Write-Host "Windows PowerShell — compatibilidade limitada." -ForegroundColor Yellow
  }
  `}),(0,i.jsx)(`h2`,{children:`Windows PowerShell 5.1 vs PowerShell 7+`}),(0,i.jsxs)(`div`,{className:`grid grid-cols-1 md:grid-cols-2 gap-4 my-6`,children:[(0,i.jsxs)(`div`,{className:`p-4 border border-border rounded-xl bg-primary/5`,children:[(0,i.jsx)(`h4`,{className:`font-bold text-primary mb-2`,children:`Windows PowerShell (5.1)`}),(0,i.jsxs)(`ul`,{className:`text-sm space-y-1 opacity-80`,children:[(0,i.jsx)(`li`,{children:`• Exclusivo para Windows`}),(0,i.jsx)(`li`,{children:`• Baseado no .NET Framework 4.x`}),(0,i.jsx)(`li`,{children:`• Pré-instalado em todos os PCs Windows`}),(0,i.jsx)(`li`,{children:`• Não recebe novos recursos (modo de manutenção)`}),(0,i.jsx)(`li`,{children:`• Melhor compatibilidade com módulos legados do Windows`}),(0,i.jsxs)(`li`,{children:[`• Executável: `,(0,i.jsx)(`code`,{children:`powershell.exe`})]})]})]}),(0,i.jsxs)(`div`,{className:`p-4 border border-border rounded-xl bg-accent/5`,children:[(0,i.jsx)(`h4`,{className:`font-bold text-accent mb-2`,children:`PowerShell 7+ — Recomendado`}),(0,i.jsxs)(`ul`,{className:`text-sm space-y-1 opacity-80`,children:[(0,i.jsx)(`li`,{children:`• Windows, Linux e macOS`}),(0,i.jsx)(`li`,{children:`• Baseado no .NET 8+ (significativamente mais rápido)`}),(0,i.jsxs)(`li`,{children:[`• Instalação separada (`,(0,i.jsx)(`code`,{children:`winget install Microsoft.PowerShell`}),`)`]}),(0,i.jsx)(`li`,{children:`• Recebe novos recursos continuamente`}),(0,i.jsx)(`li`,{children:`• Operador ternário, pipeline paralelo, null-conditional...`}),(0,i.jsxs)(`li`,{children:[`• Executável: `,(0,i.jsx)(`code`,{children:`pwsh.exe`})]})]})]})]}),(0,i.jsx)(`h2`,{children:`PowerShell e DevOps`}),(0,i.jsx)(`p`,{children:`Com a ascensão do DevOps e da automação de infraestrutura, o PowerShell tornou-se peça-chave no ecossistema Microsoft. Hoje ele é a espinha dorsal de:`}),(0,i.jsxs)(`ul`,{children:[(0,i.jsxs)(`li`,{children:[(0,i.jsx)(`strong`,{children:`Azure Automation`}),` — Runbooks para automação de nuvem`]}),(0,i.jsxs)(`li`,{children:[(0,i.jsx)(`strong`,{children:`Azure DevOps Pipelines`}),` — Tarefas de CI/CD multiplataforma`]}),(0,i.jsxs)(`li`,{children:[(0,i.jsx)(`strong`,{children:`GitHub Actions`}),` — Actions escritas em PowerShell`]}),(0,i.jsxs)(`li`,{children:[(0,i.jsx)(`strong`,{children:`Desired State Configuration (DSC)`}),` — Infraestrutura como código declarativa`]}),(0,i.jsxs)(`li`,{children:[(0,i.jsx)(`strong`,{children:`Windows Admin Center`}),` — Console de administração baseada em PS`]}),(0,i.jsxs)(`li`,{children:[(0,i.jsx)(`strong`,{children:`Ansible (módulo win_*)`}),` — PowerShell como backend de automação Windows`]})]}),(0,i.jsx)(t,{title:`Exemplos de uso moderno em DevOps`,code:`# Azure DevOps Pipeline — tarefa PowerShell
  # azure-pipelines.yml:
  # - task: PowerShell@2
  #   inputs:
  #     script: |
  #       $version = (Get-Content package.json | ConvertFrom-Json).version
  #       Write-Host "##vso[task.setvariable variable=APP_VERSION]$version"

  # GitHub Actions — step com PowerShell
  # .github/workflows/deploy.yml:
  # - name: Deploy
  #   shell: pwsh
  #   run: |
  #     Install-Module Az -Force -Scope CurrentUser
  #     Connect-AzAccount -Identity
  #     ./scripts/deploy.ps1

  # Desired State Configuration — declarar estado desejado
  Configuration ServidorWeb {
      Node "SRV-WEB-01" {
          WindowsFeature IIS {
              Ensure = "Present"
              Name   = "Web-Server"
          }
          File ConteudoWeb {
              Ensure          = "Present"
              Type            = "Directory"
              DestinationPath = "C:\\inetpub\\wwwroot\\app"
          }
      }
  }
  ServidorWeb
  Start-DscConfiguration -Path ".ServidorWeb" -Wait -Verbose
  `}),(0,i.jsx)(`h2`,{children:`Por que PowerShell e não Bash ou CMD?`}),(0,i.jsx)(t,{title:`Comparação prática: filtrar arquivos grandes`,code:`# No Bash — manipulação de texto, frágil com espaços em nomes de arquivo:
  # ls -la | awk '$5 > 1048576 {print $NF}'

  # No CMD — impossível nativamente sem ferramentas externas

  # No PowerShell — objetos reais, seguro, claro e autodescritivo:
  Get-ChildItem | Where-Object { $_.Length -gt 1MB } | Select-Object Name, Length

  # O PS roda em qualquer plataforma:
  # pwsh -Command "Get-ChildItem /var/log | Where-Object Length -gt 1MB"

  # Vantagem fundamental: tipos de dados reais (não strings)
  $tamanho = 5GB          # Um número: 5368709120 (não texto)
  $data    = Get-Date     # Um objeto [DateTime]
  $data.AddDays(30)       # Adicionar 30 dias sem parseamento de string
  (Get-Process).Count     # Um inteiro — sem cortar texto de ls | wc -l
  `}),(0,i.jsxs)(n,{type:`warning`,title:`Compatibilidade de Módulos Legados`,children:[`Alguns módulos antigos de Active Directory, Exchange ou outros produtos Microsoft ainda exigem Windows PowerShell 5.1. O PS 7 tem uma camada de compatibilidade (`,(0,i.jsx)(`code`,{children:`Import-Module -UseWindowsPowerShell`}),`) mas com limitações. Em ambientes corporativos, é comum usar ambos os PowerShells em paralelo.`]}),(0,i.jsxs)(n,{type:`success`,title:`Como instalar o PowerShell 7 agora`,children:[`Via winget (Windows 10+):`,(0,i.jsx)(`code`,{style:{display:`block`,marginTop:`0.5rem`},children:`winget install Microsoft.PowerShell`}),`Após instalado, abra com o comando `,(0,i.jsx)(`code`,{children:`pwsh`}),`. Ele coexiste perfeitamente com o 5.1.`]})]})}export{a as default};