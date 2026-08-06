function HeroIllustration() {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 500 420"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Cercle de fond doux */}
      <circle cx="250" cy="210" r="190" fill="#DCFCE7" />

      {/* Ombre portée de la carte */}
      <ellipse cx="255" cy="330" rx="150" ry="18" fill="#1F2937" opacity="0.08" />

      {/* Carte bancaire (arrière, légèrement décalée) */}
      <rect
        x="90" y="150" width="300" height="180" rx="22"
        fill="#1F2937" opacity="0.9"
        transform="rotate(-6 240 240)"
      />

      {/* Carte bancaire (avant, principale) */}
      <rect
        x="110" y="130" width="300" height="180" rx="22"
        fill="#16A34A"
      />
      {/* Bande magnétique / puce */}
      <rect x="140" y="170" width="50" height="38" rx="8" fill="#FBBF24" />
      {/* Lignes de texte simulées (numéro de carte) */}
      <rect x="140" y="240" width="60" height="10" rx="5" fill="#FFFFFF" opacity="0.85" />
      <rect x="210" y="240" width="60" height="10" rx="5" fill="#FFFFFF" opacity="0.85" />
      <rect x="280" y="240" width="60" height="10" rx="5" fill="#FFFFFF" opacity="0.85" />
      {/* Nom / logo sur la carte */}
      <text x="140" y="285" fill="#FFFFFF" fontSize="18" fontWeight="bold" fontFamily="Arial, sans-serif">
        TROIS CLÉS
      </text>

      {/* Pièce dorée 1 */}
      <circle cx="380" cy="120" r="34" fill="#FBBF24" stroke="#F59E0B" strokeWidth="4" />
      <text x="380" y="128" textAnchor="middle" fill="#7C5A00" fontSize="24" fontWeight="bold" fontFamily="Arial, sans-serif">
        $
      </text>

      {/* Pièce dorée 2 (plus petite, décalée) */}
      <circle cx="95" cy="90" r="24" fill="#FBBF24" stroke="#F59E0B" strokeWidth="3" />
      <text x="95" y="97" textAnchor="middle" fill="#7C5A00" fontSize="18" fontWeight="bold" fontFamily="Arial, sans-serif">
        $
      </text>

      {/* Flèche de croissance */}
      <path
        d="M100 340 L160 300 L210 330 L300 260"
        stroke="#16A34A"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path d="M280 255 L305 258 L302 283" stroke="#16A34A" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

export default HeroIllustration;