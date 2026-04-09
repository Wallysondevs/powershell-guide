import { PageContainer } from "@/components/layout/PageContainer";
  import { CodeBlock } from "@/components/ui/CodeBlock";
  import { AlertBox } from "@/components/ui/AlertBox";

  export default function Objetos() {
    return (
      <PageContainer
        title="Objetos Personalizados"
        subtitle="Crie, combine, estenda, ordene e serialize objetos com PSCustomObject, TypeData e propriedades calculadas."
        difficulty="intermediário"
        timeToRead="30 min"
      >
        <p>
          No PowerShell, tudo é um objeto. Entender como criar objetos personalizados,
          adicionar propriedades e métodos, manipular o sistema de tipos e serializar dados
          é fundamental para scripts avançados, bem estruturados e reutilizáveis.
        </p>

        <h2>PSCustomObject — Criação e Coleções</h2>
        <CodeBlock title="Criando objetos estruturados" code={`# Forma recomendada: literal de hashtable com cast (PS 3+)
  $servidor = [PSCustomObject]@{
      Nome        = "SRV-WEB-01"
      IP          = "192.168.1.10"
      CPU         = 45
      RAM_GB      = 16
      Online      = $true
      UltimaVerif = Get-Date
  }
  $servidor.Nome   # SRV-WEB-01
  $servidor.CPU    # 45

  # Coleção de objetos — ideal para pipeline
  $servidores = @(
      [PSCustomObject]@{ Nome="SRV-01"; CPU=45; RAM=16; Role="Web" },
      [PSCustomObject]@{ Nome="SRV-02"; CPU=23; RAM=32; Role="DB"  },
      [PSCustomObject]@{ Nome="SRV-03"; CPU=87; RAM=8;  Role="App" }
  )

  # Pipeline funciona perfeitamente
  $servidores |
      Where-Object CPU -gt 50 |
      Sort-Object CPU -Descending |
      Format-Table -AutoSize

  # Construindo objetos dentro de um pipeline
  Get-Process | ForEach-Object {
      [PSCustomObject]@{
          Nome    = $_.Name
          PID     = $_.Id
          RAM_MB  = [math]::Round($_.WorkingSet64 / 1MB, 1)
          Empresa = $_.Company
      }
  } | Sort-Object RAM_MB -Descending | Select-Object -First 10
  `} />

        <h2>Add-Member — Adicionando Propriedades e Métodos</h2>
        <CodeBlock title="Estendendo objetos existentes" code={`# NoteProperty — valor fixo
  $proc = Get-Process | Select-Object -First 1
  $proc | Add-Member -NotePropertyName "MemoriaMB" -NotePropertyValue ([math]::Round($proc.WorkingSet/1MB))
  $proc.MemoriaMB  # Nova propriedade

  # ScriptProperty — calculada dinamicamente (como um getter)
  $proc | Add-Member -MemberType ScriptProperty -Name "MemoriaFormatada" -Value {
      "{0:N2} MB" -f ($this.WorkingSet / 1MB)
  }
  $proc.MemoriaFormatada  # Recalculada toda vez que acessada

  # ScriptMethod — método executável
  $proc | Add-Member -MemberType ScriptMethod -Name "Informacoes" -Value {
      "Processo: $($this.Name) | PID: $($this.Id) | RAM: $([math]::Round($this.WorkingSet/1MB,1)) MB"
  }
  $proc.Informacoes()

  # AliasProperty — apelido para propriedade existente
  $proc | Add-Member -MemberType AliasProperty -Name "Nome" -Value "Name"
  $proc.Nome  # Mesmo que $proc.Name

  # Adicionar múltiplas propriedades de uma vez
  $obj = New-Object PSObject
  $obj | Add-Member -NotePropertyMembers @{
      Servidor  = "SRV-01"
      Porta     = 8080
      Protocolo = "HTTPS"
      Ativo     = $true
  }
  `} />

        <h2>Select-Object com Propriedades Calculadas</h2>
        <CodeBlock title="Transformando objetos no pipeline" code={`# Propriedades calculadas: @{N='Rótulo'; E={Expressão}}
  Get-Process | Select-Object Name, Id,
      @{N="CPU (s)";     E={[math]::Round($_.CPU, 2)}},
      @{N="RAM (MB)";    E={[math]::Round($_.WorkingSet/1MB, 1)}},
      @{N="Prioridade";  E={$_.PriorityClass.ToString()}},
      @{N="Em execução"; E={$_.Responding}} |
      Sort-Object "RAM (MB)" -Descending |
      Select-Object -First 10 |
      Format-Table -AutoSize

  # Achatar objetos aninhados
  Get-ChildItem "C:\\Users" -Directory | Select-Object Name,
      @{N="Tamanho GB"; E={
          $size = (Get-ChildItem $_.FullName -Recurse -ErrorAction SilentlyContinue |
              Measure-Object Length -Sum).Sum
          [math]::Round($size / 1GB, 2)
      }},
      @{N="Criado";       E={ $_.CreationTime.ToString("dd/MM/yyyy") }},
      @{N="Últ. Acesso";  E={ $_.LastAccessTime.ToString("dd/MM/yyyy") }}

  # Propriedades calculadas em Format-Table
  Get-Service | Format-Table Name,
      @{N="Estado"; E={ if ($_.Status -eq "Running") { "✅ Rodando" } else { "❌ Parado" } }},
      @{N="Tipo Início"; E={ $_.StartType }}
  `} />

        <h2>Update-TypeData — Tipos Personalizados</h2>
        <CodeBlock title="Estendendo tipos .NET com propriedades permanentes" code={`# Adicionar propriedades a FileInfo (todos os objetos de arquivo ganham a propriedade)
  Update-TypeData -TypeName System.IO.FileInfo `
    -MemberType ScriptProperty `
    -MemberName "TamanhoFormatado" `
    -Value {
      switch ($this.Length) {
          { $_ -ge 1GB } { return "{0:N2} GB" -f ($_ / 1GB) }
          { $_ -ge 1MB } { return "{0:N2} MB" -f ($_ / 1MB) }
          { $_ -ge 1KB } { return "{0:N2} KB" -f ($_ / 1KB) }
          default        { return "$_ B" }
      }
  }

  # Agora TODOS os FileInfo têm .TamanhoFormatado
  Get-ChildItem "C:\\Windows" -Filter "*.exe" |
      Select-Object Name, TamanhoFormatado, LastWriteTime |
      Format-Table -AutoSize

  # Adicionar método a [string]
  Update-TypeData -TypeName System.String `
    -MemberType ScriptMethod `
    -MemberName "Reverse" `
    -Value { [string]([char[]]$this | ForEach-Object { $_ } | Sort-Object { [array]::IndexOf([char[]]$this, $_) } -Descending) -join '' }

  # Propriedade DefaultDisplayPropertySet — controla o que Format-Table mostra por padrão
  Update-TypeData -TypeName System.Diagnostics.Process `
    -DefaultDisplayPropertySet Name, Id, CPU, WorkingSet64, StartTime
  `} />

        <h2>Serialização e Comparação de Objetos</h2>
        <CodeBlock title="JSON, XML e comparação de objetos" code={`# Serializar para JSON (PowerShell 7 tem ConvertTo-Json mais rico)
  $config = [PSCustomObject]@{
      Servidor = "SRV-01"
      Portas   = @(80, 443, 8080)
      Features = @{ SSL=$true; Auth="Bearer"; Timeout=30 }
  }
  $json = $config | ConvertTo-Json -Depth 5
  $json | Set-Content "config.json" -Encoding UTF8

  # Deserializar JSON
  $lido = Get-Content "config.json" | ConvertFrom-Json
  $lido.Features.SSL   # $true

  # Serializar para XML (CLIXML — formato nativo do PS)
  $config | Export-Clixml "config.clixml"
  $restaurado = Import-Clixml "config.clixml"

  # Comparar objetos
  $a = [PSCustomObject]@{ Nome="A"; Valor=10 }
  $b = [PSCustomObject]@{ Nome="B"; Valor=20 }
  Compare-Object $a $b -Property Nome, Valor

  # Comparar coleções
  $lista1 = Import-Csv "lista-atual.csv"
  $lista2 = Import-Csv "lista-anterior.csv"
  $diff = Compare-Object $lista1 $lista2 -Property Email
  $novos   = $diff | Where-Object SideIndicator -eq "<=" | Select-Object -ExpandProperty InputObject
  $removidos = $diff | Where-Object SideIndicator -eq "=>" | Select-Object -ExpandProperty InputObject
  "Novos: $($novos.Count) | Removidos: $($removidos.Count)"
  `} />

        <h2>Grupos e Agregações</h2>
        <CodeBlock title="Group-Object e Measure-Object avançados" code={`# Agrupar e sumarizar processos por empresa
  Get-Process | Group-Object Company |
      Sort-Object Count -Descending |
      Select-Object -First 10 |
      Select-Object Name, Count,
          @{N="RAM Total MB"; E={ [math]::Round(($_.Group | Measure-Object WorkingSet64 -Sum).Sum / 1MB) }}

  # Múltiplas estatísticas de uma vez
  Get-Process | Measure-Object CPU, WorkingSet64 -Sum -Average -Maximum -Minimum |
      Format-Table Property, Sum, Average, Maximum, Minimum -AutoSize

  # Tabela pivot com Group-Object e hashtable
  $vendas = Import-Csv "vendas.csv"
  $pivot = $vendas | Group-Object Regiao | ForEach-Object {
      [PSCustomObject]@{
          Regiao  = $_.Name
          Total   = ($_.Group | Measure-Object Valor -Sum).Sum
          Qtd     = $_.Count
          Média   = [math]::Round(($_.Group | Measure-Object Valor -Average).Average, 2)
      }
  } | Sort-Object Total -Descending
  $pivot | Format-Table -AutoSize
  `} />

        <AlertBox type="info" title="PSCustomObject vs New-Object PSObject">
          Prefira sempre <code>[PSCustomObject]@{'{'}...{'}'}</code> em vez de <code>New-Object PSObject</code>
          ou <code>New-Object PSObject -Property @{'{'}...{'}'}</code>. O cast literal é até 10x mais
          rápido, mantém a ordem das propriedades e tem sintaxe mais limpa.
        </AlertBox>
      </PageContainer>
    );
  }
  