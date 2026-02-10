# UTF-8 파일로 커밋 메시지를 전달하여 한글 깨짐 방지
# 사용: .\scripts\commit-utf8.ps1 "한글 커밋 메시지"
# 또는: .\scripts\commit-utf8.ps1 "메시지" -Push

param(
    [Parameter(Mandatory = $true, Position = 0)]
    [string]$Message,
    [switch]$Push,
    [switch]$All
)

$ErrorActionPreference = "Stop"
$repoRoot = (Get-Item $PSScriptRoot).Parent.FullName

# 임시 파일에 UTF-8(no BOM)로 메시지 저장
$tempFile = [System.IO.Path]::GetTempFileName()
$utf8NoBom = New-Object System.Text.UTF8Encoding $false
[System.IO.File]::WriteAllText($tempFile, $Message, $utf8NoBom)

try {
    Set-Location $repoRoot
    if ($All) { git add -A }
    git commit -F $tempFile
    if ($Push) { git push }
}
finally {
    Remove-Item $tempFile -Force -ErrorAction SilentlyContinue
}
