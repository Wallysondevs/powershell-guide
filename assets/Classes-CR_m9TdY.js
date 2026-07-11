import{n as e,t}from"./CodeBlock-DVOG-hPm.js";import{t as n}from"./AlertBox-q8pQIQ07.js";import{a as r}from"./index-D0tfvO9Z.js";var i=r();function a(){return(0,i.jsxs)(e,{title:`Classes e Programação Orientada a Objetos`,subtitle:`Domine a criação de classes, herança, interfaces e encapsulamento no PowerShell 5+.`,difficulty:`avançado`,timeToRead:`35 min`,children:[(0,i.jsxs)(`p`,{children:[`A partir do PowerShell 5.0, é possível definir classes nativas usando a palavra-chave `,(0,i.jsx)(`code`,{children:`class`}),`. Isso permite criar tipos reutilizáveis com propriedades, métodos, construtores e herança — tudo dentro de scripts PowerShell, sem precisar de C# ou assemblies externos.`]}),(0,i.jsx)(`h2`,{children:`Definindo uma Classe Simples`}),(0,i.jsx)(t,{title:`Classe básica com propriedades e métodos`,code:`class Pessoa {
    # Propriedades
    [string] $Nome
    [int]    $Idade

    # Construtor padrão
    Pessoa() {
        $this.Nome  = "Desconhecido"
        $this.Idade = 0
    }

    # Construtor com parâmetros
    Pessoa([string]$nome, [int]$idade) {
        $this.Nome  = $nome
        $this.Idade = $idade
    }

    # Método de instância
    [string] Saudacao() {
        return "Olá, meu nome é $($this.Nome) e tenho $($this.Idade) anos."
    }

    # Método estático
    static [string] Especie() {
        return "Homo sapiens"
    }

    # Override de ToString
    [string] ToString() {
        return "$($this.Nome) ($($this.Idade))"
    }
}

# Instanciando
$p = [Pessoa]::new("Ana", 30)
$p.Saudacao()               # Olá, meu nome é Ana e tenho 30 anos.
[Pessoa]::Especie()         # Homo sapiens
Write-Host $p               # Ana (30)  — chama ToString()
`}),(0,i.jsx)(`h2`,{children:`Propriedades com Validação`}),(0,i.jsx)(t,{title:`Propriedades tipadas e validadas`,code:`class Produto {
    [ValidateNotNullOrEmpty()] [string]  $Nome
    [ValidateRange(0, 99999)]  [decimal] $Preco
    [ValidateSet("A","B","C")] [string]  $Categoria

    Produto([string]$n, [decimal]$p, [string]$c) {
        $this.Nome      = $n
        $this.Preco     = $p
        $this.Categoria = $c
    }

    [string] Etiqueta() {
        return "[{0}] {1} - R$ {2:F2}" -f $this.Categoria, $this.Nome, $this.Preco
    }
}

$tv = [Produto]::new("Smart TV 55"", 2799.90, "A")
$tv.Etiqueta()  # [A] Smart TV 55" - R$ 2799.90

# Validação em ação
try { [Produto]::new("", 100, "A") } catch { "Erro: $_" }   # Nome vazio
try { [Produto]::new("X", -5, "A") } catch { "Erro: $_" }   # Preço negativo
`}),(0,i.jsx)(`h2`,{children:`Herança`}),(0,i.jsx)(t,{title:`Herança e polimorfismo`,code:`class Animal {
    [string] $Nome
    [string] $Especie

    Animal([string]$nome, [string]$especie) {
        $this.Nome    = $nome
        $this.Especie = $especie
    }

    [string] Falar() { return "..." }
    [string] Apresentar() { return "$($this.Nome) é um $($this.Especie)" }
}

class Cachorro : Animal {
    [string] $Raca

    Cachorro([string]$nome, [string]$raca) : base($nome, "Canis lupus familiaris") {
        $this.Raca = $raca
    }

    # Override
    [string] Falar() { return "Au au!" }
    [string] Apresentar() {
        return "$([base]::Apresentar($this)) — Raça: $($this.Raca)"
    }
}

class Gato : Animal {
    Gato([string]$nome) : base($nome, "Felis catus") {}
    [string] Falar() { return "Miau!" }
}

$dog = [Cachorro]::new("Rex", "Labrador")
$cat = [Gato]::new("Mimi")

foreach ($a in @($dog, $cat)) {
    "$($a.Nome): $($a.Falar())"
}
`}),(0,i.jsx)(`h2`,{children:`Interfaces e Membros Ocultos`}),(0,i.jsxs)(n,{type:`info`,title:`Interfaces no PowerShell`,children:[`O PowerShell não suporta interfaces nativas, mas você pode implementar interfaces .NET declarando a classe como `,(0,i.jsx)(`code`,{children:`class MinhaClasse : System.IComparable`}),` e implementando os métodos exigidos.`]}),(0,i.jsx)(t,{title:`Implementando interface .NET`,code:`class Temperatura : System.IComparable {
    [double] $Celsius

    Temperatura([double]$c) { $this.Celsius = $c }

    [double] EmFahrenheit() { return $this.Celsius * 9/5 + 32 }
    [double] EmKelvin()     { return $this.Celsius + 273.15 }

    # Obrigatório pela interface IComparable
    [int] CompareTo([object]$outro) {
        return $this.Celsius.CompareTo(([Temperatura]$outro).Celsius)
    }

    [string] ToString() {
        return "{0:F1}°C / {1:F1}°F" -f $this.Celsius, $this.EmFahrenheit()
    }
}

$temps = @(
    [Temperatura]::new(100),
    [Temperatura]::new(0),
    [Temperatura]::new(37)
)

$temps | Sort-Object | ForEach-Object { "$_" }
# 0.0°C / 32.0°F
# 37.0°C / 98.6°F
# 100.0°C / 212.0°F
`}),(0,i.jsx)(`h2`,{children:`Classes em Módulos`}),(0,i.jsx)(t,{title:`Exportando classes de módulos`,code:`# Arquivo: MeuModulo.psm1
class Configuracao {
    [string]   $Ambiente
    [hashtable] $Valores

    Configuracao([string]$amb) {
        $this.Ambiente = $amb
        $this.Valores  = @{}
    }

    [void] Definir([string]$chave, $valor) {
        $this.Valores[$chave] = $valor
    }

    $valor = $this.Valores[$chave]
    [object] Obter([string]$chave) {
        return $this.Valores[$chave]
    }

    [bool] Existe([string]$chave) {
        return $this.Valores.ContainsKey($chave)
    }
}

# IMPORTANTE: Para exportar classes, use 'using module' no script consumidor
# Não use Import-Module — classes não são exportadas por Import-Module!

# No script que usa o módulo:
using module .MeuModulo.psm1
$cfg = [Configuracao]::new("producao")
$cfg.Definir("ApiUrl", "https://api.exemplo.com")
$cfg.Obter("ApiUrl")   # https://api.exemplo.com
`}),(0,i.jsx)(n,{type:`warning`,title:`Limitações de Classes PowerShell`,children:`Classes PowerShell têm algumas limitações em comparação com C#: não suportam modificadores de acesso granulares (public/private/protected por membro), métodos genéricos nativos, ou eventos declarativos. Para esses casos, considere usar C# inline com Add-Type.`}),(0,i.jsx)(`h2`,{children:`Add-Type: Classes C# em PowerShell`}),(0,i.jsx)(t,{title:`Incorporando classes C# quando necessário`,code:`Add-Type -TypeDefinition @'
using System;
using System.Collections.Generic;

public class GerenciadorCache<T> {
    private Dictionary<string, T> _cache = new Dictionary<string, T>();
    private int _maxItens;

    public GerenciadorCache(int maxItens) { _maxItens = maxItens; }

    public void Adicionar(string chave, T valor) {
        if (_cache.Count >= _maxItens) _cache.Clear();
        _cache[chave] = valor;
    }

    public bool TryGet(string chave, out T valor) {
        return _cache.TryGetValue(chave, out valor);
    }

    public int Count => _cache.Count;
}
'@ -Language CSharp

$cache = [GerenciadorCache[string]]::new(100)
$cache.Adicionar("usuario1", "João Silva")

$val = $null
if ($cache.TryGet("usuario1", [ref]$val)) {
    "Encontrado: $val"
}
`})]})}export{a as default};