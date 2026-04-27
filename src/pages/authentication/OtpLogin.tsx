import { Input, Modal, message } from "antd";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ImagesAndIcons } from "../../shared/images-icons/ImagesAndIcons";
import Button from "../../components/btns/Button";
import { OauthLogoSlot } from "../../components/auth/OauthLogoSlot";
import { verifyOtp, initiateGoogleLogin } from "../../services/auth.service";
import { getApiErrorMessage } from "../../lib/api-error";
import { useLoginModalStore } from "../../store/login-modal.store";

interface OtpLoginProps {
  isModalOpen: boolean;
  handleCancel: () => void;
  email: string;
}

const OtpLogin = ({ isModalOpen, handleCancel, email }: OtpLoginProps) => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState<string | null>(null);
  const [verifyLoading, setVerifyLoading] = useState(false);

  const handleVerify = async () => {
    setOtpError(null);
    if (!email) {
      setOtpError("Email is missing. Close this window and try again.");
      return;
    }
    if (otp.length < 6) {
      setOtpError("Please enter the full 6-digit code.");
      return;
    }
    setVerifyLoading(true);
    try {
      await verifyOtp(email, otp);
      void message.success("Signed in successfully.");
      const raw = useLoginModalStore.getState().postLoginRedirect;
      useLoginModalStore.getState().clearPostLoginRedirect();
      const to =
        raw && raw !== "/auth/callback" && !raw.includes("error=oauth_failed")
          ? raw
          : "/";
      handleCancel();
      navigate(to, { replace: true });
    } catch {
      setOtpError("Invalid or expired code");
    } finally {
      setVerifyLoading(false);
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
        <div className="flex mb-4 sm:mb-5 items-center justify-between">
          <h2 className="text-lg sm:text-2xl font-semibold">Confirm it&apos;s you</h2>
          <button onClick={handleCancel} className="p-1 shrink-0">
            <img src={ImagesAndIcons.xIcon} alt="Close" />
          </button>
        </div>
        <p className="text-sm sm:text-base pb-4 border-b mb-4 border-b-[#D8D8D8] text-[#9B9B9B] font-normal">
          Enter the code sent to your email
        </p>
        <div className="flex items-center mb-5 justify-between gap-2">
          <p className="font-normal text-sm sm:text-base truncate min-w-0">{email || "—"}</p>
          <button
            type="button"
            className="text-primary font-semibold text-sm underline shrink-0"
            onClick={handleCancel}
          >
            Change
          </button>
        </div>
        <div className="w-full overflow-x-auto">
          <Input.OTP
            length={6}
            value={otp}
            onChange={(v) => {
              setOtp(v);
              setOtpError(null);
            }}
          />
        </div>
        {otpError ? (
          <p className="text-sm text-red-600 mt-2" role="alert" id="otp-error">
            {otpError}
          </p>
        ) : null}
        <Button
          type="red"
          label={verifyLoading ? "Verifying…" : "Verify"}
          className="font-semibold rounded-[55px] py-6 text-sm my-6 sm:my-8"
          handleClick={() => void handleVerify()}
        />
        <div className="flex items-center justify-center pb-2">
          <OauthLogoSlot onClick={handleGoogle} ariaLabel="Continue with Google" />
        </div>
      </div>
    </Modal>
  );
};

export default OtpLogin;
