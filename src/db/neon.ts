/**
 * EliteProctorPrep Neon PostgreSQL Client
 * Uses @neondatabase/serverless for low-latency serverless Postgres connections.
 */
import { neon, NeonQueryFunction } from '@neondatabase/serverless';

const DATABASE_URL = typeof process !== 'undefined' ? process.env?.DATABASE_URL : undefined;

let sqlClient: NeonQueryFunction<false, false> | null = null;

export const getDb = () => {
  if (!sqlClient && DATABASE_URL) {
    sqlClient = neon(DATABASE_URL);
  }
  return sqlClient;
};

export interface CandidateDbRecord {
  id: number;
  clerk_user_id: string;
  email: string;
  name: string | null;
  exam_track: string;
  nursing_school: string | null;
  target_date: string | null;
  subscription_tier: string;
  created_at: string;
}

export interface QuizAttemptRecord {
  id?: number;
  clerk_user_id: string;
  exam_track: string;
  subject_id: string;
  subject_title: string;
  score: number;
  total_questions: number;
  percentage: number;
  time_spent_seconds?: number;
  completed_at?: string;
}

/**
 * Upsert candidate profile linked with Clerk Auth ID
 */
export async function syncCandidateWithDb(candidate: {
  clerkUserId: string;
  email: string;
  name?: string;
  examTrack?: string;
  nursingSchool?: string;
  targetDate?: string;
}) {
  const sql = getDb();
  if (!sql) return null;

  try {
    const result = await sql`
      INSERT INTO candidates (clerk_user_id, email, name, exam_track, nursing_school, target_date, updated_at)
      VALUES (${candidate.clerkUserId}, ${candidate.email}, ${candidate.name || null}, ${candidate.examTrack || 'NCLEX-RN'}, ${candidate.nursingSchool || null}, ${candidate.targetDate || null}, CURRENT_TIMESTAMP)
      ON CONFLICT (clerk_user_id)
      DO UPDATE SET
        email = EXCLUDED.email,
        name = COALESCE(EXCLUDED.name, candidates.name),
        exam_track = COALESCE(EXCLUDED.exam_track, candidates.exam_track),
        updated_at = CURRENT_TIMESTAMP
      RETURNING *;
    `;
    return result[0];
  } catch (error) {
    console.error('Error synchronizing candidate profile with Neon database:', error);
    return null;
  }
}

/**
 * Record a practice exam quiz attempt in Neon
 */
export async function recordQuizAttempt(attempt: QuizAttemptRecord) {
  const sql = getDb();
  if (!sql) return null;

  try {
    const result = await sql`
      INSERT INTO quiz_attempts (
        clerk_user_id, exam_track, subject_id, subject_title, score, total_questions, percentage, time_spent_seconds
      ) VALUES (
        ${attempt.clerk_user_id},
        ${attempt.exam_track},
        ${attempt.subject_id},
        ${attempt.subject_title},
        ${attempt.score},
        ${attempt.total_questions},
        ${attempt.percentage},
        ${attempt.time_spent_seconds || 0}
      )
      RETURNING *;
    `;
    return result[0];
  } catch (error) {
    console.error('Error recording quiz attempt in Neon database:', error);
    return null;
  }
}

export interface EmailReportRecord {
  clerk_user_id?: string;
  recipient_email: string;
  candidate_name?: string;
  exam_track: string;
  subject_title?: string;
  score: number;
  total_questions: number;
  percentage: number;
  pass_probability?: number;
  resend_message_id?: string;
}

/**
 * Record an email report dispatched via Resend in Neon
 */
export async function recordEmailReport(report: EmailReportRecord) {
  const sql = getDb();
  if (!sql) return null;

  try {
    const result = await sql`
      INSERT INTO email_reports (
        clerk_user_id, recipient_email, candidate_name, exam_track, subject_title,
        score, total_questions, percentage, pass_probability, resend_message_id
      ) VALUES (
        ${report.clerk_user_id || null},
        ${report.recipient_email},
        ${report.candidate_name || null},
        ${report.exam_track},
        ${report.subject_title || null},
        ${report.score},
        ${report.total_questions},
        ${report.percentage},
        ${report.pass_probability || null},
        ${report.resend_message_id || null}
      )
      RETURNING *;
    `;
    return result[0];
  } catch (error) {
    console.error('Error recording email report in Neon database:', error);
    return null;
  }
}

