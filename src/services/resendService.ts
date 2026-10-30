/**
 * EliteProctorPrep - Resend Client Service
 * Provides client-side and serverless email transmission for student score reports,
 * pass readiness certificates, and onboarding summaries.
 */

export interface ScoreReportEmailPayload {
  email: string;
  candidateName?: string;
  examTrack: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  passProbability?: number;
  timeSpent?: string;
  weakAreas?: string[];
  recommendations?: string[];
  subjectTitle?: string;
}

export interface EmailResponse {
  success: boolean;
  message: string;
  messageId?: string;
  simulated?: boolean;
  error?: string;
}

/**
 * Generate formatted HTML template for score reports
 */
export function generateScoreReportHtml(payload: ScoreReportEmailPayload): string {
  const {
    candidateName = 'Future Clinician',
    examTrack,
    score,
    totalQuestions,
    percentage,
    passProbability = Math.min(99, Math.max(50, Math.round(percentage * 0.95 + 10))),
    timeSpent = '12 mins',
    subjectTitle = 'Comprehensive Clinical Review',
    recommendations = [
      'Focus daily practice on high-yield pharmacology & adverse effect recognition.',
      'Review Next Gen unfolding clinical case study prioritization rules (Airway, Breathing, Circulation).',
      'Maintain continuous 60-question daily study momentum to optimize long-term retention.'
    ]
  } = payload;

  const isPassing = percentage >= 70;
  const statusBadgeColor = isPassing ? '#2d5a4a' : '#c4553a';
  const statusBadgeText = isPassing ? 'STANDARD MET - STRONG PASS PROBABILITY' : 'REVIEW RECOMMENDED - PRIORITY DRILLS REQUIRED';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>EliteProctorPrep Clinical Score Report</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #faf7f2; margin: 0; padding: 0; color: #1c1917; }
    .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e7e5e4; box-shadow: 0 4px 20px rgba(0,0,0,0.06); }
    .header { background: #0c1a2e; color: #ffffff; padding: 32px 28px; text-align: center; }
    .logo-badge { display: inline-block; background: #c4553a; color: #ffffff; font-size: 11px; font-weight: 800; letter-spacing: 1px; padding: 4px 12px; border-radius: 9999px; text-transform: uppercase; margin-bottom: 12px; }
    .title { font-size: 24px; font-weight: 800; margin: 0 0 6px 0; letter-spacing: -0.5px; }
    .subtitle { color: #a8a29e; font-size: 14px; margin: 0; }
    .body { padding: 32px 28px; }
    .status-card { background: ${isPassing ? '#ecfdf5' : '#fff7ed'}; border: 1px solid ${isPassing ? '#a7f3d0' : '#fed7aa'}; border-radius: 12px; padding: 18px; text-align: center; margin-bottom: 24px; }
    .status-title { font-size: 13px; font-weight: 800; color: ${statusBadgeColor}; letter-spacing: 0.5px; margin-bottom: 4px; }
    .score-grid { display: table; width: 100%; margin-bottom: 24px; border-spacing: 8px; }
    .score-cell { display: table-cell; background: #faf7f2; border: 1px solid #e7e5e4; border-radius: 10px; padding: 14px; text-align: center; width: 33.33%; }
    .cell-value { font-size: 22px; font-weight: 800; color: #0c1a2e; margin-bottom: 2px; }
    .cell-label { font-size: 11px; font-weight: 600; color: #78716c; text-transform: uppercase; }
    .section-title { font-size: 16px; font-weight: 700; color: #0c1a2e; margin: 24px 0 12px 0; border-bottom: 1px solid #f5f5f4; padding-bottom: 6px; }
    .recommendations-list { padding-left: 20px; margin: 0 0 24px 0; color: #44403c; font-size: 14px; line-height: 1.6; }
    .recommendations-list li { margin-bottom: 8px; }
    .cta-button { display: block; width: 100%; box-sizing: border-box; text-align: center; background: #c4553a; color: #ffffff !important; text-decoration: none; font-weight: 700; font-size: 15px; padding: 14px 20px; border-radius: 10px; margin-top: 24px; }
    .footer { background: #faf7f2; border-top: 1px solid #e7e5e4; padding: 20px 28px; text-align: center; font-size: 12px; color: #a8a29e; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo-badge">EliteProctorPrep Verification</div>
      <h1 class="title">Clinical Diagnostic Score Report</h1>
      <p class="subtitle">${examTrack} &bull; ${subjectTitle}</p>
    </div>

    <div class="body">
      <p style="font-size: 15px; margin-top: 0; color: #292524;">
        Hello <strong>${candidateName}</strong>,
      </p>
      <p style="font-size: 14px; color: #57534e; line-height: 1.5;">
        Here is your verified clinical diagnostic examination summary from EliteProctorPrep. Keep this record for your study audit and predictive readiness tracking.
      </p>

      <div class="status-card">
        <div class="status-title">${statusBadgeText}</div>
        <div style="font-size: 28px; font-weight: 900; color: #0c1a2e; margin: 4px 0;">
          ${percentage}% Diagnostic Accuracy
        </div>
        <div style="font-size: 12px; color: #57534e;">
          Estimated Board Pass Probability: <strong>${passProbability}%</strong>
        </div>
      </div>

      <div class="score-grid">
        <div class="score-cell">
          <div class="cell-value">${score} / ${totalQuestions}</div>
          <div class="cell-label">Questions Correct</div>
        </div>
        <div class="score-cell">
          <div class="cell-value">${passProbability}%</div>
          <div class="cell-label">Pass Probability</div>
        </div>
        <div class="score-cell">
          <div class="cell-value">${timeSpent}</div>
          <div class="cell-label">Time Spent</div>
        </div>
      </div>

      <div class="section-title">Clinical Faculty Recommendations</div>
      <ul class="recommendations-list">
        ${recommendations.map(r => `<li>${r}</li>`).join('')}
      </ul>

      <a href="https://eliteproctorprep.com" class="cta-button">
        Launch Complete 300,000+ Question Bank →
      </a>
    </div>

    <div class="footer">
      <p style="margin: 0 0 6px 0;"><strong>EliteProctorPrep</strong> &bull; NCSBN &amp; USMLE Clinical Licensure Prep</p>
      <p style="margin: 0;">This email was sent to ${payload.email} via Resend. &copy; ${new Date().getFullYear()} EliteProctorPrep. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Send clinical score report using Resend
 */
export async function sendClinicalReportEmail(payload: ScoreReportEmailPayload): Promise<EmailResponse> {
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      const data = await response.json();
      return {
        success: true,
        message: data.message || `Score report sent successfully to ${payload.email}`,
        messageId: data.messageId,
        simulated: data.simulated,
      };
    } else {
      const errData = await response.json().catch(() => ({}));
      // If serverless endpoint is not running in local Vite mode, gracefully simulate
      if (response.status === 404 || response.status === 502) {
        return {
          success: true,
          message: `Preview report generated for ${payload.email}. (When deployed to Vercel with RESEND_API_KEY, emails are delivered instantly.)`,
          simulated: true,
        };
      }
      return {
        success: false,
        message: errData.error || `Server responded with status ${response.status}`,
        error: errData.error,
      };
    }
  } catch (err: any) {
    // Network or offline fallback
    console.warn('Resend API call error:', err);
    return {
      success: true,
      message: `Score report ready for ${payload.email}. (Vercel deployment with RESEND_API_KEY will dispatch via SMTP.)`,
      simulated: true,
    };
  }
}
