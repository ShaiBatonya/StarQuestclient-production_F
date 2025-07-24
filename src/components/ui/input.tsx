import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';

const inputVariants = cva(
  'flex w-full rounded-md border border-input bg-background text-sm ring-offset-background transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'h-10 px-3 py-2',
        sm: 'h-8 px-2 py-1 text-xs',
        lg: 'h-12 px-4 py-3 text-base',
        xl: 'h-14 px-6 py-4 text-lg',
      },
      state: {
        default: 'border-input focus-visible:border-ring',
        success: 'border-green-500 focus-visible:border-green-600 focus-visible:ring-green-200',
        error: 'border-red-500 focus-visible:border-red-600 focus-visible:ring-red-200',
        warning: 'border-yellow-500 focus-visible:border-yellow-600 focus-visible:ring-yellow-200',
      },
      rounded: {
        none: 'rounded-none',
        sm: 'rounded-sm',
        default: 'rounded-md',
        lg: 'rounded-lg',
        full: 'rounded-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      state: 'default',
      rounded: 'default',
    },
  }
);

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  label?: string;
  floatingLabel?: boolean;
  helperText?: string;
  errorText?: string;
  successText?: string;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  showPasswordToggle?: boolean;
  loading?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    type = 'text',
    variant,
    state,
    rounded,
    label,
    floatingLabel = false,
    helperText,
    errorText,
    successText,
    icon,
    rightIcon,
    showPasswordToggle = false,
    loading = false,
    disabled,
    value,
    placeholder,
    id,
    ...props 
  }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const [showPassword, setShowPassword] = React.useState(false);
    const [hasValue, setHasValue] = React.useState(false);
    const inputId = id || React.useId();

    // Determine current state
    const currentState = errorText ? 'error' : successText ? 'success' : state || 'default';
    const inputType = showPasswordToggle && showPassword ? 'text' : type;

    React.useEffect(() => {
      setHasValue(Boolean(value));
    }, [value]);

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      props.onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      props.onBlur?.(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(Boolean(e.target.value));
      props.onChange?.(e);
    };

    const togglePassword = () => {
      setShowPassword(!showPassword);
    };

    const InputComponent = (
      <input
        type={inputType}
        className={cn(
          inputVariants({ variant, state: currentState, rounded }),
          // Icon spacing
          icon && 'pl-10',
          (rightIcon || showPasswordToggle || loading) && 'pr-10',
          // Floating label spacing
          floatingLabel && 'pt-6 pb-2',
          // Loading state
          loading && 'cursor-wait',
          // Focus animations
          'transform transition-all duration-200 ease-out',
          isFocused && 'scale-[1.02] shadow-lg',
          className
        )}
        ref={ref}
        id={inputId}
        value={value}
        placeholder={floatingLabel ? ' ' : placeholder}
        disabled={disabled || loading}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleChange}
        {...props}
      />
    );

    const PasswordToggle = showPasswordToggle && (
      <button
        type="button"
        onClick={togglePassword}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-200 z-10"
        tabIndex={-1}
      >
        {showPassword ? (
          <EyeOff className="h-4 w-4" />
        ) : (
          <Eye className="h-4 w-4" />
        )}
      </button>
    );

    const StatusIcon = (currentState === 'error' || currentState === 'success') && (
      <div className="absolute right-3 top-1/2 -translate-y-1/2 z-10">
        {currentState === 'error' && (
          <AlertCircle className="h-4 w-4 text-red-500" />
        )}
        {currentState === 'success' && (
          <CheckCircle2 className="h-4 w-4 text-green-500" />
        )}
      </div>
    );

    const LoadingSpinner = loading && (
      <div className="absolute right-3 top-1/2 -translate-y-1/2 z-10">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-muted border-t-foreground" />
      </div>
    );

    if (floatingLabel || label || helperText || errorText || successText) {
      return (
        <div className="space-y-2">
          {/* Regular Label */}
          {label && !floatingLabel && (
            <label 
              htmlFor={inputId}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 transition-colors duration-200"
            >
              {label}
            </label>
          )}

          {/* Input Container */}
          <div className="relative group">
            {/* Left Icon */}
            {icon && (
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-foreground transition-colors duration-200 z-10">
                {icon}
              </div>
            )}

            {InputComponent}

            {/* Floating Label */}
            {floatingLabel && (
              <label
                htmlFor={inputId}
                className={cn(
                  'absolute left-3 transition-all duration-200 pointer-events-none z-10',
                  (isFocused || hasValue) 
                    ? 'top-2 text-xs text-muted-foreground' 
                    : 'top-1/2 -translate-y-1/2 text-sm text-muted-foreground',
                  isFocused && 'text-ring',
                  currentState === 'error' && 'text-red-500',
                  currentState === 'success' && 'text-green-500'
                )}
              >
                {label || placeholder}
              </label>
            )}

            {/* Focus Ring Animation */}
            <div className={cn(
              'absolute inset-0 rounded-md border-2 border-transparent transition-colors duration-200 pointer-events-none',
              isFocused && 'border-ring/20'
            )} />

            {/* Right Icons */}
            {LoadingSpinner}
            {!loading && StatusIcon}
            {!loading && !StatusIcon && PasswordToggle}
            {!loading && !StatusIcon && !showPasswordToggle && rightIcon && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10">
                {rightIcon}
              </div>
            )}
          </div>

          {/* Helper/Error/Success Text */}
          {(helperText || errorText || successText) && (
            <div className={cn(
              'text-xs transition-all duration-200 transform',
              errorText ? 'text-red-500 animate-shake' : 
              successText ? 'text-green-500 animate-fade-in' : 
              'text-muted-foreground'
            )}>
              {errorText || successText || helperText}
            </div>
          )}
        </div>
      );
    }

    // Simple input without wrapper
    return (
      <div className="relative group">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-foreground transition-colors duration-200 z-10">
            {icon}
          </div>
        )}

        {InputComponent}

        {/* Focus Ring Animation */}
        <div className={cn(
          'absolute inset-0 rounded-md border-2 border-transparent transition-colors duration-200 pointer-events-none',
          isFocused && 'border-ring/20'
        )} />

        {LoadingSpinner}
        {!loading && StatusIcon}
        {!loading && !StatusIcon && PasswordToggle}
        {!loading && !StatusIcon && !showPasswordToggle && rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10">
            {rightIcon}
          </div>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

// Enhanced Search Input
const SearchInput = React.forwardRef<HTMLInputElement, InputProps & {
  onClear?: () => void;
  showClearButton?: boolean;
}>(({ onClear, showClearButton = true, rightIcon, ...props }, ref) => {
  const [searchValue, setSearchValue] = React.useState(props.value || '');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    props.onChange?.(e);
  };

  const handleClear = () => {
    setSearchValue('');
    onClear?.();
  };

  const clearButton = showClearButton && searchValue ? (
    <button
      type="button"
      onClick={handleClear}
      className="text-muted-foreground hover:text-foreground transition-colors duration-200"
    >
      ×
    </button>
  ) : null;

  return (
    <Input
      ref={ref}
      type="search"
      {...props}
      value={searchValue}
      onChange={handleChange}
      rightIcon={clearButton || rightIcon}
    />
  );
});
SearchInput.displayName = 'SearchInput';

export { Input, SearchInput, inputVariants }; 