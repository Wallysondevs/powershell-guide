import { PageContainer } from "@/components/layout/PageContainer";
  import { CodeBlock } from "@/components/ui/CodeBlock";
  import { AlertBox } from "@/components/ui/AlertBox";

  export default function Historia() {
    return (
      <PageContainer
        title="História e Evolução"
        subtitle="Do Monad ao PowerShell 7: a jornada da shell mais poderosa da Microsoft."
        difficulty="iniciante"
        timeToRead="18 min"
      >
        <p>
          O PowerShell não surgiu do nada. Ele foi o resultado de anos de frustração com as limitações do CMD
          e a necessidade de uma ferramenta de automação que pudesse competir com os shells Unix,
          mas mantendo a filosofia de objetos do ecossistema Windows.
        </p>

        <h2>O Nascimento: Projeto Monad (2002)</h2>
        <p>
          Em 2002, <strong>Jeffrey Snover</strong> — engenheiro da Microsoft — publicou um documento
          interno chamado <em>"Monad Manifesto"</em>. Ele descrevia uma abordagem radical para
          automação de sistemas: em vez de passar texto entre comandos (e precisar de <code>awk</code>,
          <code>sed</code> e <code>grep</code> para extrair informações), os comandos passariam
          <strong> objetos .NET estruturados</strong> uns para os outros.
        </p>
        <p>
          A visão era simples, mas poderosa: para acessar a data de criação de um arquivo, não era preciso
          "cortar" a 8ª coluna de um texto formatado — bastava acessar a propriedade <code>.CreationTime</code>
          do objeto arquivo.
        </p>

        <AlertBox type="info" title="O Rebaixamento que Virou Revolução">
          Jeffrey Snover foi <strong>rebaixado</strong> na Microsoft por sua ideia. Os executivos
          acreditavam que a empresa não estava no negócio de criar shells — "o futuro era GUI".
          Anos depois, o PowerShell tornou-se uma das ferramentas mais estratégicas da Microsoft,
          e Snover foi reconhecido como Technical Fellow — o mais alto nível técnico da empresa.
        </AlertBox>

        <h2>O Lançamento: PowerShell 1.0 (2006)</h2>
        <p>
          Após anos como "Monad", o projeto foi lançado como <strong>Windows PowerShell</strong> em novembro de 2006,
          trazendo:
        </p>
        <ul>
          <li>Padrão <strong>Verbo-Substantivo</strong> para todos os cmdlets (<code>Get-Process</code>, <code>Stop-Service</code>...)</li>
          <li><strong>Objetos no pipeline</strong> em vez de texto</li>
          <li>Sistema de <strong>ajuda estruturada</strong> e pesquisável</li>
          <li>Integração nativa com o <strong>.NET Framework</strong></li>
          <li>Acesso ao WMI, COM e Registry como drives do sistema de arquivos</li>
        </ul>

        <h2>Linha do Tempo de Versões</h2>
        <ul>
          <li><strong>PS 1.0 (Nov 2006):</strong> Lançamento inicial. Windows XP SP2 e Server 2003. ~130 cmdlets.</li>
          <li><strong>PS 2.0 (Out 2009):</strong> Windows 7 e Server 2008 R2. PowerShell Remoting (WinRM), ISE e Background Jobs.</li>
          <li><strong>PS 3.0 (Ago 2012):</strong> Windows 8. Workflow, CIM, auto-descoberta de módulos, 2000+ cmdlets.</li>
          <li><strong>PS 4.0 (Out 2013):</strong> Desired State Configuration (DSC) — infraestrutura como código.</li>
          <li><strong>PS 5.0 (Fev 2016):</strong> Classes e enums, PackageManagement, mais OOP.</li>
          <li><strong>PS 5.1 (Jan 2017):</strong> Versão final do "Windows PowerShell". Ainda no Windows por padrão. Recebe apenas patches de segurança.</li>
          <li><strong>PS Core 6.0 (Jan 2018):</strong> Reescrito sobre .NET Core. Open-source no GitHub! Linux e macOS.</li>
          <li><strong>PS 7.0 (Mar 2020):</strong> Operador ternário, pipeline paralelo (<code>ForEach-Object -Parallel</code>), nulo-condicional.</li>
          <li><strong>PS 7.2 LTS (Nov 2021):</strong> Versão com suporte estendido. .NET 6.</li>
          <li><strong>PS 7.4 LTS (Nov 2023):</strong> Versão atual. .NET 8. Mais rápido, mais seguro, PSResourceGet.</li>
        </ul>

        <h2>A Grande Mudança: Open-Source (2016)</h2>
        <p>
          Em agosto de 2016, a Microsoft tornou o PowerShell <strong>open-source no GitHub</strong> e
          o portou para Linux e macOS. Isso marcou o início do "PowerShell Core" — reimplementação
          sobre .NET Core — e sinalizou a nova Microsoft: colaborativa, multiplataforma e orientada à comunidade.
        </p>
        <p>
          O código-fonte está disponível em <strong>github.com/PowerShell/PowerShell</strong> com mais
          de 40.000 commits, 3.000+ contribuidores externos e lançamentos mensais.
        </p>

        <CodeBlock title="Verificando sua versão e edição" code={`# Informações completas da instalação atual
  $PSVersionTable

  # Propriedades mais importantes:
  $PSVersionTable.PSVersion   # Ex: 7.4.1
  $PSVersionTable.PSEdition   # 'Desktop' (5.1) ou 'Core' (7+)
  $PSVersionTable.OS          # Sistema operacional atual
  $PSVersionTable.Platform    # Win32NT, Unix, MacOSX

  # Detectar versão no código (compatibilidade entre PS5 e PS7)
  if ($PSVersionTable.PSVersion.Major -ge 7) {
      Write-Host "PowerShell moderno — todos os recursos disponíveis!" -ForegroundColor Green
  } else {
      Write-Host "Windows PowerShell — compatibilidade limitada." -ForegroundColor Yellow
  }
  `} />

        <h2>Windows PowerShell 5.1 vs PowerShell 7+</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
          <div className="p-4 border border-border rounded-xl bg-primary/5">
            <h4 className="font-bold text-primary mb-2">Windows PowerShell (5.1)</h4>
            <ul className="text-sm space-y-1 opacity-80">
              <li>• Exclusivo para Windows</li>
              <li>• Baseado no .NET Framework 4.x</li>
              <li>• Pré-instalado em todos os PCs Windows</li>
              <li>• Não recebe novos recursos (modo de manutenção)</li>
              <li>• Melhor compatibilidade com módulos legados do Windows</li>
              <li>• Executável: <code>powershell.exe</code></li>
            </ul>
          </div>
          <div className="p-4 border border-border rounded-xl bg-accent/5">
            <h4 className="font-bold text-accent mb-2">PowerShell 7+ — Recomendado</h4>
            <ul className="text-sm space-y-1 opacity-80">
              <li>• Windows, Linux e macOS</li>
              <li>• Baseado no .NET 8+ (significativamente mais rápido)</li>
              <li>• Instalação separada (<code>winget install Microsoft.PowerShell</code>)</li>
              <li>• Recebe novos recursos continuamente</li>
              <li>• Operador ternário, pipeline paralelo, null-conditional...</li>
              <li>• Executável: <code>pwsh.exe</code></li>
            </ul>
          </div>
        </div>

        <h2>PowerShell e DevOps</h2>
        <p>
          Com a ascensão do DevOps e da automação de infraestrutura, o PowerShell tornou-se peça-chave
          no ecossistema Microsoft. Hoje ele é a espinha dorsal de:
        </p>
        <ul>
          <li><strong>Azure Automation</strong> — Runbooks para automação de nuvem</li>
          <li><strong>Azure DevOps Pipelines</strong> — Tarefas de CI/CD multiplataforma</li>
          <li><strong>GitHub Actions</strong> — Actions escritas em PowerShell</li>
          <li><strong>Desired State Configuration (DSC)</strong> — Infraestrutura como código declarativa</li>
          <li><strong>Windows Admin Center</strong> — Console de administração baseada em PS</li>
          <li><strong>Ansible (módulo win_*)</strong> — PowerShell como backend de automação Windows</li>
        </ul>

        <CodeBlock title="Exemplos de uso moderno em DevOps" code={`# Azure DevOps Pipeline — tarefa PowerShell
  # azure-pipelines.yml:
  # - task: PowerShell@2
  #   inputs:
  #     script: |
  #       $version = (Get-Content package.json | ConvertFrom-Json).version
  #       Write-Host "##vso[task.setvariable variable=APP_VERSION]$version"

  # GitHub Actions — step com PowerShell
  # .github/workflows/deploy.yml:
  # - name: Deploy
  #   shell: pwsh
  #   run: |
  #     Install-Module Az -Force -Scope CurrentUser
  #     Connect-AzAccount -Identity
  #     ./scripts/deploy.ps1

  # Desired State Configuration — declarar estado desejado
  Configuration ServidorWeb {
      Node "SRV-WEB-01" {
          WindowsFeature IIS {
              Ensure = "Present"
              Name   = "Web-Server"
          }
          File ConteudoWeb {
              Ensure          = "Present"
              Type            = "Directory"
              DestinationPath = "C:\\inetpub\\wwwroot\\app"
          }
      }
  }
  ServidorWeb
  Start-DscConfiguration -Path ".\ServidorWeb" -Wait -Verbose
  `} />

        <h2>Por que PowerShell e não Bash ou CMD?</h2>
        <CodeBlock title="Comparação prática: filtrar arquivos grandes" code={`# No Bash — manipulação de texto, frágil com espaços em nomes de arquivo:
  # ls -la | awk '$5 > 1048576 {print $NF}'

  # No CMD — impossível nativamente sem ferramentas externas

  # No PowerShell — objetos reais, seguro, claro e autodescritivo:
  Get-ChildItem | Where-Object { $_.Length -gt 1MB } | Select-Object Name, Length

  # O PS roda em qualquer plataforma:
  # pwsh -Command "Get-ChildItem /var/log | Where-Object Length -gt 1MB"

  # Vantagem fundamental: tipos de dados reais (não strings)
  $tamanho = 5GB          # Um número: 5368709120 (não texto)
  $data    = Get-Date     # Um objeto [DateTime]
  $data.AddDays(30)       # Adicionar 30 dias sem parseamento de string
  (Get-Process).Count     # Um inteiro — sem cortar texto de ls | wc -l
  `} />

        <AlertBox type="warning" title="Compatibilidade de Módulos Legados">
          Alguns módulos antigos de Active Directory, Exchange ou outros produtos Microsoft
          ainda exigem Windows PowerShell 5.1. O PS 7 tem uma camada de compatibilidade
          (<code>Import-Module -UseWindowsPowerShell</code>) mas com limitações.
          Em ambientes corporativos, é comum usar ambos os PowerShells em paralelo.
        </AlertBox>

        <AlertBox type="success" title="Como instalar o PowerShell 7 agora">
          Via winget (Windows 10+):
          <code style={{'{'}}{{'}'} display:'block', marginTop:'0.5rem' {'}'}}>winget install Microsoft.PowerShell</code>
          Após instalado, abra com o comando <code>pwsh</code>. Ele coexiste perfeitamente com o 5.1.
        </AlertBox>
      </PageContainer>
    );
  }
  