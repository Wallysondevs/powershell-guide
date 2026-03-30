import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Objetos() {
  return (
    <PageContainer
      title="Objetos Personalizados"
      subtitle="Crie, combine, estenda e manipule objetos PSCustomObject, TypeData e propriedades calculadas."
      difficulty="intermediário"
      timeToRead="20 min"
    >
      <p>
        No PowerShell, tudo é um objeto. Entender como criar objetos personalizados,
        adicionar propriedades e métodos, e manipular o sistema de tipos é fundamental
        para scripts avançados e bem estruturados.
      </p>

      <h2>PSCustomObject</h2>
      <CodeBlock title="Criando objetos estruturados" code={`# Forma recomendada: literal de hashtable com cast
$servidor = [PSCustomObject]@{
    Nome        = "SRV-WEB-01"
    IP          = "192.168.1.10"
    CPU         = 45
    RAM_GB      = 16
    Online      = $true
    UltimaVerif = Get-Date
}

# Acessar propriedades
$servidor.Nome   # SRV-WEB-01
$servidor.CPU    # 45

# Coleção de objetos
$servidores = @(
    [PSCustomObject]@{ Nome="SRV-01"; CPU=45; RAM=16; Role="Web" },
    [PSCustomObject]@{ Nome="SRV-02"; CPU=23; RAM=32; Role="DB"  },
    [PSCustomObject]@{ Nome="SRV-03"; CPU=87; RAM=8;  Role="App" }
)

# Pipeline funciona perfeitamente
$servidores | Where-Object CPU -gt 50 | Sort-Object CPU -Descending |
    Format-Table -AutoSize
`} />

      <h2>Add-Member: Adicionando Propriedades e Métodos</h2>
      <CodeBlock title="Estendendo objetos existentes" code={`# Add-Member em objeto existente
$obj = Get-Process | Select-Object -First 1
$obj | Add-Member -NotePropertyName "MemoriaMB" -NotePropertyValue ([math]::Round($obj.WorkingSet/1MB))
$obj.MemoriaMB  # Nova propriedade

# Adicionar método (ScriptMethod)
$obj | Add-Member -MemberType ScriptMethod -Name "Reiniciar" -Value {
    Stop-Process -Id $this.Id -Force
    Start-Process -FilePath $this.Path
    "$($this.Name) reiniciado!"
}
$obj.Reiniciar()

# Adicionar propriedade calculada (ScriptProperty — calculada dinamicamente)
$obj | Add-Member -MemberType ScriptProperty -Name "MemoriaFormatada" -Value {
    "{0:N2} MB" -f ($this.WorkingSet / 1MB)
}
$obj.MemoriaFormatada  # 45.23 MB (calculada na hora)
`} />

      <h2>Select-Object com Propriedades Calculadas</h2>
      <CodeBlock title="Transformando objetos no pipeline" code={`# Propriedades calculadas com @{N='Nome';E={expressão}}
Get-Process | Select-Object Name, Id,
    @{N="CPU (s)";    E={[math]::Round($_.CPU, 2)}},
    @{N="RAM (MB)";   E={[math]::Round($_.WorkingSet/1MB, 1)}},
    @{N="Prioridade"; E={$_.PriorityClass.ToString()}} |
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
    @{N="Último Acesso"; E={ $_.LastAccessTime.ToString("dd/MM/yyyy") }}
`} />

      <h2>Update-TypeData: Tipos Personalizados</h2>
      <CodeBlock title="Extendendo tipos com TypeData" code={`# Adicionar propriedades a tipos .NET existentes
Update-TypeData -TypeName System.IO.FileInfo  -MemberType ScriptProperty  -MemberName "TamanhoFormatado"  -Value {
        if ($this.Length -ge 1GB)     { "{0:N2} GB" -f ($this.Length / 1GB) }
        elseif ($this.Length -ge 1MB) { "{0:N2} MB" -f ($this.Length / 1MB) }
        elseif ($this.Length -ge 1KB) { "{0:N2} KB" -f ($this.Length / 1KB) }
        else                           { "$($this.Length) B" }
    }

# Agora todos os objetos FileInfo têm .TamanhoFormatado
Get-ChildItem "C:\\Windows" -Filter "*.exe" |
    Select-Object Name, TamanhoFormatado, LastWriteTime |
    Format-Table -AutoSize

# Adicionar método a [string]
Update-TypeData -TypeName System.String  -MemberType ScriptMethod  -MemberName "ParaTitulo"  -Value { $this -replace '(\w)(\w*)', { $_.Groups[1].Value.ToUpper() + $_.Groups[2].Value.ToLower() } }

"HELLO WORLD".ParaTitulo()  # Hello World
`} />

      <h2>Grupos e Agregações</h2>
      <CodeBlock title="Group-Object e Measure-Object avançados" code={`# Agrupar e sumarizar
Get-Process | Group-Object -Property Company |
    Sort-Object Count -Descending |
    Select-Object -First 10 |
    Select-Object Name,
        Count,
        @{N="RAM Total MB"; E={ [math]::Round(($_.Group | Measure-Object WorkingSet -Sum).Sum / 1MB) }}

# Múltiplas métricas
Get-ChildItem "C:\\Windows" -Recurse -ErrorAction SilentlyContinue |
    Group-Object Extension |
    Select-Object Name,
        Count,
        @{N="Total MB"; E={ [math]::Round(($_.Group | Measure-Object Length -Sum).Sum / 1MB, 1) }} |
    Sort-Object "Total MB" -Descending |
    Select-Object -First 15 |
    Format-Table -AutoSize

# Measure-Object múltiplo
Get-Process | Measure-Object CPU, WorkingSet -Sum -Average -Maximum -Minimum |
    Format-Table Property, Sum, Average, Maximum, Minimum -AutoSize
`} />
    </PageContainer>
  );
}
