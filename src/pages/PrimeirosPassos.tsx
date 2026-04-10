import { PageContainer } from "@/components/layout/PageContainer";
  import { CodeBlock } from "@/components/ui/CodeBlock";
  import { AlertBox } from "@/components/ui/AlertBox";

  export default function PrimeirosPassos() {
    return (
      <PageContainer
        title="Primeiros Passos"
        subtitle="Dominando a interface, atalhos, conceitos fundamentais e o perfil do PowerShell."
        difficulty="iniciante"
        timeToRead="20 min"
      >
        <p>
          Seja bem-vindo ao PowerShell! Nesta seção você aprenderá a abrir o terminal,
          entender a filosofia Verbo-Substantivo, navegar pelo sistema de arquivos,
          usar atalhos de produtividade e personalizar seu ambiente com o perfil.
        </p>

        <h2>Abrindo o PowerShell</h2>
        <CodeBlock title="Formas de abrir o terminal" code={`# Windows PowerShell 5.1 (já vem no Windows)
  # Tecla Win → digitar "PowerShell" → Enter
  # Ou: Win+R → powershell → Enter
  powershell.exe

  # PowerShell 7+ (instalação separada, recomendado)
  # Win → digitar "pwsh" → Enter
  pwsh.exe

  # Como Administrador (necessário para muitas operações)
  # Clic direito no ícone → "Executar como administrador"
  # Ou via PowerShell:
  Start-Process pwsh -Verb RunAs

  # Verificar versão do PowerShell
  $PSVersionTable
  # PSVersion:     7.4.1 (ou 5.1.x no Windows PowerShell)
  # PSEdition:     Core (PS7) ou Desktop (PS5.1)

  # Verificar se está como Administrador
  $isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()
      ).IsInRole([Security.Principal.WindowsBuiltInRole]"Administrator")
  Write-Host "Administrador: $isAdmin"
  `} />

        <h2>A Filosofia Verbo-Substantivo</h2>
        <CodeBlock title="Entendendo a nomenclatura dos cmdlets" code={`# Todo cmdlet segue o padrão: Verbo-Substantivo
  # Isso torna o PowerShell autodescritivo e fácil de adivinhar

  Get-Process          # Obtém processos
  Stop-Process         # Para um processo
  Start-Service        # Inicia um serviço
  Set-Location         # Define o diretório atual
  New-Item             # Cria um item (arquivo ou pasta)
  Remove-Item          # Remove um item
  Copy-Item            # Copia um item
  Move-Item            # Move um item

  # Verbos aprovados (obrigatório em módulos publicados)
  Get-Verb | Sort-Object Verb | Format-Table Verb, Group -AutoSize

  # Descobrir cmdlets por substantivo (ex: tudo relacionado a "Process")
  Get-Command -Noun "Process"
  Get-Command -Noun "Service"
  Get-Command -Noun "Item"

  # Descobrir cmdlets por verbo
  Get-Command -Verb "Get"
  Get-Command -Verb "Invoke"

  # Buscar cmdlets por palavra-chave
  Get-Command "*log*"
  Get-Command "*network*" | Select-Object Name, Module
  `} />

        <h2>Atalhos de Teclado (Produtividade)</h2>
        <CodeBlock title="Os atalhos mais importantes do terminal" code={`# === AUTOCOMPLETAR ===
  # Tab          — autocompleta nome de cmdlet, parâmetro ou arquivo
  # Ctrl+Space   — menu de autocompletar (PSReadLine)

  # === HISTÓRICO ===
  # Seta Para Cima/Baixo  — navegar pelo histórico
  # Ctrl+R               — busca no histórico (como o Bash)
  # F7                   — janela de histórico visual (PS5.1)
  # Get-History          — listar todas as entradas do histórico
  # !!                   — repetir último comando (requer PSReadLine)

  # === EDIÇÃO ===
  # Ctrl+A     — selecionar tudo na linha
  # Ctrl+C     — cancelar execução / copiar seleção
  # Ctrl+L     — limpar tela (mesmo que Clear-Host)
  # Ctrl+W     — apagar palavra anterior
  # Alt+D      — apagar palavra após o cursor
  # Home / End — ir ao início/fim da linha
  # Ctrl+←/→  — mover por palavras

  # === INTERRUPÇÃO ===
  # Ctrl+C — cancelar o comando em execução

  # Configurar o PSReadLine para busca de histórico melhorada
  Set-PSReadLineKeyHandler -Key UpArrow -Function HistorySearchBackward
  Set-PSReadLineKeyHandler -Key DownArrow -Function HistorySearchForward
  # Agora a seta para cima busca no histórico baseado no que já digitou!
  `} />

        <h2>Navegação Básica</h2>
        <CodeBlock title="Movendo pelo sistema de arquivos" code={`# Aliases de navegação (iguais ao Bash e CMD)
  cd C:\\Users\\Public           # = Set-Location
  ls                              # = Get-ChildItem
  pwd                             # = Get-Location
  mkdir "NovaPasta"               # = New-Item -ItemType Directory
  cls                             # = Clear-Host

  # Navegação com Set-Location
  Set-Location -Path "C:\\Scripts"
  Set-Location ..                # Subir um nível
  Set-Location ~                 # Ir para a home do usuário ($env:USERPROFILE)
  Set-Location -                 # Voltar para o diretório anterior (PS6+)

  # Listar arquivos com detalhes
  Get-ChildItem -Path "C:\\Windows\\System32" -Filter "*.exe" |
      Sort-Object Length -Descending |
      Select-Object -First 10 |
      Select-Object Name, @{N="Tamanho MB"; E={ [math]::Round($_.Length/1MB, 2) }}

  # Navegar no registro do Windows (como se fosse sistema de arquivos!)
  Set-Location HKLM:\\SOFTWARE\\Microsoft
  Get-ChildItem  # Lista chaves do registro

  # Navegar em certificados
  Set-Location Cert:\\CurrentUser\\My
  Get-ChildItem
  `} />

        <h2>Ajuda Integrada</h2>
        <CodeBlock title="Usando o sistema de Help do PowerShell" code={`# Atualizar a documentação de Help (faça uma vez — requer internet)
  Update-Help -Force -UICulture en-US

  # Ver ajuda de um cmdlet
  Get-Help Get-Process           # Resumo
  Get-Help Get-Process -Detailed  # Com descrição completa dos parâmetros
  Get-Help Get-Process -Examples  # Apenas exemplos práticos
  Get-Help Get-Process -Full      # Documentação completa
  Get-Help Get-Process -Online    # Abrir no navegador (docs.microsoft.com)

  # Ajuda com wildcard (descobrir cmdlets relacionados)
  Get-Help *process*
  Get-Help *service*

  # Atalho: man (alias para Get-Help | more)
  man Get-ChildItem

  # Obter exemplos rápidos
  (Get-Help Get-Content -Examples).Examples | Select-Object -First 3 |
      ForEach-Object { Write-Host $_.title; Write-Host $_.code }

  # Documentação de parâmetro específico
  Get-Help Get-Process -Parameter "Id"
  `} />

        <h2>Interagindo com Objetos</h2>
        <CodeBlock title="O poder dos objetos no pipeline" code={`# PowerShell retorna objetos, não texto!
  $proc = Get-Process | Select-Object -First 1
  $proc.Name        # Propriedade: string
  $proc.Id          # Propriedade: int
  $proc.WorkingSet64 # Propriedade: long (bytes)

  # Descobrir o que um objeto tem (Get-Member)
  Get-Process | Get-Member
  Get-Process | Get-Member -MemberType Property    # Apenas propriedades
  Get-Process | Get-Member -MemberType Method      # Apenas métodos
  Get-Date   | Get-Member

  # Pipeline — encadear operações em objetos
  Get-Process                                    # Obter objetos
    | Where-Object { $_.WorkingSet64 -gt 100MB } # Filtrar
    | Sort-Object WorkingSet64 -Descending       # Ordenar
    | Select-Object Name, Id, @{N="RAM MB"; E={[math]::Round($_.WorkingSet64/1MB, 1)}} # Transformar
    | Select-Object -First 5                     # Limitar
    | Format-Table -AutoSize                     # Exibir

  # ForEach-Object — processar cada objeto
  1..5 | ForEach-Object { $_ * 2 }  # 2 4 6 8 10
  Get-Service | ForEach-Object {
      if ($_.Status -ne "Running") {
          Write-Warning "$($_.Name) não está rodando"
      }
  }
  `} />

        <h2>O Perfil do PowerShell</h2>
        <CodeBlock title="Personalizando o terminal com o arquivo de perfil" code={`# Localização do perfil (arquivo que roda ao iniciar PS)
  $PROFILE                         # Perfil do usuário (PS atual)
  $PROFILE.CurrentUserAllHosts     # Para todos os hosts do PS (ISE, VSCode, etc)
  $PROFILE.AllUsersCurrentHost     # Para todos os usuários (requer admin)

  # Criar o perfil se não existir
  if (-not (Test-Path $PROFILE)) {
      New-Item -ItemType File -Path $PROFILE -Force
  }

  # Editar o perfil
  notepad $PROFILE
  code $PROFILE   # Se tiver VSCode instalado

  # Exemplo de conteúdo do perfil (~DocumentsPowerShellMicrosoft.PowerShell_profile.ps1)
  # --- INÍCIO do perfil ---

  # Importar módulos úteis
  Import-Module Terminal-Icons
  Import-Module posh-git

  # Aliases personalizados
  Set-Alias ll Get-ChildItem
  Set-Alias g git
  Set-Alias np notepad

  # Funções rápidas
  function which($cmd) { (Get-Command $cmd).Source }
  function up { Set-Location .. }

  # Customizar prompt
  function prompt {
      $hora   = Get-Date -Format "HH:mm"
      $pasta  = Split-Path (Get-Location) -Leaf
      "PS [$hora] $pasta> "
  }
  # --- FIM do perfil ---

  # Recarregar o perfil sem fechar o terminal
  . $PROFILE
  `} />

        <AlertBox type="info" title="Execution Policy">
          Na primeira vez que tentar rodar scripts <code>.ps1</code>, pode aparecer um erro
          de Execution Policy. Para liberar scripts locais, execute como admin:
          <code>Set-ExecutionPolicy RemoteSigned -Scope CurrentUser</code>
        </AlertBox>

        <AlertBox type="success" title="Dica: Windows Terminal">
          Instale o <strong>Windows Terminal</strong> (<code>winget install Microsoft.WindowsTerminal</code>)
          para uma experiência muito melhor: abas, temas, fontes Nerd Font, suporte a GPU e
          integração com WSL, PowerShell e CMD em um único lugar.
        </AlertBox>
      </PageContainer>
    );
  }
  