import React from 'react';

export default function CorianderLogo({ 
  variant = 'full', // 'full', 'icon', 'horizontal', 'stacked'
  size = 'medium', // 'small', 'medium', 'large', 'xlarge'
  darkMode = false,
  className = ''
}) {
  const sizes = {
    small: { icon: 32, text: 14, subtext: 8 },
    medium: { icon: 48, text: 20, subtext: 10 },
    large: { icon: 64, text: 28, subtext: 14 },
    xlarge: { icon: 96, text: 40, subtext: 18 }
  };

  const s = sizes[size] || sizes.medium;
  
  const colors = {
    primary: darkMode ? '#4ADE80' : '#166534', // Green
    secondary: darkMode ? '#FCD34D' : '#B45309', // Amber/Gold
    text: darkMode ? '#FFFFFF' : '#1F2937',
    subtext: darkMode ? '#D1D5DB' : '#6B7280'
  };

  // Coriander Leaf SVG Icon
  const LeafIcon = ({ size }) => (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Main leaf shape */}
      <path
        d="M50 10 C30 25, 15 45, 20 70 C25 85, 40 95, 50 95 C60 95, 75 85, 80 70 C85 45, 70 25, 50 10"
        fill={colors.primary}
      />
      {/* Leaf veins */}
      <path
        d="M50 20 L50 85"
        stroke={darkMode ? '#166534' : '#15803D'}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M50 35 C40 40, 32 50, 30 60"
        stroke={darkMode ? '#166534' : '#15803D'}
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M50 35 C60 40, 68 50, 70 60"
        stroke={darkMode ? '#166534' : '#15803D'}
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M50 55 C42 58, 36 65, 35 72"
        stroke={darkMode ? '#166534' : '#15803D'}
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M50 55 C58 58, 64 65, 65 72"
        stroke={darkMode ? '#166534' : '#15803D'}
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Accent circle */}
      <circle
        cx="50"
        cy="15"
        r="4"
        fill={colors.secondary}
      />
    </svg>
  );

  // Icon only variant
  if (variant === 'icon') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        <LeafIcon size={s.icon} />
      </div>
    );
  }

  // Stacked variant (icon on top, text below)
  if (variant === 'stacked') {
    return (
      <div className={`inline-flex flex-col items-center ${className}`}>
        <LeafIcon size={s.icon} />
        <div className="text-center mt-2">
          <div 
            style={{ 
              fontSize: s.text, 
              fontWeight: 700, 
              color: colors.text,
              fontFamily: 'Georgia, serif',
              letterSpacing: '0.02em'
            }}
          >
            CORIANDER
          </div>
          <div 
            style={{ 
              fontSize: s.subtext, 
              fontWeight: 600, 
              color: colors.secondary,
              fontFamily: 'Arial, sans-serif',
              letterSpacing: '0.15em',
              marginTop: 2
            }}
          >
            CASH & CARRY
          </div>
        </div>
      </div>
    );
  }

  // Horizontal variant (icon left, text right inline)
  if (variant === 'horizontal') {
    return (
      <div className={`inline-flex items-center gap-3 ${className}`}>
        <LeafIcon size={s.icon} />
        <div>
          <div 
            style={{ 
              fontSize: s.text, 
              fontWeight: 700, 
              color: colors.text,
              fontFamily: 'Georgia, serif',
              letterSpacing: '0.02em',
              lineHeight: 1.1
            }}
          >
            CORIANDER
          </div>
          <div 
            style={{ 
              fontSize: s.subtext, 
              fontWeight: 600, 
              color: colors.secondary,
              fontFamily: 'Arial, sans-serif',
              letterSpacing: '0.15em'
            }}
          >
            CASH & CARRY
          </div>
        </div>
      </div>
    );
  }

  // Full variant (default - horizontal with tagline)
  return (
    <div className={`inline-flex items-center gap-4 ${className}`}>
      <div className="flex-shrink-0">
        <LeafIcon size={s.icon} />
      </div>
      <div>
        <div 
          style={{ 
            fontSize: s.text, 
            fontWeight: 700, 
            color: colors.text,
            fontFamily: 'Georgia, serif',
            letterSpacing: '0.02em',
            lineHeight: 1.1
          }}
        >
          CORIANDER
        </div>
        <div 
          style={{ 
            fontSize: s.subtext, 
            fontWeight: 600, 
            color: colors.secondary,
            fontFamily: 'Arial, sans-serif',
            letterSpacing: '0.15em',
            marginTop: 2
          }}
        >
          CASH & CARRY
        </div>
        <div 
          style={{ 
            fontSize: s.subtext * 0.85, 
            color: colors.subtext,
            fontFamily: 'Arial, sans-serif',
            marginTop: 4,
            fontStyle: 'italic'
          }}
        >
          Quality Wholesale Since 2025
        </div>
      </div>
    </div>
  );
}

// Letterhead Component for official documents
export function LetterheadLogo({ className = '' }) {
  return (
    <div className={`flex items-center justify-between border-b-2 border-green-700 pb-4 ${className}`}>
      <CorianderLogo variant="horizontal" size="large" />
      <div className="text-right text-sm text-gray-600">
        <p className="font-semibold text-gray-800">Coriander Cash & Carry Ltd</p>
        <p>123 High Street, London, SW1A 1AA</p>
        <p>Tel: 020 1234 5678</p>
        <p>info@coriandercashandcarry.co.uk</p>
        <p className="text-xs text-gray-500 mt-1">VAT Reg: GB 123 4567 89</p>
      </div>
    </div>
  );
}

// Footer for documents
export function DocumentFooter({ className = '' }) {
  return (
    <div className={`border-t border-gray-300 pt-3 mt-8 text-center text-xs text-gray-500 ${className}`}>
      <p>Coriander Cash & Carry Ltd | Registered in England & Wales | Company No: 12345678</p>
      <p>Registered Office: 123 High Street, London, SW1A 1AA</p>
    </div>
  );
}