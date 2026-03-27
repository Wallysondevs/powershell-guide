import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Pacotes() {
  return (
    <PageContainer
      title="Gerenciamento de Pacotes"
      subtitle="Instale e atualize softwares e módulos de forma automatizada com WinGet, Chocolatey e PowerShellGet."
      difficulty="iniciante"
      timeToRead="15 min"
    >
      <p>
        Gerenciar software manualmente através de downloads e instaladores ".exe" é coisa do passado. O PowerShell oferece ferramentas poderosas para gerenciar o ciclo de vida de aplicativos e bibliotecas diretamente pela linha de comando.
      </p>

      <h2>WinGet (Windows Package Manager)</h2>
      <p>
        O WinGet é o gerenciador de pacotes oficial da Microsoft, incluído nativamente no Windows 10 e 11. Ele é ideal para instalar aplicativos desktop (VSCode, Chrome, Spotify, etc).
      </p>

      <CodeBlock
        title="Usando WinGet"
        code={`# Procurar um aplicativo
winget search "Visual Studio Code"

# Instalar um aplicativo (usando o ID para precisão)
winget install Microsoft.VisualStudioCode

# Listar todos os softwares instalados no PC
winget list

# Atualizar todos os aplicativos instalados que possuem nova versão
winget upgrade --all

# Remover um aplicativo
winget uninstall Microsoft.VisualStudioCode`}
      />

      <AlertBox type="info" title="WinGet Export/Import">
        Você pode exportar a lista de todos os seus aplicativos instalados para um arquivo JSON usando <code>winget export -o lista.json</code> e depois usá-lo para instalar tudo de novo em outro PC com <code>winget import -i lista.json</code>.
      </AlertBox>

      <h2>Chocolatey</h2>
      <p>
        O Chocolatey é o gerenciador de pacotes da comunidade mais popular para Windows. Ele possui um repositório vasto e é muito utilizado em ambientes corporativos e scripts de automação.
      </p>

      <CodeBlock
        title="Usando Chocolatey (choco)"
        code={`# Instalar o Chocolatey (via PowerShell admin)
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Instalar pacotes
choco install git nodejs docker-desktop -y

# Verificar atualizações pendentes
choco outdated

# Atualizar tudo
choco upgrade all -y`}
      />

      <h2>PowerShellGet (Módulos)</h2>
      <p>
        Para gerenciar as bibliotecas e extensões do próprio PowerShell, usamos o módulo <code>PowerShellGet</code>. Ele interage principalmente com a <strong>PowerShell Gallery</strong>.
      </p>

      <CodeBlock
        title="Gerenciando Módulos do PowerShell"
        code={`# Procurar módulos
Find-Module -Name "SqlServer"

# Instalar um módulo para o usuário atual
Install-Module -Name PSReadLine -Scope CurrentUser -Force

# Ver o que está instalado via PowerShellGet
Get-InstalledModule

# Desinstalar um módulo
Uninstall-Module -Name NomeDoModulo`}
      />

      <h2>NuGet e Outros Provedores</h2>
      <p>
        O PowerShell usa o framework <code>PackageManagement</code> (também conhecido como OneGet) para unificar diferentes gerenciadores sob comandos comuns.
      </p>

      <CodeBlock
        title="Comandos unificados"
        code={`# Listar provedores de pacotes disponíveis (NuGet, Chocolatey, WinGet, msi, etc)
Get-PackageProvider

# Instalar o provedor NuGet (necessário para a maioria dos módulos)
Install-PackageProvider -Name NuGet -MinimumVersion 2.8.5.201 -Force

# Buscar um pacote em qualquer provedor
Find-Package -Name "Python"`}
      />

      <AlertBox type="warning" title="Escopo de Instalação">
        Ao usar <code>Install-Module</code> ou <code>Install-Package</code>, se você não tiver privilégios de Administrador, sempre use o parâmetro <code>-Scope CurrentUser</code>.
      </AlertBox>

      <h2>Automação de Ambiente (Setup Script)</h2>
      <p>
        Um dos maiores benefícios desses gerenciadores é criar um script que configura toda a sua máquina de trabalho em minutos.
      </p>

      <CodeBlock
        title="Exemplo de script de setup"
        code={`# Script de Setup Rápido
Write-Host "Iniciando instalação de ferramentas dev..." -ForegroundColor Cyan

# Instalação via WinGet
winget install Microsoft.WindowsTerminal
winget install Git.Git
winget install Docker.DockerDesktop

# Instalação de módulos PS
Install-Module -Name oh-my-posh -Scope CurrentUser -Force
Install-Module -Name Terminal-Icons -Scope CurrentUser -Force

Write-Host "Ambiente configurado com sucesso!" -ForegroundColor Green`}
      />

      <AlertBox type="success" title="Dica: Scoop">
        Para desenvolvedores que preferem instalações que não exigem privilégios de Admin e não "sujam" o registro do Windows, vale a pena conhecer o <strong>Scoop</strong> (scoop.sh), outro gerenciador focado em ferramentas portáteis.
      </AlertBox>
    </PageContainer>
  );
}
