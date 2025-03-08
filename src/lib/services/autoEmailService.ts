import emailjs from '@emailjs/browser';

export class AutoEmailService {
    private static instance: AutoEmailService;
    private checkInterval: number = 1000 * 60 * 60; // Check every hour
    private intervalId: NodeJS.Timer | null = null;

    private constructor() {
        // Private constructor for singleton
    }

    public static getInstance(): AutoEmailService {
        if (!AutoEmailService.instance) {
            AutoEmailService.instance = new AutoEmailService();
        }
        return AutoEmailService.instance;
    }

    public startAutoEmailService() {
        // Clear any existing interval
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }

        // Start the service
        this.intervalId = setInterval(() => {
            this.checkAndSendBirthdayEmails();
        }, this.checkInterval);

        // Run immediately on start
        this.checkAndSendBirthdayEmails();
    }

    public stopAutoEmailService() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    private async checkAndSendBirthdayEmails() {
        try {
            // Get credentials from localStorage
            const emailServiceId = localStorage.getItem('emailServiceId');
            const emailTemplateId = localStorage.getItem('emailTemplateId');
            const publicKey = localStorage.getItem('publicKey');
            const emailTemplate = localStorage.getItem('emailTemplate');
            const lastEmailSent = localStorage.getItem('lastEmailSent');
            
            // Get students from localStorage
            const studentsJson = localStorage.getItem('students');
            if (!studentsJson) return;
            
            const students = JSON.parse(studentsJson);
            
            // Check if we have all required configurations
            if (!emailServiceId || !emailTemplateId || !publicKey || !emailTemplate) {
                console.error('Email configuration is incomplete');
                return;
            }

            // Initialize EmailJS
            emailjs.init(publicKey);

            // Get today's date
            const today = new Date();
            const todayString = today.toISOString().split('T')[0];

            // Don't send if already sent today
            if (lastEmailSent === todayString) {
                console.log('Emails already sent today');
                return;
            }

            // Find students with birthdays today
            const birthdayStudents = students.filter((student: any) => {
                const dob = new Date(student.dateOfBirth);
                return dob.getMonth() === today.getMonth() && dob.getDate() === today.getDate();
            });

            if (birthdayStudents.length === 0) {
                console.log('No birthdays today');
                return;
            }

            // Send emails to birthday students
            let sentCount = 0;
            for (const student of birthdayStudents) {
                try {
                    const processedTemplate = emailTemplate
                        .replace('[Name]', student.name)
                        .replace(/\[he\/she\]/g, student.gender === 'male' ? 'he' : 'she')
                        .replace(/\[him\/her\]/g, student.gender === 'male' ? 'him' : 'her')
                        .replace(/\[his\/her\]/g, student.gender === 'male' ? 'his' : 'her');

                    await emailjs.send(
                        emailServiceId,
                        emailTemplateId,
                        {
                            to_name: student.name,
                            to_email: student.email,
                            message: processedTemplate
                        }
                    );
                    sentCount++;
                } catch (error) {
                    console.error(`Failed to send email to ${student.email}:`, error);
                }
            }

            // Update stats
            if (sentCount > 0) {
                const currentSent = parseInt(localStorage.getItem('emailsSent') || '0');
                localStorage.setItem('emailsSent', (currentSent + sentCount).toString());
                localStorage.setItem('lastEmailSent', todayString);
            }

        } catch (error) {
            console.error('Error in automatic email service:', error);
        }
    }
}
