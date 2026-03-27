import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Instalacao() {
  return (
    <PageContainer
      title="Instalação e Configuração"
      subtitle="Prepare seu ambiente no Windows, Linux ou macOS para rodar o PowerShell 7."
      difficulty="iniciante"
      timeToRead="12 min"
    >
      <p>
        Embora o Windows já venha com o Windows PowerShell 5.1 instalado, para aproveitar todo o potencial desta guia você deve instalar a versão mais recente (PowerShell 7+).
      </p>

      <h2>Instalação no Windows</h2>
      <p>
        Existem várias formas de instalar no Windows, mas a mais moderna e recomendada é via <strong>Winget</strong> (Windows Package Manager).
      </p>

      <CodeBlock
        title="Instalando via Terminal (Recomendado)"
        code={`# Procure pela versão mais recente
winget search Microsoft.PowerShell

# Instale a versão estável
winget install --id Microsoft.PowerShell --source winget

# Se preferir a versão Preview (com recursos experimentais)
winget install --id Microsoft.PowerShell.Preview --source winget
`}
      />

      <p>
        Alternativamente, você pode baixar o instalador <code>.msi</code> diretamente do repositório oficial no <a href="https://github.com/PowerShell/PowerShell" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">GitHub</a>.
      </p>

      <h2>Instalação no Linux (Ubuntu/Debian)</h2>
      <p>
        O PowerShell está disponível nos repositórios oficiais da Microsoft para as principais distribuições Linux.
      </p>

      <CodeBlock
        language="bash"
        title="Comandos para Ubuntu 22.04+"
        code={`# Atualize a lista de pacotes e instale dependências
sudo apt-get update
sudo apt-get install -y wget apt-transport-https software-properties-common

# Baixe as chaves do repositório Microsoft
wget -q "https://packages.microsoft.com/config/ubuntu/$(lsb_release -rs)/packages-microsoft-prod.deb"

# Registre as chaves
sudo dpkg -i packages-microsoft-prod.deb

# Instale o PowerShell
sudo apt-get update
sudo apt-get install -y powershell

# Inicie o shell
pwsh
`}
      />

      <h2>Instalação no macOS</h2>
      <p>
        A forma mais simples de instalar no Mac é usando o <strong>Homebrew</strong>.
      </p>

      <CodeBlock
        language="bash"
        title="Usando Homebrew"
        code={`# Instale via cask
brew install --cask powershell

# Para rodar, use o comando:
pwsh
`}
      />

      <h2>Configurando o Ambiente Ideal</h2>
      <p>
        Apenas ter o PowerShell instalado não é o suficiente. Para uma experiência produtiva, você deve configurar duas ferramentas essenciais:
      </p>

      <h3>1. Windows Terminal</h3>
      <p>
        Esqueça aquela janela azul antiga ou o prompt preto do CMD. O <strong>Windows Terminal</strong> é moderno, suporta abas, emojis, aceleração por GPU e múltiplos perfis.
      </p>
      <AlertBox type="info" title="Dica de UI">
        No Windows 11, o Windows Terminal já é o terminal padrão. No Windows 10, você pode instalá-lo via Microsoft Store ou <code>winget install Microsoft.WindowsTerminal</code>.
      </AlertBox>

      <h3>2. Visual Studio Code + Extensão</h3>
      <p>
        O VS Code é o melhor editor para escrever scripts PowerShell.
      </p>
      <ul>
        <li>Instale o VS Code.</li>
        <li>Vá em Extensões (Ctrl+Shift+X) e busque por <strong>"PowerShell"</strong>.</li>
        <li>Instale a extensão oficial da Microsoft. Isso lhe dará IntelliSense (auto-completar), debug e análise de código em tempo real.</li>
      </ul>

      <h2>Ajustando a Política de Execução</h2>
      <p>
        Por segurança, o Windows bloqueia a execução de scripts por padrão. Para começar a desenvolver, você precisará alterar essa configuração.
      </p>

      <CodeBlock
        title="Configurando a Execution Policy"
        code={`# Verifique a política atual
Get-ExecutionPolicy

# Altere para RemoteSigned (Permite scripts locais, exige assinatura para scripts da web)
# Você precisará rodar o PowerShell como Administrador para este comando
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
`}
      />

      <AlertBox type="warning" title="Atenção">
        Nunca use <code>Set-ExecutionPolicy Unrestricted</code> a menos que saiba exatamente o que está fazendo, pois isso permite que qualquer script malicioso rode sem avisos.
      </AlertBox>

      <h2>Verificando a Instalação</h2>
      <p>
        Após instalar, abra seu terminal e execute:
      </p>

      <CodeBlock
        title="Checklist de Saúde"
        code={`# 1. Verifique a versão (deve ser 7.x)
$PSVersionTable.PSVersion

# 2. Teste o auto-completar
# Digite Get-Serv e aperte TAB
Get-Service

# 3. Verifique o caminho de instalação
$PSHOME
`}
      />

      <p>
        Agora que seu ambiente está pronto, vamos aprender como dar os primeiros passos e interagir com esse novo shell poderoso!
      </p>
    </PageContainer>
  );
}
