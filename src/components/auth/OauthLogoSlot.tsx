/** Continue-with-Google: logo-only control (no outer stroke on modals). */
export function OauthLogoSlot({ onClick, ariaLabel }: { onClick: () => void; ariaLabel: string }) {
  return (
    <button
      type="button"
      className="bg-transparent border-0 shadow-none outline-none flex items-center justify-center p-0"
      onClick={onClick}
      aria-label={ariaLabel}
    >
      <img src="/logos/red-logo.svg" alt="" className="h-20 w-auto object-contain" />
    </button>
  );
}
