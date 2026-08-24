export type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected';

export type VerificationDocumentType = 'id-card' | 'foreign-registration-card';

export interface VerificationRequest {
  id: string;
  userId: string;
  documentType: VerificationDocumentType;
  /** Never the raw photo — the server masks the RRN/registration number before this ever exists. */
  maskedImageUrl: string;
  birthDate?: string;
  status: VerificationStatus;
  submittedAt: string;
  reviewedAt?: string;
  applicantName?: string;
  applicantAvatarUrl?: string;
}

export type ReportReason = 'inappropriate' | 'no-show' | 'harassment' | 'scam' | 'other';

export interface Report {
  id: string;
  reporterId: string;
  targetUserId: string;
  reason: ReportReason;
  detail?: string;
  threadId?: string;
  status: 'open' | 'resolved' | 'dismissed';
  createdAt: string;
  reporterName?: string;
  targetName?: string;
}
