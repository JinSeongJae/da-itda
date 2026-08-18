export interface ReviewChecklist {
  id: string;
  appointmentId: string;
  reviewerId: string;
  metAtSafeZone: boolean;
  exchangeWentWell: boolean;
  hadUncomfortableIncident: boolean;
  submittedAt: string;
}

export interface ReviewOutcome {
  isPositive: boolean; // metAtSafeZone && exchangeWentWell && !hadUncomfortableIncident
  bothSubmitted: boolean;
  bothPositive: boolean;
}
