
interface chevdownIconProps {
    open: boolean;
    color: string;

}


export const ChevDownIcon = ({open, color}: chevdownIconProps) => {


return (
  <div >
    <svg
      width="12"
      height="7"
      viewBox="0 0 12 7"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`transition-transform duration-300 ${
        open ? "rotate-180" : ""
      }`}
    >
      <path
        d="M10.4992 0.699219L5.84671 5.35173C5.71002 5.48841 5.48841 5.48841 5.35173 5.35173L0.699219 0.699219"
        stroke={color}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
);

}


