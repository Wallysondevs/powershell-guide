import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Modulos() {
  return (
    <PageContainer
      title="Módulos e Perfil"
      subtitle="Organize seu código em pacotes reutilizáveis e personalize seu ambiente de trabalho."
      difficulty="intermediario"
      timeToRead="25 min"
    >
      <p>
        Módulos são a unidade básica de compartilhamento de código no PowerShell. Eles permitem agrupar funções, variáveis, aliases e fluxos de trabalho em um único pacote que pode ser facilmente distribuído e importado.
      </p>

      <h2>Gerenciando Módulos</h2>
      <p>
        O PowerShell vem com centenas de módulos pré-instalados, mas você pode adicionar muito mais através da Galeria do PowerShell (PSGallery).
      </p>

      <CodeBlock
        title="Comandos essenciais de módulos"
        code={`# Listar todos os módulos carregados na sessão atual
Get-Module

# Listar todos os módulos instalados no sistema
Get-Module -ListAvailable

# Importar um módulo manualmente
Import-Module -Name ActiveDirectory -Force

# Remover um módulo da sessão (não deleta do disco)
Remove-Module -Name NetTCPIP

# Procurar novos módulos na internet
Find-Module -Name "*SQL*"

# Instalar um módulo da Galeria
Install-Module -Name Az -Scope CurrentUser -AllowClobber`}
      />

      <AlertBox type="info" title="PSModulePath">
        O PowerShell procura módulos automaticamente nos caminhos definidos na variável de ambiente <code>$env:PSModulePath</code>. Geralmente inclui pastas em Documentos (usuário) e System32 (sistema).
      </AlertBox>

      <h2>Criando seu Próprio Módulo</h2>
      <p>
        Um módulo básico consiste em um arquivo <code>.psm1</code> contendo suas funções. Para módulos profissionais, usamos também um manifesto <code>.psd1</code>.
      </p>

      <CodeBlock
        title="Exemplo de módulo simples (MeuModulo.psm1)"
        code={`function Get-Saudacao {
    param([string]$Nome = "Usuário")
    return "Olá, $Nome! Bem-vindo ao seu módulo customizado."
}

function Get-DataFormatada {
    return Get-Date -Format "dd/MM/yyyy HH:mm:ss"
}

# Exporta apenas o que queremos tornar público
Export-ModuleMember -Function Get-Saudacao, Get-DataFormatada`}
      />

      <h2>O Perfil do PowerShell ($PROFILE)</h2>
      <p>
        O <code>$PROFILE</code> é um script que o PowerShell executa automaticamente toda vez que você abre o terminal. É o lugar perfeito para definir seus aliases favoritos, funções utilitárias e mudar o visual do console.
      </p>

      <CodeBlock
        title="Configurando seu perfil"
        code={`# Verifica se o arquivo de perfil existe, se não, cria um
if (!(Test-Path -Path $PROFILE)) {
    New-Item -ItemType File -Path $PROFILE -Force
}

# Abre o perfil no Bloco de Notas (ou VSCode)
notepad $PROFILE

# Exemplos de conteúdo para adicionar no $PROFILE:
# 1. Aliases personalizados
Set-Alias -Name "g" -Value "git"
Set-Alias -Name "ll" -Value "ls -l" # Se você gosta de comandos Linux

# 2. Funções rápidas
function c-clear { Clear-Host }

# 3. Customização do prompt
function prompt {
    $p = Split-Path -Leaf (Get-Location)
    "PS [$p]> "
}

# 4. Importar módulos de utilidade
Import-Module PSReadLine`}
      />

      <AlertBox type="warning" title="Diferentes Perfis">
        Existem 4 tipos de perfil baseados no usuário e no host (console vs ISE vs VSCode). A variável <code>$PROFILE</code> aponta para o perfil do "Usuário Atual, Host Atual" por padrão.
      </AlertBox>

      <h2>PowerShell Gallery e Repositórios</h2>
      <p>
        A PowerShell Gallery é o repositório central de módulos da comunidade. Você também pode configurar repositórios internos em sua empresa.
      </p>

      <CodeBlock
        title="Gerenciando repositórios"
        code={`# Listar repositórios registrados
Get-PSRepository

# Registrar um repositório de rede local
Register-PSRepository -Name "InternoEmpresa" -SourceLocation "\\\\Server\\PSRepo" -InstallationPolicy Trusted

# Atualizar um módulo instalado
Update-Module -Name Az`}
      />

      <h2>Autocarregamento (Autoloading)</h2>
      <p>
        Desde o PowerShell 3.0, você não precisa mais usar <code>Import-Module</code> explicitamente para a maioria dos módulos. Se você chamar um comando que pertence a um módulo no seu <code>PSModulePath</code>, o PowerShell o carrega automaticamente.
      </p>

      <CodeBlock
        title="Verificando o autocarregamento"
        code={`# Se você rodar Get-ADUser sem carregar o módulo, 
# o PS procura e carrega o ActiveDirectory sozinho.
Get-Command Get-ADUser`}
      />

      <AlertBox type="success" title="Dica: Organização">
        Ao criar módulos, sempre use o padrão Nome-Verbo para suas funções e inclua ajuda baseada em comentários. Isso torna seu módulo "nativo" aos olhos de outros desenvolvedores.
      </AlertBox>
    </PageContainer>
  );
}
