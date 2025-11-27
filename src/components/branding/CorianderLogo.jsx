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

  // Shopping Basket with Fresh Produce Icon
  const ShoppingIcon = ({ size }) => (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Basket base */}
      <path
        d="M15 45 L20 85 C21 90, 25 92, 30 92 L70 92 C75 92, 79 90, 80 85 L85 45"
        fill={colors.primary}
        stroke={darkMode ? '#166534' : '#15803D'}
        strokeWidth="2"
      />
      {/* Basket handle */}
      <path
        d="M30 45 C30 25, 50 15, 50 15 C50 15, 70 25, 70 45"
        stroke={colors.primary}
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />
      {/* Basket rim */}
      <rect
        x="12"
        y="42"
        width="76"
        height="8"
        rx="3"
        fill={colors.secondary}
      />
      {/* Basket weave lines */}
      <path
        d="M25 55 L30 82"
        stroke={darkMode ? '#166534' : '#15803D'}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M40 55 L42 82"
        stroke={darkMode ? '#166534' : '#15803D'}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M55 55 L55 82"
        stroke={darkMode ? '#166534' : '#15803D'}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M70 55 L65 82"
        stroke={darkMode ? '#166534' : '#15803D'}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Fresh produce peeking out - Apple */}
      <circle
        cx="35"
        cy="38"
        r="10"
        fill="#EF4444"
      />
      <path
        d="M35 28 C37 25, 40 26, 38 30"
        stroke="#166534"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      {/* Orange */}
      <circle
        cx="55"
        cy="35"
        r="9"
        fill="#F97316"
      />
      {/* Carrot top */}
      <path
        d="M72 32 L72 20"
        stroke="#22C55E"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M72 24 L68 18"
        stroke="#22C55E"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M72 24 L76 18"
        stroke="#22C55E"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Carrot */}
      <path
        d="M72 32 L72 42 L69 50 L75 50 L72 42"
        fill="#F97316"
      />
    </svg>
  );

  // Icon only variant
  if (variant === 'icon') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        <ShoppingIcon size={s.icon} />
      </div>
    );
  }

  // Stacked variant (icon on top, text below)
  if (variant === 'stacked') {
    return (
      <div className={`inline-flex flex-col items-center ${className}`}>
        <ShoppingIcon size={s.icon} />
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
        <ShoppingIcon size={s.icon} />
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
        <ShoppingIcon size={s.icon} />
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