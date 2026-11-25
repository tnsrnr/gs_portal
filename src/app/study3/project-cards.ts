export type StudyCard = {
  topic: string;
  definition: string;
  why: string;
  related: string;
};

export const projectCards: StudyCard[] = [
  {
    topic: 'Communication Management(의사소통관리)',
    definition: '프로젝트 정보를 만들어 배포하고 보관하는 관리',
    why: '전달이 빠지면 같은 사실을 다르게 알아 일정과 범위 판단이 어긋나는 것 방지',
    related: 'Stakeholder Management, 보고, PMO',
  },
  {
    topic: '프로젝트 관리(Project Management : 프로젝트관리)',
    definition: '유일한 제품·서비스·결과를 한시적 자원으로 끝내는 관리',
    why: '끝과 목표가 있는 일을 반복 운영과 같은 방식으로 두면 일정·원가·품질이 흐려지는 것 방지',
    related: '프로그램 관리, 포트폴리오 관리, 통합관리',
  },
  {
    topic: '프로그램 관리(Program Management : 프로그램관리)',
    definition: '관련된 프로젝트를 묶어 개별 납기가 아니라 프로그램 이익을 보는 관리',
    why: '프로젝트만 따로 끝내면 묶음의 편익과 변경이 빠지는 것 방지',
    related: '프로젝트 관리, 포트폴리오 관리, 통합관리',
  },
  {
    topic: '포트폴리오 관리(Portfolio Management : 포트폴리오관리)',
    definition: '전략 목표에 맞게 프로젝트·프로그램·운영의 우선순위와 투자를 정하는 관리',
    why: '개별 성과만 모으면 전략과 투자 효과가 어긋나는 것 방지',
    related: '프로젝트 관리, 프로그램 관리, PMO',
  },
  {
    topic: 'Risk Management(위험관리)',
    definition: '목표에 플러스 또는 마이너스가 되는 불확실 사건을 식별하고 대응·감시하는 관리',
    why: '이미 발생한 이슈가 된 뒤에야 대응해 기준선을 회복하지 못하는 것 방지',
    related: '우발예비비, 관리예비비, 통합관리',
  },
  {
    topic: '프로세스와 지식영역(Process Groups and Knowledge Areas)',
    definition: '6판 기준 프로세스 그룹 5개와 지식영역 10개가 만나는 관리 골격',
    why: '시점과 영역이 섞이면 산출물과 책임이 한곳에 모이지 않는 것 방지',
    related: '프로젝트관리 6/7판, 통합관리, ISO 21500',
  },
  {
    topic: '프로젝트관리 6/7판(PMBOK 6th and 7th Edition)',
    definition: '6판은 프로세스 약 49개, 7판은 원칙 12개와 성과 도메인 8개로 보는 관리 체계',
    why: '절차로 쓴 답과 원칙으로 쓴 답을 서로 번역하지 못하면 같은 사업을 다른 말로 설명하게 되는 것 방지',
    related: '프로세스와 지식영역, ISO 21500, 테일러링',
  },
  {
    topic: 'Procurement Management(조달관리)',
    definition: '외부의 사람·장비·개발을 계약으로 사 오고 통제하는 관리',
    why: '계약 유형을 잘못 고르면 원가와 범위 위험이 구매자에게 열리는 것 방지',
    related: '원가관리, Risk Management, 범위관리',
  },
  {
    topic: 'Stakeholder Management(이해관계자관리)',
    definition: '이해관계자를 식별하고 참여 수준을 계획·관리·감시하는 관리',
    why: '권력과 태도를 놓치면 승인과 범위, 의사소통이 막히는 것 방지',
    related: 'Communication Management, 헌장, 범위관리',
  },
  {
    topic: '조정(Coordination : 요소 간 조정)',
    definition: '지식영역, 일정, 자원, 이해관계자의 충돌을 하나의 계획으로 맞추는 활동',
    why: '영역별 계획이 따로 가면 기준선이 서로 어긋나는 것 방지',
    related: '통합관리, Communication Management, Resource Management',
  },
  {
    topic: 'Scope Management(범위관리)',
    definition: '할 일과 하지 않을 일을 정하고 WBS로 분해한 뒤 승인·통제하는 관리',
    why: '기준선 밖 요구가 승인 없이 스며들어 일정과 원가가 함께 넘는 것 방지',
    related: 'WBS, 통합관리, 요구사항',
  },
  {
    topic: 'PMO(Project Management Office : 프로젝트관리조직)',
    definition: '프로젝트·프로그램·포트폴리오의 표준, 자원, 일정, 이슈를 전담하는 조직',
    why: '사업마다 관리 방식이 달라 진도와 위험을 한곳에서 못 보는 것 방지',
    related: '프로젝트 관리, 감리, ISO 21500',
  },
  {
    topic: 'WBS(Work Breakdown Structure : 작업분류체계)',
    definition: '인도물 중심으로 작업을 계층 분해한 구조. 최하단은 작업패키지',
    why: '일정·원가·담당의 출발점이 없어 범위가 빠지거나 겹치는 것 방지',
    related: 'Scope Management, 일정관리, 원가관리',
  },
  {
    topic: 'ISO 21500(프로젝트관리 지침)',
    definition: '프로세스 그룹 5개, 주제 그룹 10개, 프로세스 39개를 정한 프로젝트관리 국제표준',
    why: '조직마다 도구는 달라도 입력과 산출의 공통 기준이 없으면 관리 결과가 비교되지 않는 것 방지',
    related: 'PMBOK, 프로세스와 지식영역, PMO',
  },
  {
    topic: 'Schedule Management(일정관리)',
    definition: '활동을 정의·배열하고 기간을 산정해 일정 기준선을 만들고 통제하는 관리',
    why: '작업 목록만 있으면 순서와 기간이 없어 납기를 약속할 수 없는 것 방지',
    related: 'CPM, WBS, 일정단축',
  },
  {
    topic: '일정단축기법(Schedule Compression : 일정 단축)',
    definition: '범위를 유지한 채 기간을 줄이는 기법. 크래싱은 자원 추가, 패스트 트래킹은 병행',
    why: '납기를 맞추려 범위를 자르거나 품질을 낮추는 기준선 변경과 단축을 섞는 것 방지',
    related: 'CPM, CCM, 원가관리',
  },
  {
    topic: 'CPM(Critical Path Method : 주공정법)',
    definition: '자원이 있다고 보고 논리 관계와 기간만으로 여유 0인 주공정을 계산하는 방법',
    why: '주공정이 아닌 활동을 줄여도 전체 기간이 줄지 않는 착오 방지',
    related: '일정관리, CCM, 일정단축',
  },
  {
    topic: 'CCM(Critical Chain Method : 주공정연쇄법)',
    definition: 'CPM에 자원 제약과 불확실성을 더해 안전시간을 버퍼로 모아 관리하는 방법',
    why: '한 자원이 두 활동을 맡으면 자원이 있다고 본 CPM 일정이 깨지는 것 방지',
    related: 'CPM, TOC, Resource Leveling',
  },
  {
    topic: '품질관리(Quality Management)',
    definition: '요구에 맞게 품질을 계획·관리·통제하는 활동. 등급은 기능의 범주',
    why: '예방과 평가를 줄이면 인도 전후의 실패 비용이 더 커지는 것 방지',
    related: '형상관리, Scope Management, 기준선',
  },
  {
    topic: 'SW 형상관리(Software Configuration Management : 기준선 관리)',
    definition: '산출물을 기준선으로 고정하고 식별·통제·감사·기록으로 변경을 관리하는 활동',
    why: '승인 없는 변경으로 무엇을 기준으로 맞는지 추적이 끊기는 것 방지',
    related: '기준선, 버전관리, Git, CCB',
  },
  {
    topic: '버전관리(Version Control : 이력 관리)',
    definition: '형상항목의 변경 이력을 남기고 기준선 사이의 차이를 관리하는 활동',
    why: '누가 무엇을 바꿨는지 없으면 기준선 감사와 복귀가 안 되는 것 방지',
    related: 'Git, GitHub, 형상관리',
  },
  {
    topic: 'Resource Management(자원관리)',
    definition: '사람과 장비·자재를 산정·확보하고 팀을 개발·관리·통제하는 관리',
    why: '활동에 자원이 없으면 일정과 원가 계획이 실행되지 않는 것 방지',
    related: 'Resource Leveling, Tuckman, 조직유형',
  },
  {
    topic: 'Tuckman Ladder Model(터크만 팀 발달 모델)',
    definition: '팀이 형성, 스토밍, 노밍, 수행, 해산 순으로 발달한다고 보는 모델',
    why: '갈등 단계를 수행 단계로 보고 지시와 코칭을 잘못 고르는 것 방지',
    related: 'Resource Management, RACI, 가상팀',
  },
  {
    topic: 'Resource Leveling(자원 평준화)',
    definition: '기간당 자원 한도를 넘지 않게 작업을 미루는 기법. 주공정도 움직여 납기가 늘 수 있음',
    why: '같은 사람을 겹쳐 쓰면 논리상 가능한 일정이 실제로 불가능한 것 방지',
    related: '자원 평활화, CPM, CCM',
  },
  {
    topic: '원격지 개발(Virtual Team : 가상팀)',
    definition: '한곳에 모이지 않은 팀이 공통 목표의 개발을 수행하는 방식',
    why: '인력은 유연하지만 산출물 검증과 요구 변경 반영이 늦어지는 것 방지',
    related: 'Resource Management, Communication Management, Tuckman',
  },
  {
    topic: '원가관리(Cost Management)',
    definition: '원가를 산정하고 예산을 정해 원가 기준선으로 통제하는 관리',
    why: '산정과 예산이 없으면 돈을 덜 쓴 것과 일이 덜 끝난 것을 구분하지 못하는 것 방지',
    related: 'EVA, 일정관리, 조달관리',
  },
  {
    topic: '조직유형(Organizational Structure : 기능·매트릭스·프로젝트조직)',
    definition: '기능조직, 매트릭스, 프로젝트조직으로 PM의 사람과 예산 권한이 달라지는 구분',
    why: '권한이 약한 조직에서 PM이 사람과 예산을 가진 것처럼 계획을 세우는 것 방지',
    related: 'Resource Management, PMO, 프로젝트 관리',
  },
  {
    topic: 'Git(분산 버전관리 도구)',
    definition: '로컬에서 커밋하고 원격에 push, pull 하는 분산 버전관리 도구',
    why: '서버가 끊겨도 로컬 이력과 분기를 남기지 못하면 변경을 복구할 수 없는 것 방지',
    related: 'GitHub, 버전관리, 형상관리',
  },
  {
    topic: 'GitHub(Git 원격 호스팅)',
    definition: 'Git 저장소를 올리고 팀이 공유하는 호스팅 서비스',
    why: '로컬 Git만으로는 팀의 원격 기준선을 한곳에 모으기 어려운 것 방지',
    related: 'Git, 버전관리, 협업',
  },
  {
    topic: 'EVA(Earned Value Analysis : 획득가치분석)',
    definition: 'PV, EV, AC로 일정 차이(SV)와 원가 차이(CV)를 함께 보는 원가 통제',
    why: '지출만 보면 일이 계획보다 덜 끝났는지 알 수 없는 것 방지',
    related: '원가관리, 일정관리, BAC',
  },
  {
    topic: '통합관리(Project Integration Management : 프로젝트 통합관리)',
    definition: '헌장, 관리계획, 변경통제, 종료로 나머지 지식영역을 하나의 기준선으로 묶는 관리',
    why: '영역별 계획이 따로 승인되면 범위·일정·원가가 서로 다른 기준을 보는 것 방지',
    related: '변경통제, Scope Management, 일정관리, 원가관리',
  },
];
