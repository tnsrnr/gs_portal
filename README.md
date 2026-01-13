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

## 폴더 구조

```
/src
  /app             # Next.js 앱 라우터
  /components      # 리액트 컴포넌트
    /ui            # UI 컴포넌트
``` 