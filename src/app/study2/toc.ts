export interface TocItem {
  slug: string;
  label: string;
  ready: boolean;
}

export const studyToc: TocItem[] = [
  { slug: "strategy", label: "1.경영전략", ready: true },
  { slug: "project", label: "2.프로젝트관리", ready: true },
  { slug: "software", label: "3.소프트웨어", ready: true },
  { slug: "digital-service", label: "4.디지털서비스", ready: true },
  { slug: "digital-network", label: "5.디지털네트워크", ready: true },
  { slug: "digital-security", label: "6.디지털시큐리티", ready: true },
  { slug: "data-analysis", label: "7.데이터분석", ready: true },
  { slug: "ai", label: "8.인공지능", ready: true },
  { slug: "ca-system", label: "9.CA및System", ready: true },
  { slug: "algorithm", label: "10.알고리즘", ready: true },
  { slug: "os", label: "11.운영체제", ready: true },
  { slug: "data-structure", label: "12.자료구조", ready: true },
  { slug: "story", label: "13.한 이야기로", ready: true },
];

export function getTocItem(slug: string) {
  return studyToc.find((item) => item.slug === slug);
}
