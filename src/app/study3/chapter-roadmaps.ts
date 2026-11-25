export type Tone = 'amber' | 'blue' | 'green' | 'slate' | 'rose';

export type RoadBox = {
  title: string;
  tone: Tone;
  items: string[];
};

export type RoadStage = {
  step: string;
  title: string;
  items: string[];
};

export type RoadSheet = {
  title: string;
  summary: string;
  banner?: string;
  stages?: RoadStage[];
  groups?: RoadBox[];
  callout?: string;
  bar?: string[];
  barLabel?: string;
  footer?: string;
};

export type ChapterRoadmapData = {
  title: string;
  lead: string;
  sheets: RoadSheet[];
};

export const chapterRoadmaps: Record<string, ChapterRoadmapData> = {
  strategy: {
    title: '경영전략 로드맵',
    lead: '경영이 원하는 것이 IT 거버넌스와 RTE로 모이고, 아래 축이 그 실행이다.',
    sheets: [
      {
        title: '1장. 한 장으로 보는 구성',
        summary: '위는 방향, 가운데는 실시간 경영, 아래 칸은 그 방향을 시스템과 거래로 내리는 자리.',
        banner: 'BCM / 신규 비즈니스 창출 / 플랫폼 / 4차 산업혁명',
        callout: 'IT-Governance가 기업 경영을 받고, RTE가 사건을 바로 본다. 경영지원시스템은 그 아래의 레거시다. 규제는 정책에서 나와 다시 경영으로 돌아온다.',
        groups: [
          { title: '기업경영전략', tone: 'amber', items: ['BSC', 'VBM', 'SEM', 'OLAP', 'BI', 'Data Mining', 'AHP', '5Forces', 'SWOT'] },
          { title: 'IT 기획', tone: 'blue', items: ['ISP', 'ISMP', 'EA', '범정부 EA', 'ITA', 'IT ROI', 'OKR'] },
          { title: '규제·준수', tone: 'rose', items: ['IT-Compliance', 'ISO/IEC 38500', 'COBIT', 'ESG', 'ISO 42001', '규제 샌드박스'] },
          { title: 'IT 정책', tone: 'green', items: ['Untact 정책', '핀테크', 'Xtech', '지능정보화기본법', 'DR(S)', 'HA', '디지털 카르텔'] },
          { title: '아웃소싱·조달', tone: 'amber', items: ['RFI', 'RFP', 'Proposal', 'SLA', 'SLM', 'ITSM', 'ITIL 4.0', 'eSCM', 'ISO 20000'] },
          { title: '프로세스 혁신', tone: 'blue', items: ['BPM', 'BPR', 'PI', 'BAM', 'BRE', 'WorkFlow', 'PDCA'] },
          { title: '정보시스템', tone: 'green', items: ['ERP', 'Composable ERP', 'DW', 'EAI', 'ESB', 'EIP', 'CRM', 'PRM'] },
          { title: 'IT Business', tone: 'slate', items: ['e-Marketplace', 'MSP', 'ASP', 'CSP', 'Commerce', '블록체인', '구독경제'] },
        ],
        footer: '계속 붙는 주제: AI, 신경망 분석, 프로세스 마이닝, 데이터 경제, 공유경제, Digital Transformation',
      },
      {
        title: '2장. 읽는 순서',
        summary: '밖과 안을 보고, 길을 고르고, 계획으로 내리고, 실시간으로 실행한 뒤, 끊겨도 잇는다.',
        stages: [
          { step: '1', title: '환경', items: ['SWOT', '5Forces', 'PEST', '7S Model', '3C', 'VRIO'] },
          { step: '2', title: '선택', items: ['STP', '선도자', '추격자', '캐즘 이론', 'TAM-SAM-SOM', 'Lean Startup'] },
          { step: '3', title: '계획', items: ['ISP', 'EA', 'BSC', 'IT ROI', '기술 가치 평가', 'MECE'] },
          { step: '4', title: '실행', items: ['RTE', 'BPM', 'ERP', 'EDA', 'ITSM', 'Digital Transformation'] },
          { step: '5', title: '지속', items: ['BCP', 'BCM', 'BIA', 'RTO', 'RPO', 'ISO 22301'] },
        ],
      },
    ],
  },
  project: {
    title: '프로젝트관리 로드맵',
    lead: '끝나는 일을 착수에서 종료까지 보내고, 지식영역은 그 위에 얹는다.',
    sheets: [
      {
        title: '1장. 프로세스 흐름',
        summary: '한 번은 착수, 기준선은 계획, 일은 실행, 차이는 감시, 산출물은 종료.',
        stages: [
          { step: '1', title: '착수', items: ['프로젝트 관리', '프로그램 관리', '포트폴리오 관리', 'Stakeholder Management', 'PMO', '조직유형(3가지)'] },
          { step: '2', title: '계획', items: ['Scope Management', 'WBS', 'Schedule Management(일정)', 'CPM', '원가관리(Cost Management)', '품질관리'] },
          { step: '3', title: '실행', items: ['Resource Management', 'Communication Management', 'Procurement Management', 'Tuckman Ladder Model', '원격지 개발(가상팀)'] },
          { step: '4', title: '감시', items: ['EVA(원가 통제 프로세스)', 'Risk Management', '프로젝트 일정단축기법', 'Resource Leveling 기법', 'CCM(Critical Chain M.)'] },
          { step: '5', title: '마무리', items: ['프로젝트 통합관리', 'SW 형상관리(기준선)', '버전관리(기준선)', 'Git', '프로세스와 지식영역', 'ISO 21500'] },
        ],
        footer: '프로젝트관리(사업관리) 6/7판은 프로세스와 원칙, ISO 21500은 같은 지도를 주제 그룹으로 본다. 조정은 영역별 계획이 어긋나지 않게 맞추는 자리다.',
      },
      {
        title: '2장. 같이 움직이는 축',
        summary: '범위·일정·원가는 한 삼각형이고, 통합관리가 세 기준선을 묶는다.',
        groups: [
          { title: '삼각형', tone: 'amber', items: ['Scope Management', 'WBS', 'Schedule Management(일정)', 'CPM', 'CCM(Critical Chain M.)', '원가관리(Cost Management)', 'EVA(원가 통제 프로세스)'] },
          { title: '사람과 품질', tone: 'blue', items: ['품질관리', 'SW 형상관리(기준선)', 'Git', 'GitHub', 'Resource Management', 'Tuckman Ladder Model', 'Communication Management'] },
          { title: '밖과 위험', tone: 'rose', items: ['Risk Management', 'Procurement Management', 'Stakeholder Management', 'PMO', '조정'] },
          { title: '통합', tone: 'green', items: ['프로젝트 통합관리', '프로젝트관리(사업관리) 6/7판', 'ISO 21500', '프로세스와 지식영역'] },
        ],
      },
    ],
  },
  software: {
    title: '소프트웨어 공학 로드맵',
    lead: '어떤 순서로 만들지 고르고, 그 순서를 분석에서 운영까지 걷는다.',
    sheets: [
      {
        title: '1장. 만드는 방법의 지도',
        summary: '왼쪽은 공정 모델, 가운데는 방법론, 오른쪽은 운영과 맞닿는 주제.',
        groups: [
          { title: 'SDLC', tone: 'amber', items: ['폭포수 모델', '프로토타이핑 모델', 'Spiral 모델', '증분형 개발 모델', '반복적 개발 모델', 'RAD'] },
          { title: '개발방법론', tone: 'blue', items: ['구조적 개발방법론', '정보공학(IE) 방법론', '객체지향 개발방법론', 'CBD', 'Agile', 'XP', 'SCRUM', 'Product Line'] },
          { title: '구조', tone: 'green', items: ['UML', 'SOA', 'MSA', 'DDD(Domain Driven Design)', '모듈화(Modularity)', 'Monolithic', 'Service Mesh'] },
          { title: '운영·융합', tone: 'rose', items: ['ITIL', '데브옵스', 'CI', 'CD', 'DevSecOps', 'SBOM', '노코드'] },
        ],
        footer: '제품품질 ISO/IEC 25010 · 프로세스 CMMI, SPICE · 품질경영 Six Sigma. 데브옵스와 ITIL은 나온 뒤를 계속 잇는다.',
      },
      {
        title: '2장. 사업에서 릴리즈까지',
        summary: '사오기와 만들기가 갈리고, 개발은 다섯 칸, 그 다음이 운영과 유지보수.',
        barLabel: '수명',
        bar: ['Procurement', 'SD(SI)', 'OP', 'MA'],
        stages: [
          { step: '1', title: '분석', items: ['SRS', '비기능 요구사항', '요구사항추적표', '추적성'] },
          { step: '2', title: '설계', items: ['UML', 'DDD(Domain Driven Design)', '모듈화(Modularity)', 'MSA', 'SOA'] },
          { step: '3', title: '코딩', items: ['CI', 'CD', '데브옵스(DevOps)', '기술부채(Technical Debt)', 'SBOM'] },
          { step: '4', title: '테스트', items: ['V-Diagram', 'Black Box 테스트 기법(명세)', 'White Box 테스트 기법(구조)', '회귀 테스트(Regression Test)', 'BMT(성능 평가 시험)'] },
          { step: '5', title: '릴리즈', items: ['SW 유지보수', 'Function Point(기능점수)', 'ISO/IEC 25010', 'CMMI', 'SPICE'] },
        ],
        callout: '조달 옆에는 상용 소프트웨어 직접구매, SW 분할 발주 중, 소프트웨어사업 영향평가. 운영 옆에는 데브옵스와 유지보수.',
      },
    ],
  },
  'digital-service': {
    title: '디지털서비스 로드맵',
    lead: '사람이 만나는 화면에서 시작해, 빌려 쓰는 컴퓨터와 현실의 사물로 두꺼워진다.',
    sheets: [
      {
        title: '1장. 서비스가 두꺼워지는 순서',
        summary: '화면, 부르는 문, 빌리는 자원, 현실에 붙는 도메인, 신뢰를 남기는 장부.',
        stages: [
          { step: '1', title: '접점', items: ['UX', 'UI', '웹 접근성', '반응형 웹', 'HTML5', 'AJAX'] },
          { step: '2', title: '연결', items: ['REST', 'API', 'Open API', 'SOAP', 'Mashup', 'Ontology'] },
          { step: '3', title: '클라우드', items: ['Public Cloud', 'Private Cloud', 'Hybrid Cloud', '도커', '쿠버네티스', 'XaaS'] },
          { step: '4', title: '현실', items: ['스마트시티', '스마트카', 'UAM', 'Healthcare', '스마트공장', 'CPS'] },
          { step: '5', title: '신뢰', items: ['블록체인', 'NFT', 'DID', 'CBDC', 'Metaverse 윤리', 'Agentic AI'] },
        ],
      },
      {
        title: '2장. 어디에 붙는가',
        summary: '같은 연결이라도 집, 도시, 차, 병원, 공장에서 이름이 달라진다.',
        groups: [
          { title: '공간·도시', tone: 'blue', items: ['스마트 홈', 'u-City', '스마트시티', 'ITS', 'C-ITS', 'GIS'] },
          { title: '이동', tone: 'amber', items: ['스마트카', 'ADAS', 'V2X', 'AUTOSAR', 'UAM', 'Telematics'] },
          { title: '건강', tone: 'green', items: ['EMR', 'HIS', 'PACS', 'PHR', 'u-Health', 'HL7'] },
          { title: '제조·에너지', tone: 'slate', items: ['스마트공장', '인더스트리 4.0', 'SCADA', 'AMI', 'ESS', '디지털 트윈'] },
        ],
      },
    ],
  },
  'digital-network': {
    title: '디지털네트워크 로드맵',
    lead: '층을 나누고, 빠지면 다시 보내고, 길은 주소를 따라가며, 나중에는 그 길 자체를 소프트웨어로 바꾼다.',
    sheets: [
      {
        title: '1장. 층으로 보기',
        summary: '아래층은 이웃과 비트, 가운데는 길, 위는 응용. TCP/IP는 이 일곱 층을 네 층으로 접은 것이다.',
        stages: [
          { step: '1', title: '링크', items: ['L2', 'Ethernet', 'MAC 주소', 'CSMA/CD', 'CSMA/CA', '스위치'] },
          { step: '2', title: '네트워크', items: ['L3', 'IPv4', 'IPv6', 'CIDR', '정적 라우팅', '동적 라우팅'] },
          { step: '3', title: '전송', items: ['L4', 'TCP 흐름제어', 'TCP 혼잡제어', 'TCP 오류제어', 'SCTP', '포트번호'] },
          { step: '4', title: '품질·이름', items: ['QoS', 'DiffServ', 'IntServ', 'Traffic Shaping', 'DNS', 'CDN'] },
          { step: '5', title: '응용', items: ['HTTP/2', 'HTTP/3', 'MQTT', 'CoAP', '전자메일', 'VoIP'] },
        ],
      },
      {
        title: '2장. 공기와 프로그램으로 바꾼 길',
        summary: '유선 층 옆에, 무선·이동·사물과 길을 소프트웨어로 여는 축이 있다.',
        groups: [
          { title: '무선·이동', tone: 'blue', items: ['WLAN', 'Wi-Fi 6', 'Wi-Fi 7', 'LTE', '5G', 'NR', 'FDD', 'TDD'] },
          { title: '사물', tone: 'green', items: ['IoT', 'MQTT', 'CoAP', 'NB-IoT', 'LoRa', 'Matter', 'LwM2M'] },
          { title: '차량·오류', tone: 'amber', items: ['V2V', 'C-V2X', 'WAVE', 'FEC', 'ARQ', 'CRC', 'Hamming code'] },
          { title: '소프트웨어 정의', tone: 'rose', items: ['SDN', 'OpenFlow', 'NFV', 'SD-WAN', 'ORAN', 'NaaS'] },
        ],
        footer: '오류는 수신이 고치거나(FEC) 다시 부탁한다(BEC, ARQ). 주소는 Subnetting으로 나누고 Supernetting, CIDR로 묶는다.',
      },
    ],
  },
  'digital-security': {
    title: '디지털시큐리티 로드맵',
    lead: '내용을 가리고, 누구인지 확인하고, 문을 나눈 뒤, 이상에 대응하고, 그 책임을 체계로 남긴다.',
    sheets: [
      {
        title: '1장. 보호의 순서',
        summary: '암호는 기밀, 서명은 출처, 접근통제는 문, 관제는 지켜보기, 관리체계는 조직의 약속.',
        stages: [
          { step: '1', title: '암호', items: ['DES', 'AES', 'SEED', 'RSA', 'ECC', '디피헬만', '해시'] },
          { step: '2', title: '신원', items: ['전자 서명', '인증서', 'PKI', 'SSO', 'FIDO 2.0', 'Oauth'] },
          { step: '3', title: '경계', items: ['Firewall', 'DMZ', 'VPN', 'IPSec', 'WAF', '망분리'] },
          { step: '4', title: '대응', items: ['IDS', 'IPS', 'SIEM', 'SOAR', 'DLP', '취약점'] },
          { step: '5', title: '체계', items: ['ISMS-P', 'ISO 27001', 'CC', '제로 트러스트', 'PbD', 'GDPR'] },
        ],
      },
      {
        title: '2장. 어디를 지키는가',
        summary: '같은 원칙이 웹, 개인정보, 제어망, 나중 암호에서 이름이 달라진다.',
        groups: [
          { title: '웹·앱', tone: 'amber', items: ['OWASP Top 10', 'Secure Coding', 'XSS', 'CSRF', 'SQL-Injection', 'Web Shell'] },
          { title: '개인정보', tone: 'blue', items: ['개인정보보호법', '가명처리', '익명처리', 'PbD', '데이터 3법', 'Mydata'] },
          { title: '기반·단말', tone: 'green', items: ['ICS', 'Stuxnet', 'IoT', 'TEE', 'VDI', 'End Point 보안'] },
          { title: '이후의 암호', tone: 'rose', items: ['양자암호화', 'PQC', "Shor's algorithm", '동형암호화', 'Zero knowledge proof'] },
        ],
        footer: '모델로 보면 BLP는 기밀, BIBA와 Clark-Wilson은 무결. 오용탐지는 시그니처, 이상탐지는 벗어남.',
      },
    ],
  },
  'data-analysis': {
    title: '데이터분석 로드맵',
    lead: '칸을 정하고, 한 번에 반영하고, 커지면 나누고, 모아서 본 뒤, 그 숫자를 맡긴다.',
    sheets: [
      {
        title: '1장. 장부가 믿기까지의 순서',
        summary: '모델이 먼저이고, 트랜잭션이 그 줄을 지키고, 저장이 커진 뒤를 분석과 거버넌스가 받는다.',
        stages: [
          { step: '1', title: '모델', items: ['개논물', '외개내', 'ER 모델', '엔티티', '식별관계', 'CRUD Matrix'] },
          { step: '2', title: '정규화', items: ['함수 종속', '1차 정규화', '2차 정규화', '3차 정규화', 'BCNF', '반정규화'] },
          { step: '3', title: '거래', items: ['ACID', 'Lock', '2PL', 'MVCC', 'Isolation Level', 'ARIES'] },
          { step: '4', title: '확장', items: ['Index', '샤딩', 'Replication', 'NoSQL', 'CAP Theorem', 'PACELC'] },
          { step: '5', title: '활용', items: ['OLTP', 'OLAP', 'Data Mining', 'Data Governance', '메타데이터', '데이터 품질'] },
        ],
      },
      {
        title: '2장. 모아서 보는 축',
        summary: '운영 장부와 분석 장부는 다르고, 빅데이터는 쌓는 구조가 따로 있다.',
        groups: [
          { title: '운영과 분석', tone: 'amber', items: ['OLTP', '로우 기반 DBMS', 'OLAP', '칼럼 기반 DBMS', 'Star Schema', 'Snowflake Schema'] },
          { title: '빅데이터', tone: 'blue', items: ['3V', 'HDFS', 'Hadoop', 'Apache Spark', 'Storm', '카프카', 'Data Lake'] },
          { title: '학습 모델', tone: 'green', items: ['Apriori', 'K-평균', 'Bagging', 'Boosting', 'Random Forest', 'Lambda', 'Kappa'] },
          { title: '맡김', tone: 'slate', items: ['DA', 'DBA', '데이터 표준화', 'MDM', 'CKAN', '데이터 산업법'] },
        ],
        callout: '동시성이 없으면 갱신 손실, 더티 리드, 모순, 연쇄 복귀(갱현모연)가 난다. 회복은 로그와 체크포인트, ARIES는 분석 다음 REDO, 그다음 UNDO.',
      },
    ],
  },
  ai: {
    title: '인공지능 로드맵',
    lead: '배우는 방법을 고르고, 층을 쌓아 맞힌 뒤, 점수를 보고, 말과 책임을 운영에 올린다.',
    sheets: [
      {
        title: '1장. 모델이 서비스가 되는 순서',
        summary: '데이터와 학습이 앞이고, 평가를 통과한 모델만 언어 서비스와 운영으로 간다.',
        stages: [
          { step: '1', title: '학습', items: ['감독학습', '무감독학습', '강화학습', '자기지도학습', '데이터 레이블링'] },
          { step: '2', title: '모델', items: ['Perceptron', 'CNN', 'RNN', 'LSTM', 'GRU', '트랜스포머', 'GAN'] },
          { step: '3', title: '맞추기', items: ['손실 함수', '경사하강법', 'SGD', '드롭아웃', '과적합', 'Underfitting'] },
          { step: '4', title: '평가', items: ['정밀도', '재현율', 'F1 Score', 'ROC', '벤치마크 데이터셋'] },
          { step: '5', title: '서비스', items: ['LLM', 'RAG', 'Prompt Engineering', 'MLOps', 'AI 윤리', 'CAT'] },
        ],
      },
      {
        title: '2장. 질문별로 고르는 모델',
        summary: '분류·군집·생성·순서는 다른 도구다. 큰 언어모델은 그 위에 검색과 운영이 붙는다.',
        groups: [
          { title: '나누고 묶기', tone: 'amber', items: ['SVM', 'KNN', 'Clustering', 'DBSCAN', 'PCA', '차원 축소'] },
          { title: '순서와 생성', tone: 'blue', items: ['RNN', 'LSTM', '어텐션', '오토인코더', 'GAN', 'DCGAN'] },
          { title: '언어', tone: 'green', items: ['PLM', 'LLM', 'sLLM', 'RAG', 'MoE', 'TEXT2SQL', 'MCP'] },
          { title: '책임', tone: 'rose', items: ['AI 기본법', 'AI Act', '인공지능 신뢰성', '딥페이크', '연합학습', 'AI Goverance'] },
        ],
      },
    ],
  },
  'ca-system': {
    title: 'CA·시스템 로드맵',
    lead: '명령이 인출되어 실행되고, 자주 쓰는 값은 가까운 메모리에, 고장은 겹쳐 둔 장치로 넘긴다.',
    sheets: [
      {
        title: '1장. 계산이 돌아가는 순서',
        summary: '구조가 명령을 가져오고, 메모리가 속도를 나누고, 병렬은 그 일을 여러 손에 맡긴다.',
        stages: [
          { step: '1', title: '구조', items: ['Von Neumann', '하바드 아키텍처', 'CPU', '명령어', '인출', '실행'] },
          { step: '2', title: '제어', items: ['고정배선', '마이크로 프로그래밍', 'Pipeline', 'Pipeline 해저드', 'CISC', 'RISC'] },
          { step: '3', title: '메모리', items: ['Cache Memory', 'MESI', '주기억장치', 'DDR', '가상기억장치', 'HBM'] },
          { step: '4', title: '저장', items: ['SSD', 'SLC', 'TLC', 'RAID', 'DAS', 'NAS', 'SAN'] },
          { step: '5', title: '병렬', items: ['Flynn', 'SMP', 'GPU', 'CUDA', 'Clustering', 'HA'] },
        ],
      },
      {
        title: '2장. 법칙과 한계',
        summary: '사람을 늘려도 순서가 남으면 암달의 상한이고, 문제 크기를 같이 키우면 구스타프슨이다.',
        groups: [
          { title: '성능 법칙', tone: 'amber', items: ['무어의 법칙', '암달의 법칙', '구스타프슨의 법칙', '멧칼프 법칙', '리드의 법칙'] },
          { title: '메모리 소자', tone: 'blue', items: ['SDRAM', 'DDR', 'DDR2', 'MRAM', 'FeRAM', 'PIM', 'CXL'] },
          { title: '가용', tone: 'green', items: ['RAID', 'HA', 'Clustering', '결함허용 컴퓨터', 'DMA'] },
          { title: '소프트웨어 뼈대', tone: 'slate', items: ['Spring Framework', 'DI', 'IoC', '전자정부프레임워크', 'Android Architecture', 'JVM(GC)'] },
        ],
      },
    ],
  },
  algorithm: {
    title: '알고리즘 로드맵',
    lead: '늘어나는 모양을 먼저 보고, 줄을 세우고, 그래프에서는 길과 그물을 가른다.',
    sheets: [
      {
        title: '1장. 문제를 푸는 순서',
        summary: '복잡도로 비교하고, 정렬과 탐색을 고른 뒤, 그래프와 압축은 별도 질문이다.',
        stages: [
          { step: '1', title: '평가', items: ['알고리즘', 'O-Notation', '분할 정복', '탐욕법', '동적계획법', '백트래킹'] },
          { step: '2', title: '정렬', items: ['Bubble Sort', 'Selection Sort', 'Insertion Sort', 'Shell Sort', 'Quick sort'] },
          { step: '3', title: '그래프 길', items: ['Depth First Search', 'Breadth First Search', 'Dijkstra', 'Bellman-Ford', 'A* 알고리즘'] },
          { step: '4', title: '그물', items: ['최소 신장 트리', 'Prim', 'Kruskal', 'Floyd-Warshall'] },
          { step: '5', title: '표현', items: ['Huffman Coding', 'RLE', 'H.264', 'HEVC', '해시 충돌 해결방안'] },
        ],
        footer: 'Floyd-Warshall은 모든 쌍, 시간 O(n³). 버블 정렬의 최악은 O(n²). 대기행렬은 L=λW.',
      },
    ],
  },
  os: {
    title: '운영체제 로드맵',
    lead: '누가 CPU를 쓰고, 누가 잠금을 잡고, 좁은 메모리와 디스크를 어떻게 나눌지.',
    sheets: [
      {
        title: '1장. 자원을 나누는 순서',
        summary: '부팅 뒤 프로세스가 생기고, 스케줄과 동기화가 실행을 지키고, 메모리와 디스크가 자리를 준다.',
        stages: [
          { step: '1', title: '시작', items: ['부트로더', '부트스트래핑', '커널', '시스템 호출', '인터럽트', 'PCB'] },
          { step: '2', title: '스케줄', items: ['FCFS', 'SJF', 'Round Robin', '선점', '비선점', 'HRN'] },
          { step: '3', title: '동기화', items: ['임계영역', 'Semaphore', '모니터', 'Deadlock', '은행가 알고리즘', '우선순위 역전'] },
          { step: '4', title: '메모리', items: ['Locality', 'Working-Set) 모델', 'Thrashing', 'PFF(Page Fault Frequency)'] },
          { step: '5', title: '디스크', items: ['스캔(scan)', 'Look', 'C-SCAN', 'SSTF', 'Inode', '파일접근제어'] },
        ],
      },
      {
        title: '2장. 시간과 입출력',
        summary: '범용 스케줄 옆에, 마감이 있는 실시간과 기다림이 다른 입출력이 있다.',
        groups: [
          { title: '실시간', tone: 'amber', items: ['RM', 'Rate Monotonic', 'EDF', 'Earliest Deadline First', 'RTOS', 'Embedded OS'] },
          { title: '교착', tone: 'rose', items: ['상호배제', '점유 대기', '비선점', '환형 대기', 'Wait-die', 'Wound-wait'] },
          { title: '디스크 헤드', tone: 'blue', items: ['스캔(scan)', 'Look', 'C-SCAN', 'C-Look', 'N-step SCAN', 'SSTF', 'SLTF'] },
          { title: '입출력', tone: 'green', items: ['Synchronous blocking I/O', 'Asynchronous non-blocking I/O', 'DMA', 'IPC', 'Thread'] },
        ],
        callout: 'RM 이용률 상한은 작업 수가 커질 때 ln2≈0.69. SCAN은 끝까지, LOOK은 마지막 요청까지만.',
      },
    ],
  },
  'data-structure': {
    title: '자료구조 로드맵',
    lead: '한 줄로 담을지, 나무로 찾을지, 지도 위 네모로 범위를 자를지.',
    sheets: [
      {
        title: '1장. 담는 모양',
        summary: '선형은 순서, 트리는 갈래, 공간 색인은 범위. 힙은 맨 위만 보면 다음 일이 나온다.',
        stages: [
          { step: '1', title: '선형', items: ['배열', 'Linked List', 'Stack', 'Queue', 'MLL'] },
          { step: '2', title: '트리', items: ['Binary Tree', 'Binary Search Tree', 'AVL Tree', 'Heap'] },
          { step: '3', title: '디스크 트리', items: ['B-Tree', 'B+ Tree', 'B* Tree', 'T-Tree'] },
          { step: '4', title: '공간', items: ['R-Tree', 'R* Tree', 'R+ Tree', 'Hilbert R-Tree'] },
          { step: '5', title: '수식', items: ['중위표기법', '후위표기법', '순회 방법', 'Priority Queue'] },
        ],
        footer: '배열은 번호로 바로 열고, 리스트는 다음 칸을 가리킨다. BST는 왼쪽이 작고 오른쪽이 크다. B+ 트리는 데이터를 리프에 모아 범위를 잇는다.',
      },
    ],
  },
  story: {
    title: '한 이야기로 로드맵',
    lead: '열두 목차는 한 줄이다. 방향을 정하고, 만들고, 잇고, 잠그고, 남기고, 맞히고, 담는다.',
    sheets: [
      {
        title: '1장. 열두 칸을 한 줄로',
        summary: '앞 목차가 정한 것을 다음 목차가 실행한다. 아래 네 묶음은 그 줄의 큰 호흡.',
        stages: [
          { step: '1', title: '방향', items: ['경영전략', 'RTE', 'BSC', 'ISP'] },
          { step: '2', title: '실행', items: ['프로젝트', 'WBS', '소프트웨어', 'SDLC'] },
          { step: '3', title: '전달', items: ['디지털서비스', 'API', '네트워크', 'TCP/IP'] },
          { step: '4', title: '보호', items: ['시큐리티', 'AES', '인증', 'ISMS-P'] },
          { step: '5', title: '판단', items: ['데이터', 'AI', '정밀도', 'RAG'] },
          { step: '6', title: '기계', items: ['시스템', '알고리즘', '운영체제', '자료구조'] },
        ],
        groups: [
          { title: '정한다', tone: 'amber', items: ['1 경영전략', '2 프로젝트관리'] },
          { title: '만든다', tone: 'blue', items: ['3 소프트웨어', '4 디지털서비스'] },
          { title: '잇고 지킨다', tone: 'green', items: ['5 네트워크', '6 시큐리티', '7 데이터'] },
          { title: '계산하고 담는다', tone: 'slate', items: ['8 인공지능', '9 시스템', '10 알고리즘', '11 운영체제', '12 자료구조'] },
        ],
        footer: '이 장은 열두 목차가 이어지는 순서만 본다. 각 목차의 속 흐름은 그 목차의 로드맵에 있다.',
      },
    ],
  },
};
