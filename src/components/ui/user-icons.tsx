// Public restroom style user icons for different roles

export const TeacherIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="currentColor">
    {/* Head */}
    <circle cx="50" cy="35" r="15" />
    {/* Body */}
    <path d="M 35 50 Q 35 48 37 48 L 63 48 Q 65 48 65 50 L 65 75 Q 65 77 63 77 L 37 77 Q 35 77 35 75 Z" />
    {/* Mortarboard cap */}
    <rect x="35" y="15" width="30" height="3" />
    <polygon points="30,18 70,18 50,10" />
    {/* Tassel */}
    <line x1="70" y1="18" x2="75" y2="25" strokeWidth="2" stroke="currentColor" />
    <circle cx="75" cy="27" r="2" />
  </svg>
);

export const StudentIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="currentColor">
    {/* Head */}
    <circle cx="50" cy="40" r="15" />
    {/* Body */}
    <path d="M 35 55 Q 35 53 37 53 L 63 53 Q 65 53 65 55 L 65 80 Q 65 82 63 82 L 37 82 Q 35 82 35 80 Z" />
    {/* Book in front */}
    <rect x="40" y="60" width="20" height="15" fill="currentColor" opacity="0.7" />
    <line x1="50" y1="60" x2="50" y2="75" stroke="white" strokeWidth="1" />
  </svg>
);

export const ParentIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="currentColor">
    {/* Large head (parent) */}
    <circle cx="45" cy="30" r="18" />
    {/* Large body (parent) */}
    <path d="M 27 48 Q 27 46 29 46 L 61 46 Q 63 46 63 48 L 63 75 Q 63 77 61 77 L 29 77 Q 27 77 27 75 Z" />
    {/* Small head (child) */}
    <circle cx="65" cy="50" r="12" opacity="0.8" />
    {/* Small body (child) */}
    <path d="M 53 62 Q 53 60 55 60 L 75 60 Q 77 60 77 62 L 77 82 Q 77 84 75 84 L 55 84 Q 53 84 53 82 Z" opacity="0.8" />
  </svg>
);
