export interface Example {
  desc: string;
  code: string;
}

export interface Command {
  name: string;
  description: string;
  syntax?: string;
  examples: Example[];
  notes?: string;
}

export interface Section {
  id: string;
  title: string;
  description: string;
  commands: Command[];
}

export const powershellData: Section[] = [
  {
    id: "intro",
    title: "1. Introdução",
    description: "O que é PowerShell, versões e instalação. O PowerShell é uma solução de automação de tarefas multiplataforma composta por um shell de linha de comando, uma linguagem de script e uma estrutura de gerenciamento de configuração.",
    commands: [
      {
        name: "Versões do PowerShell",
        description: "Existem duas ramificações principais: Windows PowerShell (até v5.1, integrado ao Windows) e PowerShell Core (v6+, multiplataforma, código aberto).",
        examples: [
          {
            desc: "Verificar a versão atual do PowerShell",
            code: "$PSVersionTable"
          }
        ],
        notes: "No Windows 10/11, o Windows PowerShell 5.1 vem pré-instalado (powershell.exe). A versão mais recente do PowerShell 7+ (pwsh.exe) deve ser instalada separadamente."
      },
      {
        name: "Instalação",
        description: "Como instalar o PowerShell 7+ em diferentes sistemas operacionais.",
        examples: [
          {
            desc: "Windows (via Winget)",
            code: "winget install --id Microsoft.Powershell --source winget"
          },
          {
            desc: "Ubuntu/Debian",
            code: "sudo apt-get install -y powershell"
          },
          {
            desc: "macOS (via Homebrew)",
            code: "brew install --cask powershell"
          }
        ]
      }
    ]
  },
  {
    id: "conceitos",
    title: "2. Conceitos Básicos",
    description: "Fundamentos, cmdlets, aliases, variáveis e uso do pipeline.",
    commands: [
      {
        name: "Get-Help",
        description: "Exibe informações de ajuda sobre cmdlets e conceitos do PowerShell.",
        syntax: "Get-Help [[-Name] <String>] [-Detailed | -Examples | -Full | -Online]",
        examples: [
          {
            desc: "Obter exemplos práticos de um comando",
            code: "Get-Help Get-Process -Examples"
          },
          {
            desc: "Abrir a documentação online no navegador",
            code: "Get-Help Get-Content -Online"
          }
        ],
        notes: "Execute 'Update-Help' periodicamente com privilégios de administrador para baixar os arquivos de ajuda mais recentes."
      },
      {
        name: "Get-Command",
        description: "Encontra cmdlets, aliases, funções e executáveis disponíveis na sessão atual.",
        examples: [
          {
            desc: "Procurar comandos relacionados a 'Process'",
            code: "Get-Command -Noun Process"
          },
          {
            desc: "Descobrir o tipo de um comando (se é alias, cmdlet ou função)",
            code: "Get-Command ls"
          }
        ]
      },
      {
        name: "Get-Member",
        description: "Inspeciona os objetos e lista suas propriedades e métodos. Essencial para entender o que um objeto pode fazer.",
        examples: [
          {
            desc: "Ver quais propriedades um processo possui",
            code: "Get-Process | Get-Member -MemberType Property"
          }
        ]
      },
      {
        name: "Variáveis e Tipos de Dados",
        description: "Variáveis começam com '$'. O PowerShell é tipado dinamicamente, mas permite tipagem estática. Arrays usam '@()' e Hashtables usam '@{}'.",
        examples: [
          {
            desc: "Declarar variáveis simples",
            code: "$nome = \"Admin\"\n[int]$idade = 30"
          },
          {
            desc: "Acessar variáveis de ambiente",
            code: "$env:PATH\n$env:USERNAME"
          },
          {
            desc: "Criar um Array e uma Hashtable (Dicionário)",
            code: "$frutas = @('Maçã', 'Banana', 'Uva')\n$usuario = @{ Nome='João'; Cargo='TI' }"
          }
        ]
      }
    ]
  },
  {
    id: "navegacao",
    title: "3. Navegação e Arquivos",
    description: "Comandos para interagir com o sistema de arquivos, diretórios e leitura de conteúdos.",
    commands: [
      {
        name: "Get-ChildItem",
        description: "Obtém os itens (arquivos e pastas) de um local.",
        syntax: "Get-ChildItem [-Path <String[]>] [-Filter <String>] [-Recurse] [-Force]",
        examples: [
          {
            desc: "Listar todos os arquivos ocultos recursivamente",
            code: "Get-ChildItem -Path C:\\ -Force -Recurse -ErrorAction SilentlyContinue"
          },
          {
            desc: "Listar apenas arquivos .log",
            code: "Get-ChildItem -Path ./Logs -Filter *.log"
          }
        ],
        notes: "Aliases: ls, dir, gci"
      },
      {
        name: "Set-Location / Get-Location",
        description: "Navega entre diretórios e exibe o diretório atual.",
        examples: [
          {
            desc: "Mudar para o diretório raiz",
            code: "Set-Location C:\\"
          },
          {
            desc: "Exibir o caminho atual",
            code: "Get-Location"
          }
        ],
        notes: "Aliases: cd, pwd, sl, gl"
      },
      {
        name: "New-Item / Remove-Item",
        description: "Cria ou exclui arquivos, pastas e chaves de registro.",
        examples: [
          {
            desc: "Criar uma nova pasta",
            code: "New-Item -Path 'C:\\NovaPasta' -ItemType Directory"
          },
          {
            desc: "Excluir uma pasta e todo o seu conteúdo sem pedir confirmação",
            code: "Remove-Item -Path 'C:\\Temp' -Recurse -Force"
          }
        ],
        notes: "Aliases: mkdir, ni, rm, ri, rmdir, del"
      },
      {
        name: "Get-Content / Set-Content",
        description: "Lê o conteúdo de um arquivo ou escreve conteúdo substituindo o existente.",
        examples: [
          {
            desc: "Ler as últimas 10 linhas de um log (similar ao 'tail')",
            code: "Get-Content -Path server.log -Tail 10 -Wait"
          },
          {
            desc: "Salvar um texto em um arquivo",
            code: "Set-Content -Path notas.txt -Value 'Primeira linha de notas'"
          },
          {
            desc: "Adicionar texto sem apagar o arquivo existente",
            code: "Add-Content -Path notas.txt -Value 'Segunda linha de notas'"
          }
        ],
        notes: "Aliases: cat, gc, type"
      }
    ]
  },
  {
    id: "pipeline",
    title: "4. Pipeline e Objetos",
    description: "O poder do PowerShell está no pipeline (|), que passa OBJETOS inteiros (não apenas texto) de um comando para o outro.",
    commands: [
      {
        name: "Select-Object",
        description: "Seleciona propriedades específicas de objetos ou um número específico de itens.",
        examples: [
          {
            desc: "Obter apenas o Nome e o ID dos 5 processos que mais consomem CPU",
            code: "Get-Process | Sort-Object CPU -Descending | Select-Object -First 5 -Property Name, Id, CPU"
          }
        ]
      },
      {
        name: "Where-Object",
        description: "Filtra objetos do pipeline com base em condições.",
        examples: [
          {
            desc: "Mostrar serviços que estão parados",
            code: "Get-Service | Where-Object { $_.Status -eq 'Stopped' }"
          },
          {
            desc: "Sintaxe simplificada (versões recentes)",
            code: "Get-Service | Where-Object Status -eq 'Stopped'"
          }
        ],
        notes: "A variável especial '$_' ou '$PSItem' representa o objeto atual no pipeline."
      },
      {
        name: "ForEach-Object",
        description: "Executa um bloco de script para cada objeto no pipeline.",
        examples: [
          {
            desc: "Parar múltiplos processos específicos",
            code: "'notepad', 'calc' | ForEach-Object { Stop-Process -Name $_ }"
          },
          {
            desc: "Renomear todos os arquivos .txt para .bak",
            code: "Get-ChildItem *.txt | ForEach-Object { Rename-Item $_ -NewName ($_.Name -replace '\\.txt','.bak') }"
          }
        ],
        notes: "Alias comum: %"
      },
      {
        name: "Exportação e Formatação",
        description: "Comandos para formatar a saída na tela ou exportar dados.",
        examples: [
          {
            desc: "Exportar processos para um arquivo CSV",
            code: "Get-Process | Export-Csv -Path processos.csv -NoTypeInformation"
          },
          {
            desc: "Exibir resultados em uma janela interativa de grid (apenas Windows)",
            code: "Get-Service | Out-GridView"
          },
          {
            desc: "Converter dados para JSON",
            code: "Get-LocalUser | Select-Object Name, Enabled | ConvertTo-Json"
          }
        ]
      }
    ]
  },
  {
    id: "strings",
    title: "5. Strings e Texto",
    description: "Manipulação avançada de texto e buscas (grep-like).",
    commands: [
      {
        name: "Select-String",
        description: "Procura padrões de texto em strings e arquivos (o equivalente ao 'grep' do Linux).",
        examples: [
          {
            desc: "Procurar a palavra 'Erro' em todos os arquivos de log",
            code: "Select-String -Path *.log -Pattern 'Erro'"
          },
          {
            desc: "Busca ignorando case sensitive, retornando o contexto",
            code: "Get-Content server.txt | Select-String -Pattern 'falha' -Context 2,2"
          }
        ]
      },
      {
        name: "Operadores de String",
        description: "O PowerShell inclui vários operadores úteis para texto: -replace, -match, -like, -split, -join.",
        examples: [
          {
            desc: "Substituir texto usando Regex",
            code: "'Hello World' -replace 'World', 'PowerShell'"
          },
          {
            desc: "Verificar se a string contém um padrão",
            code: "if ('Erro fatal no sistema' -match 'fatal') { Write-Host 'Encontrado!' }"
          },
          {
            desc: "Dividir uma string por vírgulas",
            code: "'apple,banana,orange' -split ','"
          }
        ]
      }
    ]
  },
  {
    id: "processos",
    title: "6. Processos e Serviços",
    description: "Gerenciamento de recursos do sistema, parar/iniciar processos e gerenciar serviços do Windows.",
    commands: [
      {
        name: "Gerenciamento de Processos",
        description: "Ver, iniciar e finalizar programas em execução.",
        examples: [
          {
            desc: "Listar processos agrupados por empresa",
            code: "Get-Process | Group-Object Company"
          },
          {
            desc: "Encerrar um processo travado pelo nome forçadamente",
            code: "Stop-Process -Name 'chrome' -Force"
          },
          {
            desc: "Iniciar um novo programa oculto",
            code: "Start-Process notepad.exe -WindowStyle Hidden"
          }
        ]
      },
      {
        name: "Gerenciamento de Serviços",
        description: "Administrar serviços de segundo plano (Windows Services).",
        examples: [
          {
            desc: "Reiniciar o serviço de spooler de impressão",
            code: "Restart-Service -Name Spooler -Force"
          },
          {
            desc: "Alterar um serviço para inicialização manual",
            code: "Set-Service -Name 'wuauserv' -StartupType Manual"
          }
        ]
      }
    ]
  },
  {
    id: "sistema",
    title: "7. Sistema e Rede",
    description: "Coleta de informações de hardware, SO e conectividade de rede.",
    commands: [
      {
        name: "Informações do Sistema",
        description: "Obter dados do computador local ou remoto (via CIM/WMI).",
        examples: [
          {
            desc: "Resumo rápido do hardware e SO",
            code: "Get-ComputerInfo | Select-Object CsName, OsName, OsVersion, CsTotalPhysicalMemory"
          },
          {
            desc: "Obter o número de série da BIOS",
            code: "Get-CimInstance Win32_BIOS | Select-Object SerialNumber"
          }
        ]
      },
      {
        name: "Rede e Conectividade",
        description: "Testes de rede e chamadas de API.",
        examples: [
          {
            desc: "Pingar um servidor continuamente",
            code: "Test-Connection 8.8.8.8 -Continuous"
          },
          {
            desc: "Verificar as configurações de IP",
            code: "Get-NetIPAddress -InterfaceAlias 'Wi-Fi' | Select-Object IPAddress, PrefixLength"
          },
          {
            desc: "Fazer uma requisição GET a uma API (curl/wget)",
            code: "$response = Invoke-RestMethod -Uri 'https://api.github.com/users/microsoft'\n$response.login"
          }
        ]
      }
    ]
  },
  {
    id: "usuarios",
    title: "8. Usuários e Permissões",
    description: "Gerenciamento de usuários locais e listas de controle de acesso (ACL).",
    commands: [
      {
        name: "Usuários Locais",
        description: "Gerenciar contas que existem na máquina local.",
        examples: [
          {
            desc: "Listar usuários locais ativos",
            code: "Get-LocalUser | Where-Object Enabled -eq $true"
          },
          {
            desc: "Criar um novo usuário local",
            code: "$senha = Read-Host -AsSecureString 'Digite a senha'\nNew-LocalUser -Name 'Visitante' -Password $senha -FullName 'Conta Visitante'"
          },
          {
            desc: "Adicionar usuário ao grupo de Administradores",
            code: "Add-LocalGroupMember -Group 'Administrators' -Member 'Visitante'"
          }
        ]
      },
      {
        name: "Permissões de Arquivo (ACL)",
        description: "Ver e modificar as permissões NTFS de arquivos e pastas.",
        examples: [
          {
            desc: "Ver as permissões de uma pasta",
            code: "(Get-Acl C:\\Temp).Access | Format-Table IdentityReference, FileSystemRights"
          }
        ]
      }
    ]
  },
  {
    id: "scripts",
    title: "10. Scripts e Automação",
    description: "Construção de lógicas reutilizáveis em arquivos .ps1.",
    commands: [
      {
        name: "Execution Policy",
        description: "Mecanismo de segurança do PowerShell que determina se os scripts podem ser executados.",
        examples: [
          {
            desc: "Permitir execução de scripts locais",
            code: "Set-ExecutionPolicy RemoteSigned -Scope CurrentUser"
          },
          {
            desc: "Contornar a política para uma única execução via CMD",
            code: "powershell.exe -ExecutionPolicy Bypass -File .\\MeuScript.ps1"
          }
        ]
      },
      {
        name: "Estrutura Básica de Script",
        description: "Como definir parâmetros de entrada e usar blocos Try/Catch.",
        examples: [
          {
            desc: "Script com parâmetros e tratamento de erro",
            code: `param (
    [Parameter(Mandatory=$true)]
    [string]$Servidor
)

try {
    Test-Connection -ComputerName $Servidor -Count 1 -ErrorAction Stop
    Write-Host "$Servidor está Online" -ForegroundColor Green
} catch {
    Write-Warning "Falha ao conectar no servidor: $_"
}`
          }
        ]
      }
    ]
  },
  {
    id: "pacotes",
    title: "12. Gerenciamento de Pacotes",
    description: "Como instalar softwares e módulos de terceiros diretamente do terminal.",
    commands: [
      {
        name: "Módulos do PowerShell (PSGallery)",
        description: "Repositório oficial para scripts e módulos do PowerShell.",
        examples: [
          {
            desc: "Procurar um módulo",
            code: "Find-Module -Name '*SqlServer*'"
          },
          {
            desc: "Instalar um módulo para o usuário atual",
            code: "Install-Module -Name Az -Scope CurrentUser -Force"
          }
        ]
      },
      {
        name: "WinGet (Windows Package Manager)",
        description: "Ferramenta nativa do Windows para instalação de softwares.",
        examples: [
          {
            desc: "Procurar e instalar o VS Code",
            code: "winget search vscode\nwinget install Microsoft.VisualStudioCode"
          },
          {
            desc: "Atualizar todos os programas instalados",
            code: "winget upgrade --all"
          }
        ]
      }
    ]
  },
  {
    id: "dicas",
    title: "14. Dicas e Truques",
    description: "Atalhos de produtividade, personalização do perfil e dicas úteis.",
    commands: [
      {
        name: "Perfil do PowerShell ($PROFILE)",
        description: "O script que roda toda vez que você abre o PowerShell. Ideal para carregar módulos e aliases.",
        examples: [
          {
            desc: "Criar/Editar o perfil no Bloco de Notas",
            code: "if (!(Test-Path -Path $PROFILE)) { New-Item -ItemType File -Path $PROFILE -Force }\nnotepad $PROFILE"
          }
        ]
      },
      {
        name: "Atalhos do PSReadLine",
        description: "O módulo PSReadLine (padrão) fornece atalhos estilo bash.",
        examples: [
          {
            desc: "Histórico de Comandos",
            code: "Pressione Ctrl + R para buscar comandos no histórico reverso."
          },
          {
            desc: "Tab Completion",
            code: "Escreva Get-P e pressione TAB para navegar por opções."
          },
          {
            desc: "Limpar a tela",
            code: "Pressione Ctrl + L (ou digite 'Clear-Host' / 'cls')"
          }
        ]
      }
    ]
  }
];
