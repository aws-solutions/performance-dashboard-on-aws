export interface Homepage {
  title: string;
  description: string;
  updatedAt: Date;
}

export interface HomepageItem {
  pk: string;
  sk: string;
  type: string;
  updatedAt?: string;
  title: string;
  description: string;
}
