// 학습 자료 데이터 타입 정의 (topics 테이블 구조 기반)
export interface StudyItem {
  topics?: string; // 토픽(key)
  topics_eng?: string; // 토픽(영문명)
  topics_loc?: string; // 토픽(한글명)
  importance: string; // 중요도 (상, 중, 하)
  category_l1: string; // 대분류
  category_l2?: string; // 중분류
  category_l3?: string; // 소분류
  topic: string; // 토픽 이름 (PK 역할)
  parent_topic?: string; // 상위 토픽
  child_topic?: string; // 하위 토픽
  definition?: string; // 토픽 정의
  cheatsheet?: string; // 암기용 요약 정보(두음)
  additional_info?: string; // 토픽 설명
  viewtable?: string; // 비교표(학습 화면 하단 표)
}

export interface TabData {
  id: string;
  name: string; // 탭 이름
  items: (StudyItem & { id: string; no: number })[]; // 클라이언트 전용 id와 no 추가
}
