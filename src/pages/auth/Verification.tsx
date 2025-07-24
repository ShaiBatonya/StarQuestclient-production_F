import React, { useState, useEffect, useCallback, memo } from 'react';
import { Link as RouterLink, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUIStore } from '@/store/ui';
import { authService } from '@/services/api';
import { verifyEmailSchema, VerifyEmailFormData } from '@/schemas/auth.schemas';
import { AuthLayout } from '@/components/auth';

/**
 * Verification component - Optimized for performance and responsiveness
 * Uses React.memo for performance optimization
 */
const Verification: React.FC = memo(() => {
  const { addNotification } = useUIStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<VerifyEmailFormData>({
    resolver: zodResolver(verifyEmailSchema),
    mode: 'onChange',
  });

  // Get email from URL params if available
  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setValue('email', emailParam);
    }
  }, [searchParams, setValue]);

  // Countdown timer for resend cooldown
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const emailValue = watch('email');

  /**
   * Form submission handler - Memoized to prevent unnecessary re-renders
   */
  const onSubmit = useCallback(async (data: VerifyEmailFormData) => {
    setIsLoading(true);
    try {
      const response = await authService.verifyEmail(data);
      
      if (response.status === 'success') {
        addNotification({
          type: 'success',
          title: 'Email Verified',
          message: 'Your email has been successfully verified! You can now log in.',
        });
        
        // Check if there's a pending invitation
        const pendingInvitationToken = sessionStorage.getItem('pendingInvitationToken');
        if (pendingInvitationToken) {
          sessionStorage.removeItem('pendingInvitationToken');
          navigate(`/workspace/accept-invitation?invitationToken=${pendingInvitationToken}`);
        } else {
          navigate('/login');
        }
      } else {
        throw new Error(response.message || 'Verification failed');
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 
                          error?.message || 
                          'An error occurred during verification';
      
      addNotification({
        type: 'error',
        title: 'Verification Failed',
        message: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  }, [addNotification, navigate]);

  /**
   * Resend verification email handler
   */
  const handleResendCode = useCallback(async () => {
    if (resendCooldown > 0 || !emailValue) return;
    
    setIsResending(true);
    try {
      const response = await authService.resendVerificationEmail(emailValue);
      
      if (response.status === 'success') {
        addNotification({
          type: 'success',
          title: 'Verification Email Sent',
          message: 'A new verification code has been sent to your email address.',
        });
        
        // Set cooldown period (60 seconds)
        setResendCooldown(60);
      } else {
        throw new Error(response.message || 'Failed to resend verification email');
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 
                          error?.message || 
                          'Failed to resend verification email. Please try again.';
      
      addNotification({
        type: 'error',
        title: 'Resend Failed',
        message: errorMessage,
      });
    } finally {
      setIsResending(false);
    }
  }, [emailValue, resendCooldown, addNotification]);

  return (
    <AuthLayout 
      title="Verify Your Email"
      subtitle="We've sent a 6-digit verification code to your email address. Enter the code below to verify your account."
      showBranding={false}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email Field */}
        <motion.div 
          className="space-y-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Label htmlFor="email" className="text-white text-sm font-medium">
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email address"
            {...register('email')}
            className="h-11 bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl backdrop-blur-sm transition-all duration-200"
          />
          {errors.email && (
            <motion.p 
              className="text-red-400 text-sm"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {errors.email.message}
            </motion.p>
          )}
        </motion.div>

        {/* Verification Code Field */}
        <motion.div 
          className="space-y-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Label htmlFor="code" className="text-white text-sm font-medium">
            Verification Code
          </Label>
          <Input
            id="code"
            type="text"
            placeholder="Enter 6-digit verification code"
            maxLength={6}
            {...register('code')}
            className="h-11 bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl backdrop-blur-sm text-center text-lg font-mono tracking-widest transition-all duration-200"
          />
          {errors.code && (
            <motion.p 
              className="text-red-400 text-sm"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {errors.code.message}
            </motion.p>
          )}
        </motion.div>

        {/* Resend Code Link */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <button
            type="button"
            onClick={handleResendCode}
            className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 rounded px-1"
            disabled={isResending}
          >
            {isResending ? (
              <>
                <motion.div 
                  className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <span>Resending...</span>
              </>
            ) : (
              <>
                <span>Didn't receive the code? Resend code</span>
                <motion.svg 
                  className="w-4 h-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  whileHover={{ x: 2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </motion.svg>
              </>
            )}
          </button>
          {resendCooldown > 0 && (
            <p className="text-slate-400 text-xs mt-1">
              Resend available in {resendCooldown}s
            </p>
          )}
        </motion.div>
        
        {/* Continue Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            type="submit"
            className="w-full h-11 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl focus:ring-2 focus:ring-emerald-500/20 focus:ring-offset-2 focus:ring-offset-black/80 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <motion.div 
                  className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <span>Verifying...</span>
              </>
            ) : (
              <>
                <span>Verify Email</span>
                <motion.svg 
                  className="w-4 h-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  whileHover={{ x: 2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </motion.svg>
              </>
            )}
          </Button>
        </motion.div>

        {/* Back to Login Link */}
        <motion.div 
          className="text-center pt-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-slate-400 text-sm">
            Already verified?{' '}
            <RouterLink
              to="/login"
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 rounded px-1"
            >
              Sign In
            </RouterLink>
          </p>
        </motion.div>
      </form>
    </AuthLayout>
  );
});

Verification.displayName = 'Verification';

export default Verification;
