import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Registro() {
  return (
    <PageContainer
      title="Manipulação do Registro"
      subtitle="Gerencie configurações do Windows através do provedor de Registro do PowerShell."
      difficulty="intermediario"
      timeToRead="20 min"
    >
      <p>
        O Registro do Windows é um banco de dados hierárquico que armazena configurações do sistema e de aplicativos. No PowerShell, o Registro é tratado como uma unidade de disco (através do <em>provedor Registry</em>), permitindo que você navegue, leia, escreva e automatize alterações nele exatamente como faria com o sistema de arquivos.
      </p>

      <AlertBox type="danger" title="Atenção — Faça Backup Antes de Modificar">
        Alterar o Registro incorretamente pode tornar o sistema instável, impedir o boot do Windows ou corromper aplicativos. Sempre exporte as chaves que vai modificar antes de qualquer alteração:
        <code style={{display:'block', marginTop:'0.5rem'}}>reg export "HKCU\Software\MinhaApp" "backup_minhaapp.reg"</code>
      </AlertBox>

      <h2>Navegando no Registro como um Sistema de Arquivos</h2>
      <p>
        O PowerShell mapeia as chaves raiz principais por padrão: <code>HKLM:</code> (HKEY_LOCAL_MACHINE) e <code>HKCU:</code> (HKEY_CURRENT_USER). Você pode usar <code>Set-Location</code>, <code>Get-ChildItem</code>, <code>Test-Path</code> e outros cmdlets de sistema de arquivos normalmente.
      </p>

      <CodeBlock
        title="Navegação básica no Registro"
        language="powershell"
        code={`# Mudar para a unidade do Registro
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
# Agora: cd HKCR:\\`}
      />

      <h2>Lendo Valores do Registro</h2>
      <p>
        Diferente do sistema de arquivos, as chaves de registro têm "Propriedades" (os valores reais, como strings, DWORDs, etc.). O cmdlet principal é <code>Get-ItemProperty</code>.
      </p>

      <CodeBlock
        title="Obtendo dados de chaves e valores"
        language="powershell"
        code={`# Ler TODAS as propriedades de uma chave
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
    Where-Object { $_.PSObject.Properties.Value -contains "MinhaString" }`}
      />

      <h2>Criando e Alterando Chaves e Valores</h2>
      <p>
        Para criar uma nova "pasta" no Registro use <code>New-Item</code>. Para criar um "valor" (String, DWORD, etc.), use <code>New-ItemProperty</code>. Para modificar um valor existente, use <code>Set-ItemProperty</code>.
      </p>

      <CodeBlock
        title="Escrita no Registro — operações completas"
        language="powershell"
        code={`# 1. Criar uma nova chave (pasta)
New-Item -Path "HKCU:\\Software\\ScriptBrasil" -Force

# 2. Criar subchave
New-Item -Path "HKCU:\\Software\\ScriptBrasil\\Configuracoes" -Force

# 3. Adicionar valores com diferentes tipos de dados
New-ItemProperty -Path "HKCU:\\Software\\ScriptBrasil" \`
    -Name "Versao" -Value "2.5.0" -PropertyType String    -Force
New-ItemProperty -Path "HKCU:\\Software\\ScriptBrasil" \`
    -Name "Ativo"  -Value 1       -PropertyType DWord     -Force
New-ItemProperty -Path "HKCU:\\Software\\ScriptBrasil" \`
    -Name "GUID"   -Value "{A1B2-C3D4}" -PropertyType String -Force
New-ItemProperty -Path "HKCU:\\Software\\ScriptBrasil" \`
    -Name "Servidores" -Value @("SRV01","SRV02") -PropertyType MultiString -Force

# 4. Alterar o valor de uma propriedade existente
Set-ItemProperty -Path "HKCU:\\Software\\ScriptBrasil" -Name "Versao" -Value "2.6.0"

# 5. Renomear uma propriedade
Rename-ItemProperty -Path "HKCU:\\Software\\ScriptBrasil" -Name "Ativo" -NewName "Habilitado"

# 6. Copiar uma chave inteira para outro local
Copy-Item -Path "HKCU:\\Software\\ScriptBrasil" -Destination "HKCU:\\Software\\ScriptBrasil_Backup" -Recurse`}
      />

      <h2>Tipos de Dados do Registro</h2>
      <p>
        Ao criar propriedades com <code>New-ItemProperty</code>, escolha o <code>-PropertyType</code> correto:
      </p>
      <ul>
        <li><strong>String (REG_SZ):</strong> Texto simples. Ex: caminhos, nomes, IDs.</li>
        <li><strong>ExpandString (REG_EXPAND_SZ):</strong> String com variáveis de ambiente. Ex: <code>%SystemRoot%\\system32</code>.</li>
        <li><strong>DWord (REG_DWORD):</strong> Número inteiro de 32 bits. Muito usado para flags 0/1 (desabilitado/habilitado).</li>
        <li><strong>QWord (REG_QWORD):</strong> Número inteiro de 64 bits para valores grandes.</li>
        <li><strong>Binary (REG_BINARY):</strong> Dados em formato hexadecimal (chaves de licença, configurações internas).</li>
        <li><strong>MultiString (REG_MULTI_SZ):</strong> Lista de strings separadas por nulo. Ex: lista de servidores.</li>
      </ul>

      <h2>Removendo Dados do Registro</h2>

      <CodeBlock
        title="Deletando chaves e valores com segurança"
        language="powershell"
        code={`# Exportar a chave ANTES de deletar (boa prática obrigatória!)
reg export "HKCU\\Software\\ScriptBrasil" "$env:TEMP\\backup_ScriptBrasil.reg"

# Remover um valor específico (propriedade)
Remove-ItemProperty -Path "HKCU:\\Software\\ScriptBrasil" -Name "Versao"

# Remover múltiplos valores de uma vez
Remove-ItemProperty -Path "HKCU:\\Software\\ScriptBrasil" -Name "Versao", "GUID"

# Remover uma chave inteira e tudo dentro dela (use com cuidado!)
Remove-Item -Path "HKCU:\\Software\\ScriptBrasil" -Recurse -Force

# Verificar antes de deletar (use -WhatIf para simular)
Remove-Item -Path "HKCU:\\Software\\ScriptBrasil" -Recurse -WhatIf`}
      />

      <h2>Casos de Uso Práticos</h2>

      <CodeBlock
        title="Scripts de configuração do Windows via Registro"
        language="powershell"
        code={`# Desabilitar o Bing no Menu Iniciar (Windows 10/11)
$path = "HKCU:\\Software\\Policies\\Microsoft\\Windows\\Explorer"
if (!(Test-Path $path)) { New-Item $path -Force }
Set-ItemProperty -Path $path -Name "DisableSearchBoxSuggestions" -Value 1 -Type DWord

# Habilitar modo escuro no sistema e nos aplicativos
Set-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize" \`
    -Name "AppsUseLightTheme"   -Value 0 -Type DWord  # 0 = escuro, 1 = claro
Set-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize" \`
    -Name "SystemUsesLightTheme" -Value 0 -Type DWord

# Desativar animações para melhorar performance
Set-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\VisualEffects" \`
    -Name "VisualFXSetting" -Value 2 -Type DWord  # 2 = melhor desempenho

# Configurar extensões de arquivo visíveis no Explorer
Set-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" \`
    -Name "HideFileExt" -Value 0 -Type DWord  # 0 = mostrar extensões

# Ler a chave de produto do Windows (útil para auditoria)
$key = (Get-ItemProperty "HKLM:\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion").ProductId
Write-Host "Product ID do Windows: $key"`}
      />

      <AlertBox type="info" title="Remote Registry">
        Você pode gerenciar o Registro de máquinas remotas usando <code>Invoke-Command</code> com Remoting, ou habilitando o serviço "Remote Registry" no destino e usando <code>-ComputerName</code> nos cmdlets de Registro. Sempre prefira o Remoting via WinRM (mais seguro que o Remote Registry nativo).
      </AlertBox>
    </PageContainer>
  );
}
