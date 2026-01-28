/** Dog types */
export enum DogSize {
  small = 'small',
  medium = 'medium',
  large = 'large',
  giant = 'giant',
}

export enum DogGender {
  male = 'male',
  female = 'female',
}

export interface Dog {
  id: string;
  user_id: string;
  name: string;
  breed: string;
  size: DogSize;
  gender: DogGender;
  age_months: number;
  mbti: string | null;
  avatar: string | null;
}

export interface DogCreate {
  name: string;
  breed: string;
  size: DogSize;
  gender: DogGender;
  age_months: number;
  avatar?: string;
}

export interface DogUpdate {
  name?: string;
  breed?: string;
  size?: DogSize;
  gender?: DogGender;
  age_months?: number;
  avatar?: string;
}

// Display helpers
export const SIZE_LABELS: Record<DogSize, string> = {
  [DogSize.small]: '小型',
  [DogSize.medium]: '中型',
  [DogSize.large]: '大型',
  [DogSize.giant]: '巨型',
};

export const GENDER_LABELS: Record<DogGender, string> = {
  [DogGender.male]: '弟弟',
  [DogGender.female]: '妹妹',
};
