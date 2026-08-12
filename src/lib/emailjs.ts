// EmailJS configuration - https://www.emailjs.com/docs/
// Create an account, an email service, and a template at emailjs.com,
// then swap these three placeholders for the real values from your
// dashboard. Until then, sending will fail and the contact form falls
// back to its "Something went wrong" state (the submission is still
// saved to localStorage as a backup either way - see sections/contact.tsx).
export const EMAILJS_SERVICE_ID = "YOUR_EMAILJS_SERVICE_ID"; // Get from emailjs.com dashboard
export const EMAILJS_TEMPLATE_ID = "YOUR_EMAILJS_TEMPLATE_ID"; // Get from emailjs.com dashboard
export const EMAILJS_PUBLIC_KEY = "YOUR_EMAILJS_PUBLIC_KEY"; // Get from emailjs.com dashboard

// Destination address - your EmailJS template should send To this
// address (either hardcode it in the template's "To Email" field, or
// reference {{to_email}} if the template is built to use it).
export const CONTACT_DESTINATION_EMAIL = "hello@auxai.ai";
