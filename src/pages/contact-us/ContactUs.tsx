import { message } from "antd";
import { useState, type ChangeEvent } from "react";
import Button from "../../components/btns/Button";
import Footer from "../../components/footer/Footer";
import CustomInput from "../../components/input/CustomInput";
import Navbar from "../../components/navbar/Navbar";
import { ImagesAndIcons } from "../../shared/images-icons/ImagesAndIcons";
import { submitContact } from "../../services/contact.service";
import { getApiErrorMessage } from "../../lib/api-error";
import { usePageTitle } from "../../lib/use-page-title";

const ContactUs = () => {
  usePageTitle("Contact Us");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    const name = `${firstName} ${lastName}`.trim();
    const emailTrimmed = email.trim();
    if (!name || !emailTrimmed || !description.trim()) {
      void message.error("Please fill in name, email, and description.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrimmed)) {
      void message.error("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    try {
      await submitContact({
        name,
        email: email.trim(),
        message: [subject.trim() && `Subject: ${subject.trim()}`, description.trim()]
          .filter(Boolean)
          .join("\n\n"),
        phone: phone.trim() || undefined,
      });
      void message.success(
        "Message sent successfully. We'll be in touch soon.",
      );
    } catch (e) {
      void message.error(getApiErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <Navbar />
      <div className="max-w-300 mx-auto w-[90%] py-11">
        <h3 className="text-3xl text-black font-bold mb-6">Contact Us</h3>
        <div className="flex flex-col lg:flex-row gap-11">
          <div className="w-full lg:w-1/2">
            <div className="flex items-center gap-4 w-full pb-8 border-b border-b-[#F0F0F0]">
              <img
                className="h-10 w-10 rounded-full"
                src={ImagesAndIcons.cartRed}
                alt=""
              />
              <div>
                <p className="text-base font-normal">Ile-Oti Support</p>
                <p className="text-xs text-[#9B9B9B] font-normal">
                  support@ileoti.com
                </p>
              </div>
            </div>
            <h3 className="text-3xl mt-8 mb-6 text-black font-bold">
              Leave us an email
            </h3>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col lg:flex-row gap-4 lg:gap-5">
                <CustomInput
                  label="First Name"
                  placeholder="Enter First Name"
                  value={firstName}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setFirstName(e.target.value)
                  }
                />
                <CustomInput
                  label="Last Name"
                  placeholder="Enter Last Name"
                  value={lastName}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setLastName(e.target.value)
                  }
                />
              </div>
              <div className="flex flex-col lg:flex-row gap-4 lg:gap-5">
                <CustomInput
                  label="Phone Number"
                  placeholder="Enter Phone Number"
                  value={phone}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setPhone(e.target.value)
                  }
                />
                <CustomInput
                  label="Email Address"
                  placeholder="Enter Email Address"
                  value={email}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setEmail(e.target.value)
                  }
                />
              </div>
              <CustomInput
                label="Subject"
                placeholder="Enter Subject"
                value={subject}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setSubject(e.target.value)
                }
              />
              <CustomInput
                label="Description"
                placeholder="Give Us More Information"
                value={description}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setDescription(e.target.value)
                }
              />
              <Button
                type="red"
                label={loading ? "Sending…" : "Send"}
                className="font-semibold  rounded-[55px] py-6 text-xl my-8"
                handleClick={() => void handleSend()}
              />
            </div>
          </div>
          <div className="hidden lg:block lg:w-1/2">
            <img src={ImagesAndIcons.FooterImage} alt="" className="w-full h-full object-cover rounded-2xl" />
          </div>
        </div>
      </div>
      <Footer />
    </section>
  );
};

export default ContactUs;
