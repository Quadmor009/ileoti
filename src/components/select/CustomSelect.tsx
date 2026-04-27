import { useEffect, useRef, useState } from "react";
import { ImagesAndIcons } from "../../shared/images-icons/ImagesAndIcons";

interface Option {
  label: string;
  value: string;
}

interface CustomSelectProps {
  options: Option[];
  placeholder?: string;
  onChange?: (value: string) => void;
  label?: string;
}

const CustomSelect = ({ options, placeholder = "Select...", onChange, label }: CustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<Option | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [isOpen]);

  const handleSelect = (option: Option) => {
    setSelected(option);
    setIsOpen(false);
    onChange?.(option.value);
  };

  return (
    <div ref={rootRef} className="relative w-full">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="bg-white border border-[#D0D0D0] rounded-xl px-5 py-4 w-full min-h-[3.75rem] text-left flex justify-between items-center gap-3 duration-200 hover:border-[#B0B0B0] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <div className="flex flex-col gap-1 min-w-0 flex-1">
          {label ? (
            <p className="text-sm text-[#585858] font-medium leading-tight">{label}</p>
          ) : null}
          <span className="text-lg sm:text-xl font-semibold text-black truncate">
            {selected ? selected.label : placeholder}
          </span>
        </div>
        <img
          src={ImagesAndIcons.arrowDownBg}
          alt=""
          className={`w-5 h-5 shrink-0 opacity-70 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <ul
          role="listbox"
          className="absolute left-0 right-0 top-full z-20 mt-2 bg-white border border-[#E0E0E0] rounded-xl shadow-lg max-h-64 overflow-y-auto py-1"
        >
          {options.map((option) => (
            <li key={option.value}>
              <button
                type="button"
                role="option"
                aria-selected={selected?.value === option.value}
                onClick={() => handleSelect(option)}
                className={`w-full text-left px-5 py-3.5 text-base font-medium transition-colors ${
                  selected?.value === option.value
                    ? "bg-[#FFF5F5] text-[#80011D] font-semibold"
                    : "text-black hover:bg-[#FAFAFA]"
                }`}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomSelect;
