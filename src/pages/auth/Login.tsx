import React, { useState, useCallback, memo } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/auth';
import { useUIStore } from '@/store/ui';
import { authService } from '@/services/api';
import { loginSchema, LoginFormData } from '@/schemas/auth.schemas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AuthLayout } from '@/components/auth';

/**
 * Login component - Optimized for performance and responsiveness
 * Uses React.memo for performance optimization
 */
const Login: React.FC = memo(() => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, setLoading, setError } = useAuthStore();
  const { addNotification } = useUIStore();
  
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  });

  /**
   * Form submission handler - Memoized to prevent unnecessary re-renders
   */
  const onSubmit = useCallback(async (data: LoginFormData) => {
    setIsLoading(true);
    setLoading(true);
    setError(null);

    try {
      // Step 1: Login (backend sets JWT cookie automatically)
      const response = await authService.login(data.email, data.password);
      
      if (response.status === 'success' && response.data) {
        // Step 2: Update auth store with user data
        login(response.data);
        
        addNotification({
          type: 'success',
          title: 'Login Successful',
          message: `Welcome back, ${response.data.firstName}!`,
        });

        // Step 3: Check for pending invitation
        const pendingInvitationToken = sessionStorage.getItem('pendingInvitationToken');
        if (pendingInvitationToken) {
          sessionStorage.removeItem('pendingInvitationToken');
          navigate(`/workspace/accept-invitation?invitationToken=${pendingInvitationToken}`, { replace: true });
        } else {
          // Navigate to appropriate dashboard
          const returnUrl = location.state?.from?.pathname;
          const defaultPath = '/';
          const destination = returnUrl && !returnUrl.startsWith('/admin') ? returnUrl : defaultPath;
          navigate(destination, { replace: true });
        }
      } else {
        throw new Error(response.message || 'Login failed - invalid response');
      }
    } catch (error: any) {
      // Handle different error types
      let errorMessage = 'An error occurred during login';
      
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      // Handle specific error cases
      if (errorMessage.includes('Not verified')) {
        addNotification({
          type: 'error',
          title: 'Email Not Verified',
          message: 'Please verify your email address before logging in.',
        });
      } else if (errorMessage.includes('Incorrect email or password')) {
        addNotification({
          type: 'error',
          title: 'Invalid Credentials',
          message: 'Please check your email and password and try again.',
        });
      } else {
        addNotification({
          type: 'error',
          title: 'Login Failed',
          message: errorMessage,
        });
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  }, [login, setLoading, setError, addNotification, location.state?.from?.pathname, navigate]);

  /**
   * Remember me toggle handler - Memoized for performance
   */
  const handleRememberMeToggle = useCallback((checked: boolean) => {
    setRememberMe(checked);
  }, []);

  return (
    <AuthLayout 
      title="Welcome back"
      subtitle="Sign in to your account to continue"
      brandingContent={{
        title: 'Welcome to StarQuest',
        description: 'Embark on your learning journey through the cosmos. Track your progress, complete quests, and unlock achievements as you grow.',
        pulseColors: ['bg-blue-400', 'bg-purple-400', 'bg-yellow-400']
      }}
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
        
        {/* Password Field */}
        <motion.div 
          className="space-y-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Label htmlFor="password" className="text-white text-sm font-medium">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
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

        {/* Remember Me & Forgot Password */}
        <motion.div 
          className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => handleRememberMeToggle(e.target.checked)}
              className="w-4 h-4 rounded border-white/30 bg-white/10 text-blue-500 focus:ring-blue-500/20 transition-all duration-200"
            />
            <Label htmlFor="rememberMe" className="text-slate-300 text-sm">
              Remember me
            </Label>
          </div>
          <Link
            to="/forgot-password"
            className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 rounded px-1"
          >
            Forgot Password?
          </Link>
        </motion.div>
        
        {/* Login Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
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
                <span>Signing In...</span>
              </>
            ) : (
              <>
                <span>Sign in</span>
                <motion.svg 
                  className="w-4 h-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  whileHover={{ x: 2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </motion.svg>
              </>
            )}
          </Button>
        </motion.div>
        
        {/* Sign Up Link */}
        <motion.div 
          className="text-center pt-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-slate-400 text-sm">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 rounded px-1"
            >
              Sign Up
            </Link>
          </p>
        </motion.div>
      </form>
    </AuthLayout>
  );
});

Login.displayName = 'Login';

export default Login;
