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
        A maior vantagem do PowerShell é que ele é <strong>auto-documentado</strong>. Você não precisa decorar milhares de flags. Se você souber usar os três cmdlets de descoberta, você pode dominar qualquer módulo novo em minutos.
      </p>

      <h2>O Trio de Ouro da Descoberta</h2>
      <ol className="space-y-4 my-6">
        <li><strong>Get-Command:</strong> "O que eu posso fazer?" (Lista os comandos disponíveis).</li>
        <li><strong>Get-Help:</strong> "Como eu uso isso?" (Mostra o manual do comando).</li>
        <li><strong>Get-Member:</strong> "O que esse comando me devolve?" (Mostra as propriedades e métodos do objeto).</li>
      </ol>

      <hr className="my-8 opacity-20" />

      <h2>1. Get-Command: Encontrando Cmdlets</h2>
      <p>
        O <code>Get-Command</code> pesquisa por verbos, substantivos ou padrões em todos os módulos instalados.
      </p>
      <CodeBlock
        title="Exemplos de busca de comandos"
        code={`# Listar todos os comandos que lidam com 'Process'
Get-Command *Process*

# Listar todos os comandos que usam o verbo 'Restart'
Get-Command -Verb Restart

# Listar comandos de um módulo específico (ex: Rede)
Get-Command -Module NetTCPIP

# Descobrir qual o executável real por trás de um alias
Get-Command ls
`}
      />

      <h2>2. Get-Help: O Manual Completo</h2>
      <p>
        Ao contrário de outros shells, a ajuda do PowerShell é estruturada e contém exemplos reais.
      </p>
      <AlertBox type="warning" title="Atualize sua ajuda!">
        A ajuda não vem instalada por padrão para economizar espaço. Antes de começar, rode o comando abaixo como Administrador:
        <code className="block mt-2 font-mono">Update-Help -Force -ErrorAction SilentlyContinue</code>
      </AlertBox>

      <CodeBlock
        title="Níveis de detalhamento da ajuda"
        code={`# Ajuda básica (sinopse e sintaxe)
Get-Help Get-Service

# Ajuda com exemplos práticos (O mais útil!)
Get-Help Get-Service -Examples

# Ajuda completa (detalhes de cada parâmetro)
Get-Help Get-Service -Full

# Abrir a documentação oficial no navegador
Get-Help Get-Service -Online

# Mostrar ajuda em uma janela separada (apenas Windows)
Get-Help Get-Service -ShowWindow
`}
      />

      <h3>Entendendo a Sintaxe</h3>
      <p>
        Ao ler a ajuda, você verá colchetes <code>[]</code>. Eles são fundamentais:
      </p>
      <ul>
        <li><code>[-Name] &lt;string[]&gt;</code>: O nome do parâmetro está em colchetes, então ele é <strong>posicional</strong> (você pode omitir <code>-Name</code>).</li>
        <li><code>&lt;string[]&gt;</code>: Aceita uma lista de textos.</li>
        <li><code>[ParâmetroOpcional]</code>: Todo o bloco está em colchetes, então o parâmetro não é obrigatório.</li>
      </ul>

      <h2>3. Get-Member: Explorando Objetos</h2>
      <p>
        Como o PowerShell passa objetos pelo pipeline, você precisa saber quais "peças" compõem esse objeto para poder filtrar ou formatar.
      </p>
      <CodeBlock
        title="Descobrindo propriedades e métodos"
        code={`# Quais informações um objeto de 'Serviço' possui?
Get-Service | Get-Member

# Filtrar apenas por propriedades (dados)
Get-Service | Get-Member -MemberType Property

# O Get-Member revela que existe uma propriedade chamada 'Status'
# Agora sabemos que podemos usá-la:
Get-Service | Where-Object Status -eq "Running"
`}
      />

      <h2>Aliases: Apelidos Práticos</h2>
      <p>
        O PowerShell criou aliases para comandos comuns de outros shells para facilitar a transição.
      </p>
      <CodeBlock
        title="Trabalhando com Aliases"
        code={`# Listar todos os aliases (ex: dir -> Get-ChildItem)
Get-Alias

# Qual o comando real por trás de 'cat'?
Get-Alias cat

# Criar seu próprio alias (temporário)
Set-Alias c cls
`}
      />

      <AlertBox type="danger" title="Boa Prática">
        Use aliases no terminal para ganhar velocidade, mas <strong>NUNCA</strong> use aliases em scripts. Em scripts, sempre use o nome completo do cmdlet (ex: <code>Get-ChildItem</code> em vez de <code>ls</code>) para que outras pessoas consigam ler seu código.
      </AlertBox>

      <h2>O parâmetro -? (Shorthand)</h2>
      <p>
        Se você estiver com pressa, pode simplesmente adicionar <code>-?</code> ao final de qualquer comando para ver uma ajuda rápida.
      </p>
      <CodeBlock
        code={`Get-Process -?`}
      />

      <p>
        Dominar o sistema de ajuda é o que diferencia um digitador de comandos de um verdadeiro administrador de sistemas. Com <code>Get-Help</code> e <code>Get-Member</code>, não existe comando "secreto" no PowerShell.
      </p>
    </PageContainer>
  );
}
