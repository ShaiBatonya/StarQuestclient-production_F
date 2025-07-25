/**
 * Environment Configuration for StarQuest Application
 * 
 * This module provides a centralized configuration for environment variables
 * and ensures proper API base URL configuration with /api prefix.
 */

interface EnvironmentConfig {
  API_BASE_URL: string;
  IS_DEVELOPMENT: boolean;
  IS_PRODUCTION: boolean;
  MODE: string;
}

/**
 * Ensures the API base URL ends with '/api'
 */
function ensureApiSuffix(url: string): string {
  if (!url) return 'https://api.starquest.app';
  
  // Remove trailing slash if present
  const cleanUrl = url.replace(/\/$/, '');
  
  // Add /api if not already present
  if (!cleanUrl.endsWith('/api')) {
    return `${cleanUrl}/api`;
  }
  
  return cleanUrl;
}

/**
 * Create environment configuration based on Vite environment variables
 */
function createEnvironmentConfig(): EnvironmentConfig {
  const mode = import.meta.env.MODE || 'development';
  const apiBaseUrl = ensureApiSuffix(
    import.meta.env.VITE_API_BASE_URL || 'https://api.starquest.app'
  );
  
  return {
    API_BASE_URL: apiBaseUrl,
    IS_DEVELOPMENT: mode === 'development',
    IS_PRODUCTION: mode === 'production',
    MODE: mode,
  };
}

// Export the configured environment
const env = createEnvironmentConfig();

// Export individual values for convenience
export const { API_BASE_URL, IS_DEVELOPMENT, IS_PRODUCTION, MODE } = env;

/**
 * Professional environment logging function
 */
export function logEnvironment(): void {
  const config = {
    Environment: MODE,
    'API Base URL': API_BASE_URL,
    'Development Mode': IS_DEVELOPMENT,
    'Production Mode': IS_PRODUCTION,
  };
  
  console.group('🚀 StarQuest Environment Configuration');
  Object.entries(config).forEach(([key, value]) => {
    const icon = key === 'API Base URL' ? '🌐' : 
                 key === 'Environment' ? '⚙️' : 
                 key.includes('Mode') ? (value ? '✅' : '❌') : '📋';
    console.log(`${icon} ${key}:`, value);
  });
  console.groupEnd();
  
  // Validate API configuration
  if (!API_BASE_URL.includes('/api')) {
    console.error('🚨 CRITICAL: API_BASE_URL missing /api suffix');
  }
}

/**
 * Validate required environment variables
 */
export function validateEnvironment(): void {
  logEnvironment();
  
  if (!API_BASE_URL) {
    console.warn('⚠️ API_BASE_URL not configured, using default');
  }
}

/**
 * PRODUCTION DEPLOYMENT NOTES:
 * 
 * For production builds, ensure the following environment variables are set:
 * 
 * VITE_API_BASE_URL=https://api.starquest.app/api
 * 
 * The /api suffix is CRITICAL for all API requests to work correctly.
 * 
 * Local development example:
 * VITE_API_BASE_URL=http://localhost:3000/api
 * 
 * All API services inherit from BaseApiService which uses this configuration.
 * Direct fetch calls and axiosInstance also use this base URL.
 */

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