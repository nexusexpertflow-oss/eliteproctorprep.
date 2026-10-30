-- ============================================================
-- EliteProctorPrep - Neon PostgreSQL Production Database Schema
-- Run this in your Neon SQL Editor: https://console.neon.tech
-- ============================================================

-- 1. Candidates / Students Table (Linked with Clerk Authentication)
CREATE TABLE IF NOT EXISTS candidates (
    id SERIAL PRIMARY KEY,
    clerk_user_id VARCHAR(128) UNIQUE NOT NULL,
    email VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    exam_track VARCHAR(64) DEFAULT 'NCLEX-RN',
    nursing_school VARCHAR(255),
    target_date VARCHAR(64),
    subscription_tier VARCHAR(32) DEFAULT 'Free Diagnostic',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index on clerk_user_id for instantaneous auth lookups
CREATE INDEX IF NOT EXISTS idx_candidates_clerk_id ON candidates(clerk_user_id);
CREATE INDEX IF NOT EXISTS idx_candidates_email ON candidates(email);

-- 2. Practice Quiz Attempts & Test Logs
CREATE TABLE IF NOT EXISTS quiz_attempts (
    id SERIAL PRIMARY KEY,
    clerk_user_id VARCHAR(128) NOT NULL,
    exam_track VARCHAR(64) NOT NULL,
    subject_id VARCHAR(64) NOT NULL,
    subject_title VARCHAR(255),
    score INTEGER NOT NULL,
    total_questions INTEGER NOT NULL,
    percentage NUMERIC(5,2),
    time_spent_seconds INTEGER DEFAULT 0,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user ON quiz_attempts(clerk_user_id);

-- 3. Next Generation NCLEX (NGN) Clinical Case Results
CREATE TABLE IF NOT EXISTS ngn_case_results (
    id SERIAL PRIMARY KEY,
    clerk_user_id VARCHAR(128) NOT NULL,
    case_id VARCHAR(64) NOT NULL,
    case_title VARCHAR(255) NOT NULL,
    client_name VARCHAR(128),
    client_condition VARCHAR(255),
    score INTEGER NOT NULL,
    max_score INTEGER NOT NULL,
    passed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_ngn_results_user ON ngn_case_results(clerk_user_id);

-- 4. Pass Readiness Probability Evaluations
CREATE TABLE IF NOT EXISTS readiness_evaluations (
    id SERIAL PRIMARY KEY,
    clerk_user_id VARCHAR(128) NOT NULL,
    exam_track VARCHAR(64) NOT NULL,
    questions_completed INTEGER NOT NULL,
    practice_exam_avg NUMERIC(5,2) NOT NULL,
    ngn_accuracy NUMERIC(5,2) NOT NULL,
    study_streak_days INTEGER DEFAULT 0,
    pass_probability INTEGER NOT NULL,
    readiness_rating VARCHAR(64) NOT NULL,
    evaluated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_readiness_user ON readiness_evaluations(clerk_user_id);

-- 5. Dispatched Email Reports & Score Summaries (Resend Integration)
CREATE TABLE IF NOT EXISTS email_reports (
    id SERIAL PRIMARY KEY,
    clerk_user_id VARCHAR(128),
    recipient_email VARCHAR(255) NOT NULL,
    candidate_name VARCHAR(255),
    exam_track VARCHAR(64) NOT NULL,
    subject_title VARCHAR(255),
    score INTEGER NOT NULL,
    total_questions INTEGER NOT NULL,
    percentage NUMERIC(5,2) NOT NULL,
    pass_probability INTEGER,
    resend_message_id VARCHAR(128),
    dispatched_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_email_reports_recipient ON email_reports(recipient_email);
CREATE INDEX IF NOT EXISTS idx_email_reports_track ON email_reports(exam_track);

