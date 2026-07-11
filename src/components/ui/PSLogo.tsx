interface PSLogoProps {
  className?: string;
}

/**
 * Logo do PowerShell: prompt PS> estilizado.
 */
export function PSLogo({ className }: PSLogoProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="PowerShell"
    >
      {/* Fundo */}
      <rect width="40" height="40" rx="8" fill="#012456" />
      {/* Borda azul clara */}
      <rect x="2" y="2" width="36" height="36" rx="6" stroke="#3A8EE4" strokeWidth="2" />
      {/* Prompt PS> */}
      <text x="6" y="26" fontFamily="monospace" fontSize="12" fontWeight="bold" fill="white">
        PS&gt;
      </text>
    </svg>
  );
}

export default PSLogo;
