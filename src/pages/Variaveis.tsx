import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Variaveis() {
  return (
    <PageContainer
      title="Variáveis no PowerShell"
      subtitle="Entenda como armazenar e manipular dados usando variáveis, tipos e escopos."
      difficulty="iniciante"
      timeToRead="20 min"
    >
      <p>
        No PowerShell, uma variável é uma unidade de memória na qual você pode armazenar dados. 
        Diferente de muitas linguagens de programação tradicionais, as variáveis no PowerShell 
        podem armazenar objetos completos, não apenas texto ou números simples. 
        Todas as variáveis começam com o caractere especial <code>$</code>.
      </p>

      <h2>Declaração Básica</h2>
      <p>
        Para criar uma variável, basta digitar o nome precedido por <code>$</code> e atribuir um valor 
        usando o operador de atribuição (<code>=</code>).
      </p>

      <CodeBlock
        title="Exemplos de atribuição simples"
        code={`# Armazenando uma string
$nome = "PowerShell"

# Armazenando um número inteiro
$versao = 7

# Armazenando o resultado de um comando (objeto)
$processos = Get-Process

# Exibindo o conteúdo
$nome
$versao
`}
      />

      <AlertBox type="info" title="Sensibilidade a maiúsculas">
        O PowerShell não diferencia maiúsculas de minúsculas (case-insensitive) para nomes de variáveis. 
        <code>$Nome</code> e <code>$nome</code> referem-se à mesma variável.
      </AlertBox>

      <h2>Tipos de Dados e Tipagem</h2>
      <p>
        O PowerShell é uma linguagem dinamicamente tipada por padrão, o que significa que ele tenta 
        adivinhar o tipo de dado automaticamente. No entanto, você pode forçar um tipo específico 
        usando "Type Casting".
      </p>

      <CodeBlock
        title="Trabalhando com tipos de dados"
        code={`# Tipagem dinâmica (automática)
$valor = 10         # System.Int32
$valor = "Dez"      # System.String

# Type Casting (Forçando o tipo)
[int]$numero = "10" # Converte a string "10" para o inteiro 10
[bool]$ligado = 1    # Converte 1 para True

# Aceleradores de tipo comuns
# [string], [int], [double], [bool], [array], [hashtable], [datetime], [xml]

# Verificando o tipo de uma variável
$numero.GetType().FullName
`}
      />

      <h2>Variáveis Automáticas</h2>
      <p>
        O PowerShell reserva algumas variáveis para fins específicos. Estas são criadas e mantidas 
        pelo próprio motor do PowerShell.
      </p>

      <CodeBlock
        title="Variáveis de sistema importantes"
        code={`# $_ ou $PSItem: Representa o objeto atual no pipeline
1..5 | ForEach-Object { $_ * 2 }

# $args: Array de argumentos passados para uma função/script não nomeados
# $Error: Array que contém os erros mais recentes ( $Error[0] é o último )
# $LastExitCode: O código de saída do último programa executado (útil para apps .exe)
# $ExecutionContext: Informações sobre o ambiente de execução

# Variáveis Booleanas
$true   # Representa verdadeiro
$false  # Representa falso
$null   # Representa um valor nulo ou vazio
`}
      />

      <AlertBox type="warning" title="Dica de Comparação com $null">
        Ao comparar variáveis com $null, coloque sempre o $null à esquerda: 
        <code>if ($null -eq $variavel)</code>. Isso evita comportamentos inesperados 
        ao lidar com coleções/arrays.
      </AlertBox>

      <h2>Variáveis de Ambiente</h2>
      <p>
        Você pode acessar variáveis de ambiente do sistema operacional (como PATH ou USERNAME) 
        usando o drive <code>env:</code>.
      </p>

      <CodeBlock
        title="Acessando o ambiente"
        code={`# Listar todas as variáveis de ambiente
Get-ChildItem env:

# Acessar uma variável específica
$env:COMPUTERNAME
$env:USERPROFILE

# Criar ou modificar uma variável de ambiente (apenas para a sessão atual)
$env:MINHA_VAR = "AlgumValor"
`}
      />

      <h2>Escopo de Variáveis</h2>
      <p>
        O escopo determina onde uma variável pode ser lida ou alterada. Os escopos principais são: 
        Global, Local, Script e Private.
      </p>

      <CodeBlock
        title="Exemplos de escopo"
        code={`# Escopo Global: Disponível em toda a sessão atual
$global:configuracao = "Geral"

# Escopo de Script: Disponível apenas dentro do arquivo .ps1 atual
$script:interna = 123

# Escopo Local: Padrão dentro de funções ou no contexto atual
$valorLocal = "Oi"

# Usando o modificador 'using' para passar variáveis para sessões remotas ou jobs
$x = 10
Start-Job -ScriptBlock { $using:x + 5 } | Receive-Job -Wait
`}
      />

      <h2>Cmdlets de Gerenciamento</h2>
      <p>
        Embora o uso de <code>$var = valor</code> seja o mais comum, existem cmdlets que oferecem 
        mais controle, como a criação de constantes ou variáveis somente leitura.
      </p>

      <CodeBlock
        title="Controle avançado de variáveis"
        code={`# Criar uma constante (não pode ser alterada nem removida na sessão)
Set-Variable -Name PI -Value 3.14159 -Option Constant

# Criar uma variável somente leitura (pode ser removida com -Force)
Set-Variable -Name VersaoApp -Value "1.0.0" -Option ReadOnly

# Obter informações sobre uma variável
Get-Variable -Name PI

# Remover uma variável
Remove-Variable -Name valorLocal
`}
      />

      <AlertBox type="danger" title="Cuidado com Constantes">
        Variáveis definidas com a opção <code>Constant</code> não podem ser alteradas ou 
        removidas até que a sessão do PowerShell seja fechada. Use com parcimônia.
      </AlertBox>
    </PageContainer>
  );
}
