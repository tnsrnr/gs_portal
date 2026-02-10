# Git UTF-8 설정 (한글 커밋 메시지 깨짐 방지)
# 한 번만 실행하면 됩니다. (전역 설정)

Write-Host "Git UTF-8 설정 적용 중..." -ForegroundColor Cyan

git config --global i18n.commitEncoding utf-8
git config --global i18n.logOutputEncoding utf-8
git config --global core.quotepath false

Write-Host "완료. Git이 UTF-8로 커밋/로그를 사용합니다." -ForegroundColor Green
Write-Host "PowerShell에서 한글 커밋 시 터미널 코드페이지를 UTF-8로 맞추려면:" -ForegroundColor Yellow
Write-Host "  chcp 65001" -ForegroundColor Gray
Write-Host "또는 한글 커밋 시 scripts/commit-utf8.ps1 을 사용하세요." -ForegroundColor Yellow
