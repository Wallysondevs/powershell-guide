import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Historia() {
  return (
    <PageContainer
      title="História e Evolução"
      subtitle="Do Monad ao PowerShell 7: a jornada da shell mais poderosa da Microsoft."
      difficulty="iniciante"
      timeToRead="12 min"
    >
      <p>
        O PowerShell não surgiu do nada. Ele foi o resultado de anos de frustração com as limitações do CMD e a necessidade de uma ferramenta de automação que pudesse competir com os shells do Unix, mas mantendo a filosofia de objetos do ecossistema Windows.
      </p>

      <h2>O Nascimento: Projeto Monad (2002)</h2>
      <p>
        Em 2002, <strong>Jeffrey Snover</strong> — um engenheiro da Microsoft — publicou um documento interno chamado <em>"Monad Manifesto"</em>. Nele, ele descrevia uma nova abordagem radical para automação de sistemas: em vez de passar texto de um comando para outro (e precisar de ferramentas como <code>awk</code>, <code>sed</code> e <code>grep</code> para extrair informações), os comandos passariam <strong>objetos .NET estruturados</strong> uns para os outros.
      </p>
      <p>
        A visão era simples mas poderosa: se você quer a data de criação de um arquivo, não deveria precisar "cortar" a 8ª coluna de um texto formatado — você simplesmente acessa a propriedade <code>.CreationTime</code> do objeto arquivo.
      </p>

      <AlertBox type="info" title="Fato Histórico: O Rebaixamento que virou Revolução">
        Jeffrey Snover foi <strong>rebaixado</strong> na Microsoft por sua ideia. Os executivos acreditavam que a Microsoft não estava no negócio de criar shells de linha de comando — afinal, "o futuro era GUI". Anos depois, o PowerShell se tornaria uma das ferramentas mais importantes do ecossistema Microsoft, e Snover se tornaria um dos engenheiros mais respeitados e influentes da empresa.
      </AlertBox>

      <h2>O Lançamento: PowerShell 1.0 (2006)</h2>
      <p>
        Após anos de desenvolvimento interno sob o codinome "Monad", o projeto foi renomeado para <strong>Windows PowerShell</strong> e lançado em novembro de 2006. Foi uma revolução para administradores de sistemas Windows, trazendo:
      </p>
      <ul>
        <li>O padrão <strong>Verbo-Substantivo</strong> para nomear todos os comandos (<code>Get-Process</code>, <code>Stop-Service</code>...)</li>
        <li>A filosofia de <strong>objetos no pipeline</strong> em vez de texto</li>
        <li>Sistema nativo de <strong>ajuda</strong> estruturada e pesquisável</li>
        <li>Integração profunda com o <strong>.NET Framework</strong></li>
      </ul>

      <h2>Linha do Tempo de Versões</h2>
      <ul>
        <li><strong>PS 1.0 (Nov 2006):</strong> Lançamento inicial. Disponível para Windows XP SP2 e Server 2003. Cerca de 130 cmdlets.</li>
        <li><strong>PS 2.0 (Out 2009):</strong> Integrado ao Windows 7 e Server 2008 R2. Trouxe o <strong>PowerShell Remoting</strong> via WinRM, o ISE (Integrated Scripting Environment) e os Background Jobs.</li>
        <li><strong>PS 3.0 (Ago 2012):</strong> Parte do Windows 8. Introduziu o Workflow, melhorias no CIM, auto-descoberta de módulos e mais de 2000 cmdlets disponíveis.</li>
        <li><strong>PS 4.0 (Out 2013):</strong> Introduziu o <strong>Desired State Configuration (DSC)</strong> — infraestrutura como código para Windows.</li>
        <li><strong>PS 5.0 (Fev 2016):</strong> Classes e enums, PackageManagement, OneGet, e OneGet. Mais recursos de OOP.</li>
        <li><strong>PS 5.1 (Jan 2017):</strong> A versão final do "Windows PowerShell". Ainda presente em todos os PCs Windows como padrão. Recebe apenas correções de segurança.</li>
        <li><strong>PS Core 6.0 (Jan 2018):</strong> Reescrito sobre o .NET Core. Open-source! Multiplataforma (Windows/Linux/macOS).</li>
        <li><strong>PS 7.0 (Mar 2020):</strong> Operador ternário, pipeline paralelo (<code>ForEach-Object -Parallel</code>), melhor compatibilidade com módulos Windows.</li>
        <li><strong>PS 7.4+ (2024):</strong> Versão atual com suporte a longo prazo (LTS). Baseado no .NET 8. Mais rápido e mais seguro.</li>
      </ul>

      <h2>A Grande Mudança: Open-Source e Multiplataforma (2016)</h2>
      <p>
        Em agosto de 2016, a Microsoft fez algo que parecia impensável: tornou o PowerShell <strong>open-source</strong> no GitHub e o portou para <strong>Linux e macOS</strong>. Isso marcou o início do "PowerShell Core" — uma reimplementação completa sobre o .NET Core.
      </p>
      <p>
        A partir daí, o Windows PowerShell 5.1 entrou em modo de manutenção. Todo o desenvolvimento de novas funcionalidades migrou para o que hoje chamamos simplesmente de <strong>PowerShell 7+</strong>.
      </p>

      <CodeBlock
        title="Verificando sua versão e edição"
        language="powershell"
        code={`# Ver informações completas da versão
$PSVersionTable

# As propriedades mais importantes:
$PSVersionTable.PSVersion      # Versão (ex: 7.4.1)
$PSVersionTable.PSEdition      # 'Desktop' (5.1) ou 'Core' (7+)
$PSVersionTable.OS             # O sistema operacional atual

# Verificar programaticamente se está no PS 7
if ($PSVersionTable.PSVersion.Major -ge 7) {
    Write-Host "Você está usando PowerShell moderno!" -ForegroundColor Green
} else {
    Write-Host "Windows PowerShell legado — considere atualizar." -ForegroundColor Yellow
}`}
      />

      <h2>Windows PowerShell 5.1 vs PowerShell 7+</h2>
      <p>
        É crucial entender a diferença entre os dois, pois você provavelmente encontrará ambos no seu dia a dia profissional:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        <div className="p-4 border border-border rounded-xl bg-primary/5">
          <h4 className="font-bold text-primary mb-2">Windows PowerShell (5.1)</h4>
          <ul className="text-sm space-y-1 opacity-80">
            <li>• Exclusivo para Windows</li>
            <li>• Baseado no .NET Framework 4.x</li>
            <li>• Pré-instalado em todos os PCs Windows</li>
            <li>• Não recebe novos recursos</li>
            <li>• Melhor compatibilidade com módulos legados</li>
            <li>• Inicia com: <code>powershell.exe</code></li>
          </ul>
        </div>
        <div className="p-4 border border-border rounded-xl bg-accent/5">
          <h4 className="font-bold text-accent mb-2">PowerShell (7.x) — Recomendado</h4>
          <ul className="text-sm space-y-1 opacity-80">
            <li>• Windows, Linux e macOS</li>
            <li>• Baseado no .NET 6/7/8+ (muito mais rápido)</li>
            <li>• Instalação separada (download necessário)</li>
            <li>• Recebe novos recursos constantemente</li>
            <li>• Operador ternário, pipeline paralelo...</li>
            <li>• Inicia com: <code>pwsh.exe</code></li>
          </ul>
        </div>
      </div>

      <h2>Por que PowerShell e não Bash ou CMD?</h2>
      <p>
        O <strong>CMD</strong> é extremamente limitado: sem lógica booleana real, sem objetos, sem tipos de dados. O <strong>Bash</strong> é poderoso, mas exige que você seja mestre em <code>awk</code>, <code>sed</code> e <code>grep</code> para extrair informações de texto.
      </p>

      <CodeBlock
        title="Comparação prática: filtrar arquivos grandes"
        language="powershell"
        code={`# No Bash — manipulação de texto, frágil com espaços em nomes:
# ls -la | awk '$5 > 1048576 {print $NF}'

# No CMD — impossível sem ferramentas externas

# No PowerShell — objetos reais, sintaxe clara e segura:
Get-ChildItem | Where-Object { $_.Length -gt 1MB } | Select-Object Name, Length

# O PowerShell também roda em Linux/macOS:
# pwsh -Command "Get-ChildItem /var/log | Where-Object Length -gt 1MB"

# Outra vantagem: tipos de dados reais
$tamanho = 5GB          # não é string — é um número: 5368709120
$data = Get-Date        # não é string — é um objeto [DateTime]
$data.AddDays(30)       # adicionar 30 dias sem formatar e parsear strings`}
      />

      <AlertBox type="warning" title="Compatibilidade de Módulos">
        Embora o PowerShell 7 seja o futuro, alguns módulos antigos do <strong>Active Directory</strong>, <strong>Exchange</strong> ou outros produtos Microsoft podem ainda exigir o Windows PowerShell 5.1. O PS 7 tem uma camada de compatibilidade (<code>WindowsCompatibility</code>) para rodar esses módulos legados, mas com algumas limitações.
      </AlertBox>

      <AlertBox type="success" title="Como instalar o PowerShell 7">
        Instale o PowerShell 7 via winget (Windows 10+):
        <code style={{display:'block', marginTop:'0.5rem'}}>winget install --id Microsoft.PowerShell --source winget</code>
        Depois de instalado, abra com <code>pwsh</code> no terminal. Ele coexiste com o 5.1 sem problemas.
      </AlertBox>
    </PageContainer>
  );
}
