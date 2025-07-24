import React, { useState, useCallback, memo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useUIStore } from '@/store/ui';
import { authService } from '@/services/api';
import { registerSchema, RegisterFormData } from '@/schemas/auth.schemas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AuthLayout } from '@/components/auth';

/**
 * Register component - Optimized for performance and responsiveness
 * Uses React.memo for performance optimization
 */
const Register: React.FC = memo(() => {
  const navigate = useNavigate();
  const { addNotification } = useUIStore();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
  });

  /**
   * Form submission handler - Memoized to prevent unnecessary re-renders
   */
  const onSubmit = useCallback(async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      const response = await authService.register(data);
      
      if (response.status === 'success') {
        addNotification({
          type: 'success',
          title: 'Registration Successful',
          message: 'Please check your email to verify your account',
        });
        
        // Pass email to verification page via URL params
        navigate(`/verification?email=${encodeURIComponent(data.email)}`);
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 
                          error?.message || 
                          'An error occurred during registration';
      
      addNotification({
        type: 'error',
        title: 'Registration Failed',
        message: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  }, [addNotification, navigate]);

  return (
    <AuthLayout 
      title="Create account"
      subtitle="Join StarQuest and start your learning journey"
      brandingContent={{
        title: 'Start Your Journey',
        description: 'Join thousands of learners exploring the cosmos of knowledge. Complete quests, earn rewards, and level up your skills.',
        pulseColors: ['bg-emerald-400', 'bg-cyan-400', 'bg-violet-400']
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* First Name & Last Name */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-white text-sm font-medium">
              First Name
            </Label>
            <Input
              id="firstName"
              type="text"
              placeholder="Enter first name"
              {...register('firstName')}
              className="h-11 bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl backdrop-blur-sm transition-all duration-200"
            />
            {errors.firstName && (
              <motion.p 
                className="text-red-400 text-sm"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                {errors.firstName.message}
              </motion.p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-white text-sm font-medium">
              Last Name
            </Label>
            <Input
              id="lastName"
              type="text"
              placeholder="Enter last name"
              {...register('lastName')}
              className="h-11 bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl backdrop-blur-sm transition-all duration-200"
            />
            {errors.lastName && (
              <motion.p 
                className="text-red-400 text-sm"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                {errors.lastName.message}
              </motion.p>
            )}
          </div>
        </motion.div>

        {/* Email */}
        <motion.div 
          className="space-y-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
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

        {/* Phone Number (Optional) */}
        <motion.div 
          className="space-y-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Label htmlFor="phoneNumber" className="text-white text-sm font-medium">
            Phone Number <span className="text-slate-400">(Optional)</span>
          </Label>
          <Input
            id="phoneNumber"
            type="tel"
            placeholder="Enter 10-digit phone number"
            {...register('phoneNumber')}
            className="h-11 bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl backdrop-blur-sm transition-all duration-200"
          />
          {errors.phoneNumber && (
            <motion.p 
              className="text-red-400 text-sm"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {errors.phoneNumber.message}
            </motion.p>
          )}
        </motion.div>

        {/* Password */}
        <motion.div 
          className="space-y-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Label htmlFor="password" className="text-white text-sm font-medium">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="Create a strong password"
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

        {/* Confirm Password */}
        <motion.div 
          className="space-y-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Label htmlFor="passwordConfirm" className="text-white text-sm font-medium">
            Confirm Password
          </Label>
          <Input
            id="passwordConfirm"
            type="password"
            placeholder="Confirm your password"
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
          transition={{ delay: 0.6 }}
        >
          <p>Password must be 8-10 characters with:</p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>At least one lowercase letter</li>
            <li>At least one uppercase letter</li>
            <li>At least one number</li>
          </ul>
        </motion.div>



        {/* Register Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
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
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>Create Account</span>
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

        {/* Sign In Link */}
        <motion.div 
          className="text-center pt-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <p className="text-slate-400 text-sm">
            Already have an account?{' '}
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

Register.displayName = 'Register';

export default Register;
