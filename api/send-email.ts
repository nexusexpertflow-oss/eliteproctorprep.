/**
 * EliteProctorPrep - Resend Serverless Function (Vercel)
 * Dispatches clinical exam reports, readiness certificates, and onboarding receipts.
 * 
 * Set RESEND_API_KEY in your Vercel Project Environment Variables.
 */
import { Resend } from 'resend';

export default async function handler(req: any, res: any) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
  }

  const {
    email,
    candidateName = 'Future Clinician',
    examTrack = 'NCLEX-RN',
    score = 0,
    totalQuestions = 0,
    percentage = 0,
    passProbability = 75,
    subjectTitle = 'Clinical Diagnostic Review',
    recommendations = [
      'Maintain continuous 60-question daily study momentum to optimize long-term retention.',
      'Review Next Generation NCLEX unfolding clinical case study prioritization rules.',
      'Target high-yield Pharmacology antidote and adverse reaction recognition.'
    ]
  } = req.body || {};

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'A valid candidate email address is required.' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'EliteProctorPrep <onboarding@resend.dev>';

  // If no RESEND_API_KEY is configured yet, provide clear instruction while simulating success
  if (!apiKey) {
    console.warn('[Resend Warning] RESEND_API_KEY environment variable is not set.');
    return res.status(200).json({
      success: true,
      simulated: true,
      message: `Score report generated for ${email}. Note: To deliver live emails to candidate inboxes, add your RESEND_API_KEY in Vercel Project Settings > Environment Variables.`,
      messageId: `sim_${Date.now()}`
    });
  }

  try {
    const resend = new Resend(apiKey);

    const isPassing = percentage >= 70;
    const statusText = isPassing ? 'STANDARD MET - STRONG PASS PROBABILITY' : 'REVIEW RECOMMENDED - PRIORITY DRILLS REQUIRED';
    const statusColor = isPassing ? '#2d5a4a' : '#c4553a';

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #faf7f2; margin: 0; padding: 20px; color: #1c1917; }
    .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e7e5e4; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.06); }
    .header { background: #0c1a2e; color: #ffffff; padding: 28px; text-align: center; }
    .body { padding: 28px; }
    .score-box { background: ${isPassing ? '#ecfdf5' : '#fff7ed'}; border: 1px solid ${isPassing ? '#a7f3d0' : '#fed7aa'}; border-radius: 12px; padding: 16px; text-align: center; margin: 20px 0; }
    .btn { display: block; text-align: center; background: #c4553a; color: #ffffff; text-decoration: none; padding: 12px; border-radius: 8px; font-weight: bold; margin-top: 20px; }
    .footer { text-align: center; font-size: 11px; color: #a8a29e; padding: 16px; border-top: 1px solid #f5f5f4; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div style="font-size: 11px; font-weight: 800; background: #c4553a; display: inline-block; padding: 3px 10px; border-radius: 20px; text-transform: uppercase; margin-bottom: 8px;">EliteProctorPrep</div>
      <h1 style="margin: 0; font-size: 22px;">Clinical Diagnostic Score Report</h1>
      <p style="margin: 4px 0 0 0; color: #cbd5e1; font-size: 13px;">${examTrack} &bull; ${subjectTitle}</p>
    </div>
    <div class="body">
      <p>Hello <strong>${candidateName}</strong>,</p>
      <p>Here is your verified diagnostic assessment summary from EliteProctorPrep:</p>
      
      <div class="score-box">
        <div style="font-size: 12px; font-weight: bold; color: ${statusColor};">${statusText}</div>
        <div style="font-size: 32px; font-weight: 900; margin: 6px 0; color: #0c1a2e;">${percentage}%</div>
        <div style="font-size: 13px; color: #57534e;">Estimated Licensure Pass Rate: <strong>${passProbability}%</strong></div>
      </div>

      <table style="width: 100%; text-align: center; margin: 16px 0; border-collapse: collapse;">
        <tr>
          <td style="padding: 10px; background: #faf7f2; border-radius: 8px; width: 50%;">
            <div style="font-size: 18px; font-weight: bold; color: #0c1a2e;">${score} / ${totalQuestions}</div>
            <div style="font-size: 11px; color: #78716c; text-transform: uppercase;">Correct Items</div>
          </td>
          <td style="width: 10px;"></td>
          <td style="padding: 10px; background: #faf7f2; border-radius: 8px; width: 50%;">
            <div style="font-size: 18px; font-weight: bold; color: #0c1a2e;">${passProbability}%</div>
            <div style="font-size: 11px; color: #78716c; text-transform: uppercase;">Pass Probability</div>
          </td>
        </tr>
      </table>

      <h4 style="margin: 20px 0 8px 0; color: #0c1a2e;">Recommended Next Steps:</h4>
      <ul style="padding-left: 20px; font-size: 13px; color: #44403c; line-height: 1.6;">
        ${recommendations.map((r: string) => `<li>${r}</li>`).join('')}
      </ul>

      <a href="https://eliteproctorprep.com" class="btn" style="color: #ffffff;">Access 300,000+ Question Bank</a>
    </div>
    <div class="footer">
      EliteProctorPrep &bull; NCSBN &amp; USMLE Clinical Licensure Prep &bull; Delivered via Resend
    </div>
  </div>
</body>
</html>
    `;

    const data = await resend.emails.send({
      from: fromEmail,
      to: [email],
      subject: `[EliteProctorPrep] Your ${examTrack} Diagnostic Report (${percentage}%)`,
      html: htmlContent,
    });

    return res.status(200).json({
      success: true,
      messageId: data.data?.id,
      message: `Score report successfully delivered to ${email}.`,
    });
  } catch (error: any) {
    console.error('Error dispatching email with Resend:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to dispatch email report via Resend.',
    });
  }
}
