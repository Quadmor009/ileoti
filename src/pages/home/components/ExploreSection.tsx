import { useNavigate } from "react-router-dom";
import { ImagesAndIcons } from "../../../shared/images-icons/ImagesAndIcons";
import Button from "../../../components/btns/Button";
import { exploreSlugs } from "../../../shared/exploreRoutes";

const overlayBase =
  "absolute inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center px-3 " +
  "opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-500 " +
  "lg:pointer-events-none lg:group-hover:pointer-events-auto";

const ExploreSection = () => {
  const navigate = useNavigate();

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
              <div className={overlayBase}>
                <div className="pointer-events-auto flex max-h-full w-full flex-col items-center justify-center py-4">
                  <h4 className="mb-4 max-w-[90%] px-1 text-center text-lg font-medium text-white sm:mb-6 sm:text-xl sm:w-93 md:text-2xl lg:text-4xl">
                    Crafted Spirits, Classic Sips
                  </h4>
                  <div className="w-29 w-full max-w-[220px] sm:max-w-none md:w-55">
                    <Button
                      type="white"
                      label="Shop now"
                      className="!text-sm text-[#80011D] sm:!text-base"
                      handleClick={() => navigate(`/shop/${exploreSlugs.craftedSpirits}`)}
                    />
                  </div>
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
              <div className={overlayBase}>
                <div className="pointer-events-auto flex max-h-full w-full flex-col items-center justify-center py-4">
                  <h4 className="mb-4 max-w-[90%] px-1 text-center text-lg font-medium text-white sm:mb-6 sm:text-xl sm:w-93 md:text-2xl lg:text-4xl">
                    Ice, Slushy, &amp; Hangover Kits
                  </h4>
                  <div className="w-29 w-full max-w-[220px] sm:max-w-none md:w-55">
                    <Button
                      type="white"
                      label="Shop now"
                      className="!text-sm text-[#4F664A] sm:!text-base"
                      handleClick={() => navigate(`/shop/${exploreSlugs.iceSlushy}`)}
                    />
                  </div>
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
              <div className={overlayBase}>
                <div className="pointer-events-auto flex max-h-full w-full flex-col items-center justify-center py-4">
                  <h4 className="mb-4 max-w-[90%] px-1 text-center text-lg font-medium text-white sm:mb-6 sm:text-xl sm:w-93 md:text-2xl lg:text-4xl">
                    Unrivalled Mixers &amp; Soft Drinks
                  </h4>
                  <div className="w-29 w-full max-w-[220px] sm:max-w-none md:w-55">
                    <Button
                      type="white"
                      label="Shop now"
                      className="!text-sm text-[#250D00] sm:!text-base"
                      handleClick={() => navigate(`/shop/${exploreSlugs.mixersSoftDrinks}`)}
                    />
                  </div>
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
              <div className={overlayBase}>
                <div className="pointer-events-auto flex max-h-full w-full flex-col items-center justify-center py-4">
                  <h4 className="mb-4 max-w-[90%] px-1 text-center text-lg font-medium text-white sm:mb-6 sm:text-xl sm:w-93 md:text-2xl lg:text-4xl">
                    Curated Gifting &amp; Celebration Boxes
                  </h4>
                  <div className="w-29 w-full max-w-[220px] sm:max-w-none md:w-55">
                    <Button
                      type="white"
                      label="Shop now"
                      className="!text-sm text-[#250D00] sm:!text-base"
                      handleClick={() => navigate(`/shop/${exploreSlugs.gifting}`)}
                    />
                  </div>
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
