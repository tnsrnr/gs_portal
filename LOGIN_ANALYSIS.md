# Next.js + NextAuth로 Spring Security 백엔드 연동 가이드

---

## 1. 아키텍처 개요

```
[사용자 브라우저]
    ↓
[Next.js (NextAuth)]
    ↓
[API Route (커스텀 로그인)]
    ↓
[Spring Security 백엔드]
```

- **NextAuth**는 인증 상태 관리, 세션 저장, 로그인/로그아웃 라우팅만 담당
- **실제 인증/세션/쿠키/CSRF 동기화는 커스텀 코드로 직접 처리**

---

## 2. CSRF 토큰 & JSESSIONID 생명주기 도식화

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                           로그인 페이지 접속                                      │
│  GET /login.jsp → Spring 서버에서 초기 쿠키/CSRF 토큰 획득                        │
│  📦 cookies: [JSESSIONID=xxx, X-CSRF-TOKEN=yyy]                                 │
└─────────────────────────────────────────────────────────────────────────────────────┘
                                        ↓
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                           계정 인증 (로그인 시도)                                  │
│  POST /lv1/htns_sec → Spring Security 로그인 엔드포인트                           │
│  📦 Headers: {                                                                     │
│     'Content-Type': 'application/x-www-form-urlencoded',                         │
│     'Cookie': 'JSESSIONID=xxx'                                                   │
│  }                                                                                │
│  📦 Body: {                                                                       │
│     '_csrf': 'yyy',                                                              │
│     'USER_ID': 'user123',                                                        │
│     'PW': 'password123'                                                          │
│  }                                                                                │
└─────────────────────────────────────────────────────────────────────────────────────┘
                                        ↓
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                        로그인 성공 (HTTP 302 Redirect)                            │
│  📦 Response Headers: {                                                           │
│     'Set-Cookie': 'JSESSIONID=new_session_id; Path=/; HttpOnly'                  │
│  }                                                                                │
│  📦 새로운 JSESSIONID 발급, 기존 CSRF 토큰 무효화                                 │
└─────────────────────────────────────────────────────────────────────────────────────┘
                                        ↓
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                        새로운 CSRF 토큰 획득                                       │
│  GET /login.jsp → 새로운 JSESSIONID로 새로운 CSRF 토큰 요청                       │
│  📦 Headers: { 'Cookie': 'JSESSIONID=new_session_id' }                          │
│  📦 Response: 새로운 X-CSRF-TOKEN 발급                                           │
└─────────────────────────────────────────────────────────────────────────────────────┘
                                        ↓
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                        세션 정보 조회 (권한/메뉴 등)                               │
│  POST /api/G1E000000SVC/getInitNewPortal → 사용자 세션 정보 요청                 │
│  📦 Headers: {                                                                     │
│     'X-CSRF-TOKEN': 'new_csrf_token',                                            │
│     'Cookie': 'JSESSIONID=new_session_id'                                        │
│  }                                                                                │
│  📦 Response: {                                                                   │
│     USER_ID, USER_NAME_LOC, EMAIL, EMP_ID, H_MENU, roles...                     │
│  }                                                                                │
└─────────────────────────────────────────────────────────────────────────────────────┘
                                        ↓
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                        NextAuth 세션에 저장                                       │
│  📦 NextAuth Session: {                                                           │
│     cookies: 'JSESSIONID=new_session_id',                                        │
│     csrfToken: 'new_csrf_token',                                                 │
│     empID: 'EMP001',                                                             │
│     hMenu: [...],                                                                │
│     roles: ['HRADM', 'HRSAV']                                                    │
│  }                                                                                │
└─────────────────────────────────────────────────────────────────────────────────────┘
                                        ↓
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                        브라우저에 JSESSIONID 설정                                 │
│  POST /api/auth/set-j-session-id → 브라우저 쿠키에 JSESSIONID 저장               │
│  📦 Headers: { 'Set-Cookie': 'JSESSIONID=new_session_id; Path=/; HttpOnly' }    │
└─────────────────────────────────────────────────────────────────────────────────────┘
                                        ↓
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                        일반 API 요청 (인증된 요청)                                │
│  모든 API 호출 시 NextAuth 세션에서 인증정보 추출하여 헤더에 포함                  │
│  📦 Headers: {                                                                     │
│     'X-CSRF-TOKEN': 'new_csrf_token',                                            │
│     'Cookie': 'JSESSIONID=new_session_id',                                       │
│     'ajax': 'true',                                                              │
│     'Content-Type': 'application/json'                                           │
│  }                                                                                │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

### 🔑 핵심 포인트

1. **JSESSIONID와 CSRF 토큰은 항상 1:1로 세트로 관리**
2. **로그인 성공 시 새로운 JSESSIONID 발급 → 새로운 CSRF 토큰 요청**
3. **모든 API 요청 시 NextAuth 세션에서 인증정보를 헤더에 직접 포함**
4. **브라우저 쿠키와 NextAuth 세션에 동일한 JSESSIONID 저장**

---

## 3. 핵심 구조 및 폴더

```
src/
├── pages/
│   ├── login.tsx                  # 로그인 페이지
│   └── api/auth/
│       ├── [...nextauth].ts       # NextAuth 설정 (CredentialsProvider)
│       └── login.ts               # Spring 서버와 통신하는 커스텀 API Route
├── apis/
│   └── login.ts                   # Spring 서버와의 실제 통신 함수
├── lib/
│   └── axiosInstance.ts           # 인증정보 포함 axios 인스턴스
├── utils/
│   └── http.ts, encryption/       # 쿠키/CSRF 파싱, 암호화 등
```

---

## 4. NextAuth 설정 (CredentialsProvider 커스텀)

```typescript
// src/pages/api/auth/[...nextauth].ts
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';

export default NextAuth({
  providers: [
    CredentialsProvider({
      id: 'login',
      name: 'Login',
      credentials: {
        id: { label: 'Id', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        // 1. 커스텀 API Route로 로그인 요청 (Spring 서버와 연동)
        const user = await axios.post(`${process.env.NEXTAUTH_URL}/api/auth/login`, {
          id: credentials?.id,
          password: credentials?.password
        });
        // 2. Spring 서버에서 받은 세션/쿠키/CSRF 등 인증정보를 그대로 반환
        return user.data;
      }
    })
  ],
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        token.cookies = user.cookies; // JSESSIONID 등
        token.csrfToken = user.csrfToken;
        token.empID = user.empID;
        token.hMenu = user.hMenu;
        token.roles = user.roles;
      }
      return token;
    },
    session: ({ session, token }) => {
      session.cookies = token.cookies;
      session.csrfToken = token.csrfToken;
      session.empID = token.empID;
      session.hMenu = token.hMenu;
      session.roles = token.roles;
      return session;
    }
  },
  pages: {
    signIn: '/login'
  }
});
```

---

## 5. 커스텀 로그인 API Route (Spring 서버 연동)

```typescript
// src/pages/api/auth/login.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getLoginJspApi, postHtnsSecApi } from '../../../apis/login';
import { requestLv1Api } from '../../../lib/axiosInstance';
import { getCSRFTokenInCookie, getSetCookie } from '../../../utils/http';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id, password } = req.body;
    // 1. Spring 서버에서 쿠키/CSRF 토큰 획득
    let cookies: any = getSetCookie(await getLoginJspApi());
    let csrfToken = getCSRFTokenInCookie(cookies);
    // 2. 로그인 시도
    const htnsSecRes = await postHtnsSecApi({
      cookies: cookies,
      csrfToken: csrfToken,
      userId: id,
      password: password
    });
    if (htnsSecRes.status !== 302) {
      // 실패 처리 (정규식 등으로 메시지 추출)
      return res.status(400).json({ message: 'login-failed' });
    }
    cookies = htnsSecRes.headers.get('set-cookie');
    csrfToken = getCSRFTokenInCookie(
      getSetCookie(
        await getLoginJspApi({ headers: { Cookie: cookies } })
      )
    );
    // 3. 세션 정보 조회
    const getInitRes = await requestLv1Api({
      method: 'post',
      url: '/api/G1E000000SVC/getInitNewPortal',
      data: {},
      headers: {
        'X-CSRF-TOKEN': csrfToken,
        Cookie: cookies
      }
    });
    const session = getInitRes.data.data;
    // 4. 결과 반환 (세션/쿠키/권한 등)
    return res.status(200).json({
      cookies,
      csrfToken,
      id: session.USER_ID,
      name: session.USER_NAME_LOC,
      email: session.EMAIL,
      empID: session.EMP_ID,
      hMenu: session.H_MENU,
      roles: Array.isArray(session.H_MENU) ? session.H_MENU.map((menu: any) => menu.CODE).filter(Boolean) : []
    });
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
  }
}
```

---

## 6. Spring 서버와의 실제 통신 함수

```typescript
// src/apis/login.ts
import qs from 'qs';
import { requestLv1Api } from '../lib/axiosInstance';

export const getLoginJspApi = (data: any = {}) =>
  requestLv1Api({
    method: 'get',
    url: '/login.jsp',
    headers: data.headers
  });

export const postHtnsSecApi = (data: any) =>
  fetch(`${process.env.CLIENT_URL}lv1/htns_sec`, {
    method: 'POST',
    redirect: 'manual',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Cookie: data.cookies.toString()
    },
    body: qs.stringify({
      _spring_security_remember_me: true,
      _csrf: data.csrfToken,
      USER_ID: data.userId,
      PW: data.password
    })
  });
```

---

## 7. 인증정보 포함 API 클라이언트

```typescript
// src/lib/axiosInstance.ts
import axios from 'axios';

export const requestLv1Api = (config: any) =>
  axios({
    ...config,
    baseURL: process.env.CLIENT_URL,
    withCredentials: true
  });

export const requestLv1ApiWithAuth = (session: any) => (config: any) =>
  axios({
    ...config,
    baseURL: process.env.CLIENT_URL,
    headers: {
      ...config.headers,
      'X-CSRF-TOKEN': session?.csrfToken,
      'Cookie': session?.cookies
    }
  });
```

---

## 8. 로그인 폼 예시 (NextAuth + CredentialsProvider)

```typescript
// src/pages/login.tsx
import { signIn } from 'next-auth/react';

const handleLogin = async (id: string, password: string) => {
  const res = await signIn('login', {
    redirect: false,
    id,
    password
  });
  if (res?.error) {
    // 에러 처리
  } else {
    // 로그인 성공 후 리다이렉트
  }
};
```

---

## 9. 인증정보 활용 예시 (API 호출)

```typescript
// 인증정보를 세션에서 꺼내서 API 호출 시 헤더에 직접 포함
import { useSession } from 'next-auth/react';
import axios from 'axios';

const { data: session } = useSession();

const apiCall = async () => {
  const res = await axios.get('/api/some-endpoint', {
    headers: {
      'X-CSRF-TOKEN': session?.csrfToken,
      'Cookie': session?.cookies
    }
  });
  // ...
};
```

---

## 10. 주의점 및 현업 팁

- **JSESSIONID/CSRF 토큰은 반드시 1:1로 세트로 관리/전달**
- **NextAuth의 JWT/OAuth 등 자체 세션 기능은 사용하지 않음**
- **콜백에서 Spring 서버의 인증정보를 세션에 직접 저장/활용**
- **로그인/로그아웃 라우팅, SSR/CSR 인증 상태 접근만 NextAuth 활용**
- **실제 인증 흐름, 세션/쿠키/CSRF 동기화는 100% 커스텀**
- **Spring 서버의 인증 정책(쿠키, SameSite, Secure, HttpOnly 등) 반드시 준수**
- **API 응답 구조, 에러 메시지 파싱 등은 실제 백엔드와 맞춰서 구현**

---

## 11. 결론

- NextAuth를 "껍데기"로만 활용하고, 실제 인증/세션/쿠키/CSRF 동기화는 Spring Security 정책에 100% 맞춰 커스텀으로 처리해야 함
- NextAuth의 장점(SSR/CSR 인증 접근, 라우팅, 세션 저장 등)만 활용
- 실제 인증 흐름은 반드시 Spring 서버와 1:1로 동기화
- **이 구조를 그대로 따라하면, 다른 Next.js 프로젝트에서도 NextAuth로 Spring Security 백엔드에 안전하게 연동 가능!**
