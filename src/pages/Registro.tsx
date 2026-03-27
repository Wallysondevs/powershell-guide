import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Registro() {
  return (
    <PageContainer
      title="Manipulação do Registro"
      subtitle="Gerencie configurações do Windows através do provedor de Registro do PowerShell."
      difficulty="intermediario"
      timeToRead="15 min"
    >
      <p>
        O Registro do Windows é um banco de dados hierárquico que armazena configurações do sistema e de aplicativos. No PowerShell, o Registro é tratado como uma unidade de disco (através do provedor Registry), permitindo que você navegue nele como se fosse o sistema de arquivos.
      </p>

      <h2>Navegando no Registro</h2>
      <p>
        O PowerShell mapeia as duas chaves principais por padrão: <code>HKLM:</code> (HKEY_LOCAL_MACHINE) e <code>HKCU:</code> (HKEY_CURRENT_USER).
      </p>

      <CodeBlock
        title="Navegação básica"
        code={`# Mudar para a unidade do registro
cd HKLM:\\SOFTWARE\\Microsoft

# Listar subchaves (como se fossem pastas)
ls

# Verificar se uma chave existe
Test-Path "HKCU:\\Software\\MinhaApp"`}
      />

      <h2>Lendo Valores do Registro</h2>
      <p>
        Diferente do sistema de arquivos, as chaves de registro têm "Propriedades" (os valores reais). Usamos o cmdlet <code>Get-ItemProperty</code>.
      </p>

      <CodeBlock
        title="Obtendo dados"
        code={`# Ler todas as propriedades de uma chave
Get-ItemProperty -Path "HKCU:\\Control Panel\\Desktop"

# Ler um valor específico
(Get-ItemProperty -Path "HKCU:\\Control Panel\\Desktop").WallPaper

# Forma alternativa usando Get-ItemPropertyValue (PS 5.0+)
Get-ItemPropertyValue -Path "HKCU:\\Control Panel\\Desktop" -Name "WallPaper"`}
      />

      <h2>Criando e Alterando Chaves e Valores</h2>
      <p>
        Para criar uma nova "pasta" no registro, usamos <code>New-Item</code>. Para criar um "valor" (como uma String ou DWORD), usamos <code>New-ItemProperty</code>.
      </p>

      <CodeBlock
        title="Escrita no Registro"
        code={`# 1. Criar uma nova chave
New-Item -Path "HKCU:\\Software\\ScriptBrasil"

# 2. Adicionar um valor (String)
New-ItemProperty -Path "HKCU:\\Software\\ScriptBrasil" -Name "Versao" -Value "1.0.0" -PropertyType String

# 3. Adicionar um valor (DWORD)
New-ItemProperty -Path "HKCU:\\Software\\ScriptBrasil" -Name "Ativo" -Value 1 -PropertyType DWord

# 4. Alterar um valor existente
Set-ItemProperty -Path "HKCU:\\Software\\ScriptBrasil" -Name "Versao" -Value "1.1.0"`}
      />

      <AlertBox type="danger" title="Atenção">
        Alterar o registro incorretamente pode tornar o sistema instável ou impedir o boot do Windows. Sempre faça backup das chaves antes de modificá-las.
      </AlertBox>

      <h2>Removendo Dados</h2>
      <p>
        Podemos remover propriedades específicas ou chaves inteiras.
      </p>

      <CodeBlock
        title="Deletando chaves e valores"
        code={`# Remover um valor específico (propriedade)
Remove-ItemProperty -Path "HKCU:\\Software\\ScriptBrasil" -Name "Versao"

# Remover uma chave inteira (e tudo dentro dela)
Remove-Item -Path "HKCU:\\Software\\ScriptBrasil" -Recurse -Force`}
      />

      <h2>Casos de Uso Comuns</h2>
      <p>
        Muitas configurações de interface e sistema que não estão disponíveis em menus simples podem ser alteradas via registro.
      </p>

      <CodeBlock
        title="Exemplos práticos"
        code={`# Desabilitar o Bing no Menu Iniciar do Windows 10/11
$path = "HKCU:\\Software\\Policies\\Microsoft\\Windows\\Explorer"
if (!(Test-Path $path)) { New-Item $path -Force }
Set-ItemProperty -Path $path -Name "DisableSearchBoxSuggestions" -Value 1

# Alterar o Owner (Dono) registrado do Windows
Set-ItemProperty -Path "HKLM:\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion" -Name "RegisteredOwner" -Value "Seu Nome"`}
      />

      <h2>Tipos de Dados do Registro</h2>
      <p>
        Ao criar propriedades, é importante definir o <code>-PropertyType</code> correto:
      </p>
      <ul>
        <li><strong>String:</strong> Texto normal.</li>
        <li><strong>DWord:</strong> Número inteiro de 32 bits (comum para flags 0/1).</li>
        <li><strong>QWord:</strong> Número inteiro de 64 bits.</li>
        <li><strong>Binary:</strong> Dados em formato hexadecimal.</li>
        <li><strong>MultiString:</strong> Uma lista de strings.</li>
        <li><strong>ExpandString:</strong> String que pode conter variáveis de ambiente (ex: %SystemRoot%).</li>
      </ul>

      <AlertBox type="info" title="Remote Registry">
        Você pode gerenciar o registro de máquinas remotas usando <code>Invoke-Command</code>, contanto que o serviço "Remote Registry" esteja ativo no destino.
      </AlertBox>
    </PageContainer>
  );
}
