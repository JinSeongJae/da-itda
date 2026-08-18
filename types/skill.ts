export type SkillCategory =
  | 'language'
  | 'cooking'
  | 'culture'
  | 'local-info'
  | 'education'
  | 'parenting'
  | 'sports'
  | 'hobby-art'
  | 'tech'
  | 'legal-admin';

export interface Skill {
  id: string;
  category: SkillCategory;
  label: string;
  description?: string;
}
