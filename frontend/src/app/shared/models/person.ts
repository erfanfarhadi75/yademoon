export enum RelationType {
  Partner = 1,
  Family = 2,
  Friend = 3,
  Relative = 4,
  Colleague = 5,
  Other = 6,
}

export const RELATION_LABELS: Record<RelationType, string> = {
  [RelationType.Partner]: 'عشق و شریک عاطفی',
  [RelationType.Family]: 'خانواده',
  [RelationType.Friend]: 'دوست',
  [RelationType.Relative]: 'فامیل',
  [RelationType.Colleague]: 'همکار',
  [RelationType.Other]: 'سایر',
};

export interface PersonDto {
  id: string;
  name: string;
  relation: RelationType;
  birthDate: string;
  notes?: string | null;
  nextBirthday: string;
  daysUntil: number;
  jalaliBirthMonth: number;
  jalaliBirthDay: number;
}

export interface DashboardDto {
  greetingName: string;
  totalPeople: number;
  todayCount: number;
  upcomingCount: number;
  thisMonthCount: number;
  today: PersonDto[];
  upcoming: PersonDto[];
  thisMonth: PersonDto[];
  nearest: PersonDto | null;
}

export interface AuthUser {
  id: string;
  displayName: string;
  email: string;
}
