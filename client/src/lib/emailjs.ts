import emailjs from '@emailjs/browser';

// EmailJS configuration
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

// Initialize EmailJS
if (EMAILJS_PUBLIC_KEY) {
  emailjs.init(EMAILJS_PUBLIC_KEY);
}

export interface EmailData {
  to_email: string;
  to_name: string;
  subject: string;
  message: string;
  from_name?: string;
  from_email?: string;
}

class EmailService {
  async sendEmail(emailData: EmailData): Promise<boolean> {
    try {
      if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
        console.warn('EmailJS configuration missing');
        return false;
      }

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
  }

  async sendValetConfirmation(
    userEmail: string,
    userName: string,
    destination: string,
    pickupTime: string,
    bookingId: string
  ): Promise<boolean> {
    return await this.sendEmail({
      to_email: userEmail,
      to_name: userName,
      subject: 'Valet Service Booking Confirmation',
      message: `Your valet service has been booked successfully for ${destination} on ${pickupTime}. Booking ID: ${bookingId}`,
      from_name: 'Park Sarthi Valet Team'
    });
  }

  async sendDocumentUploadConfirmation(
    userEmail: string,
    userName: string,
    documentType: string,
    fileName: string
  ): Promise<boolean> {
    return await this.sendEmail({
      to_email: userEmail,
      to_name: userName,
      subject: 'Document Upload Confirmation',
      message: `Your ${documentType} (${fileName}) has been uploaded successfully and is now securely stored.`,
      from_name: 'Park Sarthi Security Team'
    });
  }

  async sendAdminNotification(
    bookingType: string,
    userEmail: string,
    details: string
  ): Promise<boolean> {
    return await this.sendEmail({
      to_email: 'immayankparadkar@gmail.com',
      to_name: 'Admin',
      subject: `New ${bookingType} Booking`,
      message: `New booking received from ${userEmail}:\n\n${details}`,
      from_name: 'Park Sarthi System'
    });
  }
}

export const emailService = new EmailService();