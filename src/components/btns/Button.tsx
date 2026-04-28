interface btnType {
  type: "white" | "transparent" | "outlinedIcon" | "red" | "outlineRed" | "lightRed";
  label?: string;
  handleClick?: () => void;
  className?: string;
  icon?: string;
  justIcon?: boolean;
}

const Button = ({
  type,
  label,
  handleClick,
  className,
  icon,
  justIcon = false,
}: btnType) => {
  const styles = {
    white: `bg-white rounded-[56px] cursor-pointer h-14 text-xs md:text-base font-semibold w-full inline-flex items-center justify-center gap-2`,
    red: `bg-primary cursor-pointer text-white w-full h-14 inline-flex items-center justify-center gap-2`,
    transparent: `border border-white text-white bg-transparent w-full rounded-[56px] cursor-pointer h-14 text-xs md:text-base font-semibold inline-flex items-center justify-center gap-2`,
    lightRed: `text-primary bg-[#F4EEEE] w-full rounded-[56px] cursor-pointer h-14 text-xs md:text-base font-semibold inline-flex items-center justify-center gap-2`,
    outlineRed: `border border-[#80011D] text-[#80011D] bg-transparent w-full rounded-[56px] cursor-pointer h-14 text-xs inline-flex items-center gap-2 justify-center md:text-base font-semibold`,
    ashIcon: `border border-[#D8D8D8] text-black flex items-center gap-1 bg-transparent cursor-pointer p-4 max-h-14 text-xs font-medium ${
      justIcon ? "rounded-full" : "rounded-3xl"
    }`,
  };
  const getClass = (type: string) => {
    switch (type) {
      case "white":
        return styles.white;
      case "transparent":
        return styles.transparent;
      case "outlinedIcon":
        return styles.ashIcon;
      case "red":
        return styles.red;
      case "outlineRed":
        return styles.outlineRed;
      case "lightRed":
        return styles.lightRed;
    }
  };
  return (
    <button
      type="button"
      onClick={handleClick}
      className={`${getClass(type)} ${className ?? ""}`.trim()}
    >
      <span className="inline-flex min-w-0 items-center justify-center gap-2">
        {label ? <span className="min-w-0 text-center leading-snug">{label}</span> : null}
        {icon ? (
          <img
            src={icon}
            alt=""
            className="h-[1.1em] w-auto max-h-6 shrink-0 object-contain"
            draggable={false}
          />
        ) : null}
      </span>
    </button>
  );
};

export default Button;
