import { useState } from "react";
import { Popover } from "antd";

interface DeviceGadgetActionProps {
  content: React.ReactNode;
  btnLabel: string;
  icons: string;
}

const DropDown = (props: DeviceGadgetActionProps) => {
  const [open, setOpen] = useState(false);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  return (
    <Popover
      content={props.content}
      trigger="click"
      placement="bottom"
      open={open}
      onOpenChange={handleOpenChange}
      style={{
        padding: 0,
        borderRadius: 8,
        background: "red"
      }}
    >
      <button className="border border-[#D8D8D8] text-black flex items-center gap-1 bg-transparent cursor-pointer p-4 text-base font-medium rounded-full">
        {props.btnLabel} <img src={props.icons} alt="" />
      </button>
    </Popover>
  );
};

export default DropDown;
