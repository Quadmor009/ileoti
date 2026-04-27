import { ImagesAndIcons } from "../../../shared/images-icons/ImagesAndIcons";
import Button from "../../../components/btns/Button";

const ExploreSection = () => {
  return (
    <div className="bg-primary py-10 sm:py-12 md:py-15">
      <div className="w-[92%] sm:w-[90%] lg:w-full mx-auto px-0 sm:px-0">
        <h3 className="text-center mb-8 sm:mb-10 md:mb-12 lg:mb-14 font-semibold text-2xl sm:text-3xl text-white">
          EXPLORE OUR WORLD
        </h3>
        <div className="flex w-full justify-center flex-col lg:flex-row gap-4 sm:gap-5">
          <div className="flex flex-col gap-4">
            <div
              style={{
                backgroundImage: `url(${ImagesAndIcons.spirit})`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
              }}
              className="w-full h-39 md:h-57 lg:w-132 lg:h-135 rounded-2xl overflow-hidden relative group"
            >
              <div
                className="absolute inset-0 bg-[rgba(0,0,0,0.5)] flex items-center flex-col justify-center 
                  lg:opacity-0 opacity-100 lg:group-hover:opacity-100 transition-opacity duration-500"
              >
                <h4 className="text-lg sm:text-xl md:text-2xl lg:text-4xl text-white mb-4 sm:mb-6 font-medium max-w-[90%] sm:w-93 text-center px-1">
                  Crafted Spirits, Classic Sips
                </h4>
                <div className="w-29 md:w-55 w-full max-w-[200px] sm:max-w-none">
                  <Button type="white" label="Shop now" className="text-[#80011D] !text-sm sm:!text-base" />
                </div>
              </div>
            </div>

            <div
              style={{
                backgroundImage: `url(${ImagesAndIcons.iceSlucshy})`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
              }}
              className="lg:w-132 w-full rounded-2xl h-39 md:h-57 overflow-hidden relative group"
            >
              <div
                className="absolute inset-0 bg-[rgba(0,0,0,0.5)] flex items-center flex-col justify-center 
                  lg:opacity-0 opacity-100 lg:group-hover:opacity-100 transition-opacity duration-500"
              >
                <h4 className="text-lg sm:text-xl md:text-2xl lg:text-4xl text-white mb-4 sm:mb-6 font-medium max-w-[90%] sm:w-93 text-center px-1">
                  Ice, Slushy, &amp; Hangover Kits
                </h4>
                <div className="w-29 md:w-55 w-full max-w-[200px] sm:max-w-none">
                  <Button type="white" label="Shop now" className="text-[#4F664A] !text-sm sm:!text-base" />
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div
              style={{
                backgroundImage: `url(${ImagesAndIcons.soda})`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
              }}
              className="lg:w-132 w-full rounded-2xl h-39 md:h-57 overflow-hidden relative group"
            >
              <div
                className="absolute inset-0 bg-[rgba(0,0,0,0.5)] flex items-center flex-col justify-center 
                  lg:opacity-0 opacity-100 lg:group-hover:opacity-100 transition-opacity duration-500"
              >
                <h4 className="text-lg sm:text-xl md:text-2xl lg:text-4xl text-white mb-4 sm:mb-6 font-medium max-w-[90%] sm:w-93 text-center px-1">
                  Unrivalled Mixers &amp; Soft Drinks
                </h4>
                <div className="w-29 md:w-55 w-full max-w-[200px] sm:max-w-none">
                  <Button type="white" label="Shop now" className="text-[#250D00] !text-sm sm:!text-base" />
                </div>
              </div>
            </div>
            <div
              style={{
                backgroundImage: `url(${ImagesAndIcons.giftBoxes})`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
              }}
              className="w-full h-39 md:h-57 lg:w-132 lg:h-135 rounded-2xl overflow-hidden relative group"
            >
              <div
                className="absolute inset-0 bg-[rgba(0,0,0,0.5)] flex items-center flex-col justify-center 
                  lg:opacity-0 opacity-100 lg:group-hover:opacity-100 transition-opacity duration-500"
              >
                <h4 className="text-lg sm:text-xl md:text-2xl lg:text-4xl text-white mb-4 sm:mb-6 font-medium max-w-[90%] sm:w-93 text-center px-1">
                  Curated Gifting &amp; Celebration Boxes
                </h4>
                <div className="w-29 md:w-55 w-full max-w-[200px] sm:max-w-none">
                  <Button type="white" label="Shop now" className="text-[#250D00] !text-sm sm:!text-base" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExploreSection;
