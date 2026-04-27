import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import HeroSection from "./components/HeroSection";
import { useState } from "react";
import ExploreSection from "./components/ExploreSection";
import ProductCard from "../../components/card/ProductCard";
import { ImagesAndIcons } from "../../shared/images-icons/ImagesAndIcons";
import Button from "../../components/btns/Button";
import {
  InstagramOutlined,
  TikTokOutlined,
  WhatsAppOutlined,
  XOutlined,
} from "@ant-design/icons";
import GetExclusiveAccessModal from "../../components/get-exclusive-access-modal/GetExclusiveAccessModal";
import { useQuery } from "@tanstack/react-query";
import { productService } from "../../services/product.service";
import { useNavigate } from "react-router-dom";
import { routes } from "../../shared/routes/routes";

const CATEGORY_FALLBACKS = [
  ImagesAndIcons.organicSpiritImage,
  ImagesAndIcons.designerCocktails,
  ImagesAndIcons.softDrinksLemon,
  ImagesAndIcons.MixersHomeImage,
  ImagesAndIcons.icecubeblue,
  ImagesAndIcons.giftboxesRed,
  ImagesAndIcons.hangoverKit,
];

const Home = () => {
  const [hovered, setHovered] = useState("");
  const navigate = useNavigate();

  const {
    data: productsData,
    isLoading: productsLoading,
    isError: productsError,
  } = useQuery({
    queryKey: ["home-top-picks"],
    queryFn: () => productService.getProducts({ limit: 5, page: 1 }),
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => productService.getCategories(),
  });

  const featuredProducts = productsData?.data ?? [];
  const categoryCards = categories?.length
    ? categories.map((category, i) => ({
        id: category.id,
        name: category.name,
        image: category.imageUrl ?? CATEGORY_FALLBACKS[i] ?? CATEGORY_FALLBACKS[0],
      }))
    : [];

  return (
    <section>
      <Navbar />
      <HeroSection />
      <ExploreSection />
      <div className="my-20 w-[90%] mx-auto lg:w-full">
        <h3 className="text-3xl font-semibold text-center text-primary">
          TOP PICKS
        </h3>
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar mt-10 mb-8 lg:justify-center w-full">
          {productsLoading && (
            <>
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="lg:w-[246px] lg:h-[360px] w-40 h-56 rounded-3xl bg-[#F4EEEE] animate-pulse shrink-0"
                />
              ))}
            </>
          )}
          {productsError && (
            <p className="text-center text-red-600 py-6">Failed to load products</p>
          )}
          {!productsLoading && !productsError && featuredProducts.length === 0 && (
            <p className="text-center text-[#585858] py-6">No products available</p>
          )}
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="w-full mt-16 lg:mt-24 pt-10 pb-4 border-t border-[#E8E8E8]">
          <div className="flex flex-col lg:flex-row lg:items-start gap-8 lg:gap-12">
            <div className="shrink-0 max-w-full lg:max-w-[min(100%,22rem)]">
              <p className="text-xl text-black font-semibold">Categories</p>
              <h4 className="text-[28px] sm:text-[36px] lg:text-[40px] font-bold text-primary leading-tight mt-1">
                SHOP YOUR FAVOURITE CATEGORIES HERE...
              </h4>
            </div>
            <div className="flex-1 min-w-0 -mx-1 px-1 overflow-x-auto no-scrollbar pb-2">
              <div className="flex gap-4 w-max items-stretch">
                {categoryCards.map((card) => (
                  <div
                    key={card.id}
                    style={{
                      backgroundImage: `url(${card.image})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                    className="relative w-64 sm:w-69 h-80 sm:h-88 rounded-2xl transition-shadow duration-300 hover:shadow-lg shrink-0 cursor-pointer"
                    onClick={() => navigate(`/products?categoryId=${card.id}`)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        navigate(`/products?categoryId=${card.id}`);
                      }
                    }}
                  >
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-center py-2 rounded-b-2xl font-semibold">
                      {card.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div
          style={{
            backgroundImage: `url(${ImagesAndIcons.getEasyAccess})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
          className="w-[90%] mx-auto rounded-3xl overflow-hidden max-w-269 h-37 md:h-114 mt-27"
        >
          <div className="h-full w-full bg-[rgba(128,1,29,0.6)] flex flex-col items-center justify-center">
            <h4 className="font-extrabold text-2xl md:text-3xl lg:text-[66px] text-center text-white">
              Get Exclusive Access
            </h4>
            <p className="text-2xl font-normal hidden md:block text-white text-center">
              Enjoy exclusive access and offers to Ile Oti's most premium
              experience.
            </p>
            <div className="lg:w-85 w-41 mt-6">
              <GetExclusiveAccessModal />
            </div>
          </div>
        </div>
      </div>
      <div className="bg-secondary py-16">
        <h4 className="text-[32px] font-semibold text-white text-center mb-16">
          FEATURE HIGHLIGHTS
        </h4>
        <div className="flex items-center justify-center gap-4 md:gap-10 lg:gap-20">
          <div className="bg-[#FF99CC] w-40 md:h-56 md:w-60 lg:w-123 h-36 lg:h-112 rounded-md lg:rounded-[20px] flex items-center justify-center">
            <div
              style={{
                backgroundImage: `url(${ImagesAndIcons.cooperateEvents})`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
              }}
              onMouseEnter={() => setHovered("corperateevents")}
              onMouseLeave={() => setHovered("")}
              onClick={() => navigate(routes.contact)}
              className="w-[80%] h-[80%] rounded-md cursor-pointer lg:w-101 lg:h-94 flex flex-col items-center justify-center"
            >
              <h2 className="font-bold text-xs lg:text-4xl text-center mb-6 text-white">
                FOR EVENTS & CORPORATE SERVICES
              </h2>
              <div
                className={`w-75 hidden lg:block transition-opacity duration-500
                ${hovered === "corperateevents" ? "opacity-100" : "opacity-0"}
                `}
              >
                <Button type="white" label="Request A Quote" className="text-primary" />
              </div>
            </div>
          </div>
          <div
            onMouseEnter={() => setHovered("buildABox")}
            onMouseLeave={() => setHovered("")}
            className="bg-[#FF99CC] w-40 md:h-56 md:w-60 lg:w-123 h-36 lg:h-112 rounded-md lg:rounded-[20px] flex items-center justify-center"
          >
            <div
              style={{
                backgroundImage: `url(${ImagesAndIcons.buildyourbox})`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
              }}
              onClick={() => navigate(routes.contact)}
              className="w-[80%] h-[80%] cursor-pointer rounded-md lg:w-101 lg:h-94 flex items-center flex-col justify-center"
            >
              <h2 className="font-bold text-xs lg:text-4xl lg:w-75 mx-auto text-center mb-6 text-white">
                BUILD YOUR OWN BOX
              </h2>
              <div
                className={`w-75 hidden lg:block transition-opacity duration-500
                ${hovered === "buildABox" ? "opacity-100" : "opacity-0"}
                `}
              >
                <Button type="white" label="Request A Quote" className="text-primary" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-4 items-center justify-center py-7">
        <div className="bg-black h-16 w-16 rounded-full flex items-center justify-center cursor-pointer">
          <InstagramOutlined style={{ color: "white", fontSize: 28 }} />
        </div>
        <div className="bg-black h-16 w-16 rounded-full flex items-center justify-center cursor-pointer">
          <XOutlined style={{ color: "white", fontSize: 28 }} />
        </div>
        <div className="bg-black h-16 w-16 rounded-full flex items-center justify-center cursor-pointer">
          <TikTokOutlined style={{ color: "white", fontSize: 28 }} />
        </div>
        <div className="bg-black h-16 w-16 rounded-full flex items-center justify-center cursor-pointer">
          <WhatsAppOutlined style={{ color: "white", fontSize: 28 }} />
        </div>
      </div>
      <Footer />
    </section>
  );
};

export default Home;
