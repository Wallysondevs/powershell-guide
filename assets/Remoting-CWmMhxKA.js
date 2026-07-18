import{n as e,t}from"./CodeBlock-BuNVzmc1.js";import{t as n}from"./AlertBox-BFckEFwP.js";import{a as r}from"./index-Cqr-t4Fn.js";var i=r();function a(){return(0,i.jsxs)(e,{title:`PowerShell Remoting`,subtitle:`Execute comandos em máquinas remotas com WinRM, SSH e sessões persistentes.`,difficulty:`intermediário`,timeToRead:`30 min`,children:[(0,i.jsx)(`p`,{children:`O PowerShell Remoting permite executar comandos em computadores remotos como se estivesse sentado na frente deles. Baseado no protocolo WS-Management (WinRM) no Windows e SSH no Linux/macOS, é a principal ferramenta de automação remota em ambientes corporativos.`}),(0,i.jsx)(`h2`,{children:`Habilitando o Remoting`}),(0,i.jsx)(t,{title:`Configuração inicial do WinRM`,code:`# Habilitar no computador local (como Administrador)
Enable-PSRemoting -Force

# Verificar status
Get-Service WinRM | Select-Object Name, Status, StartType
winrm enumerate winrm/config/listener

# Adicionar host confiável (workgroup ou IP específico)
Set-Item WSMan:localhostClientTrustedHosts -Value "192.168.1.*" -Force
Set-Item WSMan:localhostClientTrustedHosts -Value "servidor01,servidor02" -Force

# Verificar hosts confiáveis
Get-Item WSMan:localhostClientTrustedHosts
`}),(0,i.jsx)(`h2`,{children:`Invoke-Command: Execução Remota`}),(0,i.jsx)(t,{title:`Comandos em máquinas remotas`,code:`# Comando simples em um servidor
Invoke-Command -ComputerName "servidor01" -ScriptBlock {
    Get-Process | Sort-Object CPU -Descending | Select-Object -First 5
}

# Com credenciais explícitas
$cred = Get-Credential
Invoke-Command -ComputerName "servidor01" -Credential $cred -ScriptBlock {
    Get-Service | Where-Object Status -eq 'Running'
}

# Múltiplos servidores em paralelo
$servidores = "srv01","srv02","srv03","srv04"
$resultados = Invoke-Command -ComputerName $servidores -ScriptBlock {
    [PSCustomObject]@{
        Servidor = $env:COMPUTERNAME
        CPU      = (Get-CimInstance Win32_Processor).LoadPercentage
        RAM_Livre = [math]::Round(
            (Get-CimInstance Win32_OperatingSystem).FreePhysicalMemory / 1MB, 2
        )
        Uptime = (Get-Date) - (gcim Win32_OperatingSystem).LastBootUpTime
    }
}
$resultados | Format-Table -AutoSize
`}),(0,i.jsx)(`h2`,{children:`Passando Variáveis para o Bloco Remoto`}),(0,i.jsxs)(n,{type:`warning`,title:`Escopo Remoto`,children:[`Variáveis locais não existem no contexto remoto. Use `,(0,i.jsx)(`code`,{children:`$Using:`}),` para passar variáveis locais para o bloco de script remoto.`]}),(0,i.jsx)(t,{title:`Usando variáveis locais remotamente`,code:`$servico   = "Spooler"
$tentativas = 3

Invoke-Command -ComputerName "srv01" -ScriptBlock {
    # $Using: passa variável local para o contexto remoto
    $svc = Get-Service -Name $Using:servico
    for ($i = 1; $i -le $Using:tentativas; $i++) {
        if ($svc.Status -ne 'Running') {
            Start-Service -Name $Using:servico
            Start-Sleep -Seconds 2
            $svc.Refresh()
        }
    }
    $svc | Select-Object Name, Status
}
`}),(0,i.jsx)(`h2`,{children:`Sessões Persistentes (PSSession)`}),(0,i.jsx)(t,{title:`Criando e usando sessões persistentes`,code:`# Criar sessão persistente
$sess = New-PSSession -ComputerName "servidor01" -Credential $cred

# Executar múltiplos comandos na mesma sessão (estado preservado)
Invoke-Command -Session $sess -ScriptBlock {
    $arquivos = Get-ChildItem C:Logs -Filter "*.log"
    Write-Host "Encontrados: $($arquivos.Count) logs"
}
Invoke-Command -Session $sess -ScriptBlock {
    # $arquivos ainda existe nesta sessão
    $arquivos | Where-Object Length -gt 1MB | Remove-Item -WhatIf
}

# Sessão interativa
Enter-PSSession -Session $sess
# Agora você está "dentro" do servidor remoto
# PS servidor01> ...
# PS servidor01> exit  (para sair)

# Múltiplas sessões
$sessoes = New-PSSession -ComputerName "srv01","srv02","srv03"
Invoke-Command -Session $sessoes -ScriptBlock { hostname }

# Limpar sessões
$sess | Remove-PSSession
Get-PSSession | Remove-PSSession
`}),(0,i.jsx)(`h2`,{children:`Remoting via SSH (PowerShell 7+)`}),(0,i.jsx)(t,{title:`Conexão SSH multiplataforma`,code:`# Requer OpenSSH instalado e PowerShell 7 no servidor remoto

# Conectar a Linux
$sessLinux = New-PSSession -HostName "192.168.1.50" -UserName "admin" -SSHTransport
Invoke-Command -Session $sessLinux -ScriptBlock {
    uname -a
    Get-Process | Sort-Object CPU -Descending | Select-Object -First 5
}

# Conectar com chave privada (sem senha)
$sessLinux2 = New-PSSession -HostName "servidor-linux"     -UserName "deploy"     -KeyFilePath "~/.ssh/id_rsa"     -SSHTransport

# Arquivo de configuração SSH (~/.ssh/config)
# Host servidor-linux
#     HostName 192.168.1.50
#     User deploy
#     IdentityFile ~/.ssh/id_rsa
`}),(0,i.jsx)(`h2`,{children:`Copy-Item Remoto`}),(0,i.jsx)(t,{title:`Transferindo arquivos via Remoting`,code:`$sess = New-PSSession -ComputerName "servidor01"

# Enviar arquivo para servidor remoto
Copy-Item -Path "C:ScriptsDeploy.ps1"           -Destination "C:Scripts"           -ToSession $sess

# Baixar arquivo do servidor remoto
Copy-Item -Path "C:Logsapp.log"           -Destination "D:Logs-Remotos"           -FromSession $sess

# Copiar pasta inteira
Copy-Item -Path "C:AppRelease"           -Destination "C:App"           -ToSession $sess           -Recurse

$sess | Remove-PSSession
`}),(0,i.jsx)(`h2`,{children:`Configurações Avançadas de WinRM`}),(0,i.jsx)(t,{title:`Configurando autenticação e HTTPS`,code:`# Usar HTTPS para Remoting (requer certificado)
$cert = Get-ChildItem Cert:LocalMachineMy | Where-Object Subject -like "*servidor01*"
New-Item -Path WSMan:localhostListener          -Transport HTTPS          -Address *          -CertificateThumbPrint $cert.Thumbprint -Force

# Testar conectividade
Test-WSMan -ComputerName "servidor01" -UseSSL

# Configurar autenticação CredSSP (para acesso a recursos de rede no remoto)
Enable-WSManCredSSP -Role Client -DelegateComputer "*.empresa.com" -Force
# No servidor:
Enable-WSManCredSSP -Role Server -Force

# Conectar com CredSSP
$cred = Get-Credential
Invoke-Command -ComputerName "servidor01"                -Authentication CredSSP                -Credential $cred                -ScriptBlock { net use; Get-SmbShare }
`}),(0,i.jsx)(n,{type:`info`,title:`Dica de Segurança`,children:`Use CredSSP apenas quando necessário (acesso a recursos de rede no servidor remoto). Para a maioria dos casos, a autenticação padrão (Kerberos em domínio, NTLM em workgroup) é suficiente e mais segura.`})]})}export{a as default};