import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden group touch-manipulation',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 active:scale-95',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground active:scale-95',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 active:scale-95',
        ghost: 'hover:bg-accent hover:text-accent-foreground active:scale-95',
        link: 'text-primary underline-offset-4 hover:underline',
        // Gaming variants
        gaming: 'gaming-button-primary text-white font-semibold shadow-lg hover:shadow-xl active:scale-95 hover:scale-105',
        'gaming-secondary': 'gaming-button-secondary text-white font-semibold shadow-lg hover:shadow-xl active:scale-95 hover:scale-105',
        'gaming-outline': 'border-2 border-gaming-primary text-gaming-primary bg-transparent hover:bg-gaming-primary hover:text-white active:scale-95 hover:scale-105',
        success: 'bg-green-600 text-white hover:bg-green-700 active:scale-95 hover:scale-105',
        warning: 'bg-yellow-600 text-white hover:bg-yellow-700 active:scale-95 hover:scale-105',
        danger: 'bg-red-600 text-white hover:bg-red-700 active:scale-95 hover:scale-105',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        xl: 'h-12 rounded-lg px-10 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

interface RippleProps {
  x: number;
  y: number;
  size: number;
}

const Ripple: React.FC<RippleProps & { color?: string }> = ({ x, y, size, color = 'rgba(255, 255, 255, 0.5)' }) => {
  return (
    <span
      className="absolute rounded-full pointer-events-none animate-ping"
      style={{
        left: x,
        top: y,
        width: size,
        height: size,
        backgroundColor: color,
        transform: 'translate(-50%, -50%)',
        animationDuration: '0.6s',
        animationFillMode: 'forwards',
      }}
    />
  );
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  ripple?: boolean;
  rippleColor?: string;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    asChild = false, 
    loading = false,
    ripple = true,
    rippleColor,
    icon,
    rightIcon,
    children,
    onClick,
    disabled,
    ...props 
  }, ref) => {
    const [ripples, setRipples] = React.useState<RippleProps[]>([]);
    const [isPressed, setIsPressed] = React.useState(false);

    const handleClick = React.useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled || loading) return;

      if (ripple) {
        const button = event.currentTarget;
        const rect = button.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const size = Math.max(rect.width, rect.height) * 1.5;

        const newRipple: RippleProps = { x, y, size };
        setRipples(prev => [...prev, newRipple]);

        // Remove ripple after animation
        setTimeout(() => {
          setRipples(prev => prev.slice(1));
        }, 600);
      }

      // Call original onClick
      onClick?.(event);
    }, [disabled, loading, ripple, onClick]);

    const handleMouseDown = () => setIsPressed(true);
    const handleMouseUp = () => setIsPressed(false);
    const handleMouseLeave = () => setIsPressed(false);

    if (asChild) {
      return (
        <Slot
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          {...props}
        >
          {children}
        </Slot>
      );
    }

    const getRippleColor = () => {
      if (rippleColor) return rippleColor;
      
      switch (variant) {
        case 'gaming':
        case 'gaming-secondary':
          return 'rgba(255, 255, 255, 0.3)';
        case 'success':
          return 'rgba(255, 255, 255, 0.4)';
        case 'warning':
          return 'rgba(255, 255, 255, 0.4)';
        case 'danger':
          return 'rgba(255, 255, 255, 0.4)';
        case 'outline':
        case 'ghost':
          return 'rgba(221, 54, 36, 0.2)';
        default:
          return 'rgba(255, 255, 255, 0.3)';
      }
    };

    return (
      <button
        className={cn(
          buttonVariants({ variant, size, className }),
          isPressed && 'brightness-110 scale-95',
          loading && 'cursor-wait',
          'transition-all duration-150 ease-out'
        )}
        ref={ref}
        disabled={disabled || loading}
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {/* Ripple effects */}
        {ripples.map((ripple, index) => (
          <Ripple
            key={index}
            x={ripple.x}
            y={ripple.y}
            size={ripple.size}
            color={getRippleColor()}
          />
        ))}

        {/* Loading spinner */}
        {loading && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}

        {/* Left icon */}
        {icon && !loading && (
          <span className="mr-2 transition-transform duration-200 group-hover:scale-110">
            {icon}
          </span>
        )}

        {/* Button content */}
        <span className={cn(
          'transition-all duration-200',
          loading && 'opacity-70',
          'group-hover:tracking-wider'
        )}>
          {children}
        </span>

        {/* Right icon */}
        {rightIcon && (
          <span className="ml-2 transition-transform duration-200 group-hover:scale-110 group-hover:translate-x-1">
            {rightIcon}
          </span>
        )}

        {/* Shine effect for gaming buttons */}
        {(variant === 'gaming' || variant === 'gaming-secondary') && (
          <div className="absolute inset-0 -top-full group-hover:top-full transition-all duration-500 bg-gradient-to-r from-transparent via-white/20 to-transparent transform skew-x-12" />
        )}
      </button>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants }; 