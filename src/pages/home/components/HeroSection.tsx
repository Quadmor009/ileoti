import { ImagesAndIcons } from "../../../shared/images-icons/ImagesAndIcons";
import Button from "../../../components/btns/Button";
import { useNavigate } from "react-router-dom";
import { routes } from "../../../shared/routes/routes";

const HeroSection = () => {
  const navigate = useNavigate();
  return (
    <div
      className="lato py-50"
      style={{
        backgroundImage: `url(${ImagesAndIcons.heroImage})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      <div className="w-[90%] lg:max-w-300 mx-auto ">
        <h3 className="text-[40px] text-4xl w-75 lg:text-[80px] font-bold text-white lg:w-[708px]">
          Raise Your Glass to Premium Living.
        </h3>
        <p className="text-base lg:text-3xl mb-6 text-white font-semibold">
          Premium drinks, bold mixers...
        </p>
        <div className="flex flex-col lg:flex-row items-center gap-4">
          <div className="w-full lg:w-[219px]">
            <Button handleClick={() => navigate(routes.products)} type="white" label="Shop Now" className="hover:bg-[#80011D] hover:text-white transition-all duration-300"/>
          </div>
          <div className="w-full lg:w-[219px]">
            <Button
              type="transparent"
              label="Build A Box"
              handleClick={() => navigate(`${routes.products}?buildGiftBox=1`)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
