import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import HeroSection from "./components/HeroSection";
import ExploreSection from "./components/ExploreSection";
import ProductCard from "../../components/card/ProductCard";
import { ImagesAndIcons } from "../../shared/images-icons/ImagesAndIcons";
import Button from "../../components/btns/Button";
import {
  InstagramOutlined,
  MailOutlined,
  XOutlined,
} from "@ant-design/icons";
import GetExclusiveAccessModal from "../../components/get-exclusive-access-modal/GetExclusiveAccessModal";
import { useQuery } from "@tanstack/react-query";
import { productService } from "../../services/product.service";
import { Link, useNavigate } from "react-router-dom";
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
      <div className="my-12 sm:my-16 lg:my-20 max-w-[1300px] mx-auto w-[92%] sm:w-[90%]">
        <h3 className="text-2xl sm:text-3xl font-semibold text-center text-primary">
          TOP PICKS
        </h3>
        <div className="flex items-stretch gap-3 sm:gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory mt-8 sm:mt-10 mb-8 pb-2 lg:justify-center w-full">
          {productsLoading && (
            <>
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="w-[min(88vw,300px)] sm:w-56 h-[320px] sm:h-[360px] lg:w-[246px] shrink-0 rounded-3xl bg-[#F4EEEE] animate-pulse"
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
            <div
              key={product.id}
              className="snap-start shrink-0 w-[min(88vw,300px)] sm:w-56 lg:w-[246px] flex h-full min-h-0"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
        <div className="w-full mt-12 sm:mt-16 lg:mt-24 pt-8 sm:pt-10 pb-6 border-t border-[#E8E8E8]">
          <div className="max-w-[1300px] mx-auto w-[92%] sm:w-[90%]">
            <div className="flex flex-col lg:flex-row lg:items-start gap-8 lg:gap-12">
              <div className="shrink-0 lg:max-w-[min(100%,22rem)] lg:pt-1">
                <p className="text-lg sm:text-xl text-black font-semibold">Categories</p>
                <h4 className="text-[1.35rem] sm:text-[32px] lg:text-[40px] font-bold text-primary leading-[1.15] sm:leading-tight mt-2 sm:mt-3">
                  SHOP YOUR FAVOURITE CATEGORIES HERE...
                </h4>
              </div>
              <div className="flex-1 min-w-0 lg:min-w-0 -mx-[4vw] px-[4vw] sm:mx-0 sm:px-0">
                <div className="overflow-x-auto overflow-y-visible no-scrollbar scroll-smooth snap-x snap-mandatory pb-3">
                  <div className="flex gap-4 sm:gap-5 w-max items-stretch py-1 pr-6 sm:pr-8">
                    {categoryCards.map((card) => (
                      <div
                        key={card.id}
                        style={{
                          backgroundImage: `url(${card.image})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                        className="relative w-[200px] sm:w-56 md:w-64 h-[280px] sm:h-80 md:h-[22rem] max-h-[400px] rounded-2xl transition-shadow duration-300 shadow-xl ring-2 ring-primary/25 lg:shadow-none lg:ring-0 lg:hover:shadow-xl lg:hover:ring-2 lg:hover:ring-primary/25 shrink-0 snap-start cursor-pointer overflow-hidden"
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
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/40 to-transparent pt-10 pb-3 px-2">
                          <p className="text-white text-center text-sm sm:text-base font-semibold tracking-tight">
                            {card.name}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-[1300px] mx-auto w-[92%] sm:w-[90%] mt-16 sm:mt-20 lg:mt-27">
          <div className="relative rounded-3xl overflow-hidden min-h-[220px] sm:min-h-[280px] md:min-h-[340px] lg:min-h-[22rem]">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${ImagesAndIcons.getEasyAccess})`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
              }}
              aria-hidden
            />
            <div className="absolute inset-0 bg-[rgba(128,1,29,0.62)]" aria-hidden />
            <div className="relative z-10 flex min-h-[220px] sm:min-h-[280px] md:min-h-[340px] lg:min-h-[22rem] flex-col items-center justify-center px-4 py-10 sm:py-12 md:py-14 gap-4 sm:gap-5 text-center">
              <h4 className="font-extrabold text-2xl sm:text-3xl md:text-4xl lg:text-[66px] text-white leading-tight max-w-4xl drop-shadow-sm">
                Get Exclusive Access
              </h4>
              <p className="text-sm sm:text-base md:text-xl lg:text-2xl font-normal text-white/95 max-w-xl md:max-w-2xl px-1 drop-shadow-sm">
                Enjoy exclusive access and offers to Ile Oti&apos;s most premium experience.
              </p>
              <div className="w-full max-w-sm sm:max-w-md mt-2 sm:mt-3">
                <GetExclusiveAccessModal />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-secondary py-10 sm:py-14 md:py-16 px-4 sm:px-6">
        <h4 className="text-2xl sm:text-[28px] md:text-[32px] font-semibold text-white text-center mb-8 sm:mb-12 md:mb-16 max-w-3xl mx-auto">
          FEATURE HIGHLIGHTS
        </h4>
        <div className="flex flex-col md:flex-row items-stretch justify-center gap-6 md:gap-10 lg:gap-14 max-w-5xl mx-auto w-full">
          <div className="w-full max-w-xl mx-auto md:mx-0 md:flex-1 md:max-w-none">
            <div className="relative rounded-2xl lg:rounded-[20px] bg-[#FF99CC] p-3 sm:p-4 overflow-hidden aspect-[4/3] md:aspect-[16/11] min-h-[200px]">
              <div
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    navigate(routes.contact);
                  }
                }}
                style={{
                  backgroundImage: `url(${ImagesAndIcons.cooperateEvents})`,
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                }}
                onClick={() => navigate(routes.contact)}
                className="absolute inset-3 sm:inset-4 rounded-xl overflow-hidden cursor-pointer flex flex-col items-center justify-center p-4 md:p-6 text-center"
              >
                <h2 className="font-bold text-sm sm:text-base md:text-2xl lg:text-4xl text-white leading-snug max-w-[18rem] sm:max-w-none mb-3 md:mb-6">
                  FOR EVENTS &amp; CORPORATE SERVICES
                </h2>
                <div className="w-full max-w-xs">
                  <Button type="white" label="Request a quote" className="text-primary !text-sm sm:!text-base" />
                </div>
              </div>
            </div>
          </div>
          <div className="w-full max-w-xl mx-auto md:mx-0 md:flex-1 md:max-w-none">
            <div className="relative rounded-2xl lg:rounded-[20px] bg-[#FF99CC] p-3 sm:p-4 overflow-hidden aspect-[4/3] md:aspect-[16/11] min-h-[200px]">
              <div
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    navigate(routes.contact);
                  }
                }}
                style={{
                  backgroundImage: `url(${ImagesAndIcons.buildyourbox})`,
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                }}
                onClick={() => navigate(routes.contact)}
                className="absolute inset-3 sm:inset-4 rounded-xl overflow-hidden cursor-pointer flex flex-col items-center justify-center p-4 md:p-6 text-center"
              >
                <h2 className="font-bold text-sm sm:text-base md:text-2xl lg:text-4xl max-w-[18rem] sm:max-w-md mx-auto mb-3 md:mb-6 text-white leading-snug">
                  BUILD YOUR OWN BOX
                </h2>
                <div className="w-full max-w-xs">
                  <Button type="white" label="Request a quote" className="text-primary !text-sm sm:!text-base" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-4 items-center justify-center py-7">
        <a
          href="https://www.instagram.com/ileoti.ng?igsh=ZnFqNDkxYmV0NjJl"
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-black transition-colors hover:bg-neutral-900"
          aria-label="Ile Oti on Instagram"
        >
          <InstagramOutlined style={{ color: "white", fontSize: 28 }} />
        </a>
        <div className="flex h-16 w-16 cursor-default items-center justify-center rounded-full bg-black">
          <XOutlined style={{ color: "white", fontSize: 28 }} aria-hidden />
        </div>
        <Link
          to={routes.contact}
          className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-black transition-colors hover:bg-neutral-900"
          aria-label="Contact us"
        >
          <MailOutlined style={{ color: "white", fontSize: 28 }} />
        </Link>
      </div>
      <Footer />
    </section>
  );
};

export default Home;
