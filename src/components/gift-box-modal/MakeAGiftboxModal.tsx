import { Modal } from "antd";
import { ImagesAndIcons } from "../../shared/images-icons/ImagesAndIcons";
import Button from "../btns/Button";

interface MakeAgiftBoxModalProps {
    isModalOpen: boolean;
    handleCancel: () => void;
    handleStartGiftBox?: () => void;
    handleCustomiseGiftBox?: () => void;
}

const MakeAGiftboxModal = ({ isModalOpen, handleCancel, handleStartGiftBox, handleCustomiseGiftBox }: MakeAgiftBoxModalProps) => {
  return (
    <Modal
      width={{
        xs: "90%",
        sm: "80%",
        md: "70%",
        lg: "563px",
        xl: "563px",
        xxl: "563px",
      }}
      open={isModalOpen}
      onCancel={handleCancel}
      footer={null}
      closable={false}
      style={{
        borderRadius: 24,
      }}
    >
      <div className="px-5 sm:px-10 py-8 sm:py-11 lato">
        <div className="flex items-start sm:items-center mb-5 sm:mb-6 justify-between gap-2">
          <p className="text-xl sm:text-2xl text-black font-bold pr-2 leading-snug">Create a gift box</p>
          <button type="button" onClick={handleCancel} className="shrink-0" aria-label="Close">
            <img src={ImagesAndIcons.xIcon} alt="" />
          </button>
        </div>
        <div className="flex items-center justify-center mb-8 sm:mb-11 max-h-48 sm:max-h-none">
            <img src={ImagesAndIcons.christmasBox} alt="" className="max-h-44 w-auto object-contain" />
        </div>
        <h3 className="text-base font-bold text-center mb-2">How it works</h3>
        <p className="text-sm sm:text-base font-normal text-center pb-6 sm:pb-8 border-b border-b-[#D8D8D8] text-[#424242]">Turn any product into part of a personalised gift box. Curate your favourite items, customise them with special touches, and send everything in a beautifully packaged box.</p>

        <div className="mt-6 sm:mt-8 flex flex-col gap-3 sm:gap-4">
          <Button
            handleClick={handleStartGiftBox}
            label="Start gift box"
            type="red"
            className="!py-3.5 sm:!py-4 !min-h-[52px] sm:!min-h-14 !text-base sm:!text-lg !rounded-[55px] !font-semibold w-full"
          />
          <Button
            handleClick={handleCustomiseGiftBox}
            label="Customise gift box"
            type="outlineRed"
            className="!py-3.5 sm:!py-4 !min-h-[52px] sm:!min-h-14 !text-base sm:!text-lg !rounded-[55px] !font-semibold w-full"
          />
        </div>
      </div>
    </Modal>
  );
};

export default MakeAGiftboxModal;
