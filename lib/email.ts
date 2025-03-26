import nodemailer from "nodemailer"

// Configure email transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT),
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
  secure: process.env.NODE_ENV === "production",
})

export async function sendVerificationEmail(email: string, name: string, token: string) {
  const verificationUrl = `${process.env.NEXTAUTH_URL}/auth/verify-email?token=${token}`

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Verify your email address",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #6366f1;">Verify your email address</h2>
        <p>Hello ${name},</p>
        <p>Thank you for registering with PublicFund. Please verify your email address by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" style="background: linear-gradient(to right, #6366f1, #8b5cf6, #3b82f6); color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Verify Email</a>
        </div>
        <p>If you didn't create an account, you can safely ignore this email.</p>
        <p>Best regards,<br>The PublicFund Team</p>
      </div>
    `,
  }

  await transporter.sendMail(mailOptions)
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}`

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Reset your password",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #6366f1;">Reset your password</h2>
        <p>Hello,</p>
        <p>We received a request to reset your password. Click the button below to create a new password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background: linear-gradient(to right, #6366f1, #8b5cf6, #3b82f6); color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Reset Password</a>
        </div>
        <p>If you didn't request a password reset, you can safely ignore this email.</p>
        <p>Best regards,<br>The PublicFund Team</p>
      </div>
    `,
  }

  await transporter.sendMail(mailOptions)
}

export async function sendKycApprovalEmail(email: string, name: string) {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "KYC Verification Approved",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #6366f1;">KYC Verification Approved</h2>
        <p>Hello ${name},</p>
        <p>We're pleased to inform you that your KYC verification has been approved. You now have full access to all features of the PublicFund platform.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXTAUTH_URL}/dashboard" style="background: linear-gradient(to right, #6366f1, #8b5cf6, #3b82f6); color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Go to Dashboard</a>
        </div>
        <p>Thank you for your patience during the verification process.</p>
        <p>Best regards,<br>The PublicFund Team</p>
      </div>
    `,
  }

  await transporter.sendMail(mailOptions)
}

export async function sendKycRejectionEmail(email: string, name: string, reason: string) {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "KYC Verification Update",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #6366f1;">KYC Verification Update</h2>
        <p>Hello ${name},</p>
        <p>We regret to inform you that your KYC verification could not be approved at this time.</p>
        <p><strong>Reason:</strong> ${reason}</p>
        <p>You can resubmit your KYC information by visiting your account settings.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXTAUTH_URL}/auth/kyc" style="background: linear-gradient(to right, #6366f1, #8b5cf6, #3b82f6); color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Update KYC Information</a>
        </div>
        <p>If you have any questions, please contact our support team.</p>
        <p>Best regards,<br>The PublicFund Team</p>
      </div>
    `,
  }

  await transporter.sendMail(mailOptions)
}

