# Rogierp Grid Test

Vercel 배포를 위한 최소한의 Next.js 프로젝트입니다.

## 기술 스택

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS

## 설치 및 실행

```bash
# 의존성 설치
npm install
# 또는
yarn

# 개발 서버 실행
npm run dev
# 또는
yarn dev
```

## 배포

이 프로젝트는 Vercel에 자동 배포됩니다. `main` 브랜치에 푸시하면 GitHub Actions를 통해 Vercel에 자동으로 배포됩니다.

## 한글 커밋 메시지 (깨짐 방지)

한글 커밋 메시지가 깨지지 않도록 하려면:

1. **한 번만 실행** (Git 전역 UTF-8 설정):
   ```powershell
   .\scripts\setup-git-utf8.ps1
   ```
2. **한글 커밋 시** (PowerShell에서):
   ```powershell
   .\scripts\commit-utf8.ps1 "한글 커밋 메시지"
   # 스테이징 후 푸시까지: .\scripts\commit-utf8.ps1 "메시지" -All -Push
   ```
   또는 터미널 코드페이지를 UTF-8로 맞춘 뒤 일반 `git commit -m "한글"` 사용:
   ```powershell
   chcp 65001
   git commit -m "한글 커밋 메시지"
   ```

## 폴더 구조

```
/src
  /app             # Next.js 앱 라우터
  /components      # 리액트 컴포넌트
    /ui            # UI 컴포넌트
``` 