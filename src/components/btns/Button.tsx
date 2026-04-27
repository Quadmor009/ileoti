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
    white: `bg-white rounded-[56px] cursor-pointer h-14 text-xs md:text-base font-semibold w-full`,
    red: `bg-primary cursor-pointer text-white w-full h-14 flex items-center justify-center gap-1`,
    transparent: `border border-white text-white bg-transparent w-full rounded-[56px] cursor-pointer h-14 text-xs md:text-base font-semibold`,
    lightRed: `text-primary bg-[#F4EEEE] w-full rounded-[56px] cursor-pointer h-14 text-xs md:text-base font-semibold`,
    outlineRed: `border border-[#80011D] text-[#80011D] bg-transparent w-full rounded-[56px] cursor-pointer h-14 text-xs flex items-center gap-2 justify-center md:text-base font-semibold`,
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
    <button onClick={handleClick} className={`${getClass(type)} ${className}`}>
      {label} <img src={icon} alt="" />
    </button>
  );
};

export default Button;
