import { message } from "antd";
import { useState, type ChangeEvent } from "react";
import Button from "../../components/btns/Button";
import Footer from "../../components/footer/Footer";
import CustomInput from "../../components/input/CustomInput";
import Navbar from "../../components/navbar/Navbar";
import { ImagesAndIcons } from "../../shared/images-icons/ImagesAndIcons";
import { submitContact } from "../../services/contact.service";
import { getApiErrorMessage } from "../../lib/api-error";

const ContactUs = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    const name = `${firstName} ${lastName}`.trim();
    if (!name || !email.trim() || !description.trim()) {
      void message.error("Please fill in name, email, and description.");
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
      <div className="max-w-300 mx-auto w-[90%] py-8 sm:py-11">
        <h3 className="text-2xl sm:text-3xl text-black font-bold mb-6">Contact Us</h3>
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-11">
          <div className="w-full lg:w-1/2">
            <div className="flex items-center gap-4 w-full pb-6 sm:pb-8 border-b border-b-[#F0F0F0]">
              <img
                className="h-10 w-10 rounded-full shrink-0"
                src={ImagesAndIcons.cartRed}
                alt=""
              />
              <div className="min-w-0">
                <p className="text-base font-normal truncate">John Smith Jagger</p>
                <p className="text-xs text-[#9B9B9B] font-normal truncate">
                  Jsmith.jaggger@gmail.com
                </p>
              </div>
            </div>
            <h3 className="text-2xl sm:text-3xl mt-6 sm:mt-8 mb-4 sm:mb-6 text-black font-bold">
              Leave us an email
            </h3>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-5">
                <div className="w-full">
                  <CustomInput
                    label="First Name"
                    placeholder="Enter First Name"
                    value={firstName}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setFirstName(e.target.value)
                    }
                  />
                </div>
                <div className="w-full">
                  <CustomInput
                    label="Last Name"
                    placeholder="Enter Last Name"
                    value={lastName}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setLastName(e.target.value)
                    }
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-5">
                <div className="w-full">
                  <CustomInput
                    label="Phone Number"
                    placeholder="Enter Phone Number"
                    value={phone}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setPhone(e.target.value)
                    }
                  />
                </div>
                <div className="w-full">
                  <CustomInput
                    label="Email Address"
                    placeholder="Enter Email Address"
                    value={email}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setEmail(e.target.value)
                    }
                  />
                </div>
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
              <div className="mt-2 mb-6 sm:mb-8">
                <Button
                  type="red"
                  label={loading ? "Sending…" : "Send"}
                  className="font-semibold rounded-[55px] py-5 text-sm w-full"
                  handleClick={() => void handleSend()}
                />
              </div>
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
