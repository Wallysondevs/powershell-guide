import{n as e,t}from"./CodeBlock-DVOG-hPm.js";import{t as n}from"./AlertBox-q8pQIQ07.js";import{a as r}from"./index-D0tfvO9Z.js";var i=r();function a(){return(0,i.jsxs)(e,{title:`Manipulação do Registro`,subtitle:`Gerencie configurações do Windows através do provedor de Registro do PowerShell.`,difficulty:`intermediario`,timeToRead:`20 min`,children:[(0,i.jsxs)(`p`,{children:[`O Registro do Windows é um banco de dados hierárquico que armazena configurações do sistema e de aplicativos. No PowerShell, o Registro é tratado como uma unidade de disco (através do `,(0,i.jsx)(`em`,{children:`provedor Registry`}),`), permitindo que você navegue, leia, escreva e automatize alterações nele exatamente como faria com o sistema de arquivos.`]}),(0,i.jsxs)(n,{type:`danger`,title:`Atenção — Faça Backup Antes de Modificar`,children:[`Alterar o Registro incorretamente pode tornar o sistema instável, impedir o boot do Windows ou corromper aplicativos. Sempre exporte as chaves que vai modificar antes de qualquer alteração:`,(0,i.jsx)(`code`,{style:{display:`block`,marginTop:`0.5rem`},children:`reg export "HKCU\\Software\\MinhaApp" "backup_minhaapp.reg"`})]}),(0,i.jsx)(`h2`,{children:`Navegando no Registro como um Sistema de Arquivos`}),(0,i.jsxs)(`p`,{children:[`O PowerShell mapeia as chaves raiz principais por padrão: `,(0,i.jsx)(`code`,{children:`HKLM:`}),` (HKEY_LOCAL_MACHINE) e `,(0,i.jsx)(`code`,{children:`HKCU:`}),` (HKEY_CURRENT_USER). Você pode usar `,(0,i.jsx)(`code`,{children:`Set-Location`}),`, `,(0,i.jsx)(`code`,{children:`Get-ChildItem`}),`, `,(0,i.jsx)(`code`,{children:`Test-Path`}),` e outros cmdlets de sistema de arquivos normalmente.`]}),(0,i.jsx)(t,{title:`Navegação básica no Registro`,language:`powershell`,code:`# Mudar para a unidade do Registro
Set-Location HKLM:\\SOFTWARE\\Microsoft
# ou o alias mais curto:
cd HKCU:\\Software

# Listar subchaves (como se fossem pastas/diretórios)
Get-ChildItem                       # Alias: ls, dir, gci
Get-ChildItem -Recurse              # Todas as subchaves recursivamente

# Verificar se uma chave (pasta) existe
Test-Path "HKCU:\\Software\\MinhaApp"                  # $true ou $false
Test-Path "HKLM:\\SOFTWARE\\Microsoft\\Windows NT"     # $true

# Listar todos os drives disponíveis (incluindo o Registry)
Get-PSDrive | Where-Object Provider -like "*Registry*"
# HKLM e HKCU estão disponíveis por padrão; HKCR precisa ser mapeado manualmente

# Mapear HKEY_CLASSES_ROOT como drive acessível
New-PSDrive -Name HKCR -PSProvider Registry -Root HKEY_CLASSES_ROOT
# Agora: cd HKCR:`}),(0,i.jsx)(`h2`,{children:`Lendo Valores do Registro`}),(0,i.jsxs)(`p`,{children:[`Diferente do sistema de arquivos, as chaves de registro têm "Propriedades" (os valores reais, como strings, DWORDs, etc.). O cmdlet principal é `,(0,i.jsx)(`code`,{children:`Get-ItemProperty`}),`.`]}),(0,i.jsx)(t,{title:`Obtendo dados de chaves e valores`,language:`powershell`,code:`# Ler TODAS as propriedades de uma chave
Get-ItemProperty -Path "HKCU:\\Control Panel\\Desktop"

# Ler um valor específico com -Name
Get-ItemProperty -Path "HKCU:\\Control Panel\\Desktop" -Name "WallPaper"

# Extrair apenas o valor (sem metadados extras) — PS 5.0+
Get-ItemPropertyValue -Path "HKCU:\\Control Panel\\Desktop" -Name "WallPaper"

# Guardar o valor em variável para uso posterior
$papel = Get-ItemPropertyValue -Path "HKCU:\\Control Panel\\Desktop" -Name "WallPaper"
Write-Host "Papel de parede atual: $papel"

# Ler o valor padrão de uma chave (a propriedade sem nome)
Get-ItemProperty -Path "HKCR:\\.txt" -Name "(Default)"

# Buscar chaves com valores específicos (pesquisa no Registro)
Get-ChildItem -Path "HKCU:\\Software" -Recurse -ErrorAction SilentlyContinue |
    Get-ItemProperty |
    Where-Object { $_.PSObject.Properties.Value -contains "MinhaString" }`}),(0,i.jsx)(`h2`,{children:`Criando e Alterando Chaves e Valores`}),(0,i.jsxs)(`p`,{children:[`Para criar uma nova "pasta" no Registro use `,(0,i.jsx)(`code`,{children:`New-Item`}),`. Para criar um "valor" (String, DWORD, etc.), use `,(0,i.jsx)(`code`,{children:`New-ItemProperty`}),`. Para modificar um valor existente, use `,(0,i.jsx)(`code`,{children:`Set-ItemProperty`}),`.`]}),(0,i.jsx)(t,{title:`Escrita no Registro — operações completas`,language:`powershell`,code:`# 1. Criar uma nova chave (pasta)
New-Item -Path "HKCU:\\Software\\ScriptBrasil" -Force

# 2. Criar subchave
New-Item -Path "HKCU:\\Software\\ScriptBrasil\\Configuracoes" -Force

# 3. Adicionar valores com diferentes tipos de dados
New-ItemProperty -Path "HKCU:\\Software\\ScriptBrasil"  -Name "Versao" -Value "2.5.0" -PropertyType String    -Force
New-ItemProperty -Path "HKCU:\\Software\\ScriptBrasil"  -Name "Ativo"  -Value 1       -PropertyType DWord     -Force
New-ItemProperty -Path "HKCU:\\Software\\ScriptBrasil"  -Name "GUID"   -Value "{A1B2-C3D4}" -PropertyType String -Force
New-ItemProperty -Path "HKCU:\\Software\\ScriptBrasil"  -Name "Servidores" -Value @("SRV01","SRV02") -PropertyType MultiString -Force

# 4. Alterar o valor de uma propriedade existente
Set-ItemProperty -Path "HKCU:\\Software\\ScriptBrasil" -Name "Versao" -Value "2.6.0"

# 5. Renomear uma propriedade
Rename-ItemProperty -Path "HKCU:\\Software\\ScriptBrasil" -Name "Ativo" -NewName "Habilitado"

# 6. Copiar uma chave inteira para outro local
Copy-Item -Path "HKCU:\\Software\\ScriptBrasil" -Destination "HKCU:\\Software\\ScriptBrasil_Backup" -Recurse`}),(0,i.jsx)(`h2`,{children:`Tipos de Dados do Registro`}),(0,i.jsxs)(`p`,{children:[`Ao criar propriedades com `,(0,i.jsx)(`code`,{children:`New-ItemProperty`}),`, escolha o `,(0,i.jsx)(`code`,{children:`-PropertyType`}),` correto:`]}),(0,i.jsxs)(`ul`,{children:[(0,i.jsxs)(`li`,{children:[(0,i.jsx)(`strong`,{children:`String (REG_SZ):`}),` Texto simples. Ex: caminhos, nomes, IDs.`]}),(0,i.jsxs)(`li`,{children:[(0,i.jsx)(`strong`,{children:`ExpandString (REG_EXPAND_SZ):`}),` String com variáveis de ambiente. Ex: `,(0,i.jsx)(`code`,{children:`%SystemRoot%\\\\system32`}),`.`]}),(0,i.jsxs)(`li`,{children:[(0,i.jsx)(`strong`,{children:`DWord (REG_DWORD):`}),` Número inteiro de 32 bits. Muito usado para flags 0/1 (desabilitado/habilitado).`]}),(0,i.jsxs)(`li`,{children:[(0,i.jsx)(`strong`,{children:`QWord (REG_QWORD):`}),` Número inteiro de 64 bits para valores grandes.`]}),(0,i.jsxs)(`li`,{children:[(0,i.jsx)(`strong`,{children:`Binary (REG_BINARY):`}),` Dados em formato hexadecimal (chaves de licença, configurações internas).`]}),(0,i.jsxs)(`li`,{children:[(0,i.jsx)(`strong`,{children:`MultiString (REG_MULTI_SZ):`}),` Lista de strings separadas por nulo. Ex: lista de servidores.`]})]}),(0,i.jsx)(`h2`,{children:`Removendo Dados do Registro`}),(0,i.jsx)(t,{title:`Deletando chaves e valores com segurança`,language:`powershell`,code:`# Exportar a chave ANTES de deletar (boa prática obrigatória!)
reg export "HKCU\\Software\\ScriptBrasil" "$env:TEMP\\backup_ScriptBrasil.reg"

# Remover um valor específico (propriedade)
Remove-ItemProperty -Path "HKCU:\\Software\\ScriptBrasil" -Name "Versao"

# Remover múltiplos valores de uma vez
Remove-ItemProperty -Path "HKCU:\\Software\\ScriptBrasil" -Name "Versao", "GUID"

# Remover uma chave inteira e tudo dentro dela (use com cuidado!)
Remove-Item -Path "HKCU:\\Software\\ScriptBrasil" -Recurse -Force

# Verificar antes de deletar (use -WhatIf para simular)
Remove-Item -Path "HKCU:\\Software\\ScriptBrasil" -Recurse -WhatIf`}),(0,i.jsx)(`h2`,{children:`Casos de Uso Práticos`}),(0,i.jsx)(t,{title:`Scripts de configuração do Windows via Registro`,language:`powershell`,code:`# Desabilitar o Bing no Menu Iniciar (Windows 10/11)
$path = "HKCU:\\Software\\Policies\\Microsoft\\Windows\\Explorer"
if (!(Test-Path $path)) { New-Item $path -Force }
Set-ItemProperty -Path $path -Name "DisableSearchBoxSuggestions" -Value 1 -Type DWord

# Habilitar modo escuro no sistema e nos aplicativos
Set-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize"  -Name "AppsUseLightTheme"   -Value 0 -Type DWord  # 0 = escuro, 1 = claro
Set-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize"  -Name "SystemUsesLightTheme" -Value 0 -Type DWord

# Desativar animações para melhorar performance
Set-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\VisualEffects"  -Name "VisualFXSetting" -Value 2 -Type DWord  # 2 = melhor desempenho

# Configurar extensões de arquivo visíveis no Explorer
Set-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced"  -Name "HideFileExt" -Value 0 -Type DWord  # 0 = mostrar extensões

# Ler a chave de produto do Windows (útil para auditoria)
$key = (Get-ItemProperty "HKLM:\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion").ProductId
Write-Host "Product ID do Windows: $key"`}),(0,i.jsxs)(n,{type:`info`,title:`Remote Registry`,children:[`Você pode gerenciar o Registro de máquinas remotas usando `,(0,i.jsx)(`code`,{children:`Invoke-Command`}),` com Remoting, ou habilitando o serviço "Remote Registry" no destino e usando `,(0,i.jsx)(`code`,{children:`-ComputerName`}),` nos cmdlets de Registro. Sempre prefira o Remoting via WinRM (mais seguro que o Remote Registry nativo).`]})]})}export{a as default};