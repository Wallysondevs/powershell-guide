import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function WPF() {
  return (
    <PageContainer
      title="Interfaces Gráficas com WPF/WinForms"
      subtitle="Crie GUIs nativas no Windows com Windows Forms e WPF diretamente em scripts PowerShell."
      difficulty="avançado"
      timeToRead="30 min"
    >
      <p>
        PowerShell tem acesso completo às bibliotecas .NET de interface gráfica — Windows Forms
        e WPF (Windows Presentation Foundation). Isso permite criar ferramentas administrativas
        com interface visual, diálogos de arquivo, barras de progresso e formulários completos.
      </p>

      <AlertBox type="info" title="Apenas no Windows">
        Windows Forms e WPF estão disponíveis apenas no Windows. Para interfaces multiplataforma
        com PowerShell, use Terminal UI libraries como <code>Spectre.Console</code>.
      </AlertBox>

      <h2>Windows Forms — Básico</h2>
      <CodeBlock title="Caixa de mensagem e formulário simples" code={`Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

# MessageBox simples
[System.Windows.Forms.MessageBox]::Show(
    "Operação concluída com sucesso!",
    "PowerShell GUI",
    [System.Windows.Forms.MessageBoxButtons]::OK,
    [System.Windows.Forms.MessageBoxIcon]::Information
)

# Caixa de confirmação
$resultado = [System.Windows.Forms.MessageBox]::Show(
    "Deseja continuar com a operação?",
    "Confirmar",
    [System.Windows.Forms.MessageBoxButtons]::YesNo,
    [System.Windows.Forms.MessageBoxIcon]::Question
)
if ($resultado -eq "Yes") { "Usuário confirmou!" }

# Diálogo de seleção de arquivo
$dialog = [System.Windows.Forms.OpenFileDialog]::new()
$dialog.Filter = "CSV files (*.csv)|*.csv|All files (*.*)|*.*"
$dialog.Title  = "Selecione o arquivo de dados"
if ($dialog.ShowDialog() -eq "OK") {
    $arquivo = $dialog.FileName
    Write-Host "Arquivo selecionado: $arquivo"
    Import-Csv $arquivo
}

# Diálogo de salvar arquivo
$save = [System.Windows.Forms.SaveFileDialog]::new()
$save.Filter   = "CSV files (*.csv)|*.csv"
$save.FileName = "relatorio-$(Get-Date -Format 'yyyyMMdd').csv"
if ($save.ShowDialog() -eq "OK") {
    Get-Process | Export-Csv $save.FileName -NoTypeInformation
}
`} />

      <h2>Formulário Completo com Windows Forms</h2>
      <CodeBlock title="Formulário de cadastro de servidor" code={`Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

$form = [System.Windows.Forms.Form]@{
    Text          = "Adicionar Servidor"
    Size          = [System.Drawing.Size]::new(420, 340)
    StartPosition = "CenterScreen"
    FormBorderStyle = "FixedDialog"
    MaximizeBox   = $false
}

# Função auxiliar para criar label + textbox
function Add-Campo {
    param($Form, $Label, $Y, [bool]$Password = $false)
    $lbl = [System.Windows.Forms.Label]@{ Text = $Label; Location=[Drawing.Point]::new(20,$Y); Size=[Drawing.Size]::new(100,20) }
    $txt = [System.Windows.Forms.TextBox]@{ Location=[Drawing.Point]::new(130,$Y); Size=[Drawing.Size]::new(250,20) }
    if ($Password) { $txt.PasswordChar = "*" }
    $Form.Controls.AddRange(@($lbl, $txt))
    return $txt
}

$txtNome    = Add-Campo $form "Nome:"    20
$txtIP      = Add-Campo $form "IP:"      60
$txtPorta   = Add-Campo $form "Porta:"  100
$txtSenha   = Add-Campo $form "Senha:"  140 -Password $true

# ComboBox para tipo
$lblTipo = [System.Windows.Forms.Label]@{ Text = "Tipo:"; Location=[Drawing.Point]::new(20,180); Size=[Drawing.Size]::new(100,20) }
$cmbTipo = [System.Windows.Forms.ComboBox]@{ Location=[Drawing.Point]::new(130,180); Size=[Drawing.Size]::new(250,20) }
$cmbTipo.Items.AddRange(@("Web","Database","Cache","Fila"))
$cmbTipo.SelectedIndex = 0
$form.Controls.AddRange(@($lblTipo, $cmbTipo))

# Botões
$btnOK = [System.Windows.Forms.Button]@{ Text="Adicionar"; Location=[Drawing.Point]::new(200,240); Size=[Drawing.Size]::new(80,30) }
$btnCancel = [System.Windows.Forms.Button]@{ Text="Cancelar"; Location=[Drawing.Point]::new(290,240); Size=[Drawing.Size]::new(80,30) }

$form.Controls.AddRange(@($btnOK, $btnCancel))
$form.AcceptButton = $btnOK
$form.CancelButton = $btnCancel

$resultado = $null
$btnOK.Add_Click({
    if (-not $txtNome.Text -or -not $txtIP.Text) {
        [System.Windows.Forms.MessageBox]::Show("Nome e IP são obrigatórios!", "Erro")
        return
    }
    $script:resultado = [PSCustomObject]@{
        Nome  = $txtNome.Text
        IP    = $txtIP.Text
        Porta = [int]($txtPorta.Text ?: "80")
        Tipo  = $cmbTipo.SelectedItem
    }
    $form.Close()
})
$btnCancel.Add_Click({ $form.Close() })

$form.ShowDialog() | Out-Null
if ($resultado) {
    Write-Host "Servidor adicionado: $($resultado.Nome) ($($resultado.IP))"
}
`} />

      <h2>WPF com XAML</h2>
      <CodeBlock title="Interface moderna com WPF" code={`Add-Type -AssemblyName PresentationFramework

$xaml = @'
<Window xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        Title="Monitor de Processos" Height="400" Width="600"
        WindowStartupLocation="CenterScreen">
    <Grid Margin="10">
        <Grid.RowDefinitions>
            <RowDefinition Height="Auto"/>
            <RowDefinition Height="*"/>
            <RowDefinition Height="Auto"/>
        </Grid.RowDefinitions>

        <TextBlock Grid.Row="0" Text="Processos em Execução" FontSize="16"
                   FontWeight="Bold" Margin="0,0,0,10"/>

        <DataGrid Grid.Row="1" x:Name="dgProcessos" AutoGenerateColumns="False"
                  IsReadOnly="True" AlternatingRowBackground="#F5F5F5">
            <DataGrid.Columns>
                <DataGridTextColumn Header="Nome"   Binding="{Binding Name}"       Width="200"/>
                <DataGridTextColumn Header="ID"     Binding="{Binding Id}"         Width="60"/>
                <DataGridTextColumn Header="CPU"    Binding="{Binding CPU}"        Width="80"/>
                <DataGridTextColumn Header="RAM MB" Binding="{Binding RamMB}"      Width="80"/>
            </DataGrid.Columns>
        </DataGrid>

        <Button Grid.Row="2" x:Name="btnAtualizar" Content="Atualizar"
                Margin="0,10,0,0" Padding="20,5"/>
    </Grid>
</Window>
'@

$reader = [System.Xml.XmlReader]::Create([System.IO.StringReader]::new($xaml))
$window = [System.Windows.Markup.XamlReader]::Load($reader)

$dg = $window.FindName("dgProcessos")
$btn = $window.FindName("btnAtualizar")

function Update-Grid {
    $processos = Get-Process | Sort-Object CPU -Descending | Select-Object -First 20 |
        ForEach-Object {
            [PSCustomObject]@{
                Name  = $_.ProcessName
                Id    = $_.Id
                CPU   = [math]::Round($_.CPU, 1)
                RamMB = [math]::Round($_.WorkingSet/1MB, 1)
            }
        }
    $dg.ItemsSource = $processos
}

Update-Grid
$btn.Add_Click({ Update-Grid })
$window.ShowDialog() | Out-Null
`} />

      <AlertBox type="success" title="Barra de Progresso em Scripts Longos">
        Use <code>Write-Progress</code> para barras de progresso nativas no terminal, sem precisar
        de GUI: <code>Write-Progress -Activity "Processando" -Status "Item $i de $total" -PercentComplete ($i/$total*100)</code>
      </AlertBox>
    </PageContainer>
  );
}
