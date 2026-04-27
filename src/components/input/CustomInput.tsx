import { ChangeEvent } from "react";

interface CustomInputTypes {
  label: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  icon?: string;
  placeholder?: string;
}

const CustomInput = ({
  label,
  value,
  onChange,
  icon,
  placeholder,
}: CustomInputTypes) => {
  return (
    <div className="bg-white border border-[#D8D8D8] rounded-lg px-4 py-3 w-full text-left flex justify-between items-center duration-200">
      <div className="flex gap-1 w-[90%] flex-col">
        <p className="text-xs text-[#9B9B9B] font-medium">{label}</p>
        <input
          className="border-none outline-none w-full"
          placeholder={placeholder}
          type="text"
          value={value}
          onChange={onChange}
        />
      </div>
      {icon ? <img src={icon} alt="" className="shrink-0" /> : null}
    </div>
  );
};

export default CustomInput;
