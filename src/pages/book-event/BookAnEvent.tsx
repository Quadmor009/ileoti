import { Checkbox, message, Upload, UploadProps } from "antd";
import Footer from "../../components/footer/Footer";
import CustomInput from "../../components/input/CustomInput";
import Navbar from "../../components/navbar/Navbar";
import CustomSelect from "../../components/select/CustomSelect";
import { ImagesAndIcons } from "../../shared/images-icons/ImagesAndIcons";
import Button from "../../components/btns/Button";
import { useState } from "react";
import { bookEvent } from "../../services/event.service";
import { getApiErrorMessage } from "../../lib/api-error";
import { useAuthStore } from "../../store/auth.store";

const BookAnEvent = () => {
  const { Dragger } = Upload;
  const accessToken = useAuthStore((s) => s.accessToken);
  const [orderService, setOrderService] = useState<"cooperate" | "bulk">(
    "cooperate",
  );
  const [deliveryMethod, setDeliveryMethod] = useState("");
  const [addressA, setAddressA] = useState("");
  const [addressB, setAddressB] = useState("");
  const [addressC, setAddressC] = useState("");
  const [addressD, setAddressD] = useState("");
  const [needsBartender, setNeedsBartender] = useState(false);
  const [needsMenuCuration, setNeedsMenuCuration] = useState(false);
  const [fileUrl, setFileUrl] = useState<string | undefined>();
  const [submitting, setSubmitting] = useState(false);

  const uploadProps: UploadProps = {
    name: "file",
    multiple: false,
    action: `${
      import.meta.env.VITE_BASE_URL
    }/authenticationservice/v1.0/rest/api/app/image/file/upload`,
    headers: accessToken
      ? { Authorization: `Bearer ${accessToken}` }
      : undefined,
    showUploadList: false,
    onChange(info) {
      const { status, response } = info.file;
      if (status === "done" && response?.data?.filePath) {
        const path = response.data.filePath as string;
        setFileUrl(path.startsWith("http") ? path : `https://${path}`);
      }
      if (status === "error") {
        void message.error(
          `${info.file.name} could not be uploaded. Sign in if required, or skip the file.`,
        );
      }
    },
  };

  const styles = {
    active: `py-3.5 px-12 bg-white rounded-2xl text-primary text-base font-semibold`,
    inActive: `py-3.5 px-12 rounded-2xl text-white text-base font-semibold`,
  };

  const handleRequestQuote = async () => {
    const address = [addressA, addressB, addressC, addressD]
      .map((s) => s.trim())
      .filter(Boolean)
      .join("\n");
    if (!deliveryMethod.trim()) {
      void message.error("Please select a delivery method.");
      return;
    }
    if (!address) {
      void message.error("Please enter your address.");
      return;
    }
    setSubmitting(true);
    try {
      await bookEvent({
        serviceType: orderService === "cooperate" ? "CORPORATE" : "BULK",
        deliveryMethod: deliveryMethod.trim(),
        address,
        needsBartender,
        needsMenuCuration,
        fileUrl,
      });
      void message.success(
        "Your booking request has been submitted. We will contact you shortly.",
      );
    } catch (e) {
      void message.error(getApiErrorMessage(e));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="bg-primary py-7">
        <div className="max-w-270 w-[90%] mx-auto ">
          <div className="flex justify-center w-full items-center">
            <button
              type="button"
              onClick={() => setOrderService("cooperate")}
              className={
                orderService === "cooperate" ? styles.active : styles.inActive
              }
            >
              Event & Corporate Services
            </button>
            <button
              type="button"
              onClick={() => setOrderService("bulk")}
              className={
                orderService === "bulk" ? styles.active : styles.inActive
              }
            >
              Bulk Ordering
            </button>
          </div>
        </div>
      </div>
      <div className="w-180 mx-auto flex flex-col gap-5 my-12">
        <h4 className="text-3xl font-bold mb-4">Book an Event or Corporate Service</h4>
        <div className="flex gap-4">
          <CustomSelect
            options={[
              { value: "Delivery", label: "Delivery" },
              { value: "Pickup", label: "Pickup" },
            ]}
            placeholder="Select Delivery Method"
            label="Select Country"
            onChange={(v) => setDeliveryMethod(v)}
          />
          <CustomSelect
            options={[
              { value: "Delivery", label: "Delivery" },
              { value: "Pickup", label: "Pickup" },
            ]}
            placeholder="Select Delivery Method"
            label="Select Country"
            onChange={(v) => setDeliveryMethod(v)}
          />
        </div>
        <div className="flex gap-4">
          <CustomInput
            label="Address"
            placeholder="Enter your full address"
            value={addressA}
            onChange={(e) => setAddressA(e.target.value)}
          />
          <CustomInput
            label="Address"
            placeholder="Enter your full address"
            value={addressB}
            onChange={(e) => setAddressB(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
          <CustomInput
            label="Address"
            placeholder="Enter your full address"
            value={addressC}
            onChange={(e) => setAddressC(e.target.value)}
          />
          <CustomInput
            label="Address"
            placeholder="Enter your full address"
            value={addressD}
            onChange={(e) => setAddressD(e.target.value)}
          />
        </div>
        <Dragger
          style={{
            backgroundColor: "white",
            width: "100%",
            borderColor: "#E5E7EB",
          }}
          showUploadList={false}
          {...uploadProps}
        >
          <div className="bg-white  rounded-lg w-full text-left flex justify-between items-center duration-200">
            <div className="flex gap-1 flex-col">
              <p className="text-xs text-[#9B9B9B] font-medium">
                More Information
              </p>
              <span className="text-base font-medium text-black">
                Enter More Information
              </span>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-primary font-medium text-base underline">
                Upload File
              </p>
              <img src={ImagesAndIcons.documentUpload} alt="" />
            </div>
          </div>
        </Dragger>
        <div className="flex gap-4">
          <div className="bg-white border border-[#D8D8D8] rounded-lg px-4 py-3 w-full text-left flex justify-between items-center duration-200">
            <div className="flex gap-1 flex-col">
              <p className="text-xs text-[#9B9B9B] font-medium">Bartender</p>
              <span className="text-base font-medium text-black">
                Add Bartender
              </span>
            </div>
            <Checkbox
              checked={needsBartender}
              onChange={(e) => setNeedsBartender(e.target.checked)}
            />
          </div>
          <div className="bg-white border border-[#D8D8D8] rounded-lg px-4 py-3 w-full text-left flex justify-between items-center duration-200">
            <div className="flex gap-1 flex-col">
              <p className="text-xs text-[#9B9B9B] font-medium">
                Menu Curated Services
              </p>
              <span className="text-base font-medium text-black">
                Menu Service
              </span>
            </div>
            <Checkbox
              checked={needsMenuCuration}
              onChange={(e) => setNeedsMenuCuration(e.target.checked)}
            />
          </div>
        </div>
        <Button
          type="red"
          label={submitting ? "Submitting…" : "Request Quote"}
          className="lg:py-6 text-base lg:text-xl py-3 font-semibold rounded-[55px]"
          handleClick={() => void handleRequestQuote()}
        />
      </div>
      <Footer />
    </div>
  );
};

export default BookAnEvent;
