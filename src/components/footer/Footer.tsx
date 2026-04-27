import { ImagesAndIcons } from "../../shared/images-icons/ImagesAndIcons";
import { useState } from "react";
import { Link } from "react-router-dom";
import { routes } from "../../shared/routes/routes";

const Footer = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const faqs = [
    "What is Ile-Oti?",
    "What is Ile-Oti?",
    "What is Ile-Oti?",
    "What is Ile-Oti?",
    "What is Ile-Oti?",
  ];

  const toggleFaq = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div
      className="w-full flex  lato  justify-center py-10"
      style={{
        backgroundImage: `url(${ImagesAndIcons.FooterImage})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      <div className="bg-black rounded-[32px] max-w-[1078px] min-h-113 w-[90%] flex flex-col lg:flex-row justify-between lg:items-center text-white p-8 lg:p-10 gap-10">
        {/* Left: FAQ */}
        <div className="lg:w-114 w-full">
          <h2 className="text-lg md:text-2xl font-bold mb-6">
            Frequently asked questions & answers
          </h2>

          <div className="space-y-4">
            {faqs.map((q, i) => (
              <div key={i}>
                <button
                  type="button"
                  onClick={() => toggleFaq(i)}
                  className="flex justify-between items-center text-base font-medium w-full cursor-pointer text-left border-b border-gray-600 pb-2"
                >
                  <span>{q}</span>
                  <span>{activeIndex === i ? "−" : "+"}</span>
                </button>
                {activeIndex === i && (
                  <p className="text-gray-400 text-base mt-2">
                    Ile-Oti is a brand dedicated to offering premium beverages
                    and cultural experiences.
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Center: logo + nav */}
        <div className="flex flex-col items-center justify-center text-center gap-6">
          <Link to={routes.home} className="inline-block" aria-label="Ile Oti home">
            <img
              src="/logos/white-logo.svg"
              alt=""
              className="h-14 md:h-16 w-auto max-w-[220px] object-contain mx-auto"
            />
          </Link>
          <ul className="text-xs font-semibold space-y-3">
            <li>
              <Link to={routes.home} className="hover:underline">
                HOME
              </Link>
            </li>
            <li>
              <Link to={routes.products} className="hover:underline">
                OUR PRODUCTS
              </Link>
            </li>
            <li>
              <Link to={routes.about} className="hover:underline">
                ABOUT
              </Link>
            </li>
            <li>
              <span className="opacity-60 cursor-default" title="Coming soon">
                TERMS &amp; CONDITION
              </span>
            </li>
            <li>
              <span className="opacity-60 cursor-default" title="Coming soon">
                PRIVACY POLICY
              </span>
            </li>
          </ul>
        </div>
        <div className="w-full lg:max-w-60">
          <p className="text-xs text-gray-400 mb-6">
            2025 All right reserved by Ile Oti
          </p>
          <div>
            <p className="font-medium mb-2">Follow Our News</p>
            <p className="text-xs text-gray-400 mb-3">
              Subscribe to our newsletter for exclusive offers, cocktail recipes
              and more!
            </p>

            <div className="flex flex-col gap-2">
              <input
                type="text"
                placeholder="Enter Email Address"
                className="border border-b-[#D9D9D9] py-1 bg-none border-t-0 border-x-0"
              />
              <button
                type="button"
                className="bg-white cursor-pointer w-full py-3 font-medium mt-2 text-base rounded-md text-black"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
