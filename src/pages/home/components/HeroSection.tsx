import { ImagesAndIcons } from "../../../shared/images-icons/ImagesAndIcons";
import Button from "../../../components/btns/Button";
import { useNavigate } from "react-router-dom";
import { routes } from "../../../shared/routes/routes";

const HeroSection = () => {
  const navigate = useNavigate();
  return (
    <div
      className="lato py-12 sm:py-20 md:py-32 lg:py-50"
      style={{
        backgroundImage: `url(${ImagesAndIcons.heroImage})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      <div className="w-[90%] max-w-300 mx-auto">
        <h3 className="text-[2rem] leading-tight sm:text-5xl md:text-6xl lg:text-[80px] font-bold text-white max-w-full lg:max-w-[708px]">
          Raise Your Glass to Premium Living.
        </h3>
        <p className="text-base sm:text-xl md:text-2xl lg:text-3xl mt-6 sm:mt-8 md:mt-10 mb-8 sm:mb-10 text-white/95 font-semibold max-w-2xl">
          Premium drinks, bold mixers...
        </p>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-5 w-full max-w-md sm:max-w-none lg:max-w-300">
          <div className="w-full sm:flex-1 lg:w-[219px] lg:max-w-[219px]">
            <Button
              handleClick={() => navigate(routes.products)}
              type="white"
              label="Shop now"
              className="!min-h-[52px] sm:!min-h-14 !text-base sm:!text-lg !py-3.5 hover:bg-[#80011D] hover:text-white transition-all duration-300"
            />
          </div>
          <div className="w-full sm:flex-1 lg:w-[219px] lg:max-w-[219px]">
            <Button
              type="transparent"
              label="Build a box"
              handleClick={() => navigate(`${routes.products}?buildGiftBox=1`)}
              className="!min-h-[52px] sm:!min-h-14 !text-base sm:!text-lg !py-3.5"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
