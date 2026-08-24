export interface MockNotification {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
}

/** No real in-app notification inbox backend exists yet — kept empty rather than showing fabricated notifications. */
export const NOTIFICATIONS: MockNotification[] = [];
