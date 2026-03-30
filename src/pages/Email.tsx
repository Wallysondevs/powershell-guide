import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Email() {
  return (
    <PageContainer
      title="Envio de E-mails com PowerShell"
      subtitle="Envie e-mails simples, HTML, com anexos e alertas automáticos usando Send-MailMessage e SMTP."
      difficulty="iniciante"
      timeToRead="20 min"
    >
      <p>
        PowerShell pode enviar e-mails nativamente com <code>Send-MailMessage</code> ou através
        das classes .NET <code>System.Net.Mail</code>. Isso é essencial para alertas automáticos,
        relatórios agendados e notificações de scripts.
      </p>

      <h2>Send-MailMessage Básico</h2>
      <CodeBlock title="Enviando e-mails simples" code={`# Configurações SMTP comuns
$smtp = @{
    SmtpServer = "smtp.gmail.com"
    Port       = 587
    UseSsl     = $true
    Credential = Get-Credential  # usuario@gmail.com + App Password
}

# E-mail simples
Send-MailMessage @smtp  -From "remetente@empresa.com"  -To   "destinatario@empresa.com"  -Subject "Relatório Diário - $(Get-Date -Format 'dd/MM/yyyy')"  -Body "O backup foi concluído com sucesso às $(Get-Date -Format 'HH:mm')."

# Para múltiplos destinatários
Send-MailMessage @smtp  -From    "alertas@empresa.com"  -To      @("admin@empresa.com", "suporte@empresa.com")  -Cc      "gerente@empresa.com"  -Subject "Alerta do Sistema"  -Body    "Servidor offline detectado."
`} />

      <h2>E-mail HTML com Formatação</h2>
      <CodeBlock title="E-mails ricos com HTML" code={`$processos = Get-Process | Sort-Object CPU -Descending | Select-Object -First 10

# Gerar tabela HTML dos processos
$tabela = $processos | ConvertTo-Html -Fragment -Property Name, CPU, WorkingSet |
    Out-String

$corpo = @"
<!DOCTYPE html>
<html>
<head>
<style>
  body { font-family: Arial, sans-serif; margin: 20px; }
  h2   { color: #2c3e50; }
  table { border-collapse: collapse; width: 100%; }
  th   { background: #2c3e50; color: white; padding: 8px; }
  td   { padding: 6px; border: 1px solid #ddd; }
  tr:nth-child(even) { background: #f2f2f2; }
</style>
</head>
<body>
<h2>Relatório de Processos — $($env:COMPUTERNAME)</h2>
<p>Gerado em: $(Get-Date -Format 'dd/MM/yyyy HH:mm')</p>
$tabela
<p>Equipe de Infraestrutura</p>
</body>
</html>
"@

Send-MailMessage @smtp  -From    "relatorios@empresa.com"  -To      "ti@empresa.com"  -Subject "Relatório de Processos - $(Get-Date -Format 'dd/MM')"  -Body    $corpo  -BodyAsHtml  -Encoding UTF8
`} />

      <h2>E-mail com Anexos</h2>
      <CodeBlock title="Enviando relatórios em CSV/PDF como anexo" code={`# Gerar relatório CSV
$relatorio = "C:\\Temp\\relatorio-$(Get-Date -Format 'yyyyMMdd').csv"
Get-Process | Select-Object Name, Id, CPU, WorkingSet |
    Export-Csv $relatorio -NoTypeInformation -Encoding UTF8

# Enviar com anexo
Send-MailMessage @smtp  -From        "relatorios@empresa.com"  -To          "gerente@empresa.com"  -Subject     "Relatório Semanal de Processos"  -Body        "Segue em anexo o relatório semanal de processos do servidor."  -Attachments $relatorio

# Múltiplos anexos
$anexos = @(
    "C:\\Temp\\relatorio.csv",
    "C:\\Temp\\erros.log",
    "C:\\Temp\\grafico.png"
)
Send-MailMessage @smtp  -From        "alertas@empresa.com"  -To          "admin@empresa.com"  -Subject     "Relatório Completo"  -Body        "Vide anexos."  -Attachments $anexos

# Limpar arquivo temporário após envio
Remove-Item $relatorio -ErrorAction SilentlyContinue
`} />

      <h2>Sistema de Alertas Automáticos</h2>
      <CodeBlock title="Alertas de monitoramento via e-mail" code={`function Send-Alerta {
    param(
        [string]$Assunto,
        [string]$Mensagem,
        [string]$Nivel = "INFO"  # INFO, WARN, ERRO
    )

    $cores = @{ INFO="blue"; WARN="orange"; ERRO="red" }
    $cor   = $cores[$Nivel]

    $corpo = @"
<html><body style="font-family:Arial">
<h3 style="color:$cor">[$Nivel] $Assunto</h3>
<p>$Mensagem</p>
<hr>
<small>Servidor: $($env:COMPUTERNAME) | Hora: $(Get-Date)</small>
</body></html>
"@

    $cred = [PSCredential]::new(
        "alertas@empresa.com",
        (ConvertTo-SecureString $env:SMTP_PASSWORD -AsPlainText -Force)
    )

    Send-MailMessage  -SmtpServer "smtp.empresa.com" -Port 587 -UseSsl  -Credential $cred  -From    "alertas@empresa.com"  -To      "ti@empresa.com"  -Subject "[$Nivel] $Assunto"  -Body    $corpo  -BodyAsHtml
}

# Monitoramento de CPU com alerta
$cpu = (Get-CimInstance Win32_Processor).LoadPercentage
if ($cpu -gt 90) {
    Send-Alerta  -Assunto  "CPU crítica: $cpu%"  -Mensagem "CPU acima de 90% no servidor $env:COMPUTERNAME"  -Nivel    "ERRO"
}
`} />

      <AlertBox type="warning" title="Send-MailMessage está Obsoleto no PS7">
        O cmdlet <code>Send-MailMessage</code> foi marcado como obsoleto no PowerShell 7
        por problemas de segurança TLS. Para PS7, use a classe
        <code>System.Net.Mail.SmtpClient</code> ou o módulo <strong>Send-EmailMessage</strong>
        da PowerShell Gallery.
      </AlertBox>
    </PageContainer>
  );
}
