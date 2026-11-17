import { strategyDocument, type StudyDocument } from './strategy-content';

export const strategySummary: StudyDocument = {
  ...{
  "title": "IT 경영전략",
  "part": "Part I",
  "edition": "개념 요약",
  "subtitle": "이론과 전략 개념 요약",
  "lead": "475쪽 슬라이드 교재를 시험 답안 골격으로 압축한 개인 학습용 개념 정리. 정의, 구성요소, 비교, 절차, 빈출 포인트를 남기고 사례 도표와 강의 운영 안내는 뺌. 숫자 예시와 업종 사례는 답안을 쓸 때 본인 경험으로 다시 채움.",
  "howTo": "1교시(단답): 정의 2줄 + 특징 또는 구성요소 3~5개. 2~4교시: 가. 정의·필요성, 나. 개념도 설명(구성요소), 다. 절차 또는 비교, 라. 적용 시 고려사항 순으로 씀. 비교 문제는 항상 개념·범위·주체·시점·장단점을 같은 행에 맞춤. 상 빈도: RTE/EDA, ISP·ISMP·EA, IT-ROI, BSC, Data Mining, RFI/RFP, SLA, ITIL, ITSM, BCP/DRS, RTO·RPO, ESG, DX, FinTech. 출제예상: OKR, Composable ERP, TAM-SAM-SOM, BMC, VDT, 규제 샌드박스, 디지털 카르텔, ISO 42001, 기술가치평가.",
  "themes": [
    "전략수립",
    "정보시스템",
    "통합",
    "아웃소싱",
    "업무연속",
    "비즈니스",
    "규제",
    "표준"
  ],
  "updated": "2026-11-16",
  "pdf": "/docs/it-strategy-part1-summary.pdf"
},
  keywords: strategyDocument.keywords,
  chapters: [
  {
    "id": "s1",
    "title": "0. 최근 기출이 요구한 답안 틀",
    "blocks": [
      {
        "type": "li",
        "text": "134회: TAM-SAM-SOM / IT 거버넌스(구성요소, 효과 측정 지표·방법론) / ESG(정의·목표, 지표, IT 지원) / EA 도입·운영 지침(메타모델, 참조모형, 성숙도).",
        "keyword": null
      },
      {
        "type": "li",
        "text": "133회: BCP 지표와 DRS 고려사항 / ISO 20000 중심 ITSM(개념, 설계·구축·전환) / SWOT·3C·PEST(특성, 적용 조건, 분석 방법).",
        "keyword": null
      },
      {
        "type": "li",
        "text": "132회: ISO 31000 / ISO 14000(개념, 필요성, 규격·절차, 효과) / ISMP와 EA·ISP 비교, 수립비.",
        "keyword": null
      },
      {
        "type": "li",
        "text": "131회: ISP와 BPR 비교 및 상호보완 / SEM(정의, 구성요소, 구축).",
        "keyword": null
      },
      {
        "type": "li",
        "text": "130회: ISMP 단계·활동·산출물 / AHP / K-means·DBSCAN·SVM / 금융 클라우드 SLA.",
        "keyword": null
      },
      {
        "type": "li",
        "text": "129회: ISP·ISMP 공통가이드(배경, 차이, 단계별 산출물) / 데이터 마이닝(통계와 차이, 정형·비정형, 오피니언 vs 텍스트) / ESG의 정보보호·개인정보 구제 / IT 투자분석(프로세스, 프레임워크, 방법론).",
        "keyword": null
      },
      {
        "type": "li",
        "text": "지식재산권(135 정보관리 1교시), 전자정부 성과지표, 앰비언트 컴퓨팅 vs IoT, 규제 샌드박스, 사실상 표준, ERP POC, 핀테크 동향은 컴퓨터시스템응용에서도 반복됨.",
        "keyword": null
      }
    ]
  },
  {
    "id": "s2",
    "title": "I. 기업 경영 전략 수립",
    "blocks": [
      {
        "type": "h3",
        "text": "1. RTE (Real Time Enterprise)"
      },
      {
        "type": "p",
        "text": "실시간으로 전략 정보를 모아 의사결정하고, 경영자원을 배분·집행해 성과를 내는 기업 모델. 경쟁 축이 가격 → 품질 → 스피드 → 민첩(agile)으로 이동하면서 부각됨. 스피드: 같은 일을 빨리 하는 것이고, 민첩은 사건 변화에 프로세스와 시스템을 바꿔 대응하는 것."
      },
      {
        "type": "li",
        "text": "전제: 데이터 통합(DW·품질·메타) → 프로세스 연계(BPM) → 의사결정(BI).",
        "keyword": null
      },
      {
        "type": "li",
        "text": "사이클: 인지(Awareness) → 의사결정(Decision) → 조치(Action). Cyclone 모델은 지휘·관리·운영 관점의 반복 사이클.",
        "keyword": null
      },
      {
        "type": "li",
        "text": "기반: CRM, ERP, SOA/클라우드, BPR, BPM, BAM, DRS, 유틸리티 컴퓨팅.",
        "keyword": null
      },
      {
        "type": "li",
        "text": "적용 절차: 환경·GAP 분석(SWOT, BCG, ISP) → 핵심 프로세스 선정 → RTE 전략·EA → BPM/EAI/SOA 통합 → 교육·변화관리·PDCA·투자평가.",
        "keyword": null
      },
      {
        "type": "li",
        "text": "효과: 관리(기회 포착, 위기 대응), 운영(재고·리스크·리드타임), 기술(실시간 가시성).",
        "keyword": null
      },
      {
        "type": "h3",
        "text": "2. EDA (Event Driven Architecture)"
      },
      {
        "type": "p",
        "text": "분산 시스템 사이에서 이벤트를 생성·발행하고, 필요한 수신자가 비동기로 처리하는 아키텍처. 이벤트 생산·감지·소비로 상태의 중대한 변화를 다룸."
      },
      {
        "type": "li",
        "text": "특징: 비동기, 이벤트 기반, N:N, MSA와 궁합, 느슨한 결합, 확장성. 흐름 파악과 재시도·롤백은 어려움.",
        "keyword": null
      },
      {
        "type": "li",
        "text": "구성요소: Event Generator(Publisher) → Event Channel(Bus) → Event Processing Engine(Consumer).",
        "keyword": null
      },
      {
        "type": "li",
        "text": "Mediator 토폴로지: 여러 단계와 오케스트레이션이 필요할 때. 큐 + 중재자 + 채널 + 프로세서. 예: 주식 체결.",
        "keyword": null
      },
      {
        "type": "li",
        "text": "Broker 토폴로지: 중재자 없이 이벤트와 처리를 직접 연결. 채널 + 프로세서. 예: 상태·로그 모니터링.",
        "keyword": null
      },
      {
        "type": "li",
        "text": "EDA vs SOA: 이벤트/비동기/N:N/선제적(Proactive) vs 서비스/순차/1:1/요청-응답(Reactive).",
        "keyword": null
      },
      {
        "type": "li",
        "text": "곁가지: CQRS는 쓰기 모델과 읽기 모델을 분리함. 이벤트 소싱과 함께 나옴.",
        "keyword": null
      },
      {
        "type": "h3",
        "text": "3. EA (Enterprise Architecture) / ITA (Information Technology Architecture)"
      },
      {
        "type": "p",
        "text": "조직의 전략 목표에 맞춰 IT와 비즈니스의 관계를 한 장의 청사진으로 설명하고, 공통 모델·표준·지침으로 정보자원을 식별·공유·재사용하는 설계도. ISP가 일회성 계획에 그치는 한계를 보완하려고 등장함."
      },
      {
        "type": "li",
        "text": "구성: 현행 아키텍처, 목표 아키텍처, 이행계획. 참조모형(RM)과 표준 프로파일(SP)을 붙여 호환성을 높임.",
        "keyword": null
      },
      {
        "type": "li",
        "text": "4+1 아키텍처: BA(업무, BRM/PRM), AA(응용, SRM), DA(데이터, DRM), TA(기술, TRM), SA(보안, CIA).",
        "keyword": null
      },
      {
        "type": "li",
        "text": "범정부 참조모형: 성과(PRM), 업무(BRM), 서비스(SRM), 데이터(DRM), 기술(TRM).",
        "keyword": null
      },
      {
        "type": "li",
        "text": "성숙도: 현행 수립 → 이행전략 → 목표 수립 → 아키텍처 완성(품질·통합 관리) → 최적화. 수립·관리·활용을 각각 수행·정의·제도화·확산·최적화로 봄.",
        "keyword": null
      },
      {
        "type": "li",
        "text": "ISP와 차이: ISP는 향후 구축 계획(요약, 컨설턴트 판단, 일회성). EA: 전사 자원의 전 과정에 쓰는 상세 모델이고 RM·EAMS로 계속 관리함.",
        "keyword": null
      },
      {
        "type": "h3",
        "text": "4. ISP (Information Strategy Planning)와 ISMP (Information System Master Plan)"
      },
      {
        "type": "p",
        "text": "ISP(정보화전략계획): 조직의 전략적 정보 요구를 식별하고, 경영전략을 지원하는 통합 정보시스템 마스터플랜을 만드는 접근. 필요성: 경영목표와의 정합, 비용·우선순위, 관리체계 최적화, BPR 효과의 시스템 구현."
      },
      {
        "type": "li",
        "text": "5단계(환경-현황-비전-목표-통합): 환경분석(경영·법·IT, 4C/SWOT/7S) → 현황(AS-IS 업무·시스템, 요구·벤치마크)→ 정보화 비전·전략 → 목표모델(TO-BE 프로세스·시스템·데이터·보안, GAP) → 통합 이행계획(일정, 총비용, 효과).",
        "keyword": null
      },
      {
        "type": "p",
        "text": "ISMP: 특정 SW 사업의 상세 분석과 RFP를 위해, 기능점수를 뽑을 수 있을 만큼 기능·기술 요건을 적고 구축 전략과 이행계획을 세우는 활동. ISP가 전략 수준에서 멈추고 RFP가 따로 노는 문제를 메움."
      },
      {
        "type": "li",
        "text": "ISMP 5단계: 프로젝트 착수(조직·계획) → 정보시스템 방향(전략 검토, 범위·목표) → 업무·기술 요건(프로세스, AA/DA/TA, 성능·보안·운영) → 구조·요건 정의(TO-BE, 요건 기술서) → 이행(범위, 분리발주, 기능점수·예산, RFP, 업체 선정 지원).",
        "keyword": null
      },
      {
        "type": "li",
        "text": "비교 한 줄: ISP=전략과 정보화의 연결(전사), EA=비즈니스·데이터·응용·기술의 융합(지속 관리), ISMP=단위 시스템의 기능·기술 요건과 RFP(사업).",
        "keyword": null
      },
      {
        "type": "link",
        "text": "2024 ISP 8.0: 디지털플랫폼정부(DPG) 원칙 적용 결과를 산출물에 넣음. 민간투자형 SW, 단순 기능·물품은 기획재정부 인정 시 ISP·ISMP 제외 가능."
      },
      {
        "type": "h3",
        "text": "5. SEM (Strategic Enterprise Management)과 VBM (Value Based Management)"
      },
      {
        "type": "link",
        "text": "SEM(전략적 기업경영)은 경영진이 전사 정보를 보고 가치중심 경영을 실행하도록, 분석용 애플리케이션과 프로세스를 통합한 전략 경영 체계. 기간·운영·외부 시스템을 DW로 모아 의사결정함."
      },
      {
        "type": "li",
        "text": "구성요소: VBM(가치), ABM/ABC(활동·원가), BSC(성과·KPI). 구축: 가치동인 정의 → KPI → 시뮬레이션 → 이해관계자 가치 의사결정.",
        "keyword": null
      },
      {
        "type": "p",
        "text": "VBM: 주주·투자자에게 경제적 가치를 창조하는 것을 의사결정과 평가의 기준으로 삼는 경영. 이익 중심에서 현금흐름·기업가치 중심으로 이동한 배경이 있음. 수단: EVA, MVA, ROIC, BSC."
      },
      {
        "type": "h3",
        "text": "6. IT 경제성·IT-ROI (Return on Investment)"
      },
      {
        "type": "li",
        "text": "BCR = 편익/비용. 1보다 크면 타당, 클수록 유리. 비율이라 규모가 다른 대안 비교에 씀.",
        "keyword": null
      },
      {
        "type": "li",
        "text": "PBP(회수기간): 원금 회수까지 기간. 짧을수록 유리. 화폐 시간가치는 기본형에서 무시됨.",
        "keyword": null
      },
      {
        "type": "li",
        "text": "NPV: 미래 현금흐름의 현재가치 − 투자액. 0보다 크면 가치 있음. 클수록 유리.",
        "keyword": null
      },
      {
        "type": "li",
        "text": "IRR: NPV를 0으로 만드는 할인율. 요구수익률보다 높으면 채택. 규모·시기 문제에는 NPV를 함께 봄.",
        "keyword": null
      },
      {
        "type": "li",
        "text": "ROI = 순이익/총투자 × 100.",
        "keyword": null
      },
      {
        "type": "p",
        "text": "IT-ROI 모델은 사전(타당성·우선순위)·중간(집행 효율, 일정·위험)·사후(효과, 원인 분석과 개선)를 한 사이클로 묶음. 측정: 투자성과(재무 환산)와 투자비용(컨설팅·구축·유지)."
      },
      {
        "type": "li",
        "text": "정량: BCR, IRR, PP, BEP, NPV, ROI, TCO. 정성: BSC, IT-BSC, Value Chain, ESG.",
        "keyword": null
      },
      {
        "type": "li",
        "text": "방법론: 비용편익분석, 다기준분석(재무·전략 연계·기술·리스크), 실물옵션(연기·포기·확장 권리. Black-Scholes, 이항, 몬테카를로).",
        "keyword": null
      },
      {
        "type": "h3",
        "text": "7. BSC (Balanced Scorecard), IT-BSC (IT Balanced Scorecard), OKR (Objectives and Key Results)"
      },
      {
        "type": "p",
        "text": "BSC: 재무와 세 비재무 관점(고객, 내부 프로세스, 학습과 성장)을 KPI로 바꿔, 전략과 인과로 연결하는 성과관리. 최종 귀착은 재무 목표."
      },
      {
        "type": "li",
        "text": "재무: 매출, 이익률, 현금, 원가. 고객: 만족, 적시공급, 리드타임. 내부: 사이클타임, 신제품, 단위원가. 학습: 직원 만족·역량.",
        "keyword": null
      },
      {
        "type": "li",
        "text": "기존 ROI 평가와 차이: 재무·단기·통제 vs 균형·장기·전략 소통. 결과와 과정, 내부와 외부, 과거와 미래를 같이 봄.",
        "keyword": null
      },
      {
        "type": "li",
        "text": "MBO: 상사와 합의한 측정 가능 목표로 관리(드러커). KPI: 그 목표의 핵심 지표. OKR: 목표와 핵심결과를 추적하는 실행 틀.",
        "keyword": null
      },
      {
        "type": "p",
        "text": "IT-BSC 4관점: 회사 기여, 사용자(고객) 지향, 운영 탁월, 미래 지향. 경영 BSC가 사업 성과라면 IT-BSC는 IT 조직이 사업에 기여하는 성과."
      },
      {
        "type": "p",
        "text": "OKR 원칙: 집중, 정렬, 추적, 도전. 구성: Objective + Key Result. KR: SMART. KPI와 비교하면 OKR은 분기·주간 피드백·정성+정량·전사 공유, KPI는 측정 주기·정량·프로젝트 범위에 가까움. 실무: 둘을 섞음."
      },
      {
        "type": "h3",
        "text": "8. BPR (Business Process Reengineering)과 PI (Process Innovation)"
      },
      {
        "type": "p",
        "text": "BPR: 핵심 프로세스를 근본적(Fundamental)·급진적(Radical)으로 재설계해 비용·품질·서비스·속도에서 극적인 향상을 노리는 경영기법(해머). 정보기술 활용이 거의 필수."
      },
      {
        "type": "li",
        "text": "절차: 비전 → AS-IS → TO-BE → 실행. 성공요인: 최고경영자, 공감대, CSF 연계, 재설계의 폭과 깊이, 고객 지향. PI: 기존 프로세스를 인정한 채 점진적·지속적으로 혁신함. BPR의 투자·교육·변화관리 부담 때문에 더 넓은 개념으로 확장된 것으로 설명함.",
        "keyword": null
      },
      {
        "type": "li",
        "text": "비교: PI는 점진·3~5년·톱다운과 바텀업·전략 이슈에서 출발·위험 낮음. BPR: 백지·6~12개월·톱다운·급진·위험 높음. 성과축: PI가 고객·사람·디지털, BPR이 비용·품질·서비스·시간.",
        "keyword": null
      },
      {
        "type": "li",
        "text": "ISP vs BPR: ISP는 중장기 정보화 계획(IT 전문가), BPR은 특정 프로세스의 단기 혁신(경영·BA). 보완: BPR로 프로세스를 재설계하고 ISP로 그걸 받치는 정보화 과제를 로드맵에 넣는 것.",
        "keyword": null
      },
      {
        "type": "h3",
        "text": "9. 데이터 마이닝"
      },
      {
        "type": "p",
        "text": "대용량 데이터에서 관계·패턴을 찾아 모형화하고, 의사결정에 쓸 정보로 바꾸는 과정. KDD와 같이 쓰임. 지식집약적이고, 반복·대화·증분(3I)이며, 귀납(패턴 발견)에 초점을 둠."
      },
      {
        "type": "li",
        "text": "통계와 차이: 마이닝은 가설 없이 패턴·예측(전수에 가까운 대용량). 통계: 가설 검증과 표본 추론.",
        "keyword": null
      },
      {
        "type": "li",
        "text": "서술(과거·현재): 연관, 연속(시퀀스), 군집. 예측(미래): 회귀, 분류, 의사결정나무.",
        "keyword": null
      },
      {
        "type": "li",
        "text": "분류: 정답이 있는 지도학습, 군집은 정답 없는 비지도학습.",
        "keyword": null
      },
      {
        "type": "li",
        "text": "절차: 선택(샘플) → 전처리(정제) → 변환 → 모델링 → 평가 → 시각화.",
        "keyword": null
      },
      {
        "type": "li",
        "text": "OLAP과 차이: 마이닝은 컴퓨터가 가설을 찾아 검증(발견형). OLAP: 사용자가 가설을 검증(다차원 조회). 둘 다 DW를 씀.",
        "keyword": null
      },
      {
        "type": "p",
        "text": "연관규칙: 지지도 = P(A∩B) 전체 거래 중 A·B 동시 비율. 신뢰도 = P(B|A) = P(A∩B)/P(A). 향상도 = 신뢰도/P(B). 향상도 1이면 독립, 1보다 크면 양의 상관, 1보다 작으면 음의 상관."
      },
      {
        "type": "h3",
        "text": "방법론"
      },
      {
        "type": "li",
        "text": "SEMMA(SAS): Sample, Explore, Modify, Model, Assess. 기술 관점. 도구: Enterprise Miner.",
        "keyword": null
      },
      {
        "type": "li",
        "text": "CRISP-DM: 비즈니스 이해 → 데이터 이해 → 데이터 준비 → 모델링 → 평가 → 전개. 비즈니스 문제에서 출발. SPSS Modeler. 업계에서 더 자주 기준이 됨.",
        "keyword": null
      },
      {
        "type": "li",
        "text": "KDD: 선택, 전처리, 변환, 마이닝, 해석.",
        "keyword": null
      },
      {
        "type": "li",
        "text": "이상치: 범위 밖 극단값. 평균·표준편차: 민감하고 중앙값은 덜 민감. 검출: 관찰, 통계, 시각화, K-means, 마할라노비스, LoF, Isolation Forest.",
        "keyword": null
      },
      {
        "type": "li",
        "text": "결측치: 관측되지 않은 값. 전처리에서 제거·대체·모델을 고름. 노이즈: 측정 오차.",
        "keyword": null
      },
      {
        "type": "h3",
        "text": "프로세스·오피니언·텍스트"
      },
      {
        "type": "p",
        "text": "프로세스 마이닝은 이벤트 로그에서 실제 수행 모델을 발견(Discovery)·적합 검사(Conformance)·향상(Enhancement)함. 인터뷰 AS-IS의 한계를 줄임. BPM: 프로세스를 설계·운영하는 톱다운, RPA는 화면 조작을 모방하는 자동화, 프로세스 마이닝은 로그 기반 바텀업 진단. RPA 전에 구간과 타당성을 가릴 때 씀."
      },
      {
        "type": "p",
        "text": "오피니언 마이닝은 리뷰·SNS에서 의견 문장을 가려 긍정·부정과 강도를 점수화함. 절차: 사실/의견 분리 → 극성 → 강도 → 점수. 텍스트 마이닝은 비정형 문서에서 새로운 정보를 추출(수집 → 전처리 → 분석 → 해석). 웹 마이닝은 방문·검색 로그의 행동 패턴."
      },
      {
        "type": "li",
        "text": "정형 마이닝: 분류·군집·연관, 목적-준비-가공-적용-검증. 비정형: 텍스트·SNA·웹, 수집-전처리-패턴-전략. 평가: 혼동행렬, 정밀도, 재현율.",
        "keyword": null
      },
      {
        "type": "h3",
        "text": "신경망"
      },
      {
        "type": "p",
        "text": "뉴런 연결 강도를 학습으로 바꾸는 모델. 입력층·은닉층·출력층, 가중치, 활성화함수(시그모이드 등). 순전파와 역전파. 특징: 예제 학습, 일반화, 연상, 결함 허용."
      },
      {
        "type": "li",
        "text": "퍼셉트론: 단층 선형 분리만 됨. XOR: 선형 분리 불가라 단층으로 학습되지 않고 은닉층이 필요함.",
        "keyword": null
      },
      {
        "type": "li",
        "text": "지도학습(정답 있음), 비지도(군집·SOM·ICA), 준지도, 강화학습(보상).",
        "keyword": null
      },
      {
        "type": "h3",
        "text": "10. 전략 수립 도구"
      },
      {
        "type": "p",
        "text": "경영전략: 희소 자원을 배분해 경쟁우위를 만들고 유지하는 중장기 의사결정. 절차: 현황(사업구조, 외부, 내부) → 전략 과제·비전·목표 → 사업·기능별 전략 → 실행과 피드백."
      },
      {
        "type": "li",
        "text": "거시 PEST(정치·경제·사회·기술), 산업 5 Forces, 미시 3C/4C, 종합 SWOT. 조건이 문제의 핵심. PEST: 거시 변화가 민감할 때, 3C는 고객·경쟁 차별화가 필요할 때, SWOT는 목표가 분명하고 내외 정보가 객관적일 때.",
        "keyword": null
      },
      {
        "type": "li",
        "text": "5 Forces(포터): 잠재 진입, 기존 경쟁, 구매자 교섭력, 공급자 교섭력, 대체재. 산업 수익성을 설명함.",
        "keyword": null
      },
      {
        "type": "li",
        "text": "7S(매킨지): Strategy, Shared Value, Structure, System, Staff, Skill, Style. 내부 정렬 진단.",
        "keyword": null
      },
      {
        "type": "li",
        "text": "VRIO: Value, Rarity, Imitability, Organization. 자원이 지속 우위가 되는지.",
        "keyword": null
      },
      {
        "type": "li",
        "text": "Value Chain: 본원활동과 지원활동의 원가·차별화. 1985 포터.",
        "keyword": null
      },
      {
        "type": "li",
        "text": "SWOT 전략: SO 공격, ST 방어, WO 전환, WT 생존·출구.",
        "keyword": null
      },
      {
        "type": "li",
        "text": "3C: Customer, Competitor, Company. 4C: Circumstance(환경)를 더함.",
        "keyword": null
      },
      {
        "type": "li",
        "text": "MECE: 겹치지 않고 빠짐없이 합이 전체. LISS: 겹치지 않되 중요한 부분집합만 깊게. 전부 분석 vs 핵심만 분석.",
        "keyword": null
      },
      {
        "type": "li",
        "text": "CPND: Contents, Platform, Network, Device. 생태계 전략(OTT, MVNO 등)을 가를 때.",
        "keyword": null
      },
      {
        "type": "li",
        "text": "STP: Segmentation → Targeting → Positioning. 필립 코틀러.",
        "keyword": null
      },
      {
        "type": "li",
        "text": "TAM: 제품이 해당 산업을 100% 점유할 때 시장. SAM: 지역·규제·경쟁을 뺀 도달 가능 시장. SOM: 단기(약 0.5~2년)에 실제 가져올 시장.",
        "keyword": null
      },
      {
        "type": "li",
        "text": "디자인 씽킹: 공감 → 문제정의 → 아이디어 → 프로토타입 → 시험. 핵심: Desirability, Feasibility, Viability. 공감이 먼저인 이유: 잘못된 완성품의 스노우볼을 막기 때문. 도구: 공감지도, 페르소나, 고객여정지도(시간 순 터치포인트와 통증점).",
        "keyword": null
      },
      {
        "type": "li",
        "text": "BMC 9블록: 고객군, 가치제안, 채널, 고객관계, 수익, 핵심활동, 핵심자원, 핵심파트너, 비용구조. 앞 5개가 가치 전달, 뒤 4개가 가치 생산.",
        "keyword": null
      },
      {
        "type": "li",
        "text": "AHP: 계층화 → 쌍대비교(1~9) → 부분 우선순위 → 일관성 → 종합 우선순위. 정성 기준이 여러 개인 대안 선정. 원칙: 계층·우선순위·일관성.",
        "keyword": null
      },
      {
        "type": "li",
        "text": "TRIZ: 특수 문제를 일반 문제로 바꾸고 모순을 제거해 이상해를 찾음. 관리적 모순(원하나 방법을 모름), 기술적 모순(한 특성이 좋아지면 다른 특성이 나빠짐, 40 발명원리), 물리적 모순(한 변수가 상반된 두 값을 동시에, 분리 원리).",
        "keyword": null
      },
      {
        "type": "li",
        "text": "VDT: 최종 목표에 영향을 주는 동인을 인과 트리로 그림. 원칙: MECE와 인과. 쓰임: CSF·KPI 도출 후 BSC 전략맵.",
        "keyword": null
      },
      {
        "type": "li",
        "text": "BABOK: 비즈니스 분석 지식체계. 요구 도출·분석·검증의 공통 기법 모음(인터뷰, 워크숍, 유스케이스, 프로토타입, SWOT 등).",
        "keyword": null
      },
      {
        "type": "li",
        "text": "개방형 혁신: 연구부터 사업화까지 외부 자원을 열어 비용과 성공확률을 개선. 내향(기술구매, 공동연구, M&A, 공모)과 외향(기술판매, 분사). 오픈소스: 그 도구이지 목적은 다름. 오픈소스: 구현 비용까지. 개방형 혁신: 사업 모델까지.",
        "keyword": null
      },
      {
        "type": "li",
        "text": "추격자(Fast Follower): 검증된 시장을 빠르게 모방, 위험 낮음, 타이밍이 생명. 선도자(First Mover): 시장 창출, TOM, 위험 큼. 병행자(Parallel Mover): 여러 가능성을 열어 두었다가 방향이 정해지면 집중. 선도만으로는 다른 패러다임에 시장을 잃을 수 있음.",
        "keyword": null
      },
      {
        "type": "li",
        "text": "Outside-in: 외부 기술을 들여옴(라이선스 인, 공동연구, JV, M&A). Inside-out: 내부 기술을 밖으로(라이선스 아웃, 스핀아웃, 공개).",
        "keyword": null
      },
      {
        "type": "p",
        "text": "IT 컨설팅은 정보화 전략·설계·개발·운영 자문. 영역: 전략, 아키텍처, 운영, 구현. 업무: ISP, PI, 수준진단·감리·효과분석·교육."
      }
    ]
  },
  {
    "id": "s3",
    "title": "II. 정보시스템 구축",
    "blocks": [
      {
        "type": "h3",
        "text": "1. ERP (Enterprise Resource Planning), XRP (Extended ERP), ERP II, Composable ERP"
      },
      {
        "type": "p",
        "text": "ERP: 구매·판매·생산·설비·인사 등 경영자원을 한 체계로 통합해 경쟁력을 높이는 기간계. 베스트 프랙티스가 들어 있어 BPR을 지원하고, 모듈 선택 구축이 됨."
      },
      {
        "type": "li",
        "text": "영역: 영업, 생산, 자재·구매, 무역, 원가, 회계, 인사·급여.",
        "keyword": null
      },
      {
        "type": "li",
        "text": "구축: 빅뱅(일괄, 빠르나 위험), 기능별 단계, 사업장별 단계.",
        "keyword": null
      },
      {
        "type": "p",
        "text": "XRP(확장 ERP)는 내부 통합에 그친 ERP를 영업·마케팅·협력사·고객까지 넓힌 것. ERP II는 웹 아키텍처로 기업 간 협업 프로세스를 묶음. 포지션: Buy(SCM) - Inside(ERP) - Sell(CRM), 위를 SEM이 봄."
      },
      {
        "type": "p",
        "text": "Composable ERP는 마이크로서비스를 조립해 ERP를 구성함. 모듈 교체, 느슨한 결합, 공급사 종속성 감소, 독립 업그레이드. 전통 ERP는 단일체·고정 라이선스·변경이 느림. 계층: 핵심 모듈, 조립 서비스, API·이벤트 통합, 오케스트레이션(프로세스·규칙 엔진), UI, 데이터, 보안."
      },
      {
        "type": "h3",
        "text": "2. CRM (Customer Relationship Management), e/m/g-CRM (electronic·mobile·geographic), VRM (Vendor Relationship Management)"
      },
      {
        "type": "p",
        "text": "CRM: 고객 이해에 기반해 원하는 제품·서비스를 지속 제공하고 고객생애가치(LTV)를 극대화하는 마케팅 관리. 배경: 파레토(소수 고객이 다수 수익), 경쟁, 고객 기대, IT, 매스마케팅의 비효율."
      },
      {
        "type": "li",
        "text": "운영 CRM: 접점의 영업·마케팅·서비스 자동화, SFA, 캠페인.",
        "keyword": null
      },
      {
        "type": "li",
        "text": "분석 CRM: DW·마이닝·OLAP, RFM(최근성·빈도·금액).",
        "keyword": null
      },
      {
        "type": "li",
        "text": "협업 CRM: 콜센터, 모바일, 채널 일원화.",
        "keyword": null
      },
      {
        "type": "li",
        "text": "기술 진화: 보고(대시보드) → 분석(패턴) → 예측(다음 행동 모델).",
        "keyword": null
      },
      {
        "type": "li",
        "text": "e-CRM: 웹 방문 고객, 실시간, 쌍방향. m-CRM: 모바일 단말. g-CRM: GIS·위치·상권을 결합, 시공간 정보가 필수.",
        "keyword": null
      },
      {
        "type": "li",
        "text": "DB 마케팅은 한정 접점·단기·매스. CRM: 전사 접점·장기·LTV·DW.",
        "keyword": null
      },
      {
        "type": "p",
        "text": "VRM: 개인이 기업에 줄 정보와 선호를 스스로 관리하고, 조건에 맞는 제안을 고르는 역방향. 주체: 개인, 도구는 개인 데이터 저장·분석과 제안요청. CRM과 연동하면 기업은 직접 니즈를 받고 개인은 통제권을 유지함."
      },
      {
        "type": "h3",
        "text": "3. SCM (Supply Chain Management), CPFR (Collaborative Planning, Forecasting and Replenishment), 채찍효과"
      },
      {
        "type": "p",
        "text": "공급망: 공급-제조-물류-유통-소비를 잇는 물자·정보·자금 흐름. SCM: 그 사슬 전체를 통합해 수익과 고객서비스를 높이는 경영."
      },
      {
        "type": "li",
        "text": "SCP 계획(수요·제조·재고·유통·운송), SCE 실행(주문·생산·창고 WMS·운송 TMS·역물류), SCPM(계획과 실행의 갭, 성과·모니터링).",
        "keyword": null
      },
      {
        "type": "li",
        "text": "기술: ERP, EC, DW, EDI, EFT, RFID, ABC.",
        "keyword": null
      },
      {
        "type": "p",
        "text": "채찍효과: 최종 수요의 작은 변동이 상위 공급으로 갈수록 증폭돼 과잉·과소 생산이 나는 현상. 대응: 수요 정보 공유, 리드타임 단축, 파트너십, CPFR."
      },
      {
        "type": "p",
        "text": "CPFR: 판매·재고를 공유해 제조와 유통이 같이 예측·계획·보충하는 프로세스. 안전재고 = (일 최대판매 × 최대 리드타임) − (일 평균판매 × 평균 리드타임). 적정재고: 여기에 비용까지 본 재고."
      },
      {
        "type": "link",
        "text": "Gold Plating은 요구에 없는 기능을 넣어 일정·원가를 넘기는 현상. 방지: 기준선·요구추적·변경요청, PMO, 정량 비기능 목표, 리뷰. Scope Creep은 기준선 관리 실패로 범위가 새는 것."
      },
      {
        "type": "h3",
        "text": "4. PRM (Partner Relationship Management), PLM (Product Lifecycle Management), MES (Manufacturing Execution System), POP (Point of Production), ALM (Application Lifecycle Management)"
      },
      {
        "type": "p",
        "text": "PRM: 협력 파트너의 영업·마케팅·서비스를 관리해 간접 판매 수익을 높이는 협업. CRM이 최종 고객 직접 판매라면 PRM은 채널 파트너. 진화: CRM → PRM → ERM."
      },
      {
        "type": "p",
        "text": "PLM: 개념 설계부터 폐기까지 제품 정의 정보를 생성·관리·배포하는 솔루션. 부품정보, 제품 구성·BOM, 도면·기술문서, 프로젝트, 설계 협업, 설계 변경. CAD → PDM → PLM."
      },
      {
        "type": "p",
        "text": "MES: 작업일정·지시·품질·실적을 다루는 현장 실행 시스템. ERP가 자원 계획, SCM이 공급망, CRM이 고객이라면 MES는 공정. 광의로: 주문부터 고객 지원까지 포함할 수 있음."
      },
      {
        "type": "p",
        "text": "POP: 생산이 일어나는 시점에 정보를 잡아 실적·재고·품질을 보여주는 생산시점관리. 페이퍼리스와 실시간 모니터링이 목적."
      },
      {
        "type": "p",
        "text": "ALM: 요구부터 개발·빌드·테스트·배포·이슈를 한 흐름으로 자동화함. 표준 개발환경, 자동 테스트, 코딩 규칙, 소스·브랜치, 데일리 빌드."
      }
    ]
  },
  {
    "id": "s4",
    "title": "III. 전사 통합 시스템",
    "blocks": [
      {
        "type": "h3",
        "text": "1. EIP (Enterprise Information Portal), EAI (Enterprise Application Integration), ESB (Enterprise Service Bus)"
      },
      {
        "type": "p",
        "text": "EIP(Enterprise Information Portal)는 단일 웹 관문으로 내외부 정보를 모아 개인화·검색·협업·SSO로 의사결정 정보를 줌. 확장 개념으로 ECP(협업), EEP(전문가), EKP(지식)가 있음. 같은 약어의 Enterprise Integration Patterns는메시징 통합 패턴 모음이니 문제 문맥을 보고 가름."
      },
      {
        "type": "p",
        "text": "EAI: 미들웨어로 비즈니스 로직 중심 내부 애플리케이션을 통합함. 구성요소: 플랫폼(메시징·트랜잭션), 어댑터, 브로커(포맷 변환), 워크플로."
      },
      {
        "type": "li",
        "text": "통합 단계: 플랫폼 → 데이터 → 애플리케이션 → 프로세스 → 협업.",
        "keyword": null
      },
      {
        "type": "li",
        "text": "방식: Point-to-Point(단순, 연결 폭증), Hub&Spoke(중앙, 허브 장애가 전멸), Messaging Bus(확장·대량), Hybrid, Peer-to-Peer.",
        "keyword": null
      },
      {
        "type": "li",
        "text": "EAI vs B2Bi: 내부·LAN·단기 vs 기업간·인터넷·프로세스 협업.",
        "keyword": null
      },
      {
        "type": "li",
        "text": "EAI vs ESB: 허브·앱 통합 vs 버스·서비스 연계. ESB가 SOA에 가깝고 유연하나 네트워크에 의존함.",
        "keyword": null
      },
      {
        "type": "h3",
        "text": "2. BI (Business Intelligence), DW (Data Warehouse), OLAP (Online Analytical Processing)"
      },
      {
        "type": "p",
        "text": "BI: 마케팅·영업·서비스의 의사결정 정보를 통합해 분석·배포하는 체계. 사용자가 직접 탐색함. 요소: 추출·변환, DW/마트 관리, OLAP·마이닝, 배포, 애플리케이션 통합."
      },
      {
        "type": "li",
        "text": "BI 1.0 사후 분석·배치·내부 데이터·의사결정자. 2.0 이벤트 감지·실시간·외부 데이터·전사. 3.0 예측과 실행·빅데이터·모든 사용자. CEP·분산처리가 핵심 기능으로 붙음.",
        "keyword": null
      },
      {
        "type": "li",
        "text": "BAM: 지금 프로세스 상태를 감시하고 경보함. BI: 결과와 추세, BAM은 진행 중 병목.",
        "keyword": null
      },
      {
        "type": "p",
        "text": "DW 4특성: 주제 지향, 통합, 시계열(시간 가변), 비휘발. ETL로 운영계를 정제해 적재함."
      },
      {
        "type": "li",
        "text": "ODS: 운영 일자를 ER로 담는 중간 저장, 사용자가 직접 분석하지 않음. Data Mart: 부서·주제 단위 소규모. 메타데이터: 데이터를 설명하는 데이터.",
        "keyword": null
      },
      {
        "type": "li",
        "text": "구축: Top-down(전사 DW 후 마트, 비용·정합), Bottom-up(마트 후 통합, 빠르나 통합 위험), Hybrid.",
        "keyword": null
      },
      {
        "type": "p",
        "text": "OLAP: 사용자가 다차원 정보를 대화식으로 끄집어 의사결정에 쓰는 처리. 큐브, 차원, 계층, 측정값, 슬라이싱, 다이싱, 드릴다운·업·스루, 피벗."
      },
      {
        "type": "li",
        "text": "ROLAP: 관계형에 SQL로 질의, 유연·대용량, 집계는 느릴 수 있음. MOLAP: 다차원 DB에 사전 집계, 빠름, 적재·용량 부담. HOLAP: 둘을 혼합. DOLAP: 클라이언트 로컬.",
        "keyword": null
      },
      {
        "type": "li",
        "text": "OLTP vs OLAP: 짧은 갱신 트랜잭션·동시성·현재값 vs 대량 읽기·분석·이력. 결과: 상태 변경 vs 집계 뷰.",
        "keyword": null
      },
      {
        "type": "h3",
        "text": "3. BPM (Business Process Management), PDCA (Plan-Do-Check-Act), IRM (Information Resource Management), ILM (Information Lifecycle Management)"
      },
      {
        "type": "p",
        "text": "BPM: 프로세스 자동화·통합·최적화로 업무를 효율화하는 기반. 가시성과 통제가 목적. 기술: 모델링, BPA, BRE(규칙), BAM, EAI, 워크플로."
      },
      {
        "type": "li",
        "text": "접근: 워크플로형(사람·문서·비정형), EAI형(시스템 간 정형 업무), SOA형(서비스로 민첩, RTE와 결합).",
        "keyword": null
      },
      {
        "type": "li",
        "text": "PI와 비교: BPM은 선정 프로세스의 점진·반복·현업 주도. PI: 전사 혁신의 급진·일회·TFT.",
        "keyword": null
      },
      {
        "type": "p",
        "text": "PDCA: Plan-Do-Check-Act를 반복하는 개선 고리(슈하트, 데밍). BPM·ISO 경영시스템의 공통 골격."
      },
      {
        "type": "p",
        "text": "IRM: 정보와 관련 자원(장비, 인력, 예산, 기술)을 전략적으로 통합 관리하는 활동. 요소: 정보·기술·분산·기능·전략 관리. EA/ITA의 운영 관리 축으로 보고, CIO와 최고경영자 후원이 전제."
      },
      {
        "type": "p",
        "text": "ILM: 생성-저장-활용-폐기까지 정보를 비즈니스 가치에 맞춰 관리함. 가치가 높은 최근 데이터와 낮은 과거 데이터를 다른 매체에 둠. 기술: 가상화, 백업, DAS/NAS/SAN, 아카이브, 보존 주기. HSM: 계층 스토리지 이동에 가깝고 보안·전략 관점은 ILM이 더 넓음."
      }
    ]
  },
  {
    "id": "s5",
    "title": "IV. 아웃소싱과 IT 서비스 관리",
    "blocks": [
      {
        "type": "h3",
        "text": "1. RFI (Request for Information), RFP (Request for Proposal), RFQ (Request for Quotation), 제안서"
      },
      {
        "type": "li",
        "text": "RFI: 본 RFP 전 정보 요청. 복수 업체에 능력과 과업 윤곽을 물어 후보와 요구를 다듬음.",
        "keyword": null
      },
      {
        "type": "li",
        "text": "RFP: 목표, 범위, 요구, 평가기준을 명시한 제안요청. 채택 후보에게 보냄.",
        "keyword": null
      },
      {
        "type": "li",
        "text": "RFQ: 가격·수량 견적 요청. 요구가 이미 분명할 때.",
        "keyword": null
      },
      {
        "type": "li",
        "text": "Proposal: 공급자가 수행하는 방법·경험·일정을 담아 내는 문서. 수주의 기준이고 계약과 정합해야 함.",
        "keyword": null
      },
      {
        "type": "p",
        "text": "흐름: RFI → RFP/RFQ → 제안 → 평가 → 선정·협약. 조달 계약 유형은 고정가, 원가정산, T&M."
      },
      {
        "type": "h3",
        "text": "2. SOW (Statement of Work), SLM (Service Level Management), SLA (Service Level Agreement), OLA (Operational Level Agreement)"
      },
      {
        "type": "p",
        "text": "SOW: 서비스·작업 범위와 산출을 적은 작업명세서. SLA의 세부 과업."
      },
      {
        "type": "p",
        "text": "SLM: 사용자 기대에 맞게 서비스 수준을 계획·측정·개선하는 관리 프로세스. 순환: 계획 → SLA 작성 → 운영 → 개선."
      },
      {
        "type": "li",
        "text": "구성요소: 서비스 카탈로그, SLA, OLA, 품질계획, 수준 보고, 측정 엔진.",
        "keyword": null
      },
      {
        "type": "p",
        "text": "SLA: 제공자와 고객이 서비스 수준을 정량 합의한 계약. 구성: 기본계약, SOW, 카탈로그, 지표, 목표(SLO), 측정방법, 보고, 보상(페널티·인센티브)."
      },
      {
        "type": "li",
        "text": "OLA: 공급자 내부 부서 간 운영 합의. 고객 계약(SLA)을 지키려면 내부 약속(OLA)이 먼저.",
        "keyword": null
      },
      {
        "type": "li",
        "text": "SLA 절차: 목적·범위 → 인식조사 → 카탈로그 → 측정항목 → 구조(서비스별/고객별/복합) → 요구합의 → 문서화 → 모니터링 → 초기 기준선(과거 실적) → 운영·연간 재설정·개선계획(SIP).",
        "keyword": null
      },
      {
        "type": "li",
        "text": "지표 예: 가동률 = (1 − 장애시간/서비스시간)×100, 동일장애율, SR 적기처리율, 네트워크 가동률. 목표·최소·가중치를 둠.",
        "keyword": null
      },
      {
        "type": "p",
        "text": "클라우드 SLA는 가용성(예: 99.5% 이상, 제공자 통제 밖 망·불가항력 제외), 백업준수율, 고객요청 처리율, 미달 시위약, 보안 인증 제시를 명시함. 금융권: 데이터 위치, 감사권, 개인정보, 이전 계획이 추가됨."
      },
      {
        "type": "h3",
        "text": "3. MTTF (Mean Time To Failure), MTBF (Mean Time Between Failures), MTTR (Mean Time To Repair)"
      },
      {
        "type": "p",
        "text": "MTTF: 수리 후 다음 고장까지 정상 동작 시간. MTTR: 고장 후 복구 시간. MTBF: 고장 간격 = MTTF+MTTR로 설명하는 교재 암기(고장 시작부터 다음 고장까지)."
      },
      {
        "type": "p",
        "text": "가용도 = MTTF / (MTTF+MTTR) = MTTF/MTBF. 99.9%, 99.99%, 99.999%는 허용 다운타임이 급격히 줄어듦. SLA 가용성, 설계 품질, HA/FT 선택의 기준."
      },
      {
        "type": "h3",
        "text": "4. ITO (IT Outsourcing)와 크라우드소싱"
      },
      {
        "type": "p",
        "text": "ITO: 가치사슬에서 핵심은 내부에 두고 비전략 정보기술 활동을 전문 업체에 위탁하는 것. 프레임: 사전(ISP·대상 선정) → 실행(RFI/RFP, SLA) → 계약관리(SLM, 성과, 위약)."
      },
      {
        "type": "li",
        "text": "유형: 일괄(책임 명확, 종속), 선택적(경쟁·품질, 책임 분산), 자회사(소통, 안일·비용), 코소싱(기획은 발주자, 수행은 공급자, 갭 위험).",
        "keyword": null
      },
      {
        "type": "li",
        "text": "절차: 목표 → 제공자 선정 → 협상·SLA → 전환 → 운영·성과 → 갱신 또는 인소싱.",
        "keyword": null
      },
      {
        "type": "li",
        "text": "위험: 통제·측정, 보안, 업종 이해 부족, 전환비용, 종속, 평가 공정성. 대응: 파일럿, 보안수준 명시, 유사 경험 업체, 핵심 인력 잔류, KPI·BSC.",
        "keyword": null
      },
      {
        "type": "p",
        "text": "크라우드소싱: 대중에게 과제를 열고 기여와 수익을 나누는 방식. 아웃소싱: 지정 공급자·계약, 크라우드소싱은 불특정 다수·개방·집단지성."
      },
      {
        "type": "h3",
        "text": "5. ITIL (Information Technology Infrastructure Library), eSCM (eSourcing Capability Model), ISO 20000 (IT 서비스 관리), ITSM (IT Service Management), MSP (Managed Service Provider), MRO (Maintenance, Repair and Operation)"
      },
      {
        "type": "p",
        "text": "ITIL 2: 서비스 지원(인시던트, 문제, 변경, 릴리스, 구성)과 서비스 제공(SLA, 가용성, 용량, 재무, IT 연속성)."
      },
      {
        "type": "p",
        "text": "ITIL 3: 수명주기. 전략 → 설계 → 전환 → 운영 → 지속적 개선."
      },
      {
        "type": "p",
        "text": "ITIL 4: 서비스 가치 시스템(SVS). 가이딩 원칙, 거버넌스, 서비스 가치 사슬, 프랙티스, 지속 개선. 가치 사슬 활동은 Plan, Improve, Engage, Design & transition, Obtain/build, Deliver & support. 4차원: 조직과 사람, 정보와 기술, 파트너와 공급자, 가치 흐름과 프로세스. 프로세스가 아니라 가치 공동창출로 관점이 이동함."
      },
      {
        "type": "p",
        "text": "eSCM: 소싱 역량을 발주·제공 양쪽에서 평가하는 모델. ISO/IEC 20000은 IT 서비스 관리의 국제 요구사항(사실상 표준 ITIL을 공식 인증 체계로 연결). PDCA로 설계·전환·제공·개선을 요구함. 133회: 이 기준으로 ITSM의설계·구축·전환 활동을 물음."
      },
      {
        "type": "p",
        "text": "ITSM: 기술 스택이 아니라 서비스로 IT를 운영하는 체계. 성공 요건은 경영자 후원, 서비스 카탈로그, SLA/SLM, 프로세스 책임자, 도구, 지속 개선."
      },
      {
        "type": "p",
        "text": "MSP: 인프라 감시·관리를 대행하는 관리형 서비스 사업자. CSP: 클라우드 서비스 제공자. MRO: 생산에 직접 들어가지 않는 유지·수리·운영 자재의 구매로, 간접재 전자조달과 연결됨."
      }
    ]
  },
  {
    "id": "s6",
    "title": "V. 업무연속, 거버넌스, 정책",
    "blocks": [
      {
        "type": "h3",
        "text": "1. BCP (Business Continuity Plan), BCM (Business Continuity Management), ISO 22301 (업무연속성 경영시스템)"
      },
      {
        "type": "p",
        "text": "BCP: 재난 시 IT 복구만이 아니라 사람·업무·자산·커뮤니케이션을 포함해 비즈니스가 멈추지 않게 미리 세운 계획. 예방이 본류."
      },
      {
        "type": "li",
        "text": "절차 암기: 착수 → 위험평가(RA) → 업무영향분석(BIA) → 전략 → 대응·복구 설계 → 문서화 → 모의훈련 → 유지. 검토 축은 유효·적합·적절·품질.",
        "keyword": null
      },
      {
        "type": "li",
        "text": "구성요소: DRS(IT 복구), 업무복구, BIA, 백업, 대응계획. 예방 / 대응·복구 / 유지 / 훈련.",
        "keyword": null
      },
      {
        "type": "li",
        "text": "BCP vs DRP: BCP는 사업 단위가 핵심 업무 지속(사람·장소·문서 포함). DRP: IT가 시스템·데이터를 정해진 순서로 복구하는 절차서. DRP: BCP의 IT 부분집합.",
        "keyword": null
      },
      {
        "type": "p",
        "text": "ISO 22301은 업무연속성 경영시스템 요구사항. 조직 상황, 리더십, 계획, 지원, 운영(BIA·RA·전략·훈련), 성과평가, 개선. PDCA."
      },
      {
        "type": "p",
        "text": "팬데믹 BCP는 시설 파괴보다 장기간 인력 공백이 핵심. 핵심 기능을 수개월 유지하도록 출근·대체·비대면 계획을 둠."
      },
      {
        "type": "h3",
        "text": "2. DRP (Disaster Recovery Plan), DRS (Disaster Recovery System), 지표"
      },
      {
        "type": "p",
        "text": "DRP: 재해 시 혼선 없이 복구 순서·역할대로 IT를 되돌리는 계획서. 문서: 구성·운영절차, 시스템 복구, 업무 복구, 비상연락, 훈련 시나리오·평가."
      },
      {
        "type": "li",
        "text": "센터 이용 형태: 독자, 상호이용, 공동이용, 외부위탁.",
        "keyword": null
      },
      {
        "type": "li",
        "text": "기술 형태: Mirror(RTO≈0, 동기 복제, 비용 최대), Hot(수 시간, 장비 대기), Warm(수 일, 부분 장비), Cold(수 주, 장소·설비 위주, 비용 최소).",
        "keyword": null
      },
      {
        "type": "li",
        "text": "RTO: 서비스 복구까지 허용 시간. RPO: 잃어버려도 되는 데이터 시간(복구 시점). RSO: 복구 대상 범위. RCO: 이해관계자 커뮤니케이션·통신 복구 목표. BCO: 백업센터 형태 목표.",
        "keyword": null
      },
      {
        "type": "li",
        "text": "BIA: 중단 영향을 정량·정성으로 보아 복구 등급과 RTO/RPO를 정함. 절차: 업무 식별 → 영향 산정 → 우선순위 → 복구 전략.",
        "keyword": null
      },
      {
        "type": "li",
        "text": "거리: 동일 재해권을 피하려면 원격이 원칙. 국내 지진 위험을 반영해 기관이 입지를 정함. 복제: 동기(RPO≈0, 거리·지연 제약)와 비동기(지연 허용, RPO>0).",
        "keyword": null
      },
      {
        "type": "li",
        "text": "후향 복구: 체크포인트로 되돌려 재수행. 추가 장비는 적고 시간은 긺. 전향 복구: 되감지 않고 중복·자가검사로 계속 진행. 시간: 짧고 장비가 듦.",
        "keyword": null
      },
      {
        "type": "li",
        "text": "Resilience: 부분 장애에도 서비스 수준을 유지하는 능력. Contingency plan: 식별된 위험의 사전 조치 계획.",
        "keyword": null
      },
      {
        "type": "p",
        "text": "DRaaS: 복구를 클라우드 서비스로 쓰는 모델."
      },
      {
        "type": "h3",
        "text": "3. IT 거버넌스, COBIT (Control Objectives for Information and Related Technologies), ESG (Environmental, Social, Governance), 컴플라이언스"
      },
      {
        "type": "p",
        "text": "IT 거버넌스는 IT가 사업 목표와 정렬되도록 평가(Evaluate)·지시(Direct)·모니터링(Monitor)하는 의사결정과 책임 체계. 구성요소: 원칙·정책, 조직(이사회, CIO, 위원회), 프로세스, 성과 측정으로 답함."
      },
      {
        "type": "li",
        "text": "효과 지표: 전략 정렬, 투자 대비 가치, 위험, 서비스 수준, 컴플라이언스. 방법: 성숙도, BSC/IT-BSC, KPI, 감사, COBIT 목표 지표.",
        "keyword": null
      },
      {
        "type": "li",
        "text": "COBIT: IT 통제 목표 프레임워크. 거버넌스와 관리 목적을 나눠 목표-정렬-성과를 연결. Val IT는 투자 가치, ISO/IEC 38500은 거버넌스 원칙(책임, 전략, 획득, 성과, 적합성, 인간 행동)의 국제표준.",
        "keyword": null
      },
      {
        "type": "p",
        "text": "ESG: 환경·사회·지배구조를 경영 의사결정과 공시에 넣는 것. E: 배출, 에너지, 폐기. S: 노동, 안전, 다양성, 개인정보, 지역. G: 이사회, 윤리, 투명성, 반부패. IT 지원은 데이터 수집·공시 자동화, 탄소 측정, 보안·개인정보 구제 절차, 공급망 실사 시스템. 정보보호 사고와 개인정보 구제는 S와 G를 동시에 훼손함."
      },
      {
        "type": "p",
        "text": "IT 컴플라이언스는 법·규제·계약상 의무를 시스템과 통제로 지키는 활동. 거버넌스가 방향이라면 컴플라이언스는 그 방향의 의무 이행."
      },
      {
        "type": "h3",
        "text": "4. 린 스타트업, 자금·성장, 사회 실험"
      },
      {
        "type": "li",
        "text": "린 스타트업: 구축-측정-학습. MVP로 가설을 검증하고 유지 또는 피벗. 낭비: 고객이 원하지 않는 완성도를 미리 만드는 것.",
        "keyword": null
      },
      {
        "type": "li",
        "text": "그로스 해킹: 제품 안에 측정 가능한 성장 실험을 반복. AARRR(획득, 활성화, 유지, 추천, 매출)로 병목을 고름.",
        "keyword": null
      },
      {
        "type": "li",
        "text": "크라우드 펀딩: 기부, 보상, 대출, 지분. 대중으로부터 자금을 모음.",
        "keyword": null
      },
      {
        "type": "li",
        "text": "리빙랩: 실생활 현장에서 사용자와 함께 개발·실증. SOS랩: 지역 문제의 실수요자가 중심이 되는 사회문제 해결 R&D.",
        "keyword": null
      },
      {
        "type": "li",
        "text": "시빅 해킹: 공공 데이터로 사회 문제를 푸는 시민 개발. 라이프 해킹: 개인 생산성·생활의 우회 개선.",
        "keyword": null
      }
    ]
  },
  {
    "id": "s7",
    "title": "VI. IT 비즈니스 유형",
    "blocks": [
      {
        "type": "h3",
        "text": "1. 상거래와 광고"
      },
      {
        "type": "li",
        "text": "커머스: B2B, B2C, C2C, B2G. 전자상거래: 정보·주문·결제·물류를 온라인으로 이음.",
        "keyword": null
      },
      {
        "type": "li",
        "text": "e-마켓플레이스: 다수 판매자와 구매자의 온라인 장터. 수직: 한 산업, 수평은 여러 산업. 성공: 유통비, 진입, 에스크로, 확장성. 수익: 수수료·광고·데이터.",
        "keyword": null
      },
      {
        "type": "li",
        "text": "소셜 커머스: SNS의 관계·평판으로 거래. SNS 블록: 정체성, 존재, 관계, 대화, 평판, 공유, 그룹.",
        "keyword": null
      },
      {
        "type": "li",
        "text": "광고 과금: CPC(클릭), CPM(천 회 노출), CPA(전환 행동), CPT(기간). CTR=클릭/노출, CVR=전환/클릭.",
        "keyword": null
      },
      {
        "type": "li",
        "text": "프로그래매틱 바잉: 사람 대신 시스템으로 광고 지면을 실시간 경매(RTB). DSP: 수요(광고주), SSP는 공급(매체), 퍼블리셔는 지면 소유자.",
        "keyword": null
      },
      {
        "type": "li",
        "text": "앰비언트 커머스·컴퓨팅: 명시적 조작 없이 환경이 맥락을 감지해 동작·결제. IoT가 사물 연결이라면 앰비언트는 그 위에서 사용자 개입을 지우는 경험. 요소: 센서, 상황인지, 엣지, 무인 결제, 개인화.",
        "keyword": null
      },
      {
        "type": "li",
        "text": "데이터 커머스: 고객·상품 데이터 분석으로 맞춤 추천·중개. 기술: 텍스트·오피니언·웹 마이닝, 연관·상관·군집, 하둡·NoSQL. 예: 쇼핑 큐레이션, 가구별 T커머스.",
        "keyword": null
      },
      {
        "type": "h3",
        "text": "2. 플랫폼"
      },
      {
        "type": "p",
        "text": "플랫폼: 여러 참여자가 공통 규칙 위에서 가치를 만드는 토대. 구성요소: 컴포넌트(기술 기반)와 규칙, 제공자(구글·애플), 스폰서(개발자·광고주). 특징: 주도 기업, 모방 어려운 기술, 인센티브, 확장. 네트워크 효과로 참여자가 참여자를 부름."
      },
      {
        "type": "li",
        "text": "제품 플랫폼(반도체·차량 공용), 생산 플랫폼(공급망 조정), 마케팅 플랫폼(광고 중개), 서비스 플랫폼(API 공개).",
        "keyword": null
      },
      {
        "type": "li",
        "text": "다면 플랫폼: 둘 이상의 고객 집단을 연결. 기능: 연결, 탐색비용 절감, 바이럴. 개방형(다수 개발)과 통제형(품질·수익 집중)을 비교함.",
        "keyword": null
      },
      {
        "type": "li",
        "text": "아이디어 플랫폼: 제안과 평가를 상시 개방. 소셜평가, 사업화 육성, 솔루션 경쟁, 내부 사업부 연결.",
        "keyword": null
      },
      {
        "type": "li",
        "text": "오픈 플랫폼: API, 테스트베드, API 게이트웨이. 매시업과 SaaS로 확장.",
        "keyword": null
      },
      {
        "type": "h3",
        "text": "3. O2O (Online to Offline)와 X-Tech"
      },
      {
        "type": "li",
        "text": "O2O: 온라인으로 모아 오프라인 소비로 잇거나 그 반대. 쇼루밍(매장 보고 온라인 구매), 역쇼루밍, 옴니채널. 기술: 비콘, LBS, 결제, 앱.",
        "keyword": null
      },
      {
        "type": "li",
        "text": "O4O: 온라인이 오프라인 매장 경험을 강화하는 구조(Online for Offline).",
        "keyword": null
      },
      {
        "type": "li",
        "text": "핀테크: 금융회사가 기술로 결제·송금·자산관리·대출·크라우드펀딩을 재구성. 보안: FIDO, FDS, 비대면 인증.",
        "keyword": null
      },
      {
        "type": "li",
        "text": "테크핀: 기술회사가 고객·데이터·플랫폼을 갖고 금융을 제공. 출발점이 금융이냐 기술이냐가 차이.",
        "keyword": null
      },
      {
        "type": "li",
        "text": "인터넷전문은행: 점포 없이 비대면으로 수신·여신. 빅데이터 신용평가와 낮은 비용이 강점, 수신 기반과 리스크 관리가 과제.",
        "keyword": null
      },
      {
        "type": "li",
        "text": "오픈뱅킹: 표준 API로 핀테크가 은행 계좌·이체를 이용. 고객 동의, 인증, 이용 제한, 책임 소재가 핵심.",
        "keyword": null
      },
      {
        "type": "li",
        "text": "RegTech: 규제 준수를 자동화. PropTech: 부동산+기술(중개, VR, 가치평가). AbleTech: 장애·취약 계층 접근성. Deep Tech: 기초과학 기반의 모방 어려운 원천기술(반도체, 바이오, 양자, 우주). InsurTech, Climate Tech도 같은 합성어 패턴.",
        "keyword": null
      },
      {
        "type": "h3",
        "text": "4. 경제 형태"
      },
      {
        "type": "li",
        "text": "공유경제: 유휴 자산을 플랫폼으로 나눠 써서 소유 대신 접근을 판매. 신뢰·보험·규제가 제약.",
        "keyword": null
      },
      {
        "type": "li",
        "text": "구독경제: 소유 이전 대신 기간 과금으로 반복 매출. 해지율과 고객가치가 지표.",
        "keyword": null
      },
      {
        "type": "li",
        "text": "서비타이제이션: 제품 판매에서 제품-서비스 결합 성과 판매로 이동. 반대 방향의 상품화(productization)와 짝으로 기억.",
        "keyword": null
      },
      {
        "type": "li",
        "text": "언택트: 비대면 접점(키오스크, 앱, 무인). 편의와 데이터는 늘고, 디지털 소외와 일자리가 쟁점.",
        "keyword": null
      },
      {
        "type": "li",
        "text": "디지털 전환: 기술을 덧붙이는 디지털화와 달리 비즈니스 모델·프로세스·문화를 디지털 중심으로 재설계.",
        "keyword": null
      },
      {
        "type": "li",
        "text": "CoE: 특정 역량(데이터, 클라우드, 애자일)의 표준·인재·재사용을 모은 센터.",
        "keyword": null
      },
      {
        "type": "li",
        "text": "긱 이코노미: 플랫폼 기반 초단기 노동. Big Blur: 산업·온오프·생산소비의 경계 소멸.",
        "keyword": null
      },
      {
        "type": "li",
        "text": "TOC(제약이론): 시스템 산출은 병목이 결정. 병목 식별 → 활용 → 다른 자원을 병목에 종속 → 병목 능력 상승 → 반복. 부분 최적화가 전체가 아님.",
        "keyword": null
      },
      {
        "type": "li",
        "text": "백캐스팅: 원하는 미래 상태를 고정하고 현재로 역산해 경로를 만듦. 예측(포캐스팅)과 반대 방향. 목표 기술이 불연속일 때 씀.",
        "keyword": null
      }
    ]
  },
  {
    "id": "s8",
    "title": "VII. 규제와 부작용",
    "blocks": [
      {
        "type": "h3",
        "text": "1. 규제 샌드박스"
      },
      {
        "type": "p",
        "text": "신기술·서비스가 기존 허가 때문에 출발하지 못할 때, 일정 기간 규제 전부 또는 일부를 적용하지 않고 시험·출시하게 한 뒤 사후 규제하는 제도. 정보통신융합법·산업융합촉진법 체계. 신속확인(30일 내 규제 유무, 무응답이면 규제 없음으로 간주), 임시허가(모호·불합리한 규제의 조건부 면제), 실증특례(제한된 구역·규모·기간의 우선 시험). 네거티브 규제(금지 아니면 허용) 전환의 실행 장치."
      },
      {
        "type": "h3",
        "text": "2. 디지털 카르텔"
      },
      {
        "type": "p",
        "text": "알고리즘으로 가격 정보 교환·모니터링·조정을 해 담합 효과를 내는 행위. 전통 카르텔과 달리 사람이 가격을 직접합의하지 않을 수 있음."
      },
      {
        "type": "li",
        "text": "메커니즘: 모니터링(이탈 즉시 감지), 자가학습(AI가 담합 결과를 학습), 병행(동일 가격 알고리즘 공유), 신호(인상 신호를 실시간 교환).",
        "keyword": null
      },
      {
        "type": "li",
        "text": "유형: Messenger(명시 합의+동일 알고리즘, 위법 명확), Hub and Spoke(플랫폼이 수직 관계 사업자의 수평 담합을 중개), Predictable Agent(공개 가격에 즉응하며 암묵 담합, 책임 불명확), Autonomous Machine(AI가 스스로 담합 결과, 합의·증거 부재).",
        "keyword": null
      },
      {
        "type": "li",
        "text": "대응: 가격 시계열 모니터링, 알고리즘 유사도 감사, RegTech 감독. 과잉 규제와 방임 사이를 문제 삼음.",
        "keyword": null
      },
      {
        "type": "h3",
        "text": "3. 다크패턴"
      },
      {
        "type": "p",
        "text": "사용자가 충분한 정보가 있었다면 하지 않았을 선택으로 유도하는 기만 UI. 편취(숨: 갱신, 순차 가격, 몰래 담기), 오도(거짓 할인·후기, 미끼, 위장 광고, 사전 선택), 방해(해지 복잡, 정보 은폐, 클릭 피로), 압박(반복 팝업, 시간·재고 압박, 감정 언어)."
      },
      {
        "type": "li",
        "text": "대응: 공정위·방통위·개인정보위 점검, 해외는 DSA·DMA·다크패턴 금지 법안. 기술: 탐지 모델, 신고, 디자인 가이드, 코드 리뷰.",
        "keyword": null
      },
      {
        "type": "h3",
        "text": "4. 디지털 리터러시, 생산성 역설, 캐즘"
      },
      {
        "type": "p",
        "text": "디지털 리터러시는 디지털 정보를 찾고 판단하고 재구성해 쓰는 능력. 영역: 정보 활용, 비판적 사고, 창의, 디지털 시민성, 소통·협업, 기술 운용. 교육: 윤리(권리·도덕), 능력(기술·데이터·콘텐츠·미디어·소통), 적용(자기관리·사회기여)."
      },
      {
        "type": "p",
        "text": "IT 생산성 역설(솔로): IT 투자가 늘어도 생산성이 같이 늘지 않는 현상. 원인 후보는 측정 오류, 시차, 잘못된 투자, 보완 투자(프로세스·인재) 부재. 해법: 거버넌스로 기획-구축-성과를 측정하고, 시뮬레이션·프로토타입으로 가치를 조기 검증하며, 사후평가를 투자 결정에 되돌리는 것."
      },
      {
        "type": "p",
        "text": "캐즘(무어): 기술 수용 주기에서 선각 수용자와 전기 다수 사이에 판매가 멈추는 단절. 혁신가·선각: 기술·비전, 전기 다수는 완전한 실익·참조 고객을 원함. 전략: 틈새의 완전 제품, 참조 사례, 채널 전환. 수용자: 혁신, 선각, 전기 다수, 후기 다수, 지각."
      }
    ]
  },
  {
    "id": "s9",
    "title": "VIII. 표준, 지식재산, 경영시스템",
    "blocks": [
      {
        "type": "h3",
        "text": "1. 사실상 표준과 공적 표준"
      },
      {
        "type": "p",
        "text": "De facto: 시장 지배와 연합으로 굳은 규격. 빠르고(약 2~3년), 제품과 표준이 같이 퍼지며, 특정 기술에 집중. 예: 윈도, ITIL, W3C, IEEE, IETF. De jure: ISO, IEC, ITU 등 공식 기구가 합의로 만든 표준. 3~6년, 투명, 광범위. 예: ISO21500, 22301. 시험: 주체, 속도, 결과물(규격 vs 표준), 시장 반영을 표로 물음."
      },
      {
        "type": "p",
        "text": "기술의 상용화 장벽: 악마의 강(연구 아이디어 → 제품화), 죽음의 계곡(개발 → 사업화, 자금·인재), 다윈의 바다(사업화 → 산업화, 경쟁에서 생존)."
      },
      {
        "type": "h3",
        "text": "2. 지식재산권"
      },
      {
        "type": "p",
        "text": "창작·창안으로 재산 가치가 있는 무형물에 인정되는 권리. 산업재산권 + 저작권 + 신지식재산권."
      },
      {
        "type": "li",
        "text": "특허: 자연법칙을 이용한 발명, 출원일부터 20년, 신규성·진보성·산업상 이용가능성.",
        "keyword": null
      },
      {
        "type": "li",
        "text": "실용신안: 물품의 형상·구조 고안(소발명), 10년.",
        "keyword": null
      },
      {
        "type": "li",
        "text": "상표: 출처 식별, 등록일부터 10년, 갱신 가능.",
        "keyword": null
      },
      {
        "type": "li",
        "text": "디자인: 외관의 심미, 출원일부터 20년.",
        "keyword": null
      },
      {
        "type": "li",
        "text": "저작권: 창작과 동시 발생, 생존기간+사후 70년. 프로그램 보호도 저작권 체계.",
        "keyword": null
      },
      {
        "type": "li",
        "text": "신지식재산: 반도체 배치설계(10년), 영업비밀(비밀 유지 동안), 데이터베이스 제작자 권리.",
        "keyword": null
      },
      {
        "type": "p",
        "text": "표준특허: 표준을 구현하려면 반드시 침해하게 되는 특허. 청구항 전 구성요소가 표준에 대응. 일반 특허보다 표준문서와의 매칭이 중요함."
      },
      {
        "type": "p",
        "text": "FRAND: 표준특허권자가 공정·합리·비차별 조건으로 실시 허락해야 한다는 약속. 표준의 잠금을 막음. 유럽식 표현 RAND와 혼용됨."
      },
      {
        "type": "h3",
        "text": "3. 기술가치평가"
      },
      {
        "type": "p",
        "text": "기술이전·출자·기술료를 위해 기술의 경제 가치를 화폐로 산정하는 절차. 예비평가(상용화 가능 여부) → 사업타당성(기술성·권리성·시장성·사업성) → 가치평가(사업가치×기술기여도)."
      },
      {
        "type": "li",
        "text": "시장접근: 유사 거래 가격에 증감 요인. 거래 사례가 있어야 함.",
        "keyword": null
      },
      {
        "type": "li",
        "text": "비용접근: 재생산·대체 비용. 계산: 쉬우나 미래 수익·잔여수명을 무시.",
        "keyword": null
      },
      {
        "type": "li",
        "text": "수익접근: 미래 현금흐름의 현재가치. 가정이 성패를 가름. 로열티 절감, 이익 배분, 실물옵션이 변종.",
        "keyword": null
      },
      {
        "type": "h3",
        "text": "4. ISO 14000 / 14001 (환경경영)"
      },
      {
        "type": "p",
        "text": "ISO 14000 패밀리는 환경경영 국제규격. 14001 환경경영시스템 요구, 14010대 심사, 14031 환경성과평가, 14040대 전과정평가(LCA), 14020대 환경라벨, 14050 용어."
      },
      {
        "type": "li",
        "text": "필요성: 오염과 규제, 공급망 요구, 수출 장벽, ESG, 이미지.",
        "keyword": null
      },
      {
        "type": "li",
        "text": "절차: 정보수집·TFT·계획 → 방침·영향평가·목표·내부심사 → 문서심사·본심사·인증. 14001 운영은 방침 → 목표·계획 → 실행 → 측정·시정 → 경영검토. PDCA.",
        "keyword": null
      },
      {
        "type": "li",
        "text": "효과: 폐기·유틸리티·원자재·사고비용 감소, 거래 요건 충족, 그린 조달, 수출.",
        "keyword": null
      },
      {
        "type": "h3",
        "text": "5. ISO 31000 (리스크 관리)"
      },
      {
        "type": "p",
        "text": "조직의 모든 리스크를 관리하는 원칙과 지침(2018). 인증 규격이 아니라 가이드. 원칙 8: 통합, 체계·포괄, 맞춤, 포용, 동적, 최선의 가용 정보, 인적·문화 요인, 지속 개선."
      },
      {
        "type": "li",
        "text": "프로세스: 소통과 협의, 맥락 수립, 식별, 분석, 평가, 대응, 모니터링·검토. 대응: 회피(terminate), 경감(treat), 이전(transfer), 수용(tolerate).",
        "keyword": null
      },
      {
        "type": "li",
        "text": "관련: ISO/TR 31004 구현, IEC 31010 평가 기법, ISO 31022 법률 리스크.",
        "keyword": null
      },
      {
        "type": "h3",
        "text": "6. CSR (Corporate Social Responsibility), ISO 26000 (사회적 책임), ISO 42001 (AI 경영시스템)"
      },
      {
        "type": "p",
        "text": "CSR: 생산·영업에서 환경, 윤리, 노동, 지역사회 이익을 함께 의사결정에 넣는 책임. CSV(포터): 사회 문제를 풀면서 기업 경쟁력도 올리는 공유가치로, 기부 예산에 묶인 CSR보다 사업 모델에 가까움."
      },
      {
        "type": "p",
        "text": "ISO 26000은 사회적 책임 지침(인증용 요구 표준은 아님). 7주제: 조직 거버넌스, 인권, 노동, 환경, 공정 운영, 소비자, 지역사회 참여·발전. 두 근본 관행은 책임의 인식, 이해관계자 식별과 참여."
      },
      {
        "type": "p",
        "text": "ISO/IEC 42001:2023은 AI 경영시스템(AIMS) 최초 국제표준. 목적: 투명·책임, 공정·프라이버시, 위험 식별과 완화, 법규 준수. 구조: 다른 MSS와 같이 조직 상황, 리더십, 계획, 지원, 운영(AI 위험·영향평가), 성과평가, 개선. 국내 인공지능 신뢰성 인증(CAT)은 제품·서비스의 기술 신뢰에 초점이 있고, 42001은 조직의 AI 거버넌스에 초점이 있음."
      }
    ]
  },
  {
    "id": "s10",
    "title": "답안 조립 치트시트",
    "blocks": [
      {
        "type": "h3",
        "text": "자주 같이 나오는 비교"
      },
      {
        "type": "li",
        "text": "ISP / EA / ISMP: 전략 계획 / 지속 청사진 / 단위사업 RFP.",
        "keyword": null
      },
      {
        "type": "li",
        "text": "BPR / PI / BPM: 급진 재설계 / 점진 혁신 / 프로세스 실행·통제 시스템.",
        "keyword": null
      },
      {
        "type": "li",
        "text": "ERP / XRP / Composable: 내부 통합 / 내외부 확장 / 서비스 조립.",
        "keyword": null
      },
      {
        "type": "li",
        "text": "CRM / VRM / PRM: 기업 → 고객 / 고객 → 기업 / 기업 → 파트너.",
        "keyword": null
      },
      {
        "type": "li",
        "text": "EAI / ESB / B2Bi: 내부 허브 / 서비스 버스 / 기업 간.",
        "keyword": null
      },
      {
        "type": "li",
        "text": "BI / BAM / OLAP / Mining: 의사결정 정보 / 실시간 활동 감시 / 다차원 조회 / 패턴 발견.",
        "keyword": null
      },
      {
        "type": "li",
        "text": "BCP / DRP / DRS: 사업 연속 계획 / IT 복구 절차 / 복구 시스템.",
        "keyword": null
      },
      {
        "type": "li",
        "text": "RTO / RPO: 복구에 허용된 시간 / 잃어도 되는 데이터 시점.",
        "keyword": null
      },
      {
        "type": "li",
        "text": "SLA / OLA / SLM: 고객 계약 / 내부 합의 / 그 계약의 관리 프로세스.",
        "keyword": null
      },
      {
        "type": "li",
        "text": "De facto / De jure, 특허 / 표준특허 / FRAND, 핀테크 / 테크핀, 선도 / 추격 / 병행.",
        "keyword": null
      },
      {
        "type": "h3",
        "text": "1교시 10줄 골격"
      },
      {
        "type": "p",
        "text": "정의 한 문장. 등장 배경 두 줄. 특징 또는 구성요소 네 개. 한 줄 비교나 주의. 마지막에 적용 효과 또는 한계. 암기 단어는 두문자로 남기되 답안에서는 풀어 씀."
      },
      {
        "type": "h3",
        "text": "2교시 골격"
      },
      {
        "type": "p",
        "text": "가. 정의와 필요성(사업·기술·규제 각 한 줄). 나. 개념도와 구성요소(입력-처리-출력 또는 주체별). 다. 절차 또는 비교표. 라. 구축·운영 고려(보안, 비용, 변화관리, 성과지표)와 한 문장 제언. 지표 문제가 나오면 목표치·측정식·최소수준·가중치·보상까지 적음."
      },
      {
        "type": "p",
        "text": "그림이 필요한 토픽: RTE 사이클, EA 현행-목표-이행, ISP 5단계, BSC 인과, EDA 토폴로지, DW-ETL-OLAP, SLA 관계, BCP 절차, DRS 4유형 시간축, BMC 9칸, 캐즘 곡선. 시험장에서는 상자를 다섯 개 넘기지 않음."
      }
    ]
  }
],
};
