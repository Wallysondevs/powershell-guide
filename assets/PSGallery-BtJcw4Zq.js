import{n as e,t}from"./CodeBlock-BuNVzmc1.js";import{t as n}from"./AlertBox-BFckEFwP.js";import{a as r}from"./index-Cqr-t4Fn.js";var i=r();function a(){return(0,i.jsxs)(e,{title:`PowerShell Gallery e Módulos`,subtitle:`Encontre, instale, atualize, crie e publique módulos com PowerShellGet e PSResourceGet.`,difficulty:`iniciante`,timeToRead:`25 min`,children:[(0,i.jsxs)(`p`,{children:[`A PowerShell Gallery (powershellgallery.com) é o repositório oficial de módulos, scripts e recursos DSC para PowerShell. Com mais de 10.000 pacotes disponíveis, é o ponto de partida para qualquer automação. O novo `,(0,i.jsx)(`code`,{children:`PSResourceGet`}),`substitui o `,(0,i.jsx)(`code`,{children:`PowerShellGet`}),` e é mais rápido e confiável.`]}),(0,i.jsx)(`h2`,{children:`Encontrando e Instalando Módulos`}),(0,i.jsx)(t,{title:`Find-Module, Install-Module e Update-Module`,code:`# Buscar módulos por palavra-chave, tag ou cmdlet
  Find-Module -Name "*Azure*"
  Find-Module -Tag "Database","SQL"
  Find-Module -Command "Get-SqlDatabase"  # Busca por cmdlet específico
  Find-Module -Filter "Active Directory"  # Busca geral

  # Instalar módulo (formas diferentes)
  Install-Module -Name "SqlServer" -Force -AllowClobber     # Todo o sistema (admin)
  Install-Module -Name "ImportExcel" -Scope CurrentUser     # Só para o usuário atual
  Install-Module -Name "Pester" -Force -SkipPublisherCheck  # Ignorar verificação do publisher

  # Instalar versão específica e manter versões paralelas
  Install-Module -Name "Az" -RequiredVersion "11.0.0"
  Install-Module -Name "Az" -RequiredVersion "12.0.0" -Force
  Get-InstalledModule -Name "Az" -AllVersions  # Listar todas as versões instaladas

  # Atualizar módulos
  Update-Module -Name "SqlServer"
  Update-Module  # Atualiza TODOS (pode demorar)

  # Listar módulos instalados
  Get-InstalledModule | Select-Object Name, Version, PublishedDate, Author | Sort-Object Name
  Get-Module -ListAvailable | Select-Object Name, Version, Path | Sort-Object Name

  # Desinstalar módulo
  Uninstall-Module -Name "AzureRM" -AllVersions -Force  # Remove todas as versões
  `}),(0,i.jsx)(`h2`,{children:`PSResourceGet — O Novo PowerShellGet`}),(0,i.jsx)(t,{title:`Usando o módulo moderno PSResourceGet (PS7+)`,code:`# Instalar PSResourceGet (substitui PowerShellGet no PS7)
  Install-Module -Name Microsoft.PowerShell.PSResourceGet -Force

  # Buscar recursos
  Find-PSResource -Name "Pester"
  Find-PSResource -Tag "Monitoring","Windows" -Repository PSGallery

  # Instalar com PSResourceGet (mais rápido, melhor resolução de dependências)
  Install-PSResource -Name "ImportExcel" -Scope CurrentUser
  Install-PSResource -Name "Az.Compute" -Version "7.x" -Scope CurrentUser  # Wildcards de versão

  # Listar recursos instalados
  Get-InstalledPSResource | Select-Object Name, Version, Author | Format-Table

  # Atualizar um recurso
  Update-PSResource -Name "ImportExcel"
  Update-PSResource   # Atualiza tudo

  # Salvar módulo localmente (sem instalar — para distribuição offline)
  Save-PSResource -Name "Pester" -Path "C:\\Offline\\Modules"

  # Publicar na PSGallery
  Publish-PSResource -Path "C:\\MeuModulo" -ApiKey $env:PSGALLERY_KEY -Repository PSGallery
  `}),(0,i.jsx)(`h2`,{children:`Repositórios e Confiança`}),(0,i.jsx)(t,{title:`Configurando fontes de módulos`,code:`# Listar repositórios configurados
  Get-PSRepository

  # Confiar na PSGallery (evitar confirmações)
  Set-PSRepository -Name "PSGallery" -InstallationPolicy Trusted

  # Registrar repositório privado (NuGet feed — Nexus, Azure Artifacts, etc.)
  Register-PSRepository \`
    -Name "RepoEmpresa" \`
    -SourceLocation "https://nexus.empresa.com/repository/ps-hosted/api/v2" \`
    -InstallationPolicy Trusted

  # Instalar de repositório privado
  Install-Module -Name "MinhaLib" -Repository "RepoEmpresa"

  # Repositório local (pasta de rede — útil em ambientes offline)
  $pastaRepo = "\\\\servidor\\PSRepo"
  New-Item -ItemType Directory $pastaRepo -Force
  Register-PSRepository -Name "RepoLocal" \`
    -SourceLocation $pastaRepo \`
    -PublishLocation $pastaRepo \`
    -InstallationPolicy Trusted

  # Publicar no repositório local
  Publish-Module -Path "C:\\MeuModulo" -Repository "RepoLocal"

  # Desregistrar repositório
  Unregister-PSRepository -Name "RepoEmpresa"
  `}),(0,i.jsx)(`h2`,{children:`Módulos Essenciais por Categoria`}),(0,i.jsx)(t,{title:`Os módulos mais úteis da PSGallery`,code:`# === ADMINISTRAÇÃO DE SISTEMAS ===
  Install-Module PSWindowsUpdate    # Windows Update via PS
  Install-Module PSReadLine         # Melhor autocompletar no terminal
  Install-Module Terminal-Icons     # Ícones coloridos no terminal (requer Nerd Font)
  Install-Module posh-git           # Integração com Git no prompt

  # === MICROSOFT CLOUD ===
  Install-Module Az                 # Azure PowerShell (todos os serviços)
  Install-Module ExchangeOnlineManagement   # Exchange Online / M365
  Install-Module Microsoft.Graph    # Microsoft Graph API

  # === DESENVOLVEDOR ===
  Install-Module Pester             # Testes automatizados (BDD/TDD)
  Install-Module PSScriptAnalyzer   # Linting e análise estática
  Install-Module platyPS            # Documentação Markdown de módulos
  Install-Module InvokeBuild        # Build system (como Make para PS)

  # === PRODUTIVIDADE ===
  Install-Module ImportExcel        # Excel sem Office instalado!
  Install-Module PSSQLite           # SQLite em PowerShell
  Install-Module SimplySql          # Queries SQL em bancos relacionais

  # === SEGURANÇA ===
  Install-Module Microsoft.PowerShell.SecretManagement
  Install-Module Microsoft.PowerShell.SecretStore
  Install-Module PSFalcon            # Crowdstrike Falcon API

  # === AWS ===
  Install-Module AWS.Tools.Common
  Install-Module AWS.Tools.S3
  Install-Module AWS.Tools.EC2

  # Instalar múltiplos de uma vez
  @("PSScriptAnalyzer","Pester","ImportExcel","posh-git","Terminal-Icons") |
      ForEach-Object { Install-Module $_ -Force -Scope CurrentUser -AllowClobber }
  `}),(0,i.jsx)(`h2`,{children:`Criando e Publicando Módulos`}),(0,i.jsx)(t,{title:`Estrutura completa de um módulo PowerShell`,code:`# Estrutura recomendada de módulo:
  # MeuModulo/
  # ├── MeuModulo.psd1      # Manifesto (metadados)
  # ├── MeuModulo.psm1      # Carregador principal
  # ├── Public/             # Funções exportadas
  # │   ├── Get-Dados.ps1
  # │   └── Set-Config.ps1
  # ├── Private/            # Funções internas
  # │   └── Get-Helper.ps1
  # ├── Tests/              # Testes Pester
  # │   └── MeuModulo.Tests.ps1
  # └── en-US/              # Help em inglês
  #     └── MeuModulo.dll-Help.xml

  # Criar manifesto do módulo
  New-ModuleManifest \`
    -Path "C:\\Dev\\MeuModulo\\MeuModulo.psd1" \`
    -RootModule "MeuModulo.psm1" \`
    -ModuleVersion "1.0.0" \`
    -Author "Seu Nome" \`
    -CompanyName "Empresa" \`
    -Description "Automação de infraestrutura interna" \`
    -PowerShellVersion "5.1" \`
    -FunctionsToExport @("Get-Dados","Set-Config","Invoke-Processo") \`
    -Tags @("Automação","Infraestrutura","Windows") \`
    -ProjectUri "https://github.com/empresa/MeuModulo" \`
    -LicenseUri "https://github.com/empresa/MeuModulo/blob/main/LICENSE"

  # psm1 — carregador que importa todas as funções
  $Public  = @(Get-ChildItem -Path "$PSScriptRoot\\Public\\*.ps1" -ErrorAction SilentlyContinue)
  $Private = @(Get-ChildItem -Path "$PSScriptRoot\\Private\\*.ps1" -ErrorAction SilentlyContinue)
  foreach ($import in @($Public + $Private)) {
      . $import.FullName
  }
  Export-ModuleMember -Function $Public.BaseName

  # Testar localmente
  Import-Module "C:\\Dev\\MeuModulo" -Force
  Get-Command -Module MeuModulo

  # Publicar na PSGallery (requer API Key)
  $apiKey = $env:PSGALLERY_API_KEY  # Nunca hardcode a chave!
  Publish-Module -Path "C:\\Dev\\MeuModulo" -NuGetApiKey $apiKey

  # Pipeline CI/CD — publicar automaticamente
  # (GitHub Actions / Azure Pipelines)
  # Publish-Module -Path . -NuGetApiKey $env:PSGALLERY_KEY -Verbose
  `}),(0,i.jsxs)(n,{type:`info`,title:`PSScriptAnalyzer antes de Publicar`,children:[`Sempre rode `,(0,i.jsx)(`code`,{children:`Invoke-ScriptAnalyzer -Path . -Recurse`}),` antes de publicar seu módulo. Isso verifica problemas de estilo, segurança e compatibilidade. A PSGallery realiza análise automática e pode rejeitar módulos com problemas críticos.`]})]})}export{a as default};