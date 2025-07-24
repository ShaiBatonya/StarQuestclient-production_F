// Environment configuration for StarQuest application
interface EnvironmentConfig {
  API_BASE_URL: string;
  NODE_ENV: string;
  IS_DEVELOPMENT: boolean;
  IS_PRODUCTION: boolean;
}

// Default configuration values
const DEFAULT_CONFIG = {
  API_BASE_URL: 'http://localhost:6550/api',
  NODE_ENV: 'development',
};

// Create environment configuration based on environment variables or defaults
const createEnvironmentConfig = (): EnvironmentConfig => {
  // Check for Vite environment variables first, then fall back to defaults
  const apiBaseUrl = import.meta.env?.VITE_API_BASE_URL || DEFAULT_CONFIG.API_BASE_URL;
  const nodeEnv = import.meta.env?.NODE_ENV || DEFAULT_CONFIG.NODE_ENV;
  
  return {
    API_BASE_URL: apiBaseUrl,
    NODE_ENV: nodeEnv,
    IS_DEVELOPMENT: nodeEnv === 'development',
    IS_PRODUCTION: nodeEnv === 'production',
  };
};

// Export the configured environment
export const env = createEnvironmentConfig();

// Export individual values for convenience
export const {
  API_BASE_URL,
  NODE_ENV,
  IS_DEVELOPMENT,
  IS_PRODUCTION,
} = env;

// Helper function to validate required environment variables
export const validateEnvironment = (): void => {
  const requiredVars = ['API_BASE_URL'];
  
  const missingVars = requiredVars.filter(varName => {
    const value = env[varName as keyof EnvironmentConfig];
    return !value || value === '';
  });

  if (missingVars.length > 0) {
    console.warn('Missing environment variables:', missingVars);
  }

  // Log current configuration in development
  if (IS_DEVELOPMENT) {
    console.log('StarQuest Environment Configuration:', {
      API_BASE_URL: env.API_BASE_URL,
      NODE_ENV: env.NODE_ENV,
      IS_DEVELOPMENT: env.IS_DEVELOPMENT,
      IS_PRODUCTION: env.IS_PRODUCTION,
    });
  }
}; 

export const config = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:6500/api',
  NODE_ENV: import.meta.env.NODE_ENV || 'development',
  IS_DEVELOPMENT: import.meta.env.NODE_ENV === 'development',
  IS_PRODUCTION: import.meta.env.NODE_ENV === 'production',
} as const;

// TODO: PRODUCTION EMAIL CONFIGURATION REQUIRED
// ============================================
// 
// CURRENT STATE: Using Mailtrap for testing
// REQUIRED FOR PRODUCTION: Real email provider setup
//
// RECOMMENDED PROVIDERS (in order of preference):
// 1. SendGrid (most reliable, good delivery rates)
// 2. Amazon SES (cost-effective, AWS integration)
// 3. Mailgun (good for transactional emails)
// 4. Postmark (excellent delivery rates)
//
// BACKEND CONFIGURATION NEEDED:
// =============================
// 1. Update starquestDevServer/.env with:
//    EMAIL_PROVIDER=sendgrid
//    SENDGRID_API_KEY=your_sendgrid_api_key
//    EMAIL_FROM=noreply@starquest.com
//    EMAIL_FROM_NAME=StarQuest Team
//
// 2. Install SendGrid SDK in backend:
//    npm install @sendgrid/mail
//
// 3. Update backend email service (nodeMailer.ts):
//    - Replace Mailtrap config with SendGrid
//    - Use production-ready email templates
//    - Add proper error handling and retry logic
//    - Implement email tracking and analytics
//
// 4. DNS CONFIGURATION:
//    - Add SPF record: "v=spf1 include:sendgrid.net ~all"
//    - Add DKIM records (provided by SendGrid)
//    - Add DMARC policy for email security
//    - Verify domain ownership with email provider
//
// 5. EMAIL TEMPLATES TO UPDATE:
//    - Welcome/verification emails
//    - Workspace invitation emails  
//    - Password reset emails
//    - Daily/weekly report notifications
//    - Achievement notifications
//
// 6. MONITORING & DELIVERABILITY:
//    - Set up email delivery monitoring
//    - Configure bounce and complaint handling
//    - Add unsubscribe management
//    - Monitor sender reputation
//
// FRONTEND CHANGES (if needed):
// =============================
// - Email preview/testing components for admins
// - Email status tracking in admin panel
// - Delivery confirmation feedback
//
// TESTING REQUIREMENTS:
// ====================
// 1. Test all email flows in staging environment
// 2. Verify emails reach real inboxes (Gmail, Outlook, etc.)
// 3. Test email rendering across different clients
// 4. Validate all links and buttons work correctly
// 5. Check spam score and deliverability rates
//
// COMPLIANCE CONSIDERATIONS:
// =========================
// - GDPR compliance for EU users
// - CAN-SPAM Act compliance for US users
// - Include proper unsubscribe mechanisms
// - Add privacy policy links in emails
// - Implement consent management for marketing emails 