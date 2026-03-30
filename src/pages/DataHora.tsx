import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function DataHora() {
  return (
    <PageContainer
      title="Datas e Horas"
      subtitle="Manipule, formate, calcule e converta datas e horas com precisão usando Get-Date e [datetime]."
      difficulty="iniciante"
      timeToRead="20 min"
    >
      <p>
        O PowerShell usa o tipo <code>[datetime]</code> do .NET para representar datas e horas.
        O cmdlet <code>Get-Date</code> é sua porta de entrada, mas há muito mais no tipo 
        <code>System.DateTime</code> para cálculos, fusos horários e formatação avançada.
      </p>

      <h2>Get-Date e Criando Datas</h2>
      <CodeBlock title="Obtendo e criando objetos de data" code={`# Data e hora atual
Get-Date
(Get-Date).ToString()

# Componentes individuais
$agora = Get-Date
$agora.Year    # 2024
$agora.Month   # 3
$agora.Day     # 15
$agora.Hour    # 14
$agora.Minute  # 30
$agora.Second  # 22
$agora.DayOfWeek  # Friday

# Criar data específica
$natal = [datetime]"2024-12-25"
$natal = Get-Date -Year 2024 -Month 12 -Day 25
$natal = [datetime]::new(2024, 12, 25, 0, 0, 0)

# Parsear string para data
[datetime]::ParseExact("25/12/2024", "dd/MM/yyyy", $null)
[datetime]::Parse("2024-12-25T18:30:00")
"31/01/2024" -as [datetime]  # Null se inválido
`} />

      <h2>Formatando Datas</h2>
      <CodeBlock title="Formatação de saída" code={`$d = Get-Date

# Formatos predefinidos
Get-Date -Format "yyyy-MM-dd"           # 2024-03-15
Get-Date -Format "dd/MM/yyyy"           # 15/03/2024
Get-Date -Format "dd/MM/yyyy HH:mm:ss" # 15/03/2024 14:30:22
Get-Date -Format "yyyyMMdd_HHmmss"     # 20240315_143022 (para nomes de arquivo)
Get-Date -Format "dddd, dd 'de' MMMM 'de' yyyy"  # sexta-feira, 15 de março de 2024

# Formatos ISO 8601 (para APIs)
Get-Date -Format "o"           # 2024-03-15T14:30:22.1234567-03:00 (Roundtrip)
Get-Date -Format "s"           # 2024-03-15T14:30:22 (Sortable)
Get-Date -UFormat "%Y-%m-%d"   # Unix format

# ToString com cultura específica
$d.ToString("D", [System.Globalization.CultureInfo]::new("pt-BR"))
# sexta-feira, 15 de março de 2024

# Nomes de arquivo seguros (sem caracteres inválidos)
$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
"backup_$timestamp.zip"
`} />

      <h2>Cálculos com Datas</h2>
      <CodeBlock title="Adicionando, subtraindo e comparando" code={`$hoje = Get-Date

# Adicionar/subtrair
$amanha     = $hoje.AddDays(1)
$proximoMes = $hoje.AddMonths(1)
$anoPassado = $hoje.AddYears(-1)
$em30min    = $hoje.AddMinutes(30)
$ontem      = $hoje.AddDays(-1)

# TimeSpan: diferença entre datas
$inicio = [datetime]"2024-01-01"
$fim    = [datetime]"2024-12-31"
$diff   = $fim - $inicio
$diff.Days         # 365
$diff.TotalHours   # 8784
$diff.TotalMinutes # 527040

# Novo TimeSpan
$ts = [timespan]::new(2, 30, 0)   # 2h 30min
$ts = New-TimeSpan -Hours 2 -Minutes 30
$fim = $hoje + $ts

# Dias até o próximo natal
$natal = [datetime]::new($hoje.Year, 12, 25)
if ($natal -lt $hoje) { $natal = $natal.AddYears(1) }
$diasAteNatal = ($natal - $hoje).Days
"Faltam $diasAteNatal dias para o Natal!"

# Verificar se data está dentro de um intervalo
$dataAlvo = [datetime]"2024-06-15"
$inicio   = [datetime]"2024-01-01"
$fim      = [datetime]"2024-12-31"
$dentro   = $dataAlvo -ge $inicio -and $dataAlvo -le $fim
`} />

      <h2>Fusos Horários</h2>
      <CodeBlock title="TimeZone e conversões" code={`# Fuso atual
[System.TimeZone]::CurrentTimeZone.StandardName
[System.TimeZoneInfo]::Local.DisplayName

# Listar todos os fusos
[System.TimeZoneInfo]::GetSystemTimeZones() |
    Select-Object Id, DisplayName, BaseUtcOffset |
    Where-Object DisplayName -like "*Brasilia*"

# Converter entre fusos
$utcAgora   = [datetime]::UtcNow
$tzBrasilia = [System.TimeZoneInfo]::FindSystemTimeZoneById("E. South America Standard Time")
$tzTokio    = [System.TimeZoneInfo]::FindSystemTimeZoneById("Tokyo Standard Time")

$brasilia = [System.TimeZoneInfo]::ConvertTimeFromUtc($utcAgora, $tzBrasilia)
$tokio    = [System.TimeZoneInfo]::ConvertTimeFromUtc($utcAgora, $tzTokio)

"UTC:      $($utcAgora.ToString('HH:mm'))"
"Brasília: $($brasilia.ToString('HH:mm'))"
"Tóquio:   $($tokio.ToString('HH:mm'))"

# DateTimeOffset (preserva informação de fuso)
$dto = [System.DateTimeOffset]::Now
$dto.ToUniversalTime()
$dto.ToOffset([timespan]::new(-3, 0, 0))  # UTC-3 (Brasília)

# Unix timestamp
$epoch = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()
$deEpoch = [DateTimeOffset]::FromUnixTimeSeconds(1705334400).DateTime
`} />

      <h2>Primeiro e Último Dia do Mês</h2>
      <CodeBlock title="Cálculos comuns de calendário" code={`$hoje = Get-Date

# Primeiro dia do mês atual
$primeiroDia = Get-Date -Year $hoje.Year -Month $hoje.Month -Day 1 -Hour 0 -Minute 0 -Second 0

# Último dia do mês atual
$ultimoDia = [datetime]::new($hoje.Year, $hoje.Month, [datetime]::DaysInMonth($hoje.Year, $hoje.Month))

# Primeiro dia do próximo mês
$primeiroMesProximo = $primeiroDia.AddMonths(1)

# Dia da semana: segunda-feira desta semana
$diasAteLunes = [int]$hoje.DayOfWeek - [int][DayOfWeek]::Monday
if ($diasAteLunes -lt 0) { $diasAteLunes += 7 }
$segundaFeira = $hoje.AddDays(-$diasAteLunes).Date

# Verificar se é fim de semana
$fimDeSemana = $hoje.DayOfWeek -in @([DayOfWeek]::Saturday, [DayOfWeek]::Sunday)

# Calcular idade
$nascimento = [datetime]"1990-06-15"
$idade = $hoje.Year - $nascimento.Year
if ($hoje < $nascimento.AddYears($idade)) { $idade-- }
"Idade: $idade anos"
`} />
    </PageContainer>
  );
}