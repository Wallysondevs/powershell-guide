import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function PrimeirosPassos() {
  return (
    <PageContainer
      title="Primeiros Passos"
      subtitle="Dominando a interface, atalhos e os conceitos fundamentais do terminal."
      difficulty="iniciante"
      timeToRead="15 min"
    >
      <p>
        Agora que você tem o PowerShell 7 instalado, é hora de aprender a "dirigir" essa máquina. O PowerShell é amigável, mas tem truques de produtividade que farão você economizar horas de digitação.
      </p>

      <h2>O Comando de Início: pwsh</h2>
      <p>
        Diferente do Windows PowerShell (que usa o executável <code>powershell.exe</code>), a versão moderna (Core) usa o comando <code>pwsh</code>.
      </p>
      <CodeBlock
        title="Iniciando o PowerShell moderno"
        code={`# No Windows Terminal ou CMD
pwsh
`}
      />

      <h2>A Filosofia Verbo-Substantivo</h2>
      <p>
        Quase todos os comandos do PowerShell seguem o padrão <code>Verbo-Substantivo</code>. Isso torna a linguagem extremamente previsível. Se você quer "obter" algo, o verbo é <code>Get</code>. Se quer "definir", é <code>Set</code>.
      </p>
      <ul>
        <li><code>Get-Service</code>: Obtém informações sobre serviços.</li>
        <li><code>Start-Service</code>: Inicia um serviço.</li>
        <li><code>New-Item</code>: Cria um novo arquivo ou pasta.</li>
        <li><code>Remove-Item</code>: Deleta algo.</li>
      </ul>

      <AlertBox type="success" title="Dica Prática">
        Sempre use o singular para o substantivo. É <code>Get-Service</code> e não <code>Get-Services</code>.
      </AlertBox>

      <h2>Atalhos de Teclado (Produtividade)</h2>
      <p>
        Dominar o shell significa usar menos o mouse. Aqui estão os atalhos que você usará 90% do tempo:
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        <div className="p-4 border border-border rounded-xl">
          <p><strong>TAB:</strong> Auto-completa comandos, parâmetros e nomes de arquivos. Aperte várias vezes para ciclar.</p>
          <p><strong>Ctrl + R:</strong> Pesquisa reversa no histórico. Digite uma parte de um comando antigo para encontrá-lo.</p>
        </div>
        <div className="p-4 border border-border rounded-xl">
          <p><strong>Seta para Cima/Baixo:</strong> Navega pelo histórico de comandos recentemente digitados.</p>
          <p><strong>Alt + F7:</strong> Limpa o histórico da sessão atual.</p>
        </div>
      </div>

      <h2>Navegação Básica</h2>
      <p>
        O PowerShell usa o conceito de <strong>PSProviders</strong>, o que permite que você navegue em pastas, registro e certificados como se fossem unidades de disco.
      </p>
      <CodeBlock
        title="Comandos básicos de navegação"
        code={`# Onde eu estou? (Print Working Directory)
Get-Location  # Alias: pwd

# Listar o que tem aqui?
Get-ChildItem # Alias: ls ou dir

# Entrar em uma pasta?
Set-Location "C:\\Users" # Alias: cd

# Voltar para a Home do usuário
cd ~
`}
      />

      <h2>Interagindo com Objetos</h2>
      <p>
        Este é o conceito mais importante: <strong>Tudo no PowerShell é um objeto</strong>. Quando você lista processos, você não recebe apenas um texto com o nome do processo, você recebe um objeto que tem propriedades como ID, Memória e CPU.
      </p>

      <CodeBlock
        title="Provando que tudo é objeto"
        code={`# Vamos pegar o processo do próprio PowerShell e guardar em uma variável
$meuProcesso = Get-Process -Id $PID

# Agora podemos acessar propriedades específicas
$meuProcesso.Name
$meuProcesso.StartTime
$meuProcesso.CPU

# Ou até executar métodos (ações)
# $meuProcesso.Kill() # Cuidado: isso fecharia o terminal!
`}
      />

      <h2>O Perfil do PowerShell ($PROFILE)</h2>
      <p>
        Você pode personalizar seu terminal para que ele carregue aliases, funções ou mude as cores toda vez que iniciar. Isso é feito no arquivo de <strong>Profile</strong>.
      </p>

      <CodeBlock
        title="Criando seu arquivo de configuração"
        code={`# Verifique onde fica o caminho do seu profile
$PROFILE

# O arquivo existe? Se não, vamos criar
if (!(Test-Path $PROFILE)) {
    New-Item -Type File -Path $PROFILE -Force
}

# Abrir o profile no VS Code para editar
code $PROFILE
`}
      />

      <AlertBox type="info" title="O que colocar no Profile?">
        Muitas pessoas adicionam <code>Clear-Host</code> no início, criam aliases personalizados como <code>Set-Alias g git</code>, ou configuram temas como o <strong>Oh My Posh</strong>.
      </AlertBox>

      <h2>Limpando e Saindo</h2>
      <CodeBlock
        title="Comandos de encerramento"
        code={`# Limpar a tela (mais fácil de ler)
Clear-Host # Alias: cls

# Fechar o PowerShell
exit
`}
      />

      <p>
        Com esses fundamentos, você já consegue navegar e explorar o sistema. No próximo capítulo, aprenderemos o recurso mais valioso do PowerShell: o <strong>Sistema de Ajuda</strong>. Nunca tente decorar comandos, aprenda a encontrá-los!
      </p>
    </PageContainer>
  );
}
