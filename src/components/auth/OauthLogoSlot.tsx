/** Grey OAuth-style slot with Ile Oti red logo (Google button placeholder area). */
export function OauthLogoSlot({ onClick, ariaLabel }: { onClick: () => void; ariaLabel: string }) {
  return (
    <button
      type="button"
      className="w-[145px] h-[58px] rounded-[22px] bg-[#D9D9D9] flex items-center justify-center px-3"
      onClick={onClick}
      aria-label={ariaLabel}
    >
      <img src="/logos/red-logo.svg" alt="" className="max-h-11 w-auto object-contain" />
    </button>
  );
}
