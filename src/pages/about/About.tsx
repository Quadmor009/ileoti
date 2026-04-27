import { Link } from "react-router-dom";
import Footer from "../../components/footer/Footer";
import Navbar from "../../components/navbar/Navbar";
import { routes } from "../../shared/routes/routes";
import { usePageTitle } from "../../lib/use-page-title";

export default function About() {
  usePageTitle("About");
  return (
    <section>
      <Navbar />
      <div className="max-w-[900px] mx-auto px-6 py-16 lg:py-24 lato">
        <h1 className="text-3xl lg:text-4xl font-bold text-black mb-4">About Ile Oti</h1>
        <p className="text-[#585858] text-lg leading-relaxed">
          We are building this page. For enquiries, please use{" "}
          <Link to={routes.contact} className="text-primary font-semibold underline">
            Contact Us
          </Link>
          .
        </p>
      </div>
      <Footer />
    </section>
  );
}
