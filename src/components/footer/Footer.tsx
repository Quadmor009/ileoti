import { ImagesAndIcons } from "../../shared/images-icons/ImagesAndIcons";
import { useState } from "react";
import { Link } from "react-router-dom";
import { routes } from "../../shared/routes/routes";

const faqs = [
  {
    q: "Do I need to be 18 to order?",
    a: "Yes. You must be 18 years or older to purchase alcohol from Ile-Oti. By placing an order you confirm you meet the legal drinking age in your jurisdiction.",
  },
  {
    q: "How long does delivery take?",
    a: "Standard delivery takes 2–4 business days. Express same-day delivery is available in select cities for orders placed before 10 AM.",
  },
  {
    q: "What is your returns policy?",
    a: "We accept returns for damaged or incorrect items within 48 hours of delivery. Contact our support team with your order number and photos of the item.",
  },
  {
    q: "Do you offer gift packaging?",
    a: "Yes! You can add premium gift wrapping and a personal message at checkout using our Gift Box feature.",
  },
  {
    q: "Can I track my order?",
    a: "Yes. Once your order ships you will receive a tracking link via email. You can also view your order status any time from your account dashboard.",
  },
];

const Footer = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterDone, setNewsletterDone] = useState(false);

  const toggleFaq = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const handleNewsletter = () => {
    const trimmed = newsletterEmail.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return;
    // TODO: wire to backend newsletter endpoint
    setNewsletterDone(true);
  };

  return (
    <div
      className="w-full flex lato justify-center py-10"
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
            {faqs.map((faq, i) => (
              <div key={faq.q}>
                <button
                  type="button"
                  onClick={() => toggleFaq(i)}
                  className="flex justify-between items-center text-base font-medium w-full cursor-pointer text-left border-b border-gray-600 pb-2"
                >
                  <span>{faq.q}</span>
                  <span>{activeIndex === i ? "−" : "+"}</span>
                </button>
                {activeIndex === i && (
                  <p className="text-gray-400 text-sm mt-2 leading-relaxed">
                    {faq.a}
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
              className="h-16 md:h-[72px] w-auto max-w-[240px] object-contain mx-auto"
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

        {/* Right: newsletter */}
        <div className="w-full lg:max-w-60">
          <p className="text-xs text-gray-400 mb-6">
            © 2025 All rights reserved by Ile-Oti
          </p>
          <div>
            <p className="font-medium mb-2">Follow Our News</p>
            <p className="text-xs text-gray-400 mb-3">
              Subscribe to our newsletter for exclusive offers, cocktail recipes
              and more!
            </p>

            {newsletterDone ? (
              <p className="text-sm text-green-400 font-medium py-2">
                You're subscribed! 🎉
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                <input
                  type="email"
                  placeholder="Enter Email Address"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="border border-b-[#D9D9D9] py-1 bg-transparent border-t-0 border-x-0 text-white placeholder:text-gray-500 outline-none"
                />
                <button
                  type="button"
                  onClick={handleNewsletter}
                  disabled={!newsletterEmail.trim()}
                  className="bg-white cursor-pointer w-full py-3 font-medium mt-2 text-base rounded-md text-black disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
