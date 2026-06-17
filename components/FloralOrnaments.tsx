export function FloralBranchLeft({ className = "" }: { className?: string }) {
  return (
    <svg width="100" height="150" viewBox="0 0 100 150" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M20,150 C30,100 70,80 90,20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M35,115 Q40,95 65,95 Q50,110 35,115" fill="currentColor" opacity="0.6" />
      <path d="M55,75 Q60,55 85,60 Q70,75 55,75" fill="currentColor" opacity="0.6" />
      <path d="M75,40 Q85,25 100,35 Q85,45 75,40" fill="currentColor" opacity="0.6" />
      <path d="M30,130 Q15,115 5,125 Q15,135 30,130" fill="currentColor" opacity="0.6" />
    </svg>
  );
}

export function FloralBranchRight({ className = "" }: { className?: string }) {
  return (
    <svg width="100" height="150" viewBox="0 0 100 150" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M80,150 C70,100 30,80 10,20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M65,115 Q60,95 35,95 Q50,110 65,115" fill="currentColor" opacity="0.6" />
      <path d="M45,75 Q40,55 15,60 Q30,75 45,75" fill="currentColor" opacity="0.6" />
      <path d="M25,40 Q15,25 0,35 Q15,45 25,40" fill="currentColor" opacity="0.6" />
      <path d="M70,130 Q85,115 95,125 Q85,135 70,130" fill="currentColor" opacity="0.6" />
    </svg>
  );
}

export function FloralDivider({ className = "" }: { className?: string }) {
  return (
    <svg width="200" height="30" viewBox="0 0 200 30" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M10,15 L90,15" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <path d="M190,15 L110,15" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <path d="M100,20 L95,15 L100,10 L105,15 Z" fill="currentColor" />
      <circle cx="85" cy="15" r="2" fill="currentColor" />
      <circle cx="115" cy="15" r="2" fill="currentColor" />
    </svg>
  );
}

export function FloralCornerTopLeft({ className = "" }: { className?: string }) {
  return (
    <svg width="150" height="150" viewBox="0 0 150 150" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M0,0 L150,0 C150,82.84 82.84,150 0,150 L0,0 Z" fill="currentColor" opacity="0.05" />
      <path d="M10,0 C10,50 50,90 100,90" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.4" />
      <path d="M0,10 C50,10 90,50 90,100" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.4" />
      <path d="M20,20 C30,40 50,50 70,50 C50,50 40,30 20,20 Z" fill="currentColor" opacity="0.4" />
      <circle cx="15" cy="15" r="3" fill="currentColor" opacity="0.6" />
    </svg>
  );
}

export function FloralCornerBottomRight({ className = "" }: { className?: string }) {
  return (
    <svg width="150" height="150" viewBox="0 0 150 150" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M150,150 L0,150 C0,67.16 67.16,0 150,0 L150,150 Z" fill="currentColor" opacity="0.05" />
      <path d="M140,150 C140,100 100,60 50,60" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.4" />
      <path d="M150,140 C100,140 60,100 60,50" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.4" />
      <path d="M130,130 C120,110 100,100 80,100 C100,100 110,120 130,130 Z" fill="currentColor" opacity="0.4" />
      <circle cx="135" cy="135" r="3" fill="currentColor" opacity="0.6" />
    </svg>
  );
}
