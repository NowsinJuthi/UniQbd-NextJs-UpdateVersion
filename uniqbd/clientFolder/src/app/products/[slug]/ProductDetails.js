"use client";

import TiltCard from "@/app/components/TiltCard";
import { CartContext } from "@/context/CartContext";
import { useParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import ProductTabs from "../page";
import { toast } from "react-toastify";
import axios from "axios";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";

import { Autoplay, Navigation } from "swiper/modules";
import PremiumCard from "../Premium";
import { useRouter } from "next/navigation";

const ProductDetails = () => {
  const params = useParams();

  const slug = params.slug;
  const router = useRouter();
  const [related, setRelated] = useState([]);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [gameID, setGameID] = useState("");

  const { addToCart } = useContext(CartContext);
  const slides = related.length < 5 ? [...related, ...related] : related;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(
          `https://uniqbd-nextjs-updateversion-backend.onrender.com/api/v1/product/${slug}`,
        );

        console.log("PRODUCT DATA:", data.product);
        console.log("PRODUCT ID:", data.product?._id);

        const productWithPackages = {
          ...data.product,
          packages: data.product.packageType || [],
        };

        console.log("PACKAGES FINAL:", productWithPackages.packages);

        setProduct(productWithPackages);

        if (productWithPackages.packages.length > 0) {
          setSelectedPackage(productWithPackages.packages[0]);
        }

        const relatedRes = await axios.get(
          `https://uniqbd-nextjs-updateversion-backend.onrender.com/api/v1/related/${data.product._id}`,
        );

        setRelated(relatedRes.data.products || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

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
    product.price ||
    0;

  const subtotal = price * quantity;

  const handleAddToCart = () => {
    if (product?.category?.name?.toLowerCase() === "top-up" && !gameID) {
      toast.error("Enter Game ID");
      return;
    }

    addToCart({
      product,
      selectedPkg: selectedPackage,
      playerId: gameID,
      quantity,
    });
  };

  return (
    <section className="min-h-screen py-16 px-6">
      <div className="grid md:grid-cols-2">
        {/* Product Image */}
        <div className="flex justify-cente">
          <TiltCard key={product.id} product={product} />
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-text text-4xl font-bold mb-6">{product.name}</h1>

          <p className="text-text/70 mb-6">{product.shortDescription}</p>

          {/* Game Packages */}
          {product.packages && product.packages.length > 0 && (
            <>
              <h2 className="text-text text-xl font-semibold mb-4">
                Select Package
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                {product.packages.map((pack, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedPackage(pack)}
                    className={`package relative group cursor-pointer
                      transform-gpu transition-all duration-500
                      hover:-translate-y-1 hover:scale-[1.03]
                      active:scale-[0.97] py-1 
                      flex flex-col items-center justify-center
                      rounded-md text-sm font-semibold text-text
                      bg-gradient-to-br from-package/40 via-package/10 to-transparent
                      backdrop-blur-3xl border border-white/10 
                      ${
                        selectedPackage?._id === pack._id
                          ? "-translate-y-1 scale-[1.05] shadow-sm "
                          : "shadow-[0_1px]"
                      }`}
                  >
                    <div className="package grid grid-cols-2 ">
                      <img
                        src={`https://uniqbd-nextjs-updateversion-backend.onrender.com/uploads/${product.packageImage}`}
                        alt={product.name}
                        className="object-contain z-10 h-10 pr-10"
                      />
                      <span className="text-lg font-bold">{pack.name}</span>
                    </div>
                    <span className="flex items-center gap-2 mt-1">
                      {pack.discountPrice ? (
                        <>
                          <span
                            className="text-gray-400 text-sm"
                            style={{ textDecoration: "line-through" }}
                          >
                            {pack.price.toFixed()} TK
                          </span>

                          <span className="text-green-400 font-bold text-lg">
                            {pack.discountPrice.toFixed()} TK
                          </span>
                        </>
                      ) : (
                        <span className="text-green-400 font-bold text-lg">
                          {pack.price.toFixed(2)}TK
                        </span>
                      )}
                    </span>
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
          {product?.category?.name?.toLowerCase() === "top-up" && (
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
           rounded-2xl border-button shadow-inner shadow-button/10"
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

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              onClick={() => {
                if (
                  product?.category?.name?.toLowerCase() === "top-up" &&
                  !gameID
                ) {
                  toast.error("Enter Game ID");
                  return;
                }

                addToCart({
                  product,
                  selectedPkg: selectedPackage,
                  playerId: gameID,
                  quantity,
                });

                router.push("/checkout");
              }}
              className="px-8 py-3 bg-button text-white rounded-lg shadow-lg transform transition active:translate-y-1 active:shadow-sm hover:scale-105"
            >
              Buy Now
            </button>

            <button
              onClick={handleAddToCart}
              className="px-8 py-3 bg-button text-white rounded-lg shadow-lg transform transition active:translate-y-1 active:shadow-sm hover:scale-105"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      <ProductTabs product={product} />
      {related.length > 0 && (
        <div className="mt-20 px-4 md:px-10">
          {/* Heading */}
          <div className="mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-text tracking-tight">
              Related Products
            </h2>
            <p className="text-gray-400 mt-2 text-sm">
              You might also like these
            </p>
          </div>

          <Swiper
            modules={[Autoplay, Navigation]}
            spaceBetween={24}
            slidesPerView={4}
            loop={true}
            navigation
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            breakpoints={{
              640: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
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
