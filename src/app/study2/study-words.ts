import { strategyWords, type StrategyWord } from './strategy-words';

const projectWords: StrategyWord[] = [
  { word: 'Git', reading: '깃', meaning: '분산 버전관리 도구', count: 8, examples: ['Git'] },
  { word: 'Project', reading: '프로젝트', meaning: '한시적으로 하는 일', count: 6, examples: ['PMO (Project Management Office)'] },
  { word: 'Creep', reading: '크리프', meaning: '범위가 새어 나감', count: 5, examples: ['Scope creep'] },
  { word: 'Method', reading: '메서드', meaning: '방법', count: 5, examples: ['CPM (Critical Path Method)', 'CCM (Critical Chain Method)'] },
  { word: 'Scope', reading: '스코프', meaning: '범위', count: 5, examples: ['Scope creep'] },
  { word: 'Commit', reading: '커밋', meaning: '변경을 확정 기록', count: 4, examples: ['commit'] },
  { word: 'Pull', reading: '풀', meaning: '원격 변경을 가져옴', count: 4, examples: ['pull'] },
  { word: 'Push', reading: '푸시', meaning: '원격으로 올림', count: 4, examples: ['push'] },
  { word: 'Breakdown', reading: '브레이크다운', meaning: '잘게 나눔', count: 3, examples: ['WBS (Work Breakdown Structure)'] },
  { word: 'Earned', reading: '어드', meaning: '벌어 둔 성과', count: 3, examples: ['EVM (Earned Value Management)'] },
  { word: 'GitHub', reading: '깃허브', meaning: '깃 저장 서비스', count: 3, examples: ['GitHub'] },
  { word: 'Office', reading: '오피스', meaning: '담당 조직', count: 3, examples: ['PMO (Project Management Office)'] },
  { word: 'Checkout', reading: '체크아웃', meaning: '작업본을 받음', count: 2, examples: ['checkout'] },
  { word: 'ClearCase', reading: '클리어케이스', meaning: '중앙 버전관리 도구', count: 2, examples: ['ClearCase'] },
  { word: 'Clone', reading: '클론', meaning: '저장소를 복제', count: 2, examples: ['clone'] },
  { word: 'Fetch', reading: '페치', meaning: '원격 이력을 가져옴', count: 2, examples: ['fetch'] },
  { word: 'Path', reading: '패스', meaning: '경로', count: 2, examples: ['CPM (Critical Path Method)'] },
  { word: 'Expeditor', reading: '엑스피디터', meaning: '진행을 재촉하는 역할', count: 1, examples: ['expeditor'] },
  { word: 'Jure', reading: '유레', meaning: '법으로 정한', count: 1, examples: ['de jure'] },
];

const softwareWords: StrategyWord[] = [
  { word: 'Software', reading: '소프트웨어', meaning: '프로그램으로 된 제품', count: 5, examples: ['SDLC (Software Development Life Cycle)'] },
  { word: 'Cycle', reading: '사이클', meaning: '주기', count: 2, examples: ['SDLC (Software Development Life Cycle)'] },
  { word: 'Development', reading: '디벨롭먼트', meaning: '개발', count: 2, examples: ['SDLC (Software Development Life Cycle)'] },
  { word: 'Given', reading: '기븐', meaning: '주어진 조건', count: 2, examples: ['Given-When-Then'] },
  { word: 'Interface', reading: '인터페이스', meaning: '인터페이스', count: 2, examples: ['SOLID (Interface Segregation)'] },
  { word: 'Life', reading: '라이프', meaning: '수명', count: 2, examples: ['SDLC (Software Development Life Cycle)'] },
  { word: 'Closed', reading: '클로즈드', meaning: '수정에는 닫힌', count: 1, examples: ['SOLID (Open-Closed)'] },
  { word: 'Dependency', reading: '디펜던시', meaning: '의존', count: 1, examples: ['SOLID (Dependency Inversion)'] },
  { word: 'Extends', reading: '익스텐즈', meaning: '확장한다', count: 1, examples: ['extends'] },
  { word: 'Inversion', reading: '인버전', meaning: '뒤집음', count: 1, examples: ['SOLID (Dependency Inversion)'] },
  { word: 'Language', reading: '랭귀지', meaning: '언어', count: 1, examples: ['UML (Unified Modeling Language)'] },
  { word: 'Liskov', reading: '리스코프', meaning: '치환 원칙의 이름', count: 1, examples: ['SOLID (Liskov Substitution)'] },
  { word: 'Modeling', reading: '모델링', meaning: '모형화', count: 1, examples: ['UML (Unified Modeling Language)'] },
  { word: 'Open', reading: '오픈', meaning: '확장에는 열린', count: 1, examples: ['SOLID (Open-Closed)'] },
  { word: 'Private', reading: '프라이빗', meaning: '비공개', count: 1, examples: ['private'] },
  { word: 'Public', reading: '퍼블릭', meaning: '공개', count: 1, examples: ['public'] },
  { word: 'Segregation', reading: '세그리게이션', meaning: '분리', count: 1, examples: ['SOLID (Interface Segregation)'] },
  { word: 'Single', reading: '싱글', meaning: '하나', count: 1, examples: ['SOLID (Single Responsibility)'] },
  { word: 'Substitution', reading: '서브스티튜션', meaning: '치환', count: 1, examples: ['SOLID (Liskov Substitution)'] },
  { word: 'Unified', reading: '유니파이드', meaning: '통일된', count: 1, examples: ['UML (Unified Modeling Language)'] },
];

const serviceWords: StrategyWord[] = [
  { word: 'Elasticsearch', reading: '엘라스틱서치', meaning: '검색 엔진', count: 2, examples: ['ELK (Elasticsearch)'] },
  { word: 'Kibana', reading: '키바나', meaning: '로그 시각화', count: 2, examples: ['ELK (Kibana)'] },
  { word: 'Logstash', reading: '로그스태시', meaning: '로그 수집', count: 2, examples: ['ELK (Logstash)'] },
];

const networkWords: StrategyWord[] = [
  { word: 'Protocol', reading: '프로토콜', meaning: '통신 규칙', count: 2, examples: ['TCP (Transmission Control Protocol)'] },
  { word: 'Transmission', reading: '트랜스미션', meaning: '전송', count: 2, examples: ['TCP (Transmission Control Protocol)'] },
  { word: 'Association', reading: '어소시에이션', meaning: '무선랜 연계', count: 1, examples: ['association'] },
];

const securityWords: StrategyWord[] = [
  { word: 'Design', reading: '디자인', meaning: '설계', count: 2, examples: ['Privacy by Design'] },
  { word: 'Privacy', reading: '프라이버시', meaning: '사생활', count: 2, examples: ['Privacy by Design'] },
];

const analysisWords: StrategyWord[] = [
  { word: 'NoSQL', reading: '노에스큐엘', meaning: '관계형 테이블을 쓰지 않는 저장', count: 9, examples: ['NoSQL'] },
  { word: 'Read', reading: '리드', meaning: '읽기', count: 6, examples: ['Read Uncommitted', 'Read Committed', 'Repeatable Read'] },
  { word: 'NewSQL', reading: '뉴에스큐엘', meaning: '확장과 일관성을 같이 노리는 SQL', count: 3, examples: ['NewSQL'] },
  { word: 'Apriori', reading: '아프리오리', meaning: '자주 같이 사는 항목을 찾는 방법', count: 2, examples: ['Apriori'] },
  { word: 'Cassandra', reading: '카산드라', meaning: '넓은 열 저장소', count: 2, examples: ['Cassandra'] },
  { word: 'Committed', reading: '커미티드', meaning: '확정된 값만', count: 2, examples: ['Read Committed'] },
  { word: 'HBase', reading: '에이치베이스', meaning: '하둡 위의 넓은 열 저장소', count: 2, examples: ['HBase'] },
  { word: 'MongoDB', reading: '몽고디비', meaning: '문서 저장소', count: 2, examples: ['MongoDB'] },
  { word: 'Redis', reading: '레디스', meaning: '메모리 키-값 저장소', count: 2, examples: ['Redis'] },
  { word: 'Repeatable', reading: '리피터블', meaning: '같은 읽기가 반복되는', count: 2, examples: ['Repeatable Read'] },
  { word: 'Serializable', reading: '시리얼라이저블', meaning: '하나씩 차례로 실행된 것과 같음', count: 2, examples: ['Serializable'] },
  { word: 'Uncommitted', reading: '언커미티드', meaning: '아직 확정 안 된', count: 2, examples: ['Read Uncommitted'] },
];

const aiWords: StrategyWord[] = [
  { word: 'ReLU', reading: '렐루', meaning: '양수만 통과시키는 활성화', count: 5, examples: ['ReLU'] },
  { word: 'sLLM', reading: '에스엘엘엠', meaning: '작아진 언어모델', count: 5, examples: ['sLLM'] },
  { word: 'MLOps', reading: '엠엘옵스', meaning: '모델의 학습부터 감시까지', count: 4, examples: ['MLOps'] },
  { word: 'MoE', reading: '모에', meaning: '토큰마다 전문가 일부만 깨움', count: 4, examples: ['MoE'] },
  { word: 'LLMOps', reading: '엘엘엠옵스', meaning: '언어모델 운영', count: 2, examples: ['LLMOps'] },
];

const caWords: StrategyWord[] = [
  { word: 'Link', reading: '링크', meaning: '연결', count: 6, examples: ['CXL (Compute Express Link)'] },
  { word: 'Write', reading: '라이트', meaning: '쓰기', count: 6, examples: ['Write Through', 'Write Back'] },
  { word: 'Back', reading: '백', meaning: '나중에 반영', count: 3, examples: ['Write Back'] },
  { word: 'Through', reading: '스루', meaning: '즉시 반영', count: 3, examples: ['Write Through'] },
  { word: 'Cache', reading: '캐시', meaning: '캐시', count: 2, examples: ['CXL.cache'] },
  { word: 'Compute', reading: '컴퓨트', meaning: '계산', count: 2, examples: ['CXL (Compute Express Link)'] },
  { word: 'Exclusive', reading: '익스클루시브', meaning: '이 캐시만 가진', count: 2, examples: ['Exclusive'] },
  { word: 'Express', reading: '익스프레스', meaning: '고속 연결', count: 2, examples: ['CXL (Compute Express Link)'] },
  { word: 'Invalid', reading: '인밸리드', meaning: '무효', count: 2, examples: ['Invalid'] },
  { word: 'Memory', reading: '메모리', meaning: '기억장치', count: 2, examples: ['CXL.memory'] },
  { word: 'Modified', reading: '모디파이드', meaning: '고쳐져 아직 안 내려간', count: 2, examples: ['Modified'] },
  { word: 'Refresh', reading: '리프레시', meaning: '전하를 다시 채움', count: 1, examples: ['refresh'] },
];

const osWords: StrategyWord[] = [
  { word: 'Wait', reading: '웨이트', meaning: '기다림', count: 10, examples: ['Wait-die', 'Wound-wait'] },
  { word: 'Die', reading: '다이', meaning: '젊은 트랜잭션이 죽음', count: 4, examples: ['Wait-die'] },
  { word: 'Wound', reading: '운드', meaning: '나이 든 쪽이 젊은 쪽을 밀어냄', count: 4, examples: ['Wound-wait'] },
  { word: 'Inode', reading: '아이노드', meaning: '파일의 메타정보', count: 3, examples: ['inode'] },
  { word: 'Step', reading: '스텝', meaning: '단계', count: 3, examples: ['N-step SCAN'] },
  { word: 'Init', reading: '이닛', meaning: '처음 뜨는 프로세스', count: 2, examples: ['init'] },
  { word: 'Signal', reading: '시그널', meaning: '자원을 풀어 줌', count: 2, examples: ['V(signal)'] },
  { word: 'Umask', reading: '유마스크', meaning: '기본 권한에서 빼는 마스크', count: 2, examples: ['umask'] },
  { word: 'Central', reading: '센트럴', meaning: '중앙의', count: 1, examples: ['CPU (Central Processing Unit)'] },
  { word: 'Unit', reading: '유닛', meaning: '장치', count: 1, examples: ['CPU (Central Processing Unit)'] },
];

const dsWords: StrategyWord[] = [
  { word: 'Top', reading: '탑', meaning: '맨 위', count: 11, examples: ['Top'] },
  { word: 'Pop', reading: '팝', meaning: '맨 위를 꺼냄', count: 5, examples: ['pop'] },
  { word: 'Overflow', reading: '오버플로', meaning: '가득 차서 더 못 넣음', count: 4, examples: ['Overflow'] },
  { word: 'Underflow', reading: '언더플로', meaning: '비어서 꺼낼 것이 없음', count: 4, examples: ['Underflow'] },
  { word: 'Dequeue', reading: '디큐', meaning: '큐에서 꺼냄', count: 2, examples: ['dequeue'] },
  { word: 'Enqueue', reading: '인큐', meaning: '큐에 넣음', count: 2, examples: ['enqueue'] },
  { word: 'isEmpty', reading: '이즈엠프티', meaning: '비었는지', count: 2, examples: ['isEmpty'] },
  { word: 'isFull', reading: '이즈풀', meaning: '가득 찼는지', count: 2, examples: ['isFull'] },
  { word: 'Adelson', reading: '아델슨', meaning: 'AVL을 제안한 사람', count: 1, examples: ['AVL (Adelson-Velsky and Landis)'] },
  { word: 'Landis', reading: '랜디스', meaning: 'AVL을 제안한 사람', count: 1, examples: ['AVL (Adelson-Velsky and Landis)'] },
  { word: 'Velsky', reading: '벨스키', meaning: 'AVL을 제안한 사람', count: 1, examples: ['AVL (Adelson-Velsky and Landis)'] },
];

export const studyWords: Record<string, StrategyWord[]> = {
  strategy: strategyWords,
  project: projectWords,
  software: softwareWords,
  'digital-service': serviceWords,
  'digital-network': networkWords,
  'digital-security': securityWords,
  'data-analysis': analysisWords,
  ai: aiWords,
  'ca-system': caWords,
  os: osWords,
  'data-structure': dsWords,
};

const englishWordIndex = new Map<string, StrategyWord>();
for (const list of Object.values(studyWords)) {
  for (const item of list) {
    const key = item.word.toLowerCase();
    if (!englishWordIndex.has(key)) englishWordIndex.set(key, item);
  }
}

/** 키워드 안의 영어 단어를 앞 목차부터 찾는다. 같은 단어는 한 번. */
export function lookupEnglishWords(keyword: string): StrategyWord[] {
  const exact = englishWordIndex.get(keyword.trim().toLowerCase());
  if (exact) return [exact];
  const found: StrategyWord[] = [];
  const seen = new Set<string>();
  for (const match of keyword.matchAll(/[A-Za-z][A-Za-z0-9]*/g)) {
    const hit = englishWordIndex.get(match[0].toLowerCase());
    if (!hit || seen.has(hit.word.toLowerCase())) continue;
    seen.add(hit.word.toLowerCase());
    found.push(hit);
  }
  return found;
}
