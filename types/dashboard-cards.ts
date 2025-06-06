export interface DashboardCardLink {
  css_class: string;
  icon: string;
  hidden: boolean | null;
  path: string;
  label: string;
}

export interface DashboardCard {
  longName: string;
  shortName: string;
  originalName: string;
  courseCode: string;
  assetString: string;
  href: string;
  term: string;
  subtitle: string;
  enrollmentState: string;
  enrollmentType: string;
  observee: unknown | null;
  id: string;
  isFavorited: boolean;
  isK5Subject: boolean;
  isHomeroom: boolean;
  useClassicFont: boolean;
  canManage: boolean;
  canReadAnnouncements: boolean;
  image: string | null;
  color: string | null;
  position: number;
  published: boolean;
  links: DashboardCardLink[];
  canChangeCoursePublishState: boolean;
  defaultView: string;
  pagesUrl: string;
  frontPageTitle: string;
}