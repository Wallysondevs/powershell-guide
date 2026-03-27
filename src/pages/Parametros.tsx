import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Parametros() {
  return (
    <PageContainer
      title="Parâmetros e Flags"
      subtitle="Entenda como ler, interpretar e usar parâmetros em qualquer comando PowerShell — sem precisar adivinhar."
      difficulty="iniciante"
      timeToRead="20 min"
    >
      <p>
        Um <strong>parâmetro</strong> (ou <em>flag</em>) é uma instrução adicional que você passa a um comando
        para modificar o que ele faz ou para fornecer dados que ele precisa. Aprender a ler e usar parâmetros
        é a habilidade mais importante do PowerShell — ela te dá acesso a 100% do que qualquer comando pode fazer.
      </p>

      <h2>Anatomia de um Comando com Parâmetros</h2>
      <p>
        Todo comando PowerShell segue a mesma estrutura. Veja como ler cada parte:
      </p>

      <CodeBlock
        title="Estrutura de um comando PowerShell"
        code={`#  Verbo-Substantivo   -NomeDoParâmetro    Valor
#  ───────────────────  ──────────────────  ─────
    Get-ChildItem        -Path               "C:\\Windows"
    Get-ChildItem        -Path               "C:\\Windows"   -Recurse   -Filter "*.log"
#                                                            ↑ switch    ↑ com valor

# Partes de um comando:
# 1. Verbo-Substantivo  → o nome do comando (ex: Get-ChildItem)
# 2. -NomeDoParâmetro   → começa com hífen (-), identifica qual informação você está passando
# 3. Valor              → o dado que você passa para o parâmetro (ex: "C:\\Windows")
# 4. Switch             → parâmetro sem valor, só presença/ausência ativa/desativa
`}
      />

      <AlertBox type="info" title="Parâmetros sempre começam com -">
        Toda flag/parâmetro no PowerShell começa com um hífen (<code>-</code>). Isso os distingue dos valores.
        Se você ver <code>-Recurse</code>, <code>-Force</code>, <code>-Path</code>, todos são parâmetros.
        O valor vem logo depois, sem hífen.
      </AlertBox>

      <h2>Os 3 Tipos de Parâmetro</h2>

      <h3>Tipo 1 — Parâmetro Nomeado (o mais comum)</h3>
      <p>Você escreve o nome do parâmetro com <code>-</code> seguido do valor:</p>

      <CodeBlock
        title="Parâmetros nomeados — você escolhe o nome"
        code={`# Formato: -NomeDoParâmetro Valor
Get-Process -Name "notepad"
#           ↑               ↑
#           parâmetro       valor: qual processo buscar

Get-ChildItem -Path "C:\\Users" -Filter "*.txt"
#             ↑                 ↑
#             onde buscar       filtrar por extensão

Copy-Item -Path "C:\\origem\\arquivo.txt" -Destination "D:\\backup\\"
#         ↑                               ↑
#         o que copiar                    para onde copiar

# A ORDEM não importa para parâmetros nomeados!
# Os dois comandos abaixo são idênticos:
Get-Process -Name "chrome" -Id 1234
Get-Process -Id 1234 -Name "chrome"
`}
      />

      <h3>Tipo 2 — Switch (liga/desliga)</h3>
      <p>
        Um <strong>switch</strong> não precisa de valor — a simples presença dele ativa a opção.
        É como um interruptor: presente = ligado, ausente = desligado.
      </p>

      <CodeBlock
        title="Switches — presente = ativado, ausente = desativado"
        code={`# -Recurse é um switch: entra em subpastas quando presente
Get-ChildItem -Path "C:\\Windows" -Recurse
#                                 ↑ sem valor, só o nome já ativa

# -Force é um switch: mostra arquivos ocultos quando presente
Get-ChildItem -Path "C:\\" -Force

# -WhatIf é um switch: simula sem executar (muito útil!)
Remove-Item -Path "C:\\temp\\*" -WhatIf
# Mostra o que SERIA apagado, mas NÃO apaga nada

# -Confirm é um switch: pede confirmação antes de cada ação
Remove-Item -Path "C:\\temp\\*" -Recurse -Confirm

# Combinando vários switches de uma vez
Get-ChildItem -Path "C:\\" -Recurse -Force -File
#                           ↑         ↑     ↑
#                     subpastas   ocultos  só arquivos
`}
      />

      <h3>Tipo 3 — Parâmetro Posicional (sem escrever o nome)</h3>
      <p>
        Alguns parâmetros são tão comuns que você pode passar o valor diretamente, sem escrever o nome.
        O PowerShell sabe qual parâmetro é pelo posição (1º, 2º valor, etc.):
      </p>

      <CodeBlock
        title="Parâmetros posicionais — mais rápido de digitar"
        code={`# Get-ChildItem: o 1º valor sem nome é tratado como -Path
Get-ChildItem "C:\\Windows"          # equivalente a:
Get-ChildItem -Path "C:\\Windows"    # idêntico!

# Get-Process: o 1º valor sem nome é -Name
Get-Process "notepad"                # equivalente a:
Get-Process -Name "notepad"

# Copy-Item: 1º valor = -Path, 2º valor = -Destination
Copy-Item "C:\\arquivo.txt" "D:\\backup\\"  # equivalente a:
Copy-Item -Path "C:\\arquivo.txt" -Destination "D:\\backup\\"

# DICA: em scripts, sempre use o nome explícito para clareza
# No terminal, o posicional é ótimo para velocidade
`}
      />

      <h2>Como Descobrir os Parâmetros de Qualquer Comando</h2>
      <p>
        Você nunca precisa memorizar parâmetros. Existem três formas de descobri-los na hora:
      </p>

      <CodeBlock
        title="3 formas de ver os parâmetros de um comando"
        code={`# Forma 1: -? ao final do comando — ajuda rápida no terminal
Get-ChildItem -?
# Mostra a sintaxe e todos os parâmetros disponíveis

# Forma 2: Get-Help — manual completo
Get-Help Get-ChildItem -Full
# -Full: mostra CADA parâmetro com descrição detalhada

Get-Help Get-ChildItem -Examples
# -Examples: mostra exemplos reais de uso

# Forma 3: TAB para completar parâmetros
# No terminal, digite:
Get-ChildItem -    # pressione TAB várias vezes
# O PowerShell vai mostrar: -Path, -LiteralPath, -Filter, -Include...

# Dica extra: Get-Help com busca por parâmetro específico
Get-Help Get-ChildItem -Parameter Recurse
# Mostra só a explicação do parâmetro -Recurse
`}
      />

      <AlertBox type="success" title="TAB é seu melhor amigo">
        No terminal do PowerShell, ao escrever <code>-</code> após qualquer comando e apertar <strong>TAB</strong>,
        ele mostra todos os parâmetros disponíveis. Continue apertando TAB para ciclar por eles.
        Isso funciona também para completar valores! Por exemplo: <code>Set-Location C:\U</code> + TAB
        completa para <code>Set-Location C:\Users</code>.
      </AlertBox>

      <h2>Como Ler a Sintaxe do Get-Help</h2>
      <p>
        Quando você roda <code>Get-Help AlgumComando</code>, a saída mostra a <strong>sintaxe formal</strong>.
        Ela tem uma linguagem própria que parece confusa no início, mas é simples:
      </p>

      <CodeBlock
        title="Decodificando a sintaxe do Get-Help"
        code={`# Exemplo de sintaxe que o Get-Help mostra:
# Get-ChildItem [[-Path] <string[]>] [-Filter <string>] [-Recurse] [-Force] [<CommonParameters>]

# Tradução de cada símbolo:

# [-Path]           → o nome do parâmetro está em [], significa POSICIONAL (pode omitir -Path)
# <string[]>        → o tipo de dado esperado: string[] = lista de textos
# [[-Path] <str>]   → todo o bloco em [] = o parâmetro é OPCIONAL
# [-Filter <str>]   → parâmetro opcional, precisa de um valor string
# [-Recurse]        → parâmetro opcional do tipo SWITCH (sem valor)
# [<CommonParameters>] → aceita os parâmetros comuns de todos cmdlets

# Tipos de dados comuns:
# <string>      → texto (ex: "notepad", "C:\\pasta")
# <string[]>    → lista de textos (ex: "a","b","c" ou @("a","b"))
# <int>         → número inteiro (ex: 5, 100)
# <switch>      → liga/desliga, sem valor (só -NomeDoParâmetro)
# <datetime>    → data e hora (ex: (Get-Date))
# <PSObject>    → qualquer objeto PowerShell
# <ScriptBlock> → bloco de código entre {} (ex: { $_.Name -eq "chrome" })
`}
      />

      <h2>Parâmetros Comuns — Disponíveis em Todos os Comandos</h2>
      <p>
        Esses parâmetros existem em <strong>praticamente todo cmdlet</strong> do PowerShell.
        São chamados de <em>CommonParameters</em> e você pode usá-los em qualquer lugar:
      </p>

      <CodeBlock
        title="Parâmetros comuns — disponíveis em quase todos os cmdlets"
        code={`# -Verbose: mostra mensagens detalhadas do que o comando está fazendo
Copy-Item -Path "C:\\origem" -Destination "D:\\destino" -Recurse -Verbose
# Mostra: "Copiando C:\\origem\\arquivo1.txt para D:\\destino\\arquivo1.txt"

# -WhatIf: SIMULA o comando sem executar nada (segurança!)
Remove-Item -Path "C:\\temp\\*" -Recurse -WhatIf
# Mostra o que SERIA deletado, mas NÃO deleta
# Use sempre antes de comandos destrutivos!

# -Confirm: pede sua confirmação antes de cada ação
Stop-Service -Name "Spooler" -Confirm
# Pergunta: "Are you sure you want to perform this action?"

# -ErrorAction: o que fazer quando ocorre um erro
# Stop         → para o script imediatamente (exceção)
# Continue     → mostra o erro e continua (padrão)
# SilentlyContinue → ignora o erro silenciosamente
# Inquire      → pergunta o que fazer
Get-Item "arquivo_que_nao_existe.txt" -ErrorAction SilentlyContinue
# Sem -ErrorAction SilentlyContinue, mostraria uma mensagem de erro vermelha

# -ErrorVariable: guarda o erro em uma variável para analisar depois
Get-Item "inexistente.txt" -ErrorAction SilentlyContinue -ErrorVariable meuErro
if ($meuErro) { Write-Host "Erro: $($meuErro.Exception.Message)" }

# -OutVariable: guarda o resultado em uma variável E exibe na tela
Get-Process -Name "chrome" -OutVariable processos
# $processos agora tem o resultado, e ele também apareceu no terminal

# -Debug: mostra mensagens de depuração (útil ao criar scripts)
$DebugPreference = "Continue"  # ativa globalmente
Write-Debug "Mensagem de debug"
`}
      />

      <AlertBox type="warning" title="-WhatIf: use antes de comandos perigosos">
        Antes de rodar qualquer comando que <strong>apaga</strong>, <strong>move</strong> ou <strong>modifica</strong>
        arquivos e configurações, adicione <code>-WhatIf</code> primeiro. Ele simula o comando com segurança.
        Quando tiver certeza, retire o <code>-WhatIf</code> e execute de verdade.
      </AlertBox>

      <h2>Valores com Espaços e Caracteres Especiais</h2>
      <CodeBlock
        title="Como passar valores com espaços ou caracteres especiais"
        code={`# Valores SEM espaços: aspas são opcionais
Get-Process -Name notepad
Get-Process -Name "notepad"   # equivalente

# Valores COM espaços: aspas são OBRIGATÓRIAS
Set-Location "C:\\Program Files"        # correto ✓
Set-Location C:\\Program Files          # ERRO! PowerShell trata como 2 argumentos

# Aspas simples vs duplas:
$nome = "PowerShell"
Write-Host 'Olá, $nome'     # saída: Olá, $nome    (literal, sem interpolação)
Write-Host "Olá, $nome"     # saída: Olá, PowerShell (interpola a variável)

# Passando múltiplos valores para um parâmetro:
Get-Process -Name "notepad","chrome","explorer"
#                  ↑ lista separada por vírgulas

Get-ChildItem -Path "C:\\Windows","C:\\System32"
#                    ↑ busca em duas pastas ao mesmo tempo

# Passando o resultado de outro comando como valor:
Stop-Process -Id (Get-Process -Name "notepad").Id
#                 ↑ parênteses executam o comando interno primeiro
`}
      />

      <h2>Abreviando Nomes de Parâmetros</h2>
      <p>
        No terminal (não em scripts!), você pode abreviar nomes de parâmetros desde que a abreviação
        seja única — o PowerShell completa automaticamente:
      </p>

      <CodeBlock
        title="Abreviação de parâmetros no terminal"
        code={`# Nome completo do parâmetro:
Get-ChildItem -Recurse -Filter "*.txt"

# Abreviações funcionam no terminal (mas evite em scripts):
Get-ChildItem -Rec -Fil "*.txt"
Get-ChildItem -R -Fi "*.txt"     # funciona se for único
# Cuidado: se -R combinar com -ReadOnly também, dá erro de ambiguidade

# O PowerShell avisa se a abreviação for ambígua:
# "Parameter cannot be processed because the parameter name 'p' is ambiguous"
# Solução: use mais letras para ser específico

# Dica: no terminal, use o TAB para completar o nome inteiro sem digitar
`}
      />

      <h2>Exemplo Prático: Desmontando um Comando Real</h2>
      <p>
        Vamos pegar um comando real e analisar cada parte para fixar o aprendizado:
      </p>

      <CodeBlock
        title="Analisando um comando real passo a passo"
        code={`# Comando: listar os 5 processos que mais consomem memória
Get-Process | Sort-Object WorkingSet -Descending | Select-Object -First 5 Name, Id, CPU

# Decompondo:
# ┌─ Get-Process
# │   sem parâmetros = lista TODOS os processos
# │
# ├─ Sort-Object WorkingSet -Descending
# │   WorkingSet          → parâmetro posicional = -Property WorkingSet (ordenar por memória)
# │   -Descending         → switch: maior para menor (sem -Descending seria menor para maior)
# │
# └─ Select-Object -First 5 Name, Id, CPU
#    -First 5             → parâmetro nomeado com valor 5 = pegar apenas os 5 primeiros
#    Name, Id, CPU        → parâmetro posicional = -Property Name, Id, CPU (quais colunas mostrar)

# Outro exemplo: copiar arquivos .log de hoje para backup
$hoje = Get-Date -Format "yyyy-MM-dd"
Get-ChildItem -Path "C:\\Logs" -Filter "*.log" -Recurse |
  Where-Object { $_.LastWriteTime -gt (Get-Date).AddDays(-1) } |
  Copy-Item -Destination "D:\\Backup\\$hoje\\" -Force

# Parâmetros usados:
# -Path "C:\\Logs"         → onde buscar os arquivos
# -Filter "*.log"          → filtrar só arquivos .log (mais rápido que -Include)
# -Recurse                 → entrar em subpastas também
# -gt (Get-Date).AddDays(-1) → comparação: LastWriteTime maior que "ontem"
# -Destination "D:\\..."   → para onde copiar
# -Force                   → sobrescrever se o arquivo já existir no destino
`}
      />

      <AlertBox type="info" title="Dica: Get-Help -Parameter é poderoso">
        Quando quiser entender um parâmetro específico, use:
        <code className="block mt-2 font-mono text-sm">Get-Help Get-ChildItem -Parameter Filter</code>
        Isso mostra a descrição completa, os valores aceitos e exemplos só daquele parâmetro — muito mais rápido
        que ler a documentação inteira.
      </AlertBox>

      <h2>Erros Comuns com Parâmetros</h2>
      <CodeBlock
        title="Erros frequentes e como corrigir"
        code={`# ERRO 1: esquecer o hífen no nome do parâmetro
Get-ChildItem Path "C:\\"    # ❌ ERRADO — Path sem hífen
Get-ChildItem -Path "C:\\"   # ✓ CORRETO

# ERRO 2: parâmetro e valor separados por = (não funciona em cmdlets)
Get-Process -Name="notepad"  # ❌ ERRADO (funciona em alguns contextos, mas evite)
Get-Process -Name "notepad"  # ✓ CORRETO (espaço entre nome e valor)

# ERRO 3: caminho com espaços sem aspas
Set-Location C:\\Program Files      # ❌ ERRADO — "Files" vira segundo argumento
Set-Location "C:\\Program Files"    # ✓ CORRETO

# ERRO 4: passar switch com valor
Get-ChildItem -Recurse $true        # ❌ ERRADO — switch não precisa de valor
Get-ChildItem -Recurse              # ✓ CORRETO
# Para desativar explicitamente um switch:
Get-ChildItem -Recurse:$false       # usa :$false para desativar

# ERRO 5: usar aspas dentro de aspas do mesmo tipo
Get-Process -Name "my "special" process"   # ❌ ERRADO
Get-Process -Name 'my "special" process'   # ✓ aspas simples por fora
Get-Process -Name "my 'special' process"   # ✓ aspas simples por dentro
Get-Process -Name "my \`"special\`" process"  # ✓ escape com backtick
`}
      />

      <h2>Resumo Visual</h2>
      <CodeBlock
        title="Cheat sheet de parâmetros"
        code={`# TIPOS DE PARÂMETRO:
Comando -Nome Valor         # Nomeado: você especifica o nome + valor
Comando Valor               # Posicional: sem nome, PowerShell deduz pela posição
Comando -Switch             # Switch: presente=ativo, ausente=inativo

# PARÂMETROS COMUNS (todo cmdlet tem):
-Verbose                    # Mostra o que está fazendo
-WhatIf                     # Simula sem executar
-Confirm                    # Pede confirmação
-ErrorAction Stop|Continue|SilentlyContinue  # Controla erros
-ErrorVariable $var         # Guarda o erro numa variável

# DESCOBRIR PARÂMETROS:
Comando -?                  # Ajuda rápida
Get-Help Comando -Full      # Documentação completa
Get-Help Comando -Parameter NomeDoParam  # Só esse parâmetro
Comando -[TAB]              # Auto-completar parâmetros

# PASSAR LISTAS:
Comando -Param "a","b","c"  # Múltiplos valores
Comando -Param @("a","b")   # Com array explícito

# RESULTADO DE OUTRO COMANDO COMO VALOR:
Comando -Param (OutroComando)
`}
      />
    </PageContainer>
  );
}
