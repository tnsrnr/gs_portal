# 프로젝트 아키텍처

## 개요
PostgreSQL 데이터베이스와 연동하여 토픽 데이터를 저장하고 조회하는 Next.js 애플리케이션입니다.

## 아키텍처 구조

```
src/
├── lib/
│   └── db.ts                    # PostgreSQL 연결 설정
├── app/
│   ├── actions/
│   │   └── topics.ts            # 서버 액션 (저장, 수정, 삭제)
│   ├── api/
│   │   └── topics/
│   │       └── route.ts         # API 라우트 (조회)
│   ├── input/
│   │   └── page.tsx             # 입력 화면 (서버 액션 호출)
│   └── view/
│       └── page.tsx             # 조회 화면 (API 호출)
```

## 데이터 흐름

### 1. 저장 (입력 화면)
```
사용자 입력 → handleAddItem() → saveTopic() 서버 액션 → PostgreSQL DB
                                    ↓
                            클라이언트 상태 업데이트 (Zustand)
```

### 2. 조회 (조회 화면)
```
페이지 로드 → fetchTopics() → GET /api/topics → PostgreSQL DB
                                    ↓
                            화면에 데이터 표시
```

### 3. 수정
```
사용자 수정 → handleSaveEdit() → updateTopic() 서버 액션 → PostgreSQL DB
                                    ↓
                            클라이언트 상태 업데이트
```

### 4. 삭제
```
사용자 삭제 → deleteTopic() 서버 액션 → PostgreSQL DB
                                    ↓
                            클라이언트 상태 업데이트
```

## 주요 컴포넌트

### 1. DB 연결 (`src/lib/db.ts`)
- PostgreSQL 연결 풀 관리
- 환경 변수에서 DB 설정 읽기

### 2. 서버 액션 (`src/app/actions/topics.ts`)
- `saveTopic`: 단일 토픽 저장
- `saveTopics`: 여러 토픽 일괄 저장
- `updateTopic`: 토픽 수정
- `deleteTopic`: 토픽 삭제

### 3. API 라우트 (`src/app/api/topics/route.ts`)
- `GET /api/topics`: 토픽 목록 조회
- 쿼리 파라미터 지원 (category_l1, importance, limit, offset)

### 4. 입력 화면 (`src/app/input/page.tsx`)
- 폼 입력 및 유효성 검사
- 서버 액션을 통한 DB 저장
- 클라이언트 상태 관리 (Zustand)
- DB ID와 클라이언트 ID 매핑 관리

### 5. 조회 화면 (`src/app/view/page.tsx`)
- API 호출을 통한 데이터 조회
- 로딩 및 에러 상태 처리
- 테이블 형태로 데이터 표시

## 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```env
POSTGRES_HOST=1.201.18.12
POSTGRES_PORT=5432
POSTGRES_DATABASE=appdb
POSTGRES_USER=appuser
POSTGRES_PASSWORD=!q1324511
```

## 데이터베이스 스키마

```sql
CREATE TABLE management_topics (
    id SERIAL PRIMARY KEY,
    importance VARCHAR(20) NOT NULL,
    category_l1 VARCHAR(50) NOT NULL,
    category_l2 VARCHAR(50),
    category_l3 VARCHAR(50),
    topic VARCHAR(100) NOT NULL,
    parent_topic VARCHAR(100),
    child_topic VARCHAR(100),
    definition TEXT,
    cheatsheet TEXT,
    additional_info TEXT
);
```

## 기술 스택

- **Next.js 14**: React 프레임워크 (App Router)
- **PostgreSQL**: 데이터베이스
- **pg**: PostgreSQL 클라이언트
- **Zustand**: 클라이언트 상태 관리
- **TypeScript**: 타입 안정성

## 주요 기능

1. **서버 액션을 통한 데이터 저장**: 클라이언트에서 직접 서버 액션 호출
2. **API 라우트를 통한 데이터 조회**: RESTful API 엔드포인트 제공
3. **로딩 및 에러 처리**: 사용자 경험 개선
4. **클라이언트 상태 동기화**: DB 저장 후 클라이언트 상태 업데이트

