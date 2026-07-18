import{n as e,t}from"./CodeBlock-BuNVzmc1.js";import{t as n}from"./AlertBox-BFckEFwP.js";import{a as r}from"./index-Cqr-t4Fn.js";var i=r();function a(){return(0,i.jsxs)(e,{title:`Instalação e Configuração`,subtitle:`Prepare seu ambiente no Windows, Linux ou macOS para rodar o PowerShell 7.`,difficulty:`iniciante`,timeToRead:`12 min`,children:[(0,i.jsx)(`p`,{children:`Embora o Windows já venha com o Windows PowerShell 5.1 instalado, para aproveitar todo o potencial desta guia você deve instalar a versão mais recente (PowerShell 7+).`}),(0,i.jsx)(`h2`,{children:`Instalação no Windows`}),(0,i.jsxs)(`p`,{children:[`Existem várias formas de instalar no Windows, mas a mais moderna e recomendada é via `,(0,i.jsx)(`strong`,{children:`Winget`}),` (Windows Package Manager).`]}),(0,i.jsx)(t,{title:`Instalando via Terminal (Recomendado)`,code:`# Procure pela versão mais recente
winget search Microsoft.PowerShell

# Instale a versão estável
winget install --id Microsoft.PowerShell --source winget

# Se preferir a versão Preview (com recursos experimentais)
winget install --id Microsoft.PowerShell.Preview --source winget
`}),(0,i.jsxs)(`p`,{children:[`Alternativamente, você pode baixar o instalador `,(0,i.jsx)(`code`,{children:`.msi`}),` diretamente do repositório oficial no `,(0,i.jsx)(`a`,{href:`https://github.com/PowerShell/PowerShell`,target:`_blank`,rel:`noopener noreferrer`,className:`text-primary hover:underline`,children:`GitHub`}),`.`]}),(0,i.jsx)(`h2`,{children:`Instalação no Linux (Ubuntu/Debian)`}),(0,i.jsx)(`p`,{children:`O PowerShell está disponível nos repositórios oficiais da Microsoft para as principais distribuições Linux.`}),(0,i.jsx)(t,{language:`bash`,title:`Comandos para Ubuntu 22.04+`,code:`# Atualize a lista de pacotes e instale dependências
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
`}),(0,i.jsx)(`h2`,{children:`Instalação no macOS`}),(0,i.jsxs)(`p`,{children:[`A forma mais simples de instalar no Mac é usando o `,(0,i.jsx)(`strong`,{children:`Homebrew`}),`.`]}),(0,i.jsx)(t,{language:`bash`,title:`Usando Homebrew`,code:`# Instale via cask
brew install --cask powershell

# Para rodar, use o comando:
pwsh
`}),(0,i.jsx)(`h2`,{children:`Configurando o Ambiente Ideal`}),(0,i.jsx)(`p`,{children:`Apenas ter o PowerShell instalado não é o suficiente. Para uma experiência produtiva, você deve configurar duas ferramentas essenciais:`}),(0,i.jsx)(`h3`,{children:`1. Windows Terminal`}),(0,i.jsxs)(`p`,{children:[`Esqueça aquela janela azul antiga ou o prompt preto do CMD. O `,(0,i.jsx)(`strong`,{children:`Windows Terminal`}),` é moderno, suporta abas, emojis, aceleração por GPU e múltiplos perfis.`]}),(0,i.jsxs)(n,{type:`info`,title:`Dica de UI`,children:[`No Windows 11, o Windows Terminal já é o terminal padrão. No Windows 10, você pode instalá-lo via Microsoft Store ou `,(0,i.jsx)(`code`,{children:`winget install Microsoft.WindowsTerminal`}),`.`]}),(0,i.jsx)(`h3`,{children:`2. Visual Studio Code + Extensão`}),(0,i.jsx)(`p`,{children:`O VS Code é o melhor editor para escrever scripts PowerShell.`}),(0,i.jsxs)(`ul`,{children:[(0,i.jsx)(`li`,{children:`Instale o VS Code.`}),(0,i.jsxs)(`li`,{children:[`Vá em Extensões (Ctrl+Shift+X) e busque por `,(0,i.jsx)(`strong`,{children:`"PowerShell"`}),`.`]}),(0,i.jsx)(`li`,{children:`Instale a extensão oficial da Microsoft. Isso lhe dará IntelliSense (auto-completar), debug e análise de código em tempo real.`})]}),(0,i.jsx)(`h2`,{children:`Ajustando a Política de Execução`}),(0,i.jsx)(`p`,{children:`Por segurança, o Windows bloqueia a execução de scripts por padrão. Para começar a desenvolver, você precisará alterar essa configuração.`}),(0,i.jsx)(t,{title:`Configurando a Execution Policy`,code:`# Verifique a política atual
Get-ExecutionPolicy

# Altere para RemoteSigned (Permite scripts locais, exige assinatura para scripts da web)
# Você precisará rodar o PowerShell como Administrador para este comando
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
`}),(0,i.jsxs)(n,{type:`warning`,title:`Atenção`,children:[`Nunca use `,(0,i.jsx)(`code`,{children:`Set-ExecutionPolicy Unrestricted`}),` a menos que saiba exatamente o que está fazendo, pois isso permite que qualquer script malicioso rode sem avisos.`]}),(0,i.jsx)(`h2`,{children:`Verificando a Instalação`}),(0,i.jsx)(`p`,{children:`Após instalar, abra seu terminal e execute:`}),(0,i.jsx)(t,{title:`Checklist de Saúde`,code:`# 1. Verifique a versão (deve ser 7.x)
$PSVersionTable.PSVersion

# 2. Teste o auto-completar
# Digite Get-Serv e aperte TAB
Get-Service

# 3. Verifique o caminho de instalação
$PSHOME
`}),(0,i.jsx)(`p`,{children:`Agora que seu ambiente está pronto, vamos aprender como dar os primeiros passos e interagir com esse novo shell poderoso!`})]})}export{a as default};