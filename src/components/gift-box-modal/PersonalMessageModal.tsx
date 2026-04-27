import { Input, Modal, message } from "antd";
import { Dispatch, SetStateAction, useEffect, useState, type ChangeEvent } from "react";
import Button from "../btns/Button";
import { ImagesAndIcons } from "../../shared/images-icons/ImagesAndIcons";
import CustomInput from "../input/CustomInput";

interface PersonalMessageModalProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  onSubmitMessage?: (message: string) => void;
}

const PersonalMessageModal = ({
  open,
  setOpen,
  onSubmitMessage,
}: PersonalMessageModalProps) => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [recipient, setRecipient] = useState("");
  const [sender, setSender] = useState("");

  useEffect(() => {
    if (!open) return;
    setTitle("");
    setBody("");
    setRecipient("");
    setSender("");
  }, [open]);

  const handleSubmit = () => {
    const parts = [
      title.trim() && `Title: ${title.trim()}`,
      body.trim() && body.trim(),
      recipient.trim() && `To: ${recipient.trim()}`,
      sender.trim() && `From: ${sender.trim()}`,
    ].filter(Boolean);
    const combined = parts.join("\n\n");
    const finalMessage = combined || body.trim();
    if (!finalMessage) {
      void message.warning("Add a message or a title before saving.");
      return;
    }
    onSubmitMessage?.(finalMessage);
    void message.success("Personal message saved. It will be sent with your gift box at checkout.");
    setOpen(false);
  };

  return (
    <Modal
      open={open}
      onCancel={() => setOpen(false)}
      footer={null}
      width={650}
      centered
      closable={false}
    >
      <div className="p-10 lato">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <img src={ImagesAndIcons.giftBox} alt="" /> Personal message
          </h2>
          <button type="button" onClick={() => setOpen(false)}>
            <img src={ImagesAndIcons.xIcon} alt="" />
          </button>
        </div>
        <p className="text-base font-bold max-w-[423px] mb-6 mt-2 text-[#585858]">
          This can be added to an Ile-Oti note with your package. You can edit it until you
          complete checkout.
        </p>

        <div className="flex flex-col gap-2 mb-8">
          <CustomInput
            label="Message title (optional)"
            placeholder="E.g. Happy birthday"
            value={title}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
          />
          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-sm font-bold text-primary">Message</label>
            <Input.TextArea
              placeholder="Write your message"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={4}
              className="!rounded-2xl !px-3 !py-2 !text-base"
              autoSize={{ minRows: 4, maxRows: 8 }}
            />
          </div>
          <CustomInput
            label="Recipient name (optional)"
            placeholder="Add the recipient’s name"
            value={recipient}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setRecipient(e.target.value)}
          />
          <CustomInput
            label="Sender name (optional)"
            placeholder="Who is this from?"
            value={sender}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setSender(e.target.value)}
          />
        </div>
        <Button
          label="Save message"
          type="red"
          className="py-6 text-xl rounded-[55px] font-semibold"
          handleClick={handleSubmit}
        />
      </div>
    </Modal>
  );
};

export default PersonalMessageModal;
