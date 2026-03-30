import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function RefRapida() {
  return (
    <PageContainer
      title="Referência Rápida do PowerShell"
      subtitle="Cheat sheet completo: cmdlets essenciais, operadores, formatação e padrões comuns."
      difficulty="iniciante"
      timeToRead="15 min"
    >
      <p>
        Esta referência rápida reúne os cmdlets, operadores e padrões mais usados no dia a dia
        do PowerShell. Use como consulta rápida ao trabalhar em scripts.
      </p>

      <h2>Cmdlets Essenciais por Categoria</h2>
      <CodeBlock title="Get-Command rápido — os cmdlets mais usados" code={`# ── ARQUIVOS E PASTAS ──────────────────────────────────────
Get-ChildItem (ls, gci, dir)  # Listar arquivos/pastas
Set-Location  (cd, sl)        # Mudar diretório
Get-Location  (pwd, gl)       # Diretório atual
New-Item      (ni, mkdir, touch) # Criar arquivo/pasta
Copy-Item     (cp, copy)      # Copiar
Move-Item     (mv, move)      # Mover
Remove-Item   (rm, del)       # Deletar
Rename-Item   (ren)           # Renomear
Get-Content   (cat, gc, type) # Ler arquivo
Set-Content   (sc)            # Escrever arquivo
Add-Content   (ac)            # Adicionar ao final
Test-Path                     # Verificar existência

# ── OBJETOS E PIPELINE ────────────────────────────────────
Where-Object  (where, ?)      # Filtrar objetos
Select-Object (select)        # Selecionar propriedades
Sort-Object   (sort)          # Ordenar
Group-Object  (group)         # Agrupar
Measure-Object (measure)      # Calcular estatísticas
ForEach-Object (foreach, %)   # Iterar
Compare-Object (compare, diff)# Comparar coleções

# ── FORMATAÇÃO E SAÍDA ────────────────────────────────────
Format-Table  (ft)            # Tabela
Format-List   (fl)            # Lista vertical
Format-Wide   (fw)            # Múltiplas colunas
Out-File                      # Salvar em arquivo
Out-String                    # Converter para string
Write-Host                    # Imprimir (não vai ao pipeline)
Write-Output  (echo)          # Imprimir (vai ao pipeline)
`} />

      <h2>Operadores Completos</h2>
      <CodeBlock title="Todos os operadores do PowerShell" code={`# ── COMPARAÇÃO ────────────────────────────────────────────
-eq   # Igual              -ne   # Diferente
-gt   # Maior que          -lt   # Menor que
-ge   # Maior ou igual     -le   # Menor ou igual
-like # Wildcard (*)       -notlike
-match # Regex             -notmatch
-contains # Array contém   -notcontains
-in       # Item está em   -notin
-is       # É do tipo      -isnot

# Modificadores (padrão é case-insensitive):
-ceq -cne -cgt -clt -cge -cle    # Case-sensitive
-ieq -ine -igt -ilt -ige -ile    # Explicitamente insensitive

# ── LÓGICOS ───────────────────────────────────────────────
-and    # E lógico
-or     # OU lógico
-not    # Negação (ou !)
-xor    # XOR

# ── ATRIBUIÇÃO ────────────────────────────────────────────
=    # Atribuição
+=   # Soma e atribui       -=   # Subtrai e atribui
*=   # Multiplica e atribui /=   # Divide e atribui
%=   # Módulo e atribui     ++   # Incremento
--   # Decremento

# ── REDIRECCIONAMENTO ─────────────────────────────────────
>   # Redirecionar stdout (sobrescreve)
>>  # Redirecionar stdout (append)
2>  # Stderr              2>&1  # Stderr para stdout
| # Pipeline             &   # Executar em background
`} />

      <h2>Variáveis Automáticas Importantes</h2>
      <CodeBlock title="$_, $PSItem, $args e outras variáveis especiais" code={`$_  / $PSItem         # Objeto atual no pipeline ou ForEach
$?                    # True/False: último comando teve sucesso?
$!                    # Process ID do último comando externo
$Error                # Array de todos os erros da sessão
$Error[0]             # Erro mais recente
$LastExitCode         # Código de saída do último executável externo
$null                 # Valor nulo
$true / $false        # Booleanos
$args                 # Array de argumentos (scripts sem param)
$env:VARIAVEL         # Variável de ambiente
$PSVersionTable       # Informações da versão do PowerShell
$PSScriptRoot         # Pasta onde o script está sendo executado
$MyInvocation         # Informações sobre o script/função atual
$PROFILE              # Caminho do perfil do usuário atual
$HOME                 # Pasta home do usuário
$HOST                 # Informações do host PowerShell
$OFS                  # Output Field Separator (separador de lista)
$ConfirmPreference    # Preferência de confirmação (High/Medium/Low/None)
$ErrorActionPreference # Stop/Continue/SilentlyContinue/Inquire
$VerbosePreference    # SilentlyContinue/Continue/Stop
$DebugPreference      # SilentlyContinue/Continue/Stop
$MaximumHistoryCount  # Tamanho máximo do histórico
`} />

      <h2>Formatação de Strings</h2>
      <CodeBlock title="Formas de formatar e construir strings" code={`$nome = "Ana"
$valor = 1234.567

# Interpolação com aspas duplas
"Olá, $nome!"                          # Olá, Ana!
"Resultado: $($valor * 2)"             # Resultado: 2469.134 (subexpressão)
"Tipo: $($valor.GetType().Name)"       # Tipo: Double

# Operador -f (format)
"Olá, {0}! Valor: {1:N2}" -f $nome, $valor    # Olá, Ana! Valor: 1.234,57
"{0:yyyy-MM-dd}" -f (Get-Date)                  # 2024-03-15
"{0,10}" -f "texto"                             # "     texto" (alinhado à direita)
"{0,-10}" -f "texto"                            # "texto     " (alinhado à esquerda)

# Formatos numéricos comuns
"{0:N0}" -f 1234567     # 1.234.567   (sem decimais, com separador)
"{0:N2}" -f 1234.567    # 1.234,57    (2 decimais)
"{0:C}" -f 1234.56      # R$ 1.234,56 (moeda)
"{0:P1}" -f 0.85        # 85,0%       (percentual, 1 decimal)
"{0:X}" -f 255          # FF          (hexadecimal)
"{0:D5}" -f 42          # 00042       (preenchido com zeros)
"{0:E2}" -f 12345.6     # 1.23E+004   (notação científica)

# Here-String (bloco de texto multilinha)
$texto = @"
Nome: $nome
Data: $(Get-Date -Format 'dd/MM/yyyy')
Valor: R$ $("{0:N2}" -f $valor)
"@
`} />

      <h2>Padrões Comuns</h2>
      <CodeBlock title="Receitas prontas para uso diário" code={`# Exportar para CSV e abrir no Excel
Get-Process | Export-Csv "processos.csv" -NoTypeInformation && Start-Process "processos.csv"

# Encontrar e substituir em arquivo
(Get-Content "arquivo.txt") -replace "velho","novo" | Set-Content "arquivo.txt"

# Contar linhas de um arquivo
(Get-Content "arquivo.txt" | Measure-Object).Count

# Obter linhas únicas (deduplicar)
Get-Content "lista.txt" | Sort-Object -Unique

# Top 10 processos por memória
Get-Process | Sort-Object WS -Descending | Select-Object -First 10 Name,Id,
    @{N="MB";E={[math]::Round($_.WS/1MB,1)}} | Format-Table -AutoSize

# Testar se porta está aberta
Test-NetConnection -ComputerName "servidor" -Port 443 | Select-Object TcpTestSucceeded

# Converter para/de Base64
$b64 = [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes("texto"))
$dec = [Text.Encoding]::UTF8.GetString([Convert]::FromBase64String($b64))

# Verificar se estou rodando como Administrador
([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole(
    [Security.Principal.WindowsBuiltInRole]::Administrator
)

# Executar como Administrador
Start-Process pwsh -Verb RunAs -ArgumentList "-NoExit -Command \`"Set-Location '$PWD'\`"
`} />

      <AlertBox type="success" title="Dica: Tab Completion e Ctrl+Espaço">
        O PowerShell tem auto-completar poderoso. Use <strong>Tab</strong> para completar
        cmdlets, parâmetros, caminhos e muito mais. <strong>Ctrl+Espaço</strong> mostra todas
        as opções disponíveis. Com PSReadLine, use as setas ↑↓ para pesquisar o histórico.
      </AlertBox>
    </PageContainer>
  );
}
