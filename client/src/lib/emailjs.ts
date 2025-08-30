import emailjs from '@emailjs/browser';

// EmailJS configuration
const EMAILJS_SERVICE_ID = 'service_parkplus'; // You'll need to replace with actual service ID
const EMAILJS_TEMPLATE_ID = 'template_parkplus'; // You'll need to replace with actual template ID  
const EMAILJS_PUBLIC_KEY = 'your_public_key'; // You'll need to replace with actual public key

// Initialize EmailJS
emailjs.init(EMAILJS_PUBLIC_KEY);

export interface EmailData {
  to_email: string;
  to_name: string;
  subject: string;
  message: string;
  from_name?: string;
  from_email?: string;
}

export const sendEmail = async (emailData: EmailData): Promise<boolean> => {
  try {
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      {
        to_email: emailData.to_email,
        to_name: emailData.to_name,
        subject: emailData.subject,
        message: emailData.message,
        from_name: emailData.from_name || 'Park Sarthi',
        from_email: emailData.from_email || 'noreply@parksarthi.com',
      }
    );

    console.log('Email sent successfully:', response.status, response.text);
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
};

// Predefined email templates
export const sendWelcomeEmail = async (userEmail: string, userName: string) => {
  return await sendEmail({
    to_email: userEmail,
    to_name: userName,
    subject: 'Welcome to Park Sarthi! 🚗',
    message: `
      Dear ${userName},

      Welcome to Park Sarthi - your smart parking companion!

      Your account has been successfully created. You can now:
      ✅ Find and book parking spots instantly
      ✅ Earn points and rewards with every booking
      ✅ Track your parking history
      ✅ Manage your digital wallet

      Start your parking journey today and earn 100 welcome bonus points!

      Best regards,
      The Park Sarthi Team
    `
  });
};

export const sendBookingConfirmation = async (
  userEmail: string, 
  userName: string, 
  bookingDetails: {
    location: string;
    slotNumber: string;
    bookingTime: string;
    duration: number;
    pointsEarned: number;
  }
) => {
  return await sendEmail({
    to_email: userEmail,
    to_name: userName,
    subject: 'Booking Confirmed - Park Sarthi 🅿️',
    message: `
      Dear ${userName},

      Your parking booking has been confirmed!

      📍 Location: ${bookingDetails.location}
      🚗 Slot Number: ${bookingDetails.slotNumber}
      ⏰ Booking Time: ${bookingDetails.bookingTime}
      ⏱️ Duration: ${bookingDetails.duration} minutes
      🎯 Points Earned: ${bookingDetails.pointsEarned}

      Please arrive on time and show this confirmation at the parking facility.

      Happy parking!
      Park Sarthi Team
    `
  });
};

export const sendWalletUpdate = async (
  userEmail: string, 
  userName: string, 
  transactionDetails: {
    type: string;
    amount: number;
    newBalance: number;
    description: string;
  }
) => {
  return await sendEmail({
    to_email: userEmail,
    to_name: userName,
    subject: 'Wallet Update - Park Sarthi 💰',
    message: `
      Dear ${userName},

      Your wallet has been updated!

      Transaction Type: ${transactionDetails.type}
      Amount: ₹${transactionDetails.amount}
      New Balance: ₹${transactionDetails.newBalance}
      Description: ${transactionDetails.description}

      Keep earning and saving with Park Sarthi!

      Best regards,
      Park Sarthi Team
    `
  });
};

export const sendPasswordReset = async (userEmail: string, userName: string, resetLink: string) => {
  return await sendEmail({
    to_email: userEmail,
    to_name: userName,
    subject: 'Password Reset Request - Park Sarthi 🔐',
    message: `
      Dear ${userName},

      We received a request to reset your password for your Park Sarthi account.

      Click the link below to reset your password:
      ${resetLink}

      This link will expire in 24 hours for security reasons.

      If you didn't request this password reset, please ignore this email.

      Best regards,
      Park Sarthi Team
    `
  });
};