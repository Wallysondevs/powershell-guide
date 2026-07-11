import{n as e,t}from"./CodeBlock-DVOG-hPm.js";import{t as n}from"./AlertBox-q8pQIQ07.js";import{a as r}from"./index-D0tfvO9Z.js";var i=r();function a(){return(0,i.jsxs)(e,{title:`Manipulação de Strings`,subtitle:`Textos, interpolação, expressões regulares, formatação e operações avançadas.`,difficulty:`iniciante`,timeToRead:`25 min`,children:[(0,i.jsx)(`p`,{children:`Strings são fundamentais em qualquer script. PowerShell oferece um sistema completo para criar, manipular, formatar e pesquisar texto — com suporte a interpolação, here-strings, expressões regulares e métodos .NET completos.`}),(0,i.jsx)(`h2`,{children:`Aspas Simples vs. Aspas Duplas`}),(0,i.jsx)(t,{title:`Diferença entre tipos de string`,code:`# Aspas duplas — interpolação de variáveis ($)
  $nome   = "PowerShell"
  $versao = 7
  "Olá, $nome versão $versao!"
  "CPU: $((Get-CimInstance Win32_Processor).Name)"

  # Aspas simples — string literal (sem interpolação)
  'Olá, $nome versão $versao!'        # String literal exata
  'Use $variavel sem interpolação'    # Útil para regex e paths

  # Subexpressão $() para expressões complexas dentro de strings
  $data = Get-Date
  "Hora atual: $($data.ToString('HH:mm:ss'))"
  "Processos rodando: $((Get-Process).Count)"
  "5 + 3 = $(5 + 3)"

  # Caracteres de escape com backtick (crase)
  "Linha 1\`nLinha 2"        # Quebra de linha
  "Coluna1\`tColuna2"        # Tab
  "Isso é um \`"aspas\`""    # Aspas dentro de string com aspas duplas
  `}),(0,i.jsx)(`h2`,{children:`Here-Strings — Texto Multilinha`}),(0,i.jsx)(t,{title:`Blocos de texto preservando formatação`,code:`# Here-string com aspas duplas (INTERPOLA variáveis)
  $servidor = "SRV-01"
  $porta    = 8080
  $config = @"
  [servidor]
  nome  = $servidor
  porta = $porta
  debug = false
  criado = $(Get-Date -Format 'yyyy-MM-dd')
  "@

  # Here-string com aspas simples (LITERAL — sem interpolação)
  $regex = @'
  ^d{2}/d{2}/d{4}$
  '@

  # Caso de uso: SQL query com interpolação
  $dataInicio = (Get-Date).AddDays(-30).ToString('yyyy-MM-dd')
  $sql = @"
  SELECT u.Id, u.Nome, u.Email
  FROM   Usuarios u
  WHERE  u.Ativo = 1
    AND  u.CriadoEm >= '$dataInicio'
  ORDER  BY u.Nome
  "@

  # JSON body para chamada de API
  $jsonBody = @"
  {
    "nome":      "$nome",
    "timestamp": "$(Get-Date -Format 'o')"
  }
  "@
  `}),(0,i.jsx)(`h2`,{children:`Métodos .NET de String`}),(0,i.jsx)(t,{title:`Manipulando strings com métodos do .NET`,code:`$texto = "  PowerShell é Incrível!  "

  # Limpeza de espaços
  $texto.Trim()            # Remove espaços das extremidades
  $texto.TrimStart()       # Remove espaços do início
  $texto.TrimEnd()         # Remove espaços do final

  # Transformação
  $texto.ToUpper()         # POWERSHELL É INCRÍVEL!
  $texto.ToLower()         # powershell é incrível!
  $texto.Replace("é", "is")  # PowerShell is Incrível!

  # Busca e verificação
  $texto.Contains("PowerShell")   # True
  $texto.StartsWith("  Power")    # True
  $texto.EndsWith("!")            # True
  $texto.IndexOf("é")            # 13
  $texto.LastIndexOf("i")        # 21

  # Extração
  $texto.Substring(2, 11)         # PowerShell
  $texto.Split(" ")              # Array de palavras
  "a,b,c,d".Split(",")          # @("a","b","c","d")
  "Nome: João".Split(":")[1].Trim()  # João

  # Construção
  [string]::Join(", ", "a","b","c")   # a, b, c
  [string]::Join([Environment]::NewLine, $lista)  # Juntar com nova linha
  "=" * 40    # ======================================== (repetição)
  "abc" * 3   # abcabcabc
  `}),(0,i.jsx)(`h2`,{children:`Operador de Formatação (-f)`}),(0,i.jsx)(t,{title:`Formatando números, datas e alinhamento de colunas`,code:`# Números
  "{0:N2}" -f 1234567.891     # 1.234.567,89 (milhar + 2 decimais)
  "{0:F3}" -f 3.14159         # 3,142 (3 casas fixas)
  "{0:P1}" -f 0.8523          # 85,2% (percentual)
  "{0:C}" -f 29.90            # R$ 29,90 (moeda)
  "{0:X}" -f 255              # FF (hexadecimal)
  "{0:D8}" -f 42              # 00000042 (8 dígitos com zeros)

  # Múltiplos valores
  "{0} de {1} ({2:P0})" -f 75, 100, 0.75   # 75 de 100 (75%)

  # Alinhamento — útil para relatórios de texto
  "{0,-25} {1,8} {2,10}" -f "Processo", "PID", "RAM(MB)"
  "{0,-25} {1,8} {2,10:N1}" -f "svchost.exe", 1234, 45.8
  # Negativo = alinha à esquerda, positivo = alinha à direita

  # Datas formatadas
  "{0:dd/MM/yyyy}" -f (Get-Date)    # 25/12/2024
  "{0:HH:mm:ss}"  -f (Get-Date)    # 14:30:45
  Get-Date -Format "yyyy-MM-dd'T'HH:mm:ssZ"   # ISO 8601

  # Tabela formatada sem Format-Table
  $processos = Get-Process | Select-Object -First 5
  "{0,-25} {1,6} {2,10}" -f "PROCESSO","PID","RAM(MB)"
  "-" * 45
  foreach ($p in $processos) {
      "{0,-25} {1,6} {2,10:N1}" -f $p.Name, $p.Id, ($p.WorkingSet64/1MB)
  }
  `}),(0,i.jsx)(`h2`,{children:`Expressões Regulares`}),(0,i.jsx)(t,{title:`-match, -replace, -split com regex`,code:`# -match: verifica correspondência e preenche $Matches
  "192.168.1.100" -match "^(d{1,3}.){3}d{1,3}$"   # True
  $Matches[0]   # Resultado completo

  "joao@empresa.com" -match "^([w.]+)@([w.]+).([a-z]{2,})$"
  $Matches[1]   # joao
  $Matches[2]   # empresa

  # -replace: substitui com regex
  "   muitos    espaços   " -replace "s+", " "           # Remove espaços extras
  "2024-12-25" -replace "(d{4})-(d{2})-(d{2})", '$3/$2/$1'  # 25/12/2024
  "abc123def" -replace "[^d]", ""                        # 123 (apenas dígitos)

  # -split: divide usando regex
  "a,b;c  d" -split "[,;s]+"   # @("a","b","c","d")
  "log1.txt,log2.txt" -split ","   # Array de nomes de arquivo

  # Grupos nomeados (?<nome>)
  $linha = "2024-12-25 14:30 ERROR Disco cheio: 99%"
  if ($linha -match "(?<data>d{4}-d{2}-d{2}) (?<hora>S+) (?<nivel>w+) (?<msg>.+)") {
      "Data: $($Matches.data)"
      "Nível: $($Matches.nivel)"
      "Mensagem: $($Matches.msg)"
  }
  `}),(0,i.jsx)(`h2`,{children:`Select-String — O grep do PowerShell`}),(0,i.jsx)(t,{title:`Buscando padrões em arquivos e pipelines`,code:`# Busca simples em arquivo
  Select-String -Path "C:\\Logs\\app.log" -Pattern "ERROR|FATAL"

  # Busca com contexto (linhas antes e depois)
  Select-String -Path "app.log" -Pattern "Exception" -Context 2,5

  # Busca recursiva em diretório
  Select-String -Path "C:\\Scripts\\**\\*.ps1" -Pattern "TODO|FIXME"

  # Extrair informações das correspondências
  Get-Content "access.log" |
      Select-String "\b(4d{2}|5d{2})\b" |
      ForEach-Object {
          [PSCustomObject]@{
              Linha  = $_.LineNumber
              Código = $_.Matches[0].Value
              Texto  = $_.Line.Trim()
          }
      } | Group-Object Código | Sort-Object Count -Descending

  # Verificar se contém um padrão (booleano)
  $logContent = Get-Content "deploy.log" -Raw
  if ($logContent | Select-String "FAILED") {
      Write-Warning "O deploy pode ter falhado!"
  }
  `}),(0,i.jsxs)(n,{type:`info`,title:`Operadores de String no PowerShell`,children:[`PowerShell usa `,(0,i.jsx)(`code`,{children:`-eq`}),`, `,(0,i.jsx)(`code`,{children:`-ne`}),`, `,(0,i.jsx)(`code`,{children:`-like`}),`, `,(0,i.jsx)(`code`,{children:`-match`}),`em vez de `,(0,i.jsx)(`code`,{children:`==`}),`. Por padrão, todas as comparações são`,(0,i.jsx)(`strong`,{children:`case-insensitive`}),`. Adicione `,(0,i.jsx)(`code`,{children:`c`}),` para sensível a maiúsculas:`,(0,i.jsx)(`code`,{children:`-ceq`}),`, `,(0,i.jsx)(`code`,{children:`-clike`}),`, `,(0,i.jsx)(`code`,{children:`-cmatch`}),`.`]})]})}export{a as default};