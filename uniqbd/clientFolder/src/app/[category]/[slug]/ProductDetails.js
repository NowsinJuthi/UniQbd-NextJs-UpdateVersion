"use client";

import TiltCard from "@/app/components/TiltCard";
import { CartContext } from "@/context/CartContext";
import { useParams, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";

import { toast } from "react-toastify";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

import { Autoplay } from "swiper/modules";
import PremiumCard from "../Premium";

import api, { appUrl } from "@/utils/api";
import ProductTabs from "../page";

const ProductDetails = () => {
  const params = useParams();

  const slug = params.slug;
  const category = params.category;
  const router = useRouter();

  const [related, setRelated] = useState([]);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [gameID, setGameID] = useState("");

  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    setLoading(true);
    setProduct(null);
    setSelectedPackage(null);
    setQuantity(1);
    setGameID("");

    const fetchProduct = async () => {
      try {
        const { data } = await api.get(
          `/product/${category}/${slug}`
        );
        const productWithPackages = {
          ...data.product,
          packages: data.product.packageType || [],
        };

        setProduct(productWithPackages);

        if (productWithPackages.packages.length > 0) {
          setSelectedPackage(productWithPackages.packages[0]);
        }

        const relatedRes = await api.get(
          `/related/${data.product._id}`
        );

        setRelated(relatedRes.data.products || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [category, slug]);

  if (loading) return <div className="text-center mt-20">Loading...</div>;

  if (!product)
    return (
      <div className="text-center mt-20 text-2xl font-bold">
        Product Not Found
      </div>
    );

  const price =
    selectedPackage?.discountPrice ||
    selectedPackage?.price ||
    product.discountPrice ||
    product.price ||
    0;

  const subtotal = price * quantity;

  const isTopUp =
    product?.category?.name?.toLowerCase() === "top-up";

  const formatTk = (amount) => `${Number(amount ?? 0).toFixed(0)} TK`;

  const packageKey = (pack) => pack?._id || pack?.name;

  const handleAddToCart = (redirectToCheckout = false) => {
    if (isTopUp && !gameID.trim()) {
      toast.error("Enter Game ID");
      return;
    }

    const added = addToCart({
      product,
      selectedPkg: selectedPackage,
      playerId: gameID,
      quantity,
    });

    if (added && redirectToCheckout) {
      router.push("/checkout");
    }
  };

  return (
    <section className="min-h-screen md:py-16 md:px-6 px-3">
      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">

        {/* LEFT SIDE - BIG HERO TILT CARD */}
        <div className="w-full flex justify-center md:sticky md:top-20">
          <div className="w-full max-w-[750px] h-full">
            <TiltCard key={product._id ?? product.id} product={product} />
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-full">
          <h1 className="text-text text-4xl font-bold mb-6">
            {product.name}
          </h1>

          <p className="text-text/70 mb-6">
            {product.shortDescription}
          </p>

          {/* PACKAGES */}
          {product.packages?.length > 0 && (
            <>
              <h2 className="text-text text-xl font-semibold mb-4">
                Select Package
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {product.packages.map((pack, index) => (
                  <div
                    key={packageKey(pack) ?? index}
                    onClick={() => setSelectedPackage(pack)}
                    className={`
            group relative overflow-hidden cursor-pointer
            transition-all duration-300

            rounded-[10px]
            border border-cyan-400/20
            bg-gradient-to-b from-cyan-500/10 to-transparent
            backdrop-blur-2xl
            shadow-xl shadow-cyan-500/10

            flex flex-col items-start justify-center
            px-3 py-4 text-left w-full

            ${packageKey(selectedPackage) === packageKey(pack)
                        ? "scale-105 translate-y-[-4px] shadow-[0_12px_0_rgba(0,0,0,0.25),0_18px_30px_rgba(34,211,238,0.25)] border-cyan-400/80"
                        : "hover:scale-105 hover:translate-y-[-4px] hover:shadow-[0_12px_0_rgba(0,0,0,0.2),0_18px_30px_rgba(34,211,238,0.2)]"
                      }
          `}
                  >
                    {/* Glow Effect */}
                    <div
                      className="
              absolute inset-0 rounded-full blur-2xl
              bg-cyan-500/10 opacity-0
              group-hover:opacity-100
              transition duration-300
            "
                    />

                    {/* content wrapper */}
                    <div className="flex items-center gap-3 z-10 w-full">

                      {/* Image */}
                      <img
                        src={
                          product.packageImage
                            ? `${appUrl}/uploads/${product.packageImage}`
                            : product.photo
                              ? `${appUrl}/uploads/${product.photo}`
                              : "/default-product.png"
                        }
                        alt={product.name}
                        className="object-contain h-15 w-15 flex-shrink-0"
                      />

                      {/* Text block */}
                      <div className="flex flex-col w-full gap-1">

                        {/* Name */}
                        <span className="text-sm font-bold text-right w-full">
                          {pack.name}
                        </span>

                        <hr className="my-1 w-full opacity-30" />

                        {/* Price */}
                        <span className="flex items-center justify-end gap-2 ">
                          {pack.discountPrice ? (
                            <>
                              <span className="text-gray-400 text-xs line-through">
                                {formatTk(pack.price)}
                              </span>
                              <span className="text-green-400 font-bold">
                                {formatTk(pack.discountPrice)}
                              </span>
                            </>
                          ) : (
                            <span className="text-green-400 font-bold">
                              {formatTk(pack.price)}
                            </span>
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Bottom Glow Line */}
                    <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Quantity */}
          <div className="mb-6 flex flex-col gap-2">
            <label className="block text-text font-semibold mb-1">
              Quantity
            </label>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                className="w-10 h-10 flex text-text items-center justify-center bg-button/10 shadow-lg shadow-button/20 rounded-lg hover:bg-button/20 transition"
              >
                -
              </button>

              <span className="relative w-20 text-center text-text font-semibold px-4 py-2 rounded-xl bg-button/10 backdrop-blur-xl shadow-lg shadow-button/20">
                {quantity}
              </span>

              <button
                onClick={() => setQuantity((prev) => prev + 1)}
                className="w-10 h-10 text-text flex items-center justify-center bg-button/10 shadow-lg shadow-button/20 rounded-lg hover:bg-button/20 transition"
              >
                +
              </button>
            </div>
          </div>

          {/* Game ID */}
          {isTopUp && (
            <div className="mb-8">
              <label className="block font-semibold mb-2 text-text">
                Game ID
              </label>

              <input
                type="text"
                value={gameID}
                onChange={(e) => setGameID(e.target.value)}
                placeholder="Enter Player ID"
                className="w-full px-4 py-3 rounded-xl bg-imgcard border
                 border-white/10 focus:border-button outline-none shadow-inner"
              />
            </div>
          )}

          {/* Order Summary */}
          <div
            className="bg-imgcard backdrop-blur-3xl px-4 py-4 my-10
           rounded-[10px] border-button shadow-inner shadow-button/10"
          >
            <h3 className="font-bold text-text text-lg mb-4">Order Summary</h3>

            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-semibold">{subtotal} TK</span>
            </div>

            <div className="flex justify-between border-t pt-3">
              <span className="font-semibold text-text text-lg">Total</span>
              <span className="font-bold text-lg text-button">
                {subtotal} TK
              </span>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => handleAddToCart(true)}
              className="px-8 py-3 bg-button text-white rounded-[5px] shadow-lg transform transition active:translate-y-1 active:shadow-sm hover:scale-105"
            >
              Buy Now
            </button>

            <button
              onClick={() => handleAddToCart(false)}
              className="px-8 py-3 bg-button text-white rounded-[5px] shadow-lg transform transition active:translate-y-1 active:shadow-sm hover:scale-105"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* TABS */}
      <ProductTabs product={product} />

      {/* RELATED */}
      {related.length > 0 && (
        <div className="mt-20">
          <h2 className="text-3xl font-bold mb-6 text-text">
            Related Products
          </h2>

          <Swiper
            modules={[Autoplay]}
            spaceBetween={15}
            slidesPerView={1}
            loop={related.length > 1}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            breakpoints={{
              0: {
                slidesPerView: 1,
              },
              480: {
                slidesPerView: 1.2,
              },
              640: {
                slidesPerView: 2,
              },
              768: {
                slidesPerView: 3,
              },
              1024: {
                slidesPerView: 4,
              },
            }}
          >
            {related.map((item) => (
              <SwiperSlide key={item._id}>
                <PremiumCard item={item} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </section>
  );
};

export default ProductDetails;