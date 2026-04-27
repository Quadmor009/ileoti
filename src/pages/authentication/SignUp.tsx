import { Modal, message } from "antd";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { ImagesAndIcons } from "../../shared/images-icons/ImagesAndIcons";
import { OauthLogoSlot } from "../../components/auth/OauthLogoSlot";
import { useLoginModalStore } from "../../store/login-modal.store";
import CustomInput from "../../components/input/CustomInput";
import Button from "../../components/btns/Button";
import OtpLogin from "./OtpLogin";
import { sendOtp, initiateGoogleLogin } from "../../services/auth.service";
import { getApiErrorMessage } from "../../lib/api-error";

const SignUp = () => {
  const location = useLocation();
  const setPostLoginRedirect = useLoginModalStore((s) => s.setPostLoginRedirect);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenTwo, setIsModalOpenTwo] = useState(false);
  const [email, setEmail] = useState("");
  const [sendLoading, setSendLoading] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  const handleCancel = () => {
    setIsModalOpen(false);
    setSendError(null);
  };

  const handleSendOtp = async () => {
    const trimmed = email.trim();
    if (!trimmed) {
      void message.error("Please enter your email address.");
      return;
    }
    setSendError(null);
    setSendLoading(true);
    try {
      await sendOtp(trimmed);
      setIsModalOpen(false);
      setIsModalOpenTwo(true);
    } catch (err) {
      setSendError(getApiErrorMessage(err));
    } finally {
      setSendLoading(false);
    }
  };

  const handleGoogle = () => {
    try {
      initiateGoogleLogin();
    } catch (err) {
      void message.error(getApiErrorMessage(err));
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          setPostLoginRedirect(`${location.pathname}${location.search}`);
          setIsModalOpen(true);
        }}
        className="border border-[#80011D] text-[#80011D] rounded-[100px] px-6 h-10 text-sm font-medium hover:bg-[#80011D] hover:text-white transition-colors"
      >
        Sign Up
      </button>
      <Modal
        open={isModalOpen}
        footer={null}
        onCancel={handleCancel}
        width={{
          xs: "90%",
          sm: "80%",
          md: "70%",
          lg: "542px",
          xl: "542px",
          xxl: "542px",
        }}
        centered
        closable={false}
        style={{
          borderRadius: 24,
        }}
        styles={{ content: { background: "#fff", borderRadius: 24 } }}
      >
        <div className="py-6 px-5 sm:py-9 sm:px-8 lato">
          <div className="flex mb-6 sm:mb-10 items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-semibold">Sign Up</h2>
            <button onClick={handleCancel} className="p-1 shrink-0">
              <img src={ImagesAndIcons.xIcon} alt="Close" />
            </button>
          </div>
          <CustomInput
            label="Email Address"
            placeholder="Enter Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {sendError ? (
            <p className="text-sm text-red-600 mt-2" role="alert">
              {sendError}
            </p>
          ) : null}
          <Button
            type="red"
            label={sendLoading ? "Sending…" : "Sign Up"}
            className="font-semibold rounded-[55px] py-6 text-sm my-6 sm:my-10"
            handleClick={() => void handleSendOtp()}
          />
          <div className="flex items-center justify-center pb-2">
            <OauthLogoSlot onClick={handleGoogle} ariaLabel="Continue with Google" />
          </div>
        </div>
      </Modal>
      <OtpLogin
        isModalOpen={isModalOpenTwo}
        handleCancel={() => setIsModalOpenTwo(false)}
        email={email.trim()}
      />
    </div>
  );
};

export default SignUp;
