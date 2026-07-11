import{n as e,t}from"./CodeBlock-DVOG-hPm.js";import{t as n}from"./AlertBox-q8pQIQ07.js";import{a as r}from"./index-D0tfvO9Z.js";var i=r();function a(){return(0,i.jsxs)(e,{title:`Desired State Configuration (DSC)`,subtitle:`Declare o estado desejado de servidores e aplique configurações de forma idempotente e repetível.`,difficulty:`avançado`,timeToRead:`35 min`,children:[(0,i.jsx)(`p`,{children:`DSC (Desired State Configuration) permite descrever o estado desejado de um sistema de forma declarativa. Em vez de escrever scripts imperativos passo-a-passo, você define COMO o servidor deve estar e o DSC garante que ele chegue e permaneça nesse estado.`}),(0,i.jsxs)(n,{type:`info`,title:`Declarativo vs Imperativo`,children:[(0,i.jsx)(`strong`,{children:`Imperativo:`}),` "Instale o IIS, depois crie a pasta, depois configure o site..."`,(0,i.jsx)(`strong`,{children:`Declarativo (DSC):`}),` "O servidor DEVE ter IIS, a pasta DEVE existir, o site DEVE estar configurado." O DSC determina sozinho o que fazer para chegar ao estado desejado — e só age se necessário.`]}),(0,i.jsx)(`h2`,{children:`Primeira Configuração DSC`}),(0,i.jsx)(t,{title:`Configuração básica de servidor web`,code:`# Definir configuração desejada
Configuration ServidorWeb {
    param ([string[]]$NosAlvo = "localhost")

    Import-DscResource -ModuleName PSDesiredStateConfiguration

    Node $NosAlvo {
        # IIS deve estar instalado
        WindowsFeature IIS {
            Ensure = "Present"
            Name   = "Web-Server"
        }

        # ASP.NET depende do IIS
        WindowsFeature ASPNET {
            Ensure    = "Present"
            Name      = "Web-Asp-Net45"
            DependsOn = "[WindowsFeature]IIS"
        }

        # Pasta de logs deve existir
        File PastaDeLogs {
            Type            = "Directory"
            Ensure          = "Present"
            DestinationPath = "C:\\Logs\\App"
            DependsOn       = "[WindowsFeature]IIS"
        }

        # Serviço W3SVC deve estar rodando
        Service ServicoIIS {
            Name      = "W3SVC"
            State     = "Running"
            DependsOn = "[WindowsFeature]IIS"
        }
    }
}

# Gerar arquivo MOF (plano de configuração)
ServidorWeb -NosAlvo "servidor01","servidor02" -OutputPath "C:\\DSC\\ServidorWeb"

# Aplicar configuração
Start-DscConfiguration -Path "C:\\DSC\\ServidorWeb" -Wait -Verbose -Force
`}),(0,i.jsx)(`h2`,{children:`Verificação e Reconfiguração`}),(0,i.jsx)(t,{title:`Test-DscConfiguration e idempotência`,code:`# Verificar conformidade sem aplicar mudanças
Test-DscConfiguration -Detailed

# Ver estado atual da configuração aplicada
Get-DscConfiguration

# Ver histórico de configurações
Get-DscConfigurationStatus

# Reaplicar configuração existente (corrigir desvios)
Start-DscConfiguration -UseExisting -Wait -Verbose

# Aplicar em computador remoto
Start-DscConfiguration -Path "C:\\DSC\\ServidorWeb"  -ComputerName "servidor01"  -Credential (Get-Credential)  -Wait -Verbose
`}),(0,i.jsx)(`h2`,{children:`Recursos DSC Comuns`}),(0,i.jsx)(t,{title:`Configuração completa de ambiente`,code:`Configuration AmbienteCompleto {
    Import-DscResource -ModuleName PSDesiredStateConfiguration
    Import-DscResource -ModuleName NetworkingDsc  # Install-Module NetworkingDsc

    Node "servidor-app" {
        # SOFTWARE
        WindowsFeature IIS     { Ensure = "Present"; Name = "Web-Server" }
        WindowsFeature WebMgmt { Ensure = "Present"; Name = "Web-Mgmt-Console" }

        # ARQUIVOS
        File AppDir {
            Type            = "Directory"
            Ensure          = "Present"
            DestinationPath = "D:\\Apps\\MinhaApp"
        }

        File ConfigApp {
            Ensure          = "Present"
            DestinationPath = "D:\\Apps\\MinhaApp\\appsettings.json"
            Contents        = '{"Ambiente":"Producao","LogLevel":"Warning"}'
            DependsOn       = "[File]AppDir"
        }

        # REGISTRO
        Registry TLSLog {
            Ensure    = "Present"
            Key       = "HKLM:\\SYSTEM\\CurrentControlSet\\Control\\SecurityProviders\\SCHANNEL"
            ValueName = "EventLogging"
            ValueData = "1"
            ValueType = "Dword"
        }

        # SERVIÇOS — Spooler desnecessário em servidores web
        Service Spooler {
            Name        = "Spooler"
            State       = "Stopped"
            StartupType = "Disabled"
        }

        # FIREWALL (NetworkingDsc)
        Firewall PermitirHTTPS {
            Name      = "Permitir-HTTPS-Entrada"
            Ensure    = "Present"
            Enabled   = "True"
            Direction = "Inbound"
            LocalPort = "443"
            Protocol  = "TCP"
            Action    = "Allow"
        }
    }
}

AmbienteCompleto -OutputPath "C:\\DSC\\Saida"
Start-DscConfiguration "C:\\DSC\\Saida" -Wait -Verbose
`}),(0,i.jsx)(`h2`,{children:`ConfigurationData — Separando Código de Dados`}),(0,i.jsx)(t,{title:`Configuração multi-nó com dados externos`,code:`$ConfigData = @{
    AllNodes = @(
        @{
            NodeName      = "*"
            CertificateFile = "C:\\Certs\\dsc.cer"
        },
        @{
            NodeName    = "web01"
            Role        = "WebServer"
            Site        = "app-producao"
        },
        @{
            NodeName    = "web02"
            Role        = "WebServer"
            Site        = "app-staging"
        }
    )
}

Configuration Multi {
    Node $AllNodes.Where({$_.Role -eq "WebServer"}) {
        File LogDir {
            Type            = "Directory"
            Ensure          = "Present"
            DestinationPath = "C:\\Logs\\$($Node.Site)"
        }
    }
}

Multi -ConfigurationData $ConfigData -OutputPath "C:\\DSC\\Multi"
`}),(0,i.jsxs)(n,{type:`warning`,title:`DSC e PowerShell 7`,children:[`O DSC v2 está sendo redesenhado. Para ambientes existentes, use DSC v1 com WMF 5.1. Para novos projetos, considere o módulo `,(0,i.jsx)(`strong`,{children:`PSDesiredStateConfiguration 2.x`}),`ou ferramentas como Ansible para configuração multiplataforma.`]})]})}export{a as default};