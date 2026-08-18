export type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected';

export type VerificationDocumentType = 'id-card' | 'foreign-registration-card';

export interface VerificationRequest {
  id: string;
  userId: string;
  documentType: VerificationDocumentType;
  imageUri: string;
  status: VerificationStatus;
  submittedAt: string;
  reviewedAt?: string;
}
