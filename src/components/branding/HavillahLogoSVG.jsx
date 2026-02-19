import React from 'react';

// High-quality SVG logo string for Havillah Marketplace (transparent background)
export const HAVILLAH_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 160" width="400" height="160">
  <!-- Transparent background (no fill) -->

  <!-- Icon: Green rounded square with H -->
  <rect x="10" y="20" width="120" height="120" rx="22" ry="22" fill="#166534"/>

  <!-- Shopping basket arc (top handle) -->
  <path d="M40 80 Q70 40 100 80" stroke="white" stroke-width="7" stroke-linecap="round" fill="none"/>

  <!-- Basket body -->
  <path d="M32 82 L35 115 Q36 122 44 122 L96 122 Q104 122 105 115 L108 82 Z" fill="white" opacity="0.95"/>

  <!-- Basket weave lines -->
  <line x1="50" y1="85" x2="48" y2="118" stroke="#166534" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="70" y1="83" x2="70" y2="119" stroke="#166534" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="90" y1="85" x2="92" y2="118" stroke="#166534" stroke-width="2.5" stroke-linecap="round"/>

  <!-- Basket rim -->
  <rect x="29" y="79" width="82" height="9" rx="4" fill="#B45309"/>

  <!-- Produce: apple -->
  <circle cx="52" cy="72" r="11" fill="#EF4444"/>
  <path d="M52 61 C54 57 58 58 56 63" stroke="#166534" stroke-width="2.5" stroke-linecap="round" fill="none"/>

  <!-- Produce: orange -->
  <circle cx="76" cy="69" r="10" fill="#F97316"/>

  <!-- Produce: green leaf/herb -->
  <path d="M96 66 Q104 56 112 60 Q108 72 96 66Z" fill="#22C55E"/>
  <line x1="96" y1="66" x2="106" y2="60" stroke="#166534" stroke-width="1.5"/>

  <!-- Text: Havillah -->
  <text x="148" y="88" font-family="Georgia, 'Times New Roman', serif" font-size="52" font-weight="700" fill="#166534" letter-spacing="-1">Havillah</text>

  <!-- Text: MARKETPLACE -->
  <text x="152" y="118" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="600" fill="#B45309" letter-spacing="6">MARKETPLACE</text>

  <!-- Decorative underline -->
  <line x1="148" y1="128" x2="390" y2="128" stroke="#166534" stroke-width="2.5" opacity="0.3"/>
</svg>`;

// Download the SVG file
export function downloadHavillahSVG() {
  const blob = new Blob([HAVILLAH_SVG], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Havillah-Marketplace-Logo.svg';
  document.body.appendChild(a);
  a.click();
  URL.revokeObjectURL(url);
  a.remove();
}

// Inline SVG React component (transparent bg, scalable)
export default function HavillahLogoSVG({ width = 300, className = '' }) {
  const height = Math.round(width * 0.4);
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 400 160"
      width={width}
      height={height}
      className={className}
    >
      {/* Icon: Green rounded square */}
      <rect x="10" y="20" width="120" height="120" rx="22" ry="22" fill="#166534"/>

      {/* Shopping basket handle arc */}
      <path d="M40 80 Q70 40 100 80" stroke="white" strokeWidth="7" strokeLinecap="round" fill="none"/>

      {/* Basket body */}
      <path d="M32 82 L35 115 Q36 122 44 122 L96 122 Q104 122 105 115 L108 82 Z" fill="white" opacity="0.95"/>

      {/* Basket weave lines */}
      <line x1="50" y1="85" x2="48" y2="118" stroke="#166534" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="70" y1="83" x2="70" y2="119" stroke="#166534" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="90" y1="85" x2="92" y2="118" stroke="#166534" strokeWidth="2.5" strokeLinecap="round"/>

      {/* Basket rim */}
      <rect x="29" y="79" width="82" height="9" rx="4" fill="#B45309"/>

      {/* Apple */}
      <circle cx="52" cy="72" r="11" fill="#EF4444"/>
      <path d="M52 61 C54 57 58 58 56 63" stroke="#166534" strokeWidth="2.5" strokeLinecap="round" fill="none"/>

      {/* Orange */}
      <circle cx="76" cy="69" r="10" fill="#F97316"/>

      {/* Herb leaf */}
      <path d="M96 66 Q104 56 112 60 Q108 72 96 66Z" fill="#22C55E"/>
      <line x1="96" y1="66" x2="106" y2="60" stroke="#166534" strokeWidth="1.5"/>

      {/* Havillah text */}
      <text x="148" y="88" fontFamily="Georgia, 'Times New Roman', serif" fontSize="52" fontWeight="700" fill="#166534" letterSpacing="-1">Havillah</text>

      {/* MARKETPLACE text */}
      <text x="152" y="118" fontFamily="Arial, Helvetica, sans-serif" fontSize="22" fontWeight="600" fill="#B45309" letterSpacing="6">MARKETPLACE</text>

      {/* Underline */}
      <line x1="148" y1="128" x2="390" y2="128" stroke="#166534" strokeWidth="2.5" opacity="0.3"/>
    </svg>
  );
}