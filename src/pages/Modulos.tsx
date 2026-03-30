import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Modulos() {
  return (
    <PageContainer
      title="Módulos e Perfil"
      subtitle="Organize seu código em pacotes reutilizáveis e personalize seu ambiente de trabalho."
      difficulty="intermediario"
      timeToRead="25 min"
    >
      <p>
        Módulos são a unidade básica de compartilhamento de código no PowerShell. Eles permitem agrupar funções, variáveis, aliases e recursos em um único pacote que pode ser facilmente distribuído, versionado e importado. Dominar módulos é o que separa scripts avulsos de automações profissionais de nível enterprise.
      </p>

      <h2>Gerenciando Módulos</h2>
      <p>
        O PowerShell vem com centenas de módulos pré-instalados, mas você pode adicionar muito mais através da PowerShell Gallery (PSGallery) — o repositório central da comunidade.
      </p>

      <CodeBlock
        title="Comandos essenciais de módulos"
        language="powershell"
        code={`# Listar todos os módulos carregados na sessão atual
Get-Module

# Listar todos os módulos instalados no sistema (em todos os PSModulePaths)
Get-Module -ListAvailable

# Buscar um módulo específico instalado
Get-Module -ListAvailable -Name "*Azure*"

# Importar um módulo manualmente (normalmente é automático no PS 3.0+)
Import-Module -Name ActiveDirectory -Force -Verbose

# Remover um módulo da sessão atual (não deleta do disco)
Remove-Module -Name NetTCPIP

# Ver os comandos exportados por um módulo
Get-Command -Module ActiveDirectory | Select-Object Name, CommandType

# Ver detalhes de um módulo (versão, autor, dependências)
Get-Module -Name PSReadLine | Format-List *`}
      />

      <h2>Descobrindo e Instalando Módulos da Gallery</h2>

      <CodeBlock
        title="Usando a PowerShell Gallery"
        language="powershell"
        code={`# Procurar módulos por nome ou tags
Find-Module -Name "*SQL*"
Find-Module -Tag "ActiveDirectory", "Windows"
Find-Module -Name "ImportExcel" | Select-Object Name, Version, Description

# Instalar um módulo da Gallery
Install-Module -Name Az -Scope CurrentUser -AllowClobber

# Instalar uma versão específica
Install-Module -Name Pester -RequiredVersion 5.4.0 -Force

# Instalar sem confirmação (útil em automações/CI)
Install-Module -Name PSScriptAnalyzer -Scope CurrentUser -Force -Confirm:$false

# Atualizar um módulo para a versão mais recente
Update-Module -Name ImportExcel

# Atualizar todos os módulos instalados pelo usuário de uma vez
Get-InstalledModule | Update-Module -Force

# Desinstalar um módulo
Uninstall-Module -Name OldModule -AllVersions`}
      />

      <AlertBox type="info" title="PSModulePath">
        O PowerShell procura módulos automaticamente nos caminhos definidos em <code>$env:PSModulePath</code>. Geralmente inclui:
        <ul style={{marginTop: '0.5rem'}}>
          <li><code>C:\Users\Você\Documents\PowerShell\Modules</code> (usuário)</li>
          <li><code>C:\Program Files\PowerShell\7\Modules</code> (sistema, PS 7)</li>
          <li><code>C:\Windows\System32\WindowsPowerShell\v1.0\Modules</code> (legado)</li>
        </ul>
        Coloque seus módulos personalizados na pasta do usuário para não precisar de privilégio de administrador.
      </AlertBox>

      <h2>Criando seu Próprio Módulo</h2>
      <p>
        Um módulo básico consiste em um arquivo <code>.psm1</code> contendo suas funções. Para módulos profissionais, usamos também um manifesto <code>.psd1</code> que define metadados, dependências e controle de exportação.
      </p>

      <CodeBlock
        title="Estrutura de um módulo profissional"
        language="powershell"
        code={`# Estrutura de pasta recomendada:
# MeuModulo/
# ├── MeuModulo.psm1        (código principal)
# ├── MeuModulo.psd1        (manifesto — metadados)
# ├── Public/               (funções exportadas)
# │   ├── Get-Relatorio.ps1
# │   └── Send-AlertaEmail.ps1
# └── Private/              (funções internas — não exportadas)
#     └── Format-Dados.ps1

# MeuModulo.psm1 — Carrega e exporta funções organizadas em pastas
$Public  = Get-ChildItem "$PSScriptRoot\\Public\\*.ps1"  -ErrorAction SilentlyContinue
$Private = Get-ChildItem "$PSScriptRoot\\Private\\*.ps1" -ErrorAction SilentlyContinue

foreach ($funcao in ($Public + $Private)) {
    try {
        . $funcao.FullName
    } catch {
        Write-Error "Falha ao importar $($funcao.Name): $_"
    }
}

# Exporta APENAS as funções da pasta Public
Export-ModuleMember -Function $Public.BaseName -Alias *`}
      />

      <CodeBlock
        title="Gerando o manifesto do módulo (MeuModulo.psd1)"
        language="powershell"
        code={`# Criar um manifesto profissional automaticamente
New-ModuleManifest -Path ".\\MeuModulo\\MeuModulo.psd1"  -RootModule "MeuModulo.psm1"  -ModuleVersion "1.2.0"  -Author "Seu Nome"  -CompanyName "Empresa Ltda"  -Description "Automações internas de TI para Windows Server"  -PowerShellVersion "5.1"  -RequiredModules @("ActiveDirectory")  -FunctionsToExport @("Get-Relatorio", "Send-AlertaEmail")  -Tags @("Windows", "ActiveDirectory", "Automacao")  -ProjectUri "https://github.com/empresa/MeuModulo"

# Publicar na Gallery (requer conta na PowerShell Gallery)
Publish-Module -Path ".\\MeuModulo" -NuGetApiKey "sua_api_key"`}
      />

      <h2>O Perfil do PowerShell ($PROFILE)</h2>
      <p>
        O <code>$PROFILE</code> é um script que o PowerShell executa automaticamente toda vez que você abre o terminal. É o lugar perfeito para definir aliases favoritos, funções utilitárias, mudanças visuais e importações de módulos.
      </p>

      <CodeBlock
        title="Configurando um perfil completo e profissional"
        language="powershell"
        code={`# Há 4 perfis por host (CurrentUser/AllUsers x CurrentHost/AllHosts)
$PROFILE                    # CurrentUser, CurrentHost (o mais comum)
$PROFILE.AllUsersAllHosts   # Afeta TODOS os usuários e hosts

# Verificar o caminho e criar o arquivo se não existir
if (!(Test-Path $PROFILE)) {
    New-Item -ItemType File -Path $PROFILE -Force
}

# Editar no VSCode
code $PROFILE

# Exemplo de conteúdo rico para o $PROFILE:

# 1. Importar módulos úteis na inicialização
Import-Module PSReadLine
Import-Module Terminal-Icons

# 2. Configurar PSReadLine para previsão de comandos
Set-PSReadLineOption -PredictionSource History
Set-PSReadLineOption -PredictionViewStyle ListView
Set-PSReadLineKeyHandler -Key UpArrow   -Function HistorySearchBackward
Set-PSReadLineKeyHandler -Key DownArrow -Function HistorySearchForward

# 3. Aliases personalizados
Set-Alias -Name "g"   -Value "git"
Set-Alias -Name "k"   -Value "kubectl"
Set-Alias -Name "tf"  -Value "terraform"
Set-Alias -Name "np"  -Value "notepad"

# 4. Funções rápidas do dia a dia
function which { Get-Command $args[0] | Select-Object -ExpandProperty Source }
function touch { New-Item -ItemType File -Path $args[0] -Force }
function reload { . $PROFILE; Write-Host "Perfil recarregado!" -ForegroundColor Green }
function .. { Set-Location .. }
function ... { Set-Location ..\.. }

# 5. Prompt personalizado com informações de Git
function prompt {
    $local = Split-Path -Leaf (Get-Location)
    $hora  = Get-Date -Format "HH:mm"
    $branch = git branch --show-current 2>$null
    $gitInfo = if ($branch) { " ($branch)" } else { "" }
    "\`e[32m[$hora]\`e[0m \`e[36m$local\`e[33m$gitInfo\`e[0m PS> "
}`}
      />

      <AlertBox type="warning" title="Quatro tipos de perfil">
        Existem 4 perfis baseados em <strong>usuário</strong> (CurrentUser/AllUsers) e <strong>host</strong> (CurrentHost/AllHosts). A variável <code>$PROFILE</code> sozinha aponta para o "Usuário Atual, Host Atual". Para configurações que se aplicam a todos os hosts (terminal, VS Code, ISE), use <code>$PROFILE.CurrentUserAllHosts</code>.
      </AlertBox>

      <h2>Repositórios Corporativos Internos</h2>

      <CodeBlock
        title="Gerenciando repositórios internos"
        language="powershell"
        code={`# Registrar um repositório de rede interna da empresa
Register-PSRepository -Name "InternalRepo"  -SourceLocation "\\\\servidor\\PSGallery"  -PublishLocation "\\\\servidor\\PSGallery\\publish"  -InstallationPolicy Trusted

# Listar repositórios disponíveis
Get-PSRepository

# Instalar módulo do repositório interno
Install-Module -Name AutomacaoTI -Repository InternalRepo

# Publicar seu módulo no repo interno
Publish-Module -Name MeuModulo -Repository InternalRepo -NuGetApiKey "interna"

# Remover repositório quando não precisar mais
Unregister-PSRepository -Name "InternalRepo"`}
      />

      <AlertBox type="success" title="Dica: Organização de Módulos">
        Ao criar módulos corporativos, adote um prefixo padrão para suas funções (ex: <code>BRT-</code> para "Brasil TI"). Isso evita colisões com cmdlets nativos e fica claro que é um módulo interno: <code>BRT-Get-ServidoresAtivos</code>, <code>BRT-Send-AlertaEquipe</code>. Use o <code>PSScriptAnalyzer</code> para verificar boas práticas automaticamente.
      </AlertBox>
    </PageContainer>
  );
}
