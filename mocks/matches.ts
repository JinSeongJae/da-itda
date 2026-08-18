import type { MatchResult } from '../types';
import { JASMIN, LEE_JIEUN } from './users';
import { computeCompatibilityScore, computeMatchFactorScores } from '../utils/matchAlgorithm';

export const MATCH_JASMIN_JIEUN_ID = 'match_jasmin_jieun';

const factorScores = computeMatchFactorScores(JASMIN, LEE_JIEUN);

export const SEED_MATCH: MatchResult = {
  id: MATCH_JASMIN_JIEUN_ID,
  userAId: JASMIN.id,
  userBId: LEE_JIEUN.id,
  compatibilityScore: computeCompatibilityScore(factorScores),
  factorScores,
  status: 'chatting',
  createdAt: '2026-08-14T09:00:00+09:00',
};

export const SEED_MATCHES: MatchResult[] = [SEED_MATCH];
