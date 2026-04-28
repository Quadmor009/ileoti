import { Checkbox, Spin } from "antd";
import Button from "../../components/btns/Button";
import Footer from "../../components/footer/Footer";
import Navbar from "../../components/navbar/Navbar";
import { ImagesAndIcons } from "../../shared/images-icons/ImagesAndIcons";
import DropDown from "../../components/dropdown/DropDown";
import ProductCard from "../../components/card/ProductCard";
import Pagination from "../../shared/pagination/Pagination";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import MakeAGiftboxModal from "../../components/gift-box-modal/MakeAGiftboxModal";
import GiftBoxModal from "../../components/gift-box-modal/GiftboxModal";
import PersonalMessageModal from "../../components/gift-box-modal/PersonalMessageModal";
import { useQuery } from "@tanstack/react-query";
import { productService } from "../../services/product.service";
import { routes } from "../../shared/routes/routes";
import {
  getExploreConfig,
  isExploreSlug,
  resolveExploreCategoryId,
} from "../../shared/exploreRoutes";

const DEFAULT_CATEGORY_TABS = ["Cognac", "Gin", "Pineau", "Whiskey"];

const Products = () => {
  const { slug } = useParams<{ slug?: string }>();
  const navigate = useNavigate();
  const explore = slug && isExploreSlug(slug) ? getExploreConfig(slug) : undefined;
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState(() => searchParams.get("search") ?? "");
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get("search") ?? "");
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    () => searchParams.get("categoryId") ?? undefined,
  );
  const [openGiftBox, setOpenGiftBox] = useState(false);
  const [openGiftBoxTwo, setOpenGiftBoxTwo] = useState(false);
  const [addPersonalMessage, setAddPersonalMessage] = useState(false);
  const [giftMessage, setGiftMessage] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const buildGiftBoxHandled = useRef(false);

  useEffect(() => {
    if (searchParams.get("buildGiftBox") !== "1") {
      buildGiftBoxHandled.current = false;
      return;
    }
    if (buildGiftBoxHandled.current) return;
    buildGiftBoxHandled.current = true;
    setOpenGiftBoxTwo(true);
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.delete("buildGiftBox");
        return next;
      },
      { replace: true },
    );
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    const q = searchParams.get("search") ?? "";
    const categoryId = searchParams.get("categoryId") ?? undefined;
    setSearch(q);
    setSearchQuery(q);
    const onExplore = Boolean(slug && isExploreSlug(slug));
    if (!onExplore) {
      setSelectedCategory(categoryId);
    } else if (categoryId) {
      setSelectedCategory(categoryId);
    }
    setCurrentPage(1);
  }, [searchParams, slug]);

  // 500ms debounce on search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setSearchQuery(search);
    }, 500);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [search]);

  const { data: productsData, isLoading, isError } = useQuery({
    queryKey: ["products", searchQuery, selectedCategory, currentPage],
    queryFn: () =>
      productService.getProducts({
        page: currentPage,
        limit: 20,
        search: searchQuery || undefined,
        categoryId: selectedCategory,
      }),
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => productService.getCategories(),
  });

  useEffect(() => {
    if (!slug) return;
    if (!isExploreSlug(slug)) {
      navigate(routes.products, { replace: true });
    }
  }, [slug, navigate]);

  useEffect(() => {
    if (!slug || !isExploreSlug(slug) || !categories?.length) return;
    const id = resolveExploreCategoryId(slug, categories);
    setSelectedCategory(id);
    setCurrentPage(1);
  }, [slug, categories]);

  const products = productsData?.data ?? [];
  const totalPages =
    (productsData as { meta?: { totalPages?: number } } | undefined)?.meta?.totalPages ?? 1;
  const dedupedCategories = (categories ?? []).filter(
    (category, index, all) =>
      all.findIndex((item) => item.name.toLowerCase() === category.name.toLowerCase()) === index,
  );
  const quickTabs = DEFAULT_CATEGORY_TABS.map((tabName) =>
    dedupedCategories.find((category) => category.name.toLowerCase() === tabName.toLowerCase()),
  ).filter((category): category is NonNullable<typeof category> => Boolean(category));

  return (
    <section>
      <Navbar />
      <div className="bg-primary py-7">
        <div className="max-w-270 w-[90%] mx-auto">
          <p className="font-bold text-2xl lg:text-[40px] text-white leading-tight">
            {explore?.pageTitle ?? "Explore our products"}
          </p>
          {explore?.pageSubtitle ? (
            <p className="mt-2 max-w-3xl text-sm sm:text-base text-white/90 lg:text-lg">
              {explore.pageSubtitle}
            </p>
          ) : null}
        </div>
      </div>
      <div className="max-w-270 w-[90%] mx-auto mt-6 mb-2">
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => {
              setSelectedCategory(undefined);
              setCurrentPage(1);
            }}
            className={`px-4 py-2 rounded-full border text-sm ${
              !selectedCategory
                ? "bg-primary text-white border-primary"
                : "bg-white text-black border-[#D9D9D9]"
            }`}
          >
            All
          </button>
          {quickTabs.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => {
                setSelectedCategory(category.id);
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-full border text-sm ${
                selectedCategory === category.id
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-black border-[#D9D9D9]"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
      <div className="flex justify-between flex-wrap gap-y-4 mx-auto items-center py-6 max-w-270 w-[90%]">
        <div className="hidden lg:flex gap-4">
          <Button
            type="outlinedIcon"
            icon={ImagesAndIcons.filterSearch}
            justIcon={true}
          />
          <DropDown
            icons={ImagesAndIcons.arrowDownSquare}
            content={
              <div className="border border-[#D9D9D9] bg-white p-6 rounded-2xl flex flex-col gap-4">
                <div className="text-xs font-medium flex items-center gap-2">
                  <Checkbox /> Alcoholic
                </div>
                <div className="text-xs font-medium flex items-center gap-2">
                  <Checkbox /> Non Alcoholic
                </div>
              </div>
            }
            btnLabel=" Alcoholic  & Non Alcoholic"
          />
          <DropDown
            icons={ImagesAndIcons.arrowDownSquare}
            content={
              <div className="border border-[#D9D9D9] bg-white p-6 rounded-2xl flex flex-col gap-4">
                <div className="text-xs font-medium flex items-center gap-2">
                  <Checkbox /> Social Gathering
                </div>
                <div className="text-xs font-medium flex items-center gap-2">
                  <Checkbox /> Gifts
                </div>
                <div className="text-xs font-medium flex items-center gap-2">
                  <Checkbox /> Weddings
                </div>
              </div>
            }
            btnLabel={`Occasion: All`}
          />
          <DropDown
            icons={ImagesAndIcons.arrowDownSquare}
            content={
              <div className="border border-[#D9D9D9] bg-white p-6 rounded-2xl flex flex-col gap-4">
                <div className="text-xs font-medium flex items-center gap-2">
                  <Checkbox /> 0 - N100,000
                </div>
                <div className="text-xs font-medium flex items-center gap-2">
                  <Checkbox /> 101,000 - N500,000
                </div>
                <div className="text-xs font-medium flex items-center gap-2">
                  <Checkbox /> 501,000 - N1,000,000
                </div>
              </div>
            }
            btnLabel={`Price Range: All`}
          />
          {/* Category filter */}
          <DropDown
            icons={ImagesAndIcons.arrowDownSquare}
            content={
              <div className="border border-[#D9D9D9] bg-white p-6 rounded-2xl flex flex-col gap-4">
                <div
                  className="text-xs font-medium cursor-pointer hover:text-primary"
                  onClick={() => { setSelectedCategory(undefined); setCurrentPage(1); }}
                >
                  All categories
                </div>
                {categories?.map((cat) => (
                  <div
                    key={cat.id}
                    className="text-xs font-medium cursor-pointer hover:text-primary"
                    onClick={() => { setSelectedCategory(cat.id); setCurrentPage(1); }}
                  >
                    {cat.name}
                    {selectedCategory === cat.id && " ✓"}
                  </div>
                ))}
              </div>
            }
            btnLabel={
              selectedCategory
                ? categories?.find((c) => c.id === selectedCategory)?.name ?? "Category"
                : "Category: All"
            }
          />
          <DropDown
            icons={ImagesAndIcons.arrowDownSquare}
            content={
              <div className="border border-[#D9D9D9] bg-white p-6 rounded-2xl flex flex-col gap-4">
                <div className="text-xs font-medium flex items-center gap-2">
                  <Checkbox /> Alcoholic
                </div>
                <div className="text-xs font-medium flex items-center gap-2">
                  <Checkbox /> Non Alcoholic
                </div>
              </div>
            }
            btnLabel={`Sort By`}
          />
        </div>
        <div className="block lg:hidden">
          <DropDown
            icons={ImagesAndIcons.filterSearch}
            content={
              <div className="bg-primary rounded-[0px_24px_24px_24px] p-6 flex flex-col gap-4">
                <button className="py-2 px-4 border border-white text-white flex items-center gap-2 rounded-lg text-xs font-medium">
                  Alcoholic & Non Alcoholic{" "}
                  <img src={ImagesAndIcons.arrowdownWhite} alt="" />
                </button>
                <button className="py-2 px-4 border border-white text-white flex items-center gap-2 rounded-lg text-xs font-medium">
                  Occasion: All{" "}
                  <img src={ImagesAndIcons.arrowdownWhite} alt="" />
                </button>
                <button className="py-2 px-4 border border-white text-white flex items-center gap-2 rounded-lg text-xs font-medium">
                  Price Range: All{" "}
                  <img src={ImagesAndIcons.arrowdownWhite} alt="" />
                </button>
                <button className="py-2 px-4 border border-white text-white flex items-center gap-2 rounded-lg text-xs font-medium">
                  Flavour Profile: All{" "}
                  <img src={ImagesAndIcons.arrowdownWhite} alt="" />
                </button>
                <button className="py-2 px-4 border border-white text-white flex items-center gap-2 rounded-lg text-xs font-medium">
                  Sort by <img src={ImagesAndIcons.arrowdownWhite} alt="" />
                </button>
              </div>
            }
            btnLabel="Filter"
          />
        </div>
        {/* Search */}
        <div className="w-full lg:w-auto">
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search products..."
            className="border border-[#D9D9D9] rounded-full px-4 h-14 text-base w-full lg:w-64 outline-none focus:border-primary"
          />
        </div>
        <div className="w-38">
          <Button
            type="red"
            icon={ImagesAndIcons.giftboxWhite}
            label="Gift Box"
            className="py-2 md:py-[14px] text-base font-medium rounded-3xl"
            handleClick={() => setOpenGiftBox(true)}
          />
        </div>
      </div>
      {/* Products grid */}
      {isLoading && (
        <div className="max-w-270 mx-auto w-[90%] py-16 flex justify-center">
          <Spin size="large" />
        </div>
      )}
      {isError && (
        <p className="text-center text-red-600 py-10">Failed to load products</p>
      )}
      {!isLoading && !isError && (
        <div className="grid grid-cols-2 md:grid-cols-4 max-w-270 mx-auto w-[90%] items-stretch gap-y-10 gap-x-2 sm:gap-x-3 justify-center">
          {products.length === 0 ? (
            <p className="col-span-4 text-center text-[#585858] py-10">No products found.</p>
          ) : (
            products.map((product) => (
              <div key={product.id} className="min-w-0 flex h-full">
                <ProductCard product={product} />
              </div>
            ))
          )}
        </div>
      )}

      <div className="flex items-center justify-center my-16">
        <Pagination numberOfPages={totalPages} setpage={(p) => setCurrentPage(p)} page={currentPage} />
      </div>
      <Footer />
      <MakeAGiftboxModal
        handleStartGiftBox={() => { setOpenGiftBoxTwo(true); setOpenGiftBox(false); }}
        isModalOpen={openGiftBox}
        handleCancel={() => setOpenGiftBox(false)}
      />
      <GiftBoxModal
        handleAddPersonalMessage={() => setAddPersonalMessage(true)}
        open={openGiftBoxTwo}
        setOpen={setOpenGiftBoxTwo}
        personalMessage={giftMessage}
        initialProduct={undefined}
      />
      <PersonalMessageModal
        open={addPersonalMessage}
        setOpen={setAddPersonalMessage}
        initialDraft={giftMessage}
        onSubmitMessage={(msg) => setGiftMessage(msg)}
      />
    </section>
  );
};

export default Products;
