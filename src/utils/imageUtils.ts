/**
 * Optimized image loading utilities for StarQuest
 * Handles lazy loading, WebP conversion, and responsive images
 */

// Cache for loaded images to prevent duplicate requests
const imageCache = new Map<string, HTMLImageElement>();

// Preload critical images
export const preloadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    if (imageCache.has(src)) {
      resolve(imageCache.get(src)!);
      return;
    }

    const img = new Image();
    img.onload = () => {
      imageCache.set(src, img);
      resolve(img);
    };
    img.onerror = reject;
    img.src = src;
  });
};

// Lazy load images with Intersection Observer
export const lazyLoadImage = (img: HTMLImageElement, src: string) => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target as HTMLImageElement;
        target.src = src;
        target.classList.remove('opacity-0');
        target.classList.add('opacity-100', 'transition-opacity', 'duration-300');
        observer.unobserve(target);
      }
    });
  }, {
    rootMargin: '50px 0px',
    threshold: 0.1
  });

  observer.observe(img);
};

// Create optimized image component props
export const getOptimizedImageProps = (
  src: string,
  alt: string,
  options: {
    width?: number;
    height?: number;
    priority?: boolean;
    loading?: 'lazy' | 'eager';
  } = {}
) => {
  const { width, height, priority = false, loading = 'lazy' } = options;

  return {
    src,
    alt,
    width,
    height,
    loading: priority ? 'eager' : loading,
    decoding: 'async' as const,
    style: { 
      objectFit: 'cover' as const,
      ...(width && height && { aspectRatio: `${width}/${height}` })
    },
    onLoad: (e: React.SyntheticEvent<HTMLImageElement>) => {
      const img = e.currentTarget;
      img.classList.add('animate-fade-in');
    }
  };
};

// Avatar image optimization
export const getAvatarProps = (avatarName: string, size: number = 64) => {
  const avatarPath = `/src/assets/${avatarName}`;
  
  return getOptimizedImageProps(avatarPath, 'User Avatar', {
    width: size,
    height: size,
    priority: true, // Avatars are usually above fold
    loading: 'eager'
  });
};

// Background image optimization with WebP fallback
export const getBackgroundImageStyle = (imageName: string) => {
  const webpSrc = `/src/assets/${imageName.replace(/\.(jpg|jpeg|png)$/, '.webp')}`;
  const fallbackSrc = `/src/assets/${imageName}`;
  
  // Check WebP support
  const supportsWebP = (() => {
    const canvas = document.createElement('canvas');
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  })();

  return {
    backgroundImage: `url("${supportsWebP ? webpSrc : fallbackSrc}")`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  };
};

// Responsive image sizes
export const getResponsiveImageSizes = () => ({
  mobile: '(max-width: 768px) 100vw',
  tablet: '(max-width: 1024px) 50vw',
  desktop: '25vw'
});

// Image compression for uploads
export const compressImage = (
  file: File,
  maxWidth: number = 800,
  quality: number = 0.8
): Promise<Blob> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;

      // Draw and compress
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
      }, 'image/webp', quality);
    };

    img.src = URL.createObjectURL(file);
  });
}; 