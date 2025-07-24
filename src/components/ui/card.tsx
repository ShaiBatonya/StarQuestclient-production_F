import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const cardVariants = cva(
  'rounded-lg border bg-card text-card-foreground shadow transition-all duration-300 ease-out relative overflow-hidden group',
  {
    variants: {
      variant: {
        default: 'hover:shadow-lg border-border',
        elevated: 'shadow-lg hover:shadow-xl hover:-translate-y-1 border-border/50',
        interactive: 'cursor-pointer hover:shadow-xl hover:-translate-y-2 hover:border-primary/20 active:scale-[0.98]',
        'gaming-primary': 'bg-gradient-to-br from-gaming-primary/10 to-gaming-primary/5 border-gaming-primary/20 hover:border-gaming-primary/40 hover:shadow-gaming-primary/10 hover:shadow-xl',
        'gaming-secondary': 'bg-gradient-to-br from-gaming-secondary/10 to-gaming-secondary/5 border-gaming-secondary/20 hover:border-gaming-secondary/40 hover:shadow-gaming-secondary/10 hover:shadow-xl',
        'gaming-accent': 'bg-gradient-to-br from-gaming-accent/10 to-gaming-accent/5 border-gaming-accent/20 hover:border-gaming-accent/40 hover:shadow-gaming-accent/10 hover:shadow-xl',
        success: 'bg-gradient-to-br from-green-900/20 to-green-800/10 border-green-500/30 hover:border-green-400/50 hover:shadow-green-500/20 hover:shadow-xl',
        warning: 'bg-gradient-to-br from-yellow-900/20 to-yellow-800/10 border-yellow-500/30 hover:border-yellow-400/50 hover:shadow-yellow-500/20 hover:shadow-xl',
        danger: 'bg-gradient-to-br from-red-900/20 to-red-800/10 border-red-500/30 hover:border-red-400/50 hover:shadow-red-500/20 hover:shadow-xl',
        ghost: 'border-transparent hover:bg-accent/50 hover:shadow-md',
        glass: 'backdrop-blur-xl bg-gray-800/30 border-gray-700/30 hover:bg-gray-800/50 hover:border-gray-600/50',
      },
      padding: {
        none: 'p-0',
        sm: 'p-3',
        default: 'p-6',
        lg: 'p-8',
        xl: 'p-10',
      },
      rounded: {
        none: 'rounded-none',
        sm: 'rounded-sm',
        default: 'rounded-lg',
        lg: 'rounded-xl',
        xl: 'rounded-2xl',
        full: 'rounded-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'default',
      rounded: 'default',
    },
  }
);

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & 
  VariantProps<typeof cardVariants> & {
    hoverable?: boolean;
    shimmer?: boolean;
    pulse?: boolean;
    glow?: boolean;
  }
>(({ 
  className, 
  variant, 
  padding, 
  rounded, 
  hoverable = false, 
  shimmer = false,
  pulse = false,
  glow = false,
  children,
  onClick,
  ...props 
}, ref) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });

  const handleMouseMove = React.useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!hoverable) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePosition({ x, y });
  }, [hoverable]);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePosition({ x: 50, y: 50 });
  };

  return (
    <div
      ref={ref}
      className={cn(
        cardVariants({ variant, padding, rounded }),
        hoverable && 'transform-gpu transition-transform duration-300',
        shimmer && 'animate-shimmer',
        pulse && 'animate-pulse-subtle',
        glow && 'animate-glow-pulse',
        onClick && 'cursor-pointer',
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={hoverable && isHovered ? {
        transform: `perspective(1000px) rotateX(${(mousePosition.y - 50) * 0.1}deg) rotateY(${(mousePosition.x - 50) * 0.1}deg) translateZ(10px)`,
      } : undefined}
      {...props}
    >
      {/* Shine effect overlay */}
      {shimmer && (
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-purple-400/10 to-transparent" />
      )}

      {/* Glow effect */}
      {glow && (
        <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-gaming-primary/5 via-gaming-accent/5 to-gaming-secondary/5 blur-xl -z-10" />
      )}

      {/* Interactive spotlight */}
      {hoverable && isHovered && (
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(168, 85, 247, 0.15) 0%, transparent 50%)`
          }}
        />
      )}

      {children}
    </div>
  );
});
Card.displayName = 'Card';

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    animate?: boolean;
  }
>(({ className, animate = false, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex flex-col space-y-1.5 p-6',
      animate && 'group-hover:translate-y-[-2px] transition-transform duration-300',
      className
    )}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement> & {
    gradient?: boolean;
    level?: 1 | 2 | 3 | 4 | 5 | 6;
  }
>(({ className, gradient = false, level = 3, ...props }, ref) => {
  const Component = `h${level}` as keyof JSX.IntrinsicElements;
  
  return React.createElement(Component, {
    ref,
    className: cn(
      'text-2xl font-semibold leading-none tracking-tight transition-colors duration-300',
      gradient && 'bg-gradient-to-r from-gaming-primary to-gaming-secondary bg-clip-text text-transparent group-hover:from-gaming-secondary group-hover:to-gaming-accent',
      'group-hover:text-gaming-primary',
      className
    ),
    ...props
  });
});
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement> & {
    animate?: boolean;
  }
>(({ className, animate = false, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      'text-sm text-muted-foreground transition-colors duration-300',
      animate && 'group-hover:text-foreground',
      className
    )}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    animate?: boolean;
  }
>(({ className, animate = false, ...props }, ref) => (
  <div 
    ref={ref} 
    className={cn(
      'p-6 pt-0 transition-all duration-300',
      animate && 'group-hover:translate-y-[-1px]',
      className
    )} 
    {...props} 
  />
));
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    animate?: boolean;
  }
>(({ className, animate = false, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex items-center p-6 pt-0 transition-all duration-300',
      animate && 'group-hover:translate-y-[-1px]',
      className
    )}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';

// Specialized Gaming Cards
const QuestCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    difficulty?: 'easy' | 'medium' | 'hard' | 'expert';
    completed?: boolean;
    locked?: boolean;
    progress?: number;
  }
>(({ 
  className, 
  difficulty = 'easy', 
  completed = false, 
  locked = false, 
  progress = 0,
  children,
  ...props 
}, ref) => {
  const difficultyColors = {
    easy: 'from-green-500/20 to-green-600/10 border-green-400/30',
    medium: 'from-yellow-500/20 to-yellow-600/10 border-yellow-400/30', 
    hard: 'from-orange-500/20 to-red-600/10 border-orange-400/30',
    expert: 'from-purple-500/20 to-red-600/10 border-purple-400/30'
  };

  return (
    <Card
      ref={ref}
      variant="interactive"
      hoverable
      shimmer={!locked}
      glow={completed}
      className={cn(
        'bg-gradient-to-br',
        locked ? 'from-gray-500/10 to-gray-600/5 border-gray-400/20 opacity-60' : difficultyColors[difficulty],
        completed && 'ring-2 ring-green-400/50 shadow-green-400/20',
        className
      )}
      {...props}
    >
      {progress > 0 && progress < 100 && (
        <div className="absolute top-0 left-0 h-1 bg-gradient-to-r from-gaming-primary to-gaming-accent rounded-t-lg transition-all duration-500"
             style={{ width: `${progress}%` }} />
      )}
      {children}
    </Card>
  );
});
QuestCard.displayName = 'QuestCard';

const StatCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    trend?: 'up' | 'down' | 'neutral';
    highlight?: boolean;
  }
>(({ className, trend = 'neutral', highlight = false, children, ...props }, ref) => {
  const trendColors = {
    up: 'border-green-400/30 hover:border-green-400/50',
    down: 'border-red-400/30 hover:border-red-400/50',
    neutral: 'border-blue-400/30 hover:border-blue-400/50'
  };

  return (
    <Card
      ref={ref}
      variant="elevated"
      shimmer={highlight}
      pulse={highlight}
      className={cn(
        'transition-all duration-300',
        trendColors[trend],
        highlight && 'animate-pulse-ring',
        className
      )}
      {...props}
    >
      {children}
    </Card>
  );
});
StatCard.displayName = 'StatCard';

export { 
  Card, 
  CardHeader, 
  CardFooter, 
  CardTitle, 
  CardDescription, 
  CardContent,
  QuestCard,
  StatCard,
  cardVariants
}; 