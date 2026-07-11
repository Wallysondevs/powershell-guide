import{n as e,t}from"./CodeBlock-DVOG-hPm.js";import{t as n}from"./AlertBox-q8pQIQ07.js";import{a as r}from"./index-D0tfvO9Z.js";var i=r();function a(){return(0,i.jsxs)(e,{title:`Envio de E-mails com PowerShell`,subtitle:`Envie e-mails simples, HTML, com anexos, via SMTP, Graph API e Microsoft 365.`,difficulty:`iniciante`,timeToRead:`25 min`,children:[(0,i.jsxs)(`p`,{children:[`PowerShell pode enviar e-mails nativamente com `,(0,i.jsx)(`code`,{children:`Send-MailMessage`}),` ou através das classes .NET `,(0,i.jsx)(`code`,{children:`System.Net.Mail`}),`. Para ambientes modernos com Microsoft 365, use a Microsoft Graph API. Alertas automáticos, relatórios agendados e notificações de scripts ficam muito mais fáceis com automação de e-mail.`]}),(0,i.jsx)(`h2`,{children:`Send-MailMessage Básico`}),(0,i.jsx)(t,{title:`Enviando e-mails simples via SMTP`,code:`# Configurações SMTP — Gmail, Exchange ou qualquer servidor
  $smtp = @{
      SmtpServer = "smtp.gmail.com"
      Port       = 587
      UseSsl     = $true
      Credential = Get-Credential  # usuario@gmail.com + App Password
  }

  # E-mail simples de texto
  Send-MailMessage @smtp \`
    -From    "remetente@empresa.com" \`
    -To      "destinatario@empresa.com" \`
    -Subject "Relatório Diário - $(Get-Date -Format 'dd/MM/yyyy')" \`
    -Body    "O backup foi concluído com sucesso às $(Get-Date -Format 'HH:mm')."

  # Para múltiplos destinatários com CC e BCC
  Send-MailMessage @smtp \`
    -From    "alertas@empresa.com" \`
    -To      @("admin@empresa.com", "suporte@empresa.com") \`
    -Cc      "gerente@empresa.com" \`
    -Bcc     "auditoria@empresa.com" \`
    -Subject "Alerta do Sistema" \`
    -Body    "Servidor offline detectado em $(Get-Date)."

  # Exchange Server interno (sem SSL)
  $smtpExchange = @{
      SmtpServer = "mail.empresa.com"
      Port       = 25
  }
  Send-MailMessage @smtpExchange -From "sistema@empresa.com" -To "ti@empresa.com" -Subject "Teste"
  `}),(0,i.jsx)(`h2`,{children:`E-mail HTML com Formatação Rica`}),(0,i.jsx)(t,{title:`E-mails profissionais com tabelas HTML`,code:`$processos = Get-Process | Sort-Object CPU -Descending | Select-Object -First 10

  # Gerar tabela HTML dos processos via PowerShell
  $linhas = $processos | ForEach-Object {
      $cpu = [math]::Round($_.CPU, 2)
      $ram = [math]::Round($_.WorkingSet64/1MB, 1)
      "<tr><td>$($_.Name)</td><td>$cpu</td><td>$ram MB</td></tr>"
  }

  $corpo = @"
  <!DOCTYPE html>
  <html>
  <head>
  <meta charset="UTF-8">
  <style>
    body  { font-family: 'Segoe UI', Arial, sans-serif; margin: 20px; color: #333; }
    h2    { color: #0078d4; border-bottom: 2px solid #0078d4; padding-bottom: 8px; }
    table { border-collapse: collapse; width: 100%; margin-top: 12px; }
    th    { background: #0078d4; color: white; padding: 10px; text-align: left; }
    td    { padding: 8px; border-bottom: 1px solid #e0e0e0; }
    tr:nth-child(even) { background: #f5f5f5; }
    .footer { color: #888; font-size: 0.85em; margin-top: 20px; }
    .badge  { background: #d83b01; color: white; padding: 2px 6px; border-radius: 3px; font-size: 0.8em; }
  </style>
  </head>
  <body>
  <h2>Relatório de Processos — $($env:COMPUTERNAME)</h2>
  <p>Gerado em: <strong>$(Get-Date -Format 'dd/MM/yyyy HH:mm')</strong></p>
  <table>
    <tr><th>Processo</th><th>CPU (s)</th><th>RAM</th></tr>
    $($linhas -join '')
  </table>
  <p class="footer">Servidor: $($env:COMPUTERNAME) | PowerShell $($PSVersionTable.PSVersion)</p>
  </body>
  </html>
  "@

  Send-MailMessage @smtp \`
    -From     "relatorios@empresa.com" \`
    -To       "ti@empresa.com" \`
    -Subject  "Relatório de Processos - $(Get-Date -Format 'dd/MM')" \`
    -Body     $corpo \`
    -BodyAsHtml \`
    -Encoding UTF8
  `}),(0,i.jsx)(`h2`,{children:`E-mail com Anexos`}),(0,i.jsx)(t,{title:`Enviando relatórios CSV e logs como anexo`,code:`# Gerar relatório CSV temporário
  $relatorio = "C:\\Temp\\relatorio-$(Get-Date -Format 'yyyyMMdd').csv"
  Get-Process | Select-Object Name, Id, CPU, WorkingSet |
      Export-Csv $relatorio -NoTypeInformation -Encoding UTF8

  # Enviar com um anexo
  Send-MailMessage @smtp \`
    -From        "relatorios@empresa.com" \`
    -To          "gerente@empresa.com" \`
    -Subject     "Relatório Semanal de Processos" \`
    -Body        "Segue em anexo o relatório semanal do servidor $env:COMPUTERNAME." \`
    -Attachments $relatorio

  # Múltiplos anexos (relatório + log de erros + screenshot)
  $anexos = @(
      "C:\\Temp\\relatorio.csv",
      "C:\\Logs\\erros.log"
  ) | Where-Object { Test-Path $_ }  # Só anexar arquivos que existem

  if ($anexos) {
      Send-MailMessage @smtp \`
        -From        "alertas@empresa.com" \`
        -To          "admin@empresa.com" \`
        -Subject     "Relatório Completo - $(Get-Date -Format 'dd/MM')" \`
        -Body        "Vide anexos com relatórios do servidor." \`
        -Attachments $anexos
  }

  # Limpar arquivo temporário após envio
  Remove-Item $relatorio -ErrorAction SilentlyContinue
  `}),(0,i.jsx)(`h2`,{children:`Sistema de Alertas Automáticos`}),(0,i.jsx)(t,{title:`Monitoramento com alertas por e-mail`,code:`function Send-Alerta {
      param(
          [string]$Assunto,
          [string]$Mensagem,
          [ValidateSet("INFO","AVISO","ERRO","CRITICO")]
          [string]$Nivel = "INFO"
      )

      $cores  = @{ INFO="#0078d4"; AVISO="#ff8c00"; ERRO="#d83b01"; CRITICO="#8b0000" }
      $icones = @{ INFO="ℹ"; AVISO="⚠"; ERRO="✖"; CRITICO="🚨" }
      $cor    = $cores[$Nivel]
      $icone  = $icones[$Nivel]

      $corpo = @"
  <html><body style="font-family:'Segoe UI',Arial;margin:20px">
  <div style="border-left:4px solid $cor;padding:12px;background:#f9f9f9">
    <h3 style="color:$cor;margin:0">$icone [$Nivel] $Assunto</h3>
  </div>
  <p style="margin-top:16px">$Mensagem</p>
  <hr style="border:none;border-top:1px solid #e0e0e0">
  <p style="color:#888;font-size:0.85em">
    Servidor: <strong>$($env:COMPUTERNAME)</strong> |
    Hora: $(Get-Date -Format 'dd/MM/yyyy HH:mm:ss') |
    PS $($PSVersionTable.PSVersion)
  </p>
  </body></html>
  "@

      $cred = [PSCredential]::new(
          $env:SMTP_USER,
          (ConvertTo-SecureString $env:SMTP_PASSWORD -AsPlainText -Force)
      )

      Send-MailMessage \`
          -SmtpServer $env:SMTP_SERVER -Port 587 -UseSsl \`
          -Credential $cred \`
          -From    $env:SMTP_FROM \`
          -To      "ti@empresa.com" \`
          -Subject "[$Nivel] $Assunto" \`
          -Body    $corpo \`
          -BodyAsHtml -Encoding UTF8
  }

  # Monitoramento de CPU
  $cpu = (Get-CimInstance Win32_Processor | Measure-Object LoadPercentage -Average).Average
  if ($cpu -gt 90) {
      Send-Alerta -Assunto "CPU crítica: $cpu%" \`
          -Mensagem "CPU acima de 90% há vários minutos. Verificar processos." \`
          -Nivel "CRITICO"
  }

  # Monitoramento de disco
  Get-PSDrive -PSProvider FileSystem | Where-Object { $_.Used } | ForEach-Object {
      $pct = [math]::Round($_.Used / ($_.Used + $_.Free) * 100)
      if ($pct -gt 85) {
          Send-Alerta -Assunto "Disco $($_.Name): cheio $pct%" \`
              -Mensagem "Disco $($_.Name) em $pct% de uso no servidor $env:COMPUTERNAME" \`
              -Nivel "AVISO"
      }
  }
  `}),(0,i.jsx)(`h2`,{children:`Microsoft Graph API (Microsoft 365)`}),(0,i.jsx)(t,{title:`Enviando e-mails via Graph API sem SMTP`,code:`# Instalar módulo Microsoft Graph
  Install-Module Microsoft.Graph.Mail -Scope CurrentUser

  # Autenticar (requer app registrada no Azure AD)
  Connect-MgGraph -TenantId "seu-tenant-id" \`
      -ClientId "seu-app-id" \`
      -CertificateThumbprint "THUMBPRINT"  # Ou -ClientSecretCredential

  # Enviar e-mail via Graph API
  $params = @{
      message = @{
          subject = "Teste Graph API"
          body    = @{
              contentType = "HTML"
              content     = "<h1>Olá do PowerShell!</h1><p>Enviado via Microsoft Graph.</p>"
          }
          toRecipients = @(@{
              emailAddress = @{ address = "destinatario@empresa.com" }
          })
          attachments = @(@{
              "@odata.type"  = "#microsoft.graph.fileAttachment"
              name           = "relatorio.csv"
              contentType    = "text/csv"
              contentBytes   = [Convert]::ToBase64String([IO.File]::ReadAllBytes("C:\\Temp\\relatorio.csv"))
          })
      }
      saveToSentItems = $false
  }

  Send-MgUserMail -UserId "remetente@empresa.com" -BodyParameter $params
  Write-Host "E-mail enviado via Microsoft Graph" -ForegroundColor Green
  `}),(0,i.jsxs)(n,{type:`warning`,title:`Send-MailMessage Obsoleto no PS7`,children:[`O cmdlet `,(0,i.jsx)(`code`,{children:`Send-MailMessage`}),` foi marcado como obsoleto no PowerShell 7 por problemas de segurança TLS. Para novos projetos, use `,(0,i.jsx)(`code`,{children:`System.Net.Mail.SmtpClient`}),`com TLS explícito ou a Microsoft Graph API para ambientes Microsoft 365.`]}),(0,i.jsxs)(n,{type:`info`,title:`App Password do Gmail`,children:[`Para usar Gmail, ative a autenticação de dois fatores e crie uma`,(0,i.jsx)(`strong`,{children:`Senha de App`}),` (App Password) em myaccount.google.com/security. Use essa senha no `,(0,i.jsx)(`code`,{children:`Get-Credential`}),` — não sua senha normal.`]})]})}export{a as default};