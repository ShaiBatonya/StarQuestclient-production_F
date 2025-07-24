import React, { useState, useCallback, memo } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useUIStore } from '@/store/ui';
import { authService } from '@/services/api';
import { resetPasswordSchema, ResetPasswordFormData } from '@/schemas/auth.schemas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AuthLayout } from '@/components/auth';

/**
 * ResetPassword component - Optimized for performance and responsiveness
 * Uses React.memo for performance optimization
 */
const ResetPassword: React.FC = memo(() => {
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();
  const { addNotification } = useUIStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onChange',
  });

  /**
   * Form submission handler - Memoized to prevent unnecessary re-renders
   */
  const onSubmit = useCallback(async (data: ResetPasswordFormData) => {
    if (!token) {
      addNotification({
        type: 'error',
        title: 'Invalid Reset Link',
        message: 'The password reset link is invalid or expired. Please request a new one.',
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await authService.resetPassword(token, data);
      
      if (response.status === 'success') {
        setIsSuccess(true);
        addNotification({
          type: 'success',
          title: 'Password Reset Successful',
          message: 'Your password has been successfully reset. You can now log in with your new password.',
        });
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        throw new Error(response.message || 'Password reset failed');
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 
                          error?.message || 
                          'Failed to reset password. Please try again.';
      
      addNotification({
        type: 'error',
        title: 'Password Reset Failed',
        message: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  }, [token, addNotification, navigate]);

  // Handle missing or invalid token
  if (!token) {
    return (
      <AuthLayout 
        title="Invalid Reset Link"
        subtitle="This password reset link is invalid or has expired. Please request a new password reset link."
        showBranding={false}
      >
        <motion.div 
          className="space-y-4 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <motion.div 
            className="space-y-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Button
              asChild
              className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Link to="/forgot-password">Request New Reset Link</Link>
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

  // Success state
  if (isSuccess) {
    return (
      <AuthLayout 
        title="Password Reset Successful"
        subtitle="Your password has been successfully reset. Redirecting to login..."
        showBranding={false}
      >
        <motion.div 
          className="flex items-center justify-center space-x-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {['bg-emerald-400', 'bg-cyan-400', 'bg-violet-400'].map((color, index) => (
            <motion.div
              key={index}
              className={`w-3 h-3 ${color} rounded-full`}
              animate={{ 
                scale: [1, 1.2, 1], 
                opacity: [0.7, 1, 0.7] 
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: index * 0.3,
                ease: "easeInOut"
              }}
            />
          ))}
        </motion.div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout 
      title="Reset Your Password"
      subtitle="Enter your new password below to complete the reset process"
      showBranding={false}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* New Password Field */}
        <motion.div 
          className="space-y-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Label htmlFor="password" className="text-white text-sm font-medium">
            New Password
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your new password"
            {...register('password')}
            className="h-11 bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl backdrop-blur-sm transition-all duration-200"
            showPasswordToggle
          />
          {errors.password && (
            <motion.p 
              className="text-red-400 text-sm"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {errors.password.message}
            </motion.p>
          )}
        </motion.div>

        {/* Confirm Password Field */}
        <motion.div 
          className="space-y-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Label htmlFor="passwordConfirm" className="text-white text-sm font-medium">
            Confirm New Password
          </Label>
          <Input
            id="passwordConfirm"
            type="password"
            placeholder="Confirm your new password"
            {...register('passwordConfirm')}
            className="h-11 bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl backdrop-blur-sm transition-all duration-200"
            showPasswordToggle
          />
          {errors.passwordConfirm && (
            <motion.p 
              className="text-red-400 text-sm"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {errors.passwordConfirm.message}
            </motion.p>
          )}
        </motion.div>

        {/* Password Requirements */}
        <motion.div 
          className="text-xs text-slate-400 space-y-1"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <p>Password must be 8-10 characters with:</p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>At least one lowercase letter</li>
            <li>At least one uppercase letter</li>
            <li>At least one number</li>
          </ul>
        </motion.div>

        {/* Reset Button */}
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
                <span>Resetting...</span>
              </>
            ) : (
              <>
                <span>Reset Password</span>
                <motion.svg 
                  className="w-4 h-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  whileHover={{ x: 2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
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

ResetPassword.displayName = 'ResetPassword';

export default ResetPassword; 