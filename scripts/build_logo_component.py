import json

with open(r'g:\sites\CAMISETAS\scripts\smooth_logo_paths.json', 'r') as f:
    data = json.load(f)

w = data['width']
h = data['height']
s_path = data['s_path']
ing_path = data['ing_path']

# Generate React component
component_code = '''import React from 'react';

export interface SingularLogoProps {
  variant?: 'full' | 'icon' | 'compact';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'custom';
  height?: number | string;
  width?: number | string;
  className?: string;
  animated?: boolean;
  textColor?: string;
  showSubtitle?: boolean;
}

export const SingularLogo: React.FC<SingularLogoProps> = ({
  variant = 'full',
  size = 'md',
  height,
  width,
  className = '',
  animated = true,
  textColor,
  showSubtitle = false,
}) => {
  const heightMap = {
    sm: 28,
    md: 36,
    lg: 48,
    xl: 60,
    custom: height || 36,
  };

  const computedHeight = height || heightMap[size];

  if (variant === 'icon') {
    return (
      <svg
        viewBox="0 0 115 185"
        height={computedHeight}
        width={width || 'auto'}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`inline-block select-none overflow-visible ${className}`}
        aria-label="SINGULAR Icon"
      >
        <defs>
          <linearGradient id="singularIconFlameGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FF4500" />
            <stop offset="35%" stopColor="#FF6A00" />
            <stop offset="70%" stopColor="#FF8800" />
            <stop offset="100%" stopColor="#FFA800" />
          </linearGradient>
        </defs>

        <g className={animated ? 'singular-flame-animated' : ''} fill="url(#singularIconFlameGrad)">
          <path d="''' + s_path + '''" fillRule="evenodd" />
        </g>
      </svg>
    );
  }

  return (
    <div className={`inline-flex flex-col select-none ${className}`}>
      <svg
        viewBox="0 0 ''' + str(w) + ' ' + str(h) + '''"
        height={computedHeight}
        width={width || 'auto'}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible max-h-full"
        aria-label="SINGULAR Logo"
      >
        <defs>
          <linearGradient id="singularFlameGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FF4500" />
            <stop offset="35%" stopColor="#FF6A00" />
            <stop offset="70%" stopColor="#FF8800" />
            <stop offset="100%" stopColor="#FFA800" />
          </linearGradient>
        </defs>

        {/* EXACT VECTOR 'S' FLAME WITH PULSE ANIMATION */}
        <g className={animated ? 'singular-flame-animated' : ''} fill="url(#singularFlameGrad)">
          <path d="''' + s_path + '''" fillRule="evenodd" />
        </g>

        {/* EXACT VECTOR 'INGULAR' CHARACTERS (STATIC) */}
        <g fill={textColor || '#FFFFFF'}>
          <path d="''' + ing_path + '''" fillRule="evenodd" />
        </g>
      </svg>

      {showSubtitle && (
        <span className="text-[10px] text-orange-400/90 font-bold tracking-[0.28em] uppercase pl-1 -mt-0.5">
          Personalizador Textil
        </span>
      )}
    </div>
  );
};
'''

with open(r'g:\sites\CAMISETAS\src\components\common\SingularLogo.tsx', 'w', encoding='utf-8') as f:
    f.write(component_code)

print("Updated SingularLogo.tsx with exact vectors!")
