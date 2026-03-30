import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function PSGallery() {
  return (
    <PageContainer
      title="PowerShell Gallery e Módulos"
      subtitle="Encontre, instale, atualize e publique módulos na PowerShell Gallery com PackageManagement."
      difficulty="iniciante"
      timeToRead="20 min"
    >
      <p>
        A PowerShell Gallery (powershellgallery.com) é o repositório oficial de módulos,
        scripts e recursos DSC para PowerShell. Com mais de 10.000 pacotes disponíveis,
        é o ponto de partida para qualquer automação.
      </p>

      <h2>Encontrando e Instalando Módulos</h2>
      <CodeBlock title="Find-Module, Install-Module e Update-Module" code={`# Buscar módulos por palavra-chave
Find-Module -Name "*Azure*"
Find-Module -Tag "Database","SQL"
Find-Module -Command "Get-SqlDatabase"  # Busca por cmdlet específico

# Instalar módulo
Install-Module -Name "SqlServer" -Force -AllowClobber
Install-Module -Name "ImportExcel" -Scope CurrentUser  # Só para o usuário atual
Install-Module -Name "Pester" -Force -SkipPublisherCheck

# Instalar versão específica
Install-Module -Name "Az" -RequiredVersion "11.0.0"

# Atualizar módulos
Update-Module -Name "SqlServer"
Update-Module  # Atualiza TODOS os módulos instalados

# Listar módulos instalados
Get-Module -ListAvailable | Select-Object Name, Version, Path | Sort-Object Name
Get-InstalledModule | Select-Object Name, Version, PublishedDate, Author
`} />

      <h2>Repositórios e Confiança</h2>
      <CodeBlock title="Configurando fontes de módulos" code={`# Listar repositórios configurados
Get-PSRepository

# Confiar na PSGallery (evitar confirmações)
Set-PSRepository -Name "PSGallery" -InstallationPolicy Trusted

# Registrar repositório privado (NuGet feed interno)
Register-PSRepository -Name "RepoEmpresa"  -SourceLocation "https://nexus.empresa.com/repository/ps-hosted/api/v2"  -InstallationPolicy Trusted

# Instalar de repositório específico
Install-Module -Name "MinhaLib" -Repository "RepoEmpresa"

# Desregistrar repositório
Unregister-PSRepository -Name "RepoEmpresa"

# NuGet provider
Install-PackageProvider -Name NuGet -MinimumVersion 2.8.5.201 -Force
`} />

      <h2>Módulos Essenciais para Administradores</h2>
      <CodeBlock title="Módulos mais úteis da PSGallery" code={`# === ADMINISTRAÇÃO DE SISTEMAS ===
Install-Module -Name PSWindowsUpdate    # Windows Update via PS
Install-Module -Name Carbon             # Administração de Windows
Install-Module -Name AutomatedLab       # Labs de teste automatizados

# === DESENVOLVEDOR ===
Install-Module -Name Pester             # Testes automatizados
Install-Module -Name platyPS            # Documentação de módulos
Install-Module -Name PSScriptAnalyzer   # Análise estática de código

# === CLOUD ===
Install-Module -Name Az                 # Azure PowerShell
Install-Module -Name AWS.Tools.Common   # AWS PowerShell Tools
Install-Module -Name GoogleCloud        # Google Cloud

# === PRODUTIVIDADE ===
Install-Module -Name ImportExcel        # Excel sem Office instalado
Install-Module -Name PSSQLite          # SQLite em PowerShell
Install-Module -Name PSReadLine         # Melhor experiência de linha de comando
Install-Module -Name posh-git           # Integração com Git no prompt
Install-Module -Name Terminal-Icons     # Ícones coloridos no terminal

# === SEGURANÇA ===
Install-Module -Name Microsoft.PowerShell.SecretManagement
Install-Module -Name Microsoft.PowerShell.SecretStore

# Instalar múltiplos de uma vez
@("PSScriptAnalyzer","Pester","ImportExcel","posh-git") |
    ForEach-Object { Install-Module $_ -Force -Scope CurrentUser }
`} />

      <h2>Publicando seus Próprios Módulos</h2>
      <CodeBlock title="Criando e publicando um módulo" code={`# Estrutura de um módulo
# MeuModulo/
#   MeuModulo.psd1  (manifesto)
#   MeuModulo.psm1  (código)
#   Public/         (funções públicas)
#   Private/        (funções internas)
#   Tests/          (testes Pester)

# Criar manifesto do módulo
New-ModuleManifest -Path "C:\\Dev\\MeuModulo\\MeuModulo.psd1"  -RootModule "MeuModulo.psm1"  -ModuleVersion "1.0.0"  -Author "Seu Nome"  -Description "Descrição do módulo"  -FunctionsToExport "Get-Dados","Set-Config","Invoke-Processo"  -Tags "Automação","Administração"  -ProjectUri "https://github.com/usuario/MeuModulo"  -LicenseUri "https://github.com/usuario/MeuModulo/blob/main/LICENSE"

# Testar módulo localmente
Import-Module "C:\\Dev\\MeuModulo" -Force
Get-Command -Module MeuModulo

# Publicar na PSGallery
Publish-Module -Path "C:\\Dev\\MeuModulo"  -NuGetApiKey $env:PSGALLERY_API_KEY

# Publicar em repositório privado
Publish-Module -Path "C:\\Dev\\MeuModulo"  -Repository "RepoEmpresa"  -NuGetApiKey "internal-key"
`} />

      <AlertBox type="success" title="PSScriptAnalyzer — Código Limpo">
        Antes de publicar, rode o analisador: <code>Invoke-ScriptAnalyzer -Path . -Recurse</code>.
        Ele detecta problemas de compatibilidade, performance e boas práticas no seu código PowerShell.
      </AlertBox>
    </PageContainer>
  );
}
