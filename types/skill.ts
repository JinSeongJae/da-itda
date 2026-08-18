export type SkillCategory =
  | 'language'
  | 'cooking'
  | 'education'
  | 'local-info'
  | 'culture'
  | 'craft';

export interface Skill {
  id: string;
  category: SkillCategory;
  label: string;
  description?: string;
}
