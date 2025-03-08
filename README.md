# Birthday Email Management System

A SvelteKit application for managing and sending automated birthday emails to students. Built with SvelteKit, Tailwind CSS, and shadcn/ui components.

## Features

- **Student Management**: Import and manage student data including name, email, gender, and date of birth
- **Email Template Management**: Create, edit, and delete custom email templates with gender-specific placeholders
- **Automated Birthday Detection**: Automatically identifies students with birthdays on the current date
- **Email Preview**: Preview emails before sending them
- **Email Tracking**: Track when emails were last sent
- **Responsive UI**: Full mobile and desktop support
- **EmailJS Integration**: Uses EmailJS service for reliable email delivery

## Setup & Configuration

### Prerequisites

- Bun installed
- EmailJS account (free tier available)

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   bun install
   ```
3. Configure your EmailJS account:
   - Create an account at [EmailJS](https://www.emailjs.com/)
   - Create an email service
   - Create an email template
   - Note your Service ID, Template ID, and Public Key

### EmailJS Template Configuration

1. In your EmailJS template, ensure you add `{{to_email}}` in the "To Email" field
2. Create placeholders for other dynamic content that match the parameters sent from the app:
   - Use `{{to_name}}` for the recipient's name
   - Use `{{message}}` for the email content

### Application Configuration

1. Navigate to the Settings page in the application
2. Enter your EmailJS credentials:
   - Email Service ID
   - Email Template ID
   - Public Key

## Usage

### Adding Students

1. Go to the Students page
2. Import students from a CSV file or add them manually
3. Ensure each student record includes name, email, gender, and date of birth

### Creating Email Templates

1. Go to the Email Management page
2. Click "Add Template"
3. Create templates using the following placeholders:
   - `[Name]` - Student's name
   - `[he/she]` - Gender-specific pronoun
   - `[him/her]` - Gender-specific pronoun
   - `[his/her]` - Gender-specific possessive pronoun

### Sending Birthday Emails

1. Go to the Email Management page
2. Click "Preview Today's Emails" to see which students have birthdays today
3. Click "Send Birthday Emails" to send emails to students with birthdays today

## Technical Details

- **State Management**: Uses Svelte's built-in reactivity system with localStorage for persistence
- **Email Processing**: Handles gender-specific text replacements for personalized emails
- **UI Components**: Built with shadcn/ui components and Tailwind CSS for styling
- **Responsive Design**: Adapts to various screen sizes using Tailwind's responsive utilities
- **Runtime**: Uses Bun for improved performance and development experience

## License

[MIT License](LICENSE)

## Support

For issues or questions, please open an issue in the GitHub repository.
