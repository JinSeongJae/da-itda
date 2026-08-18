export interface MockNotification {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
}

export const NOTIFICATIONS: MockNotification[] = [
  {
    id: 'noti_1',
    title: 'AI 매칭 완료!',
    body: '이지은님과 98% 호환되는 매칭이 도착했어요.',
    createdAt: '2026-08-16T09:12:00+09:00',
    read: false,
  },
  {
    id: 'noti_2',
    title: '약속 확정',
    body: '경산시 로컬푸드 직매장 공유주방에서의 만남이 확정되었습니다.',
    createdAt: '2026-08-15T20:03:00+09:00',
    read: true,
  },
  {
    id: 'noti_3',
    title: '이번 주 소모임 추천',
    body: '경산시 로컬푸드 주방 소규모 쿠킹 모임이 열려요.',
    createdAt: '2026-08-14T11:00:00+09:00',
    read: true,
  },
];
