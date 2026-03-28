import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Ajuda() {
  return (
    <PageContainer
      title="O Sistema de Ajuda"
      subtitle="Aprenda a descobrir comandos, parâmetros e exemplos sem precisar do Google."
      difficulty="iniciante"
      timeToRead="15 min"
    >
      <p>
        A maior vantagem do PowerShell é que ele é <strong>auto-documentado</strong>. Você não precisa decorar milhares de flags. Se você dominar os três cmdlets de descoberta, conseguirá aprender qualquer módulo novo em minutos — sem sair do terminal.
      </p>

      <h2>O Trio de Ouro da Descoberta</h2>
      <ol className="space-y-4 my-6">
        <li><strong>Get-Command:</strong> "O que eu posso fazer?" — Lista todos os comandos disponíveis no sistema.</li>
        <li><strong>Get-Help:</strong> "Como eu uso isso?" — Exibe o manual completo de um comando com exemplos reais.</li>
        <li><strong>Get-Member:</strong> "O que esse comando me devolve?" — Mostra as propriedades e métodos do objeto retornado.</li>
      </ol>

      <hr className="my-8 opacity-20" />

      <h2>1. Get-Command: Encontrando Cmdlets</h2>
      <p>
        O <code>Get-Command</code> pesquisa por verbos, substantivos ou padrões em todos os módulos instalados — inclusive os ainda não carregados na sessão.
      </p>
      <CodeBlock
        title="Buscando comandos de forma avançada"
        language="powershell"
        code={`# Listar todos os comandos que lidam com 'Process'
Get-Command *Process*

# Listar comandos que usam o verbo 'Restart'
Get-Command -Verb Restart

# Listar comandos que lidam com o substantivo 'Service'
Get-Command -Noun Service

# Buscar comandos de um módulo específico
Get-Command -Module NetTCPIP
Get-Command -Module ActiveDirectory

# Descobrir qual o executável real por trás de um alias
Get-Command ls      # → Get-ChildItem
Get-Command dir     # → Get-ChildItem

# Verificar o tipo de um comando (função, alias, cmdlet, aplicativo externo)
Get-Command notepad | Select-Object Name, CommandType, Source

# Encontrar onde um executável está no PATH
Get-Command python | Select-Object -ExpandProperty Source`}
      />

      <h2>2. Get-Help: O Manual Completo</h2>
      <p>
        Ao contrário de outros shells, a ajuda do PowerShell é estruturada, rica em exemplos e pode ser filtrada por seção.
      </p>
      <AlertBox type="warning" title="Atualize sua ajuda primeiro!">
        A documentação detalhada não vem instalada por padrão para economizar espaço. Execute o comando abaixo como Administrador uma vez para baixar tudo:
        <code className="block mt-2 font-mono">Update-Help -Force -ErrorAction SilentlyContinue</code>
      </AlertBox>

      <CodeBlock
        title="Usando Get-Help em todos os níveis"
        language="powershell"
        code={`# Ajuda básica — sinopse e sintaxe
Get-Help Get-Service

# Ajuda com exemplos práticos (o mais útil no dia a dia!)
Get-Help Get-Service -Examples

# Ajuda completa — detalhes de cada parâmetro e tipo aceito
Get-Help Get-Service -Full

# Mostrar apenas os parâmetros e suas descrições
Get-Help Get-Service -Parameter *

# Informações sobre um parâmetro específico
Get-Help Get-Service -Parameter Name

# Abrir a documentação oficial no navegador (requer internet)
Get-Help Get-Service -Online

# Mostrar ajuda em uma janela separada (apenas Windows)
Get-Help Get-Service -ShowWindow

# Buscar ajuda sobre um conceito (não apenas cmdlets)
Get-Help about_*          # Lista todos os tópicos conceituais
Get-Help about_Pipeline   # Explica o pipeline em detalhes
Get-Help about_Operators  # Todos os operadores do PS`}
      />

      <h3>Entendendo a Sintaxe da Ajuda</h3>
      <p>
        Ao ler a saída de <code>Get-Help</code>, você verá colchetes <code>[]</code>. Eles significam coisas diferentes dependendo de onde aparecem:
      </p>
      <ul>
        <li><code>[-Name] &lt;string[]&gt;</code> — O nome do parâmetro está em colchetes: é <strong>posicional</strong> (pode omitir <code>-Name</code> e passar o valor direto).</li>
        <li><code>&lt;string[]&gt;</code> — O <code>[]</code> após o tipo indica que aceita <strong>múltiplos valores</strong> (um array).</li>
        <li><code>[[-Name] &lt;string&gt;]</code> — Todo o bloco em colchetes: parâmetro <strong>opcional</strong>.</li>
        <li><code>-Switch</code> — Parâmetro sem valor: é uma <strong>flag</strong> (presente = $true, ausente = $false).</li>
      </ul>

      <CodeBlock
        title="Lendo a sintaxe corretamente"
        language="powershell"
        code={`# Get-ChildItem tem este parâmetro: [[-Path] <string[]>]
# Isso significa:
# 1. -Path é POSICIONAL (não precisa escrever -Path)
# 2. Aceita MÚLTIPLOS caminhos (array de strings)
# 3. É OPCIONAL (tem um valor padrão — a pasta atual)

# Todas as formas abaixo são equivalentes:
Get-ChildItem -Path "C:\\Windows"
Get-ChildItem "C:\\Windows"              # posicional
Get-ChildItem "C:\\Windows", "C:\\Temp"  # múltiplos valores`}
      />

      <h2>3. Get-Member: Explorando Objetos</h2>
      <p>
        Como o PowerShell passa <strong>objetos</strong> pelo pipeline, você precisa saber quais "peças" compõem esses objetos para poder filtrar, formatar e agir sobre eles com precisão.
      </p>
      <CodeBlock
        title="Descobrindo propriedades e métodos de objetos"
        language="powershell"
        code={`# Quais informações um objeto de Serviço possui?
Get-Service | Get-Member

# Filtrar apenas por tipo de membro
Get-Service | Get-Member -MemberType Property     # Apenas dados/propriedades
Get-Service | Get-Member -MemberType Method       # Apenas ações/métodos
Get-Service | Get-Member -MemberType ScriptMethod # Métodos adicionados pelo PS

# Fluxo de descoberta típico:
# Passo 1: Saber o que o objeto tem
Get-Service | Get-Member

# Passo 2: Usar a propriedade descoberta (ex: 'Status')
Get-Service | Where-Object Status -eq "Running"

# Passo 3: Invocar um método descoberto (ex: 'Stop()')
(Get-Service -Name "Spooler").Stop()

# Ver o tipo real do objeto
Get-Service | ForEach-Object { $_.GetType().FullName }
# System.ServiceProcess.ServiceController`}
      />

      <h2>4. Show-Command: Ajuda Visual Interativa</h2>
      <p>
        Pouco conhecido mas extremamente útil para iniciantes: <code>Show-Command</code> abre uma janela gráfica com todos os parâmetros de um cmdlet, permitindo que você preencha os campos e gere o comando.
      </p>

      <CodeBlock
        title="Interface gráfica para montar comandos"
        language="powershell"
        code={`# Abrir a janela gráfica para Get-EventLog
Show-Command Get-EventLog

# Abrir para qualquer cmdlet
Show-Command Invoke-Command
Show-Command Send-MailMessage

# Sem argumento — abre um catálogo de TODOS os comandos
Show-Command`}
      />

      <h2>5. O Parâmetro -? (Atalho Rápido)</h2>
      <p>
        Se você estiver com pressa, adicione <code>-?</code> ao final de qualquer comando para ver uma ajuda rápida e sintaxe sem precisar do <code>Get-Help</code>.
      </p>
      <CodeBlock
        language="powershell"
        code={`Get-Process -?
Invoke-WebRequest -?
New-Item -?`}
      />

      <h2>Fluxo de Aprendizagem de um Módulo Novo</h2>

      <CodeBlock
        title="Como dominar qualquer módulo em 5 minutos"
        language="powershell"
        code={`# Exemplo: Aprender o módulo de DNS do Windows Server

# 1. Quais comandos existem?
Get-Command -Module DnsServer

# 2. O que o comando principal faz?
Get-Help Get-DnsServerResourceRecord -Examples

# 3. Que tipo de objeto ele retorna?
Get-DnsServerResourceRecord -ZoneName "empresa.local" | Get-Member

# 4. Usar o que descobrimos
Get-DnsServerResourceRecord -ZoneName "empresa.local" |
    Where-Object RecordType -eq "A" |
    Select-Object HostName, TimeToLive, RecordData

# 5. O mesmo padrão funciona para QUALQUER módulo!
# Azure, Active Directory, Exchange, Kubernetes (kubectl wrapping), etc.`}
      />

      <AlertBox type="success" title="Conselho de Especialista">
        Desenvolva o hábito de sempre rodar <code>| Get-Member</code> quando um comando retornar algo inesperado. Entender o tipo do objeto que você está manipulando resolve 90% das dúvidas de filtragem e formatação — sem precisar pesquisar na internet.
      </AlertBox>
    </PageContainer>
  );
}
