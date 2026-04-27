import { Rate } from "antd";
import { ImagesAndIcons } from "../../shared/images-icons/ImagesAndIcons";
import { useNavigate } from "react-router-dom";
import { routes } from "../../shared/routes/routes";
import type { Product } from "../../types";
import { effectivePrice, formatNGN, primaryImage } from "../../lib/format";

interface ProductCardProps {
  product?: Product;
}

const ProductCard = ({ product }: ProductCardProps = {}) => {
  const navigate = useNavigate();

  const id = product?.id;
  console.log("product id:", product?.id);
  const name = product?.name ?? "Deanston 12 Year Old";
  const image = primaryImage(product?.images, ImagesAndIcons.furasgnBottle);
  const price = product ? effectivePrice(product) : 40000;
  const isDiscounted =
    product?.discountedPrice != null &&
    product.discountStart != null &&
    product.discountEnd != null &&
    Date.now() >= new Date(product.discountStart).getTime() &&
    Date.now() <= new Date(product.discountEnd).getTime();
  const avgRating = 4;

  const handleCardClick = () => {
    if (!id) return;
    navigate(`${routes.products}/${id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleCardClick();
        }
      }}
      className="cursor-pointer border border-transparent lg:hover:border-[#80011D] lg:hover:bg-[#F4EEEE] p-2 rounded-3xl transition-all duration-300 ease-in-out"
    >
      <div
        style={{
          backgroundImage: `url(${image})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
        className="lg:w-[246px] lg:h-[306px] w-40 h-49 mb-3 rounded-2xl"
      >
        <div className="p-2 flex items-center justify-end">
          <button
            onClick={(e) => e.stopPropagation()}
          >
            <img src={ImagesAndIcons.lovelyRed} alt="" />
          </button>
        </div>
      </div>
      <p className="text-sm lg:text-xl mb-0.5 font-medium text-black">{name}</p>
      <p className="text-[10px] lg:text-xs mb-0.5 text-[#585858] font-medium">
        {product?.category?.name ?? "70 Cl/46.3% ABV"}
      </p>
      <div className="mb-0.5 flex items-center gap-2">
        <Rate disabled defaultValue={avgRating} />
        <p className="text-[10px] lg:text-xs text-[#585858] font-medium">
          {product ? "Reviews" : "102 Reviews"}
        </p>
      </div>
      <div className="flex items-center gap-2 mb-3">
        <p className="text-sm lg:text-xl font-medium text-black">
          {formatNGN(price)}
        </p>
        {isDiscounted && product?.price != null && (
          <p className="text-xs text-[#585858] line-through">
            {formatNGN(product.price)}
          </p>
        )}
      </div>
      <div className="flex gap-2 items-center">
        <button
          onClick={(e) => e.stopPropagation()}
          className="text-xs text-white bg-primary rounded-[56px] px-6 lg:px-[50px] py-2 lg:py-4"
        >
          Add To Cart
        </button>
        <button
          onClick={(e) => e.stopPropagation()}
          className="lg:h-12 h-8 w-8 lg:w-12 rounded-full flex justify-center items-center border border-[#80011D]"
        >
          <img src={ImagesAndIcons.giftBox} alt="" />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
