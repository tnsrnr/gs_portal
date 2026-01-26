-- 학습 세션 테이블
CREATE TABLE study_sessions (
    id SERIAL PRIMARY KEY,
    student_name VARCHAR(100) NOT NULL,      -- 학습자명
    category_l1 VARCHAR(50) NOT NULL,         -- 대분류명 (학습목록)
    study_duration INTEGER NOT NULL,          -- 총 학습 시간 (초 단위)
    study_date DATE NOT NULL,                 -- 학습일자
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 인덱스 추가 (조회 성능 향상)
CREATE INDEX idx_study_sessions_student_name ON study_sessions(student_name);
CREATE INDEX idx_study_sessions_category ON study_sessions(category_l1);
CREATE INDEX idx_study_sessions_study_date ON study_sessions(study_date);
CREATE INDEX idx_study_sessions_created_at ON study_sessions(created_at);

-- updated_at 자동 업데이트 트리거
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_study_sessions_updated_at 
    BEFORE UPDATE ON study_sessions 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
