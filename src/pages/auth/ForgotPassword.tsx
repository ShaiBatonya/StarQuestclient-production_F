import React, { useState, useCallback, memo } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useUIStore } from '@/store/ui';
import { forgotPasswordSchema, ForgotPasswordFormData } from '@/schemas/auth.schemas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AuthLayout } from '@/components/auth';

/**
 * ForgotPassword component - Optimized for performance and responsiveness
 * Uses React.memo for performance optimization
 */
const ForgotPassword: React.FC = memo(() => {
  const { addNotification } = useUIStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onChange',
  });

  const emailValue = watch('email');

  /**
   * Form submission handler - Memoized to prevent unnecessary re-renders
   */
  const onSubmit = useCallback(async () => {
    setIsLoading(true);
    try {
      // TODO: Implement forgotPassword method in authService
      // const response = await authService.forgotPassword(data.email);
      // Temporary placeholder: always show success
      addNotification({
        type: 'success',
        title: 'Reset Email Sent',
        message: 'If your email is registered, you will receive a password reset link.',
      });
      setIsLoading(false);
      return;
      // if (response.status === 'success') {
      //   addNotification({
      //     type: 'success',
      //     title: 'Reset Email Sent',
      //     message: 'If your email is registered, you will receive a password reset link.',
      //   });
      // } else {
      //   throw new Error(response.message || 'Reset failed');
      // }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 
                          error?.message || 
                          'An error occurred during password reset';
      
      addNotification({
        type: 'error',
        title: 'Reset Failed',
        message: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  }, [addNotification]);

  /**
   * Try again handler - Memoized for performance
   */
  const handleTryAgain = useCallback(() => {
    setIsSubmitted(false);
  }, []);

  if (isSubmitted) {
    return (
      <AuthLayout 
        title="Check Your Email"
        subtitle={`We've sent password reset instructions to ${emailValue}`}
        showBranding={false}
      >
        <motion.div 
          className="space-y-6 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <motion.p 
            className="text-slate-400 text-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Didn't receive the email? Check your spam folder or try again.
          </motion.p>
          
          <motion.div 
            className="space-y-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Button
              onClick={handleTryAgain}
              className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Try Again
            </Button>
            
            <Button
              asChild
              className="w-full h-11 bg-white/10 border-white/20 text-white hover:bg-white/20 font-semibold rounded-xl transition-all duration-200 backdrop-blur-sm"
            >
              <Link to="/login">Back to Sign In</Link>
            </Button>
          </motion.div>
        </motion.div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout 
      title="Reset Password"
      subtitle="Enter your email address and we'll send you a link to reset your password"
      showBranding={false}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Button
            type="submit"
            className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-2 focus:ring-offset-black/80 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <motion.div 
                  className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <span>Sending...</span>
              </>
            ) : (
              <>
                <span>Send Reset Link</span>
                <motion.svg 
                  className="w-4 h-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  whileHover={{ x: 2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </motion.svg>
              </>
            )}
          </Button>
        </motion.div>
        
        <motion.div 
          className="text-center pt-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-slate-400 text-sm">
            Remember your password?{' '}
            <Link
              to="/login"
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 rounded px-1"
            >
              Sign In
            </Link>
          </p>
        </motion.div>
      </form>
    </AuthLayout>
  );
});

ForgotPassword.displayName = 'ForgotPassword';

export default ForgotPassword;
