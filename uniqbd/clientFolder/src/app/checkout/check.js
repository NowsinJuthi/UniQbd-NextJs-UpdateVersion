"use client";

import { CartContext } from "@/context/CartContext";
import React, { useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const Checkout = () => {
  const router = useRouter();

  // form states
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [paymentNumber, setPaymentNumber] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  const [loading, setLoading] = useState(false);

  const { cart, removeFromCart, updateQuantity, subtotal, clearCart } =
    useContext(CartContext);

  // validation
  const validEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validMobile = (mobile) => /^01\d{9}$/.test(mobile);

  const changeQuantity = (index, delta) => {
    const newQty = cart[index].quantity + delta;

    if (newQty >= 1) {
      updateQuantity(index, newQty);
    }
  };

  const removeItem = (index) => {
    removeFromCart(index);
  };

  const handlePlaceOrder = async () => {
    try {
      console.log("CHECKOUT EMAIL:", email);

      if (!name) return toast.error("Enter your name");

      if (!location) return toast.error("Select your location");

      if (!validMobile(mobile))
        return toast.error("Enter valid 11 digit mobile number");

      if (!validEmail(email)) return toast.error("Enter valid email");

      if (!paymentMethod) return toast.error("Select payment method");

      if (!validMobile(paymentNumber))
        return toast.error("Enter valid payment number");

      if (!transactionId) return toast.error("Enter transaction ID");

      if (cart.length === 0) return toast.error("Cart is empty");

      setLoading(true);

      const token = localStorage.getItem("accessToken");

      const { data } = await axios.post(
        "http://localhost:3001/api/v1/order/create",
        {
          products: cart,
          customerName: name,
          customerEmail: email,
          customerLocation: location,
          customerMobile: mobile,
          orderNote: note,
          paymentMethod,
          paymentNumber,
          paymentId: transactionId,
          totalAmt: subtotal,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        },
      );

      toast.success("Order placed successfully!");

      clearCart();

      router.push(`/my-account/thank-you/${data.order._id}`);
    } catch (error) {
      console.log(error);

      toast.error("Order failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 bg-cover bg-center">
      <div
        className="max-w-6xl mx-auto 
      shadow-inner shadow-button/20 rounded-2xl p-8
      grid grid-cols-1 md:grid-cols-2 gap-10 bg-imgcard backdrop-blur-3xl"
      >
        {/* LEFT SIDE - BILLING DETAILS */}

        <div>
          <h1 className="text-2xl font-bold mb-6 border-b pb-3 text-text">
            Billing Details
          </h1>

          <div className="space-y-5">
            {/* name */}

            <div>
              <label className="block font-medium mb-1 text-text/80">
                Your Name
              </label>

              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-transparent
                rounded-lg px-4 py-2 shadow-inner shadow-button/20"
              />
            </div>

            {/* location */}

            <div>
              <label className="block font-medium mb-1 text-text/80">
                State / Country
              </label>

              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full border bg-transparent
                rounded-lg px-4 py-2 shadow-inner shadow-button/20"
              >
                <option value="">Select your location</option>
                <option>Dhaka</option>
                <option>Chattogram</option>
                <option>Rajshahi</option>
                <option>Sylhet</option>
              </select>
            </div>

            {/* mobile */}

            <div>
              <label className="block font-medium mb-1 text-text/80">
                Mobile Number
              </label>

              <input
                type="tel"
                placeholder="01XXXXXXXXX"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full bg-transparent
                rounded-lg px-4 py-2 shadow-inner shadow-button/20"
              />
            </div>

            {/* email */}

            <div>
              <label className="block font-medium mb-1 text-text/80">
                Email
              </label>

              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent
                rounded-lg px-4 py-2 shadow-inner shadow-button/20"
              />
            </div>

            {/* note */}

            <div>
              <h2 className="text-lg font-semibold mt-4 mb-2 text-text/80">
                Additional Information
              </h2>

              <textarea
                placeholder="Notes about your order"
                rows="3"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full bg-transparent
                rounded-lg px-4 py-2 shadow-inner shadow-button/20"
              />
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}

        <div className="bg-button/5 p-6 rounded-xl shadow-inner shadow-button/20 backdrop-blur-3xl">
          <h1 className="text-2xl font-bold mb-6 border-b pb-3 text-text">
            Your Order
          </h1>

          {/* product list */}

          <div className="space-y-4">
            {cart.map((product, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-5 gap-2 bg-button/10 rounded-xl p-5 shadow-inner shadow-button/30"
              >
                <img
                  src={product.img}
                  alt={product.name}
                  className="w-20 h-20 rounded-lg object-cover"
                />

                <div>
                  <h2 className="font-semibold text-text">{product.name}</h2>

                  <p className="text-sm text-gray-400">{product.package}</p>

                  <button
                    onClick={() => removeItem(index)}
                    className="text-red-400 text-xs mt-1"
                  >
                    Remove
                  </button>
                </div>

                <div className="text-text font-medium">{product.price} TK</div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => changeQuantity(index, -1)}
                    className="w-8 h-8 bg-button text-white rounded-md"
                  >
                    −
                  </button>

                  {product.quantity}

                  <button
                    onClick={() => changeQuantity(index, 1)}
                    className="w-8 h-8 bg-button text-white rounded-md"
                  >
                    +
                  </button>
                </div>

                <div className="font-semibold text-text">
                  {product.price * product.quantity} TK
                </div>
              </div>
            ))}
          </div>

          {/* total */}

          <div className="mt-6 border-t pt-4 flex justify-between font-semibold">
            <span>Total</span>

            <span>{subtotal} TK</span>
          </div>

          {/* payment method */}

          <div className="mt-6 space-y-2">
            <h2 className="font-semibold">Payment Method</h2>

            <label>
              <input
                type="radio"
                name="payment"
                value="bkash"
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              bKash
            </label>

            <label>
              <input
                type="radio"
                name="payment"
                value="nagad"
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Nagad
            </label>

            <label>
              <input
                type="radio"
                name="payment"
                value="rocket"
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Rocket
            </label>
          </div>

          {/* payment info */}

          <div className="max-w-md mx-auto mt-10">
            <div className="bg-imgcard/80 rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-6">
                Payment Information
              </h2>

              <div className="mb-5">
                <label className="block text-sm mb-2">
                  Enter Your Payment Number
                </label>

                <input
                  type="text"
                  placeholder="01XXXXXXXXX"
                  value={paymentNumber}
                  onChange={(e) => setPaymentNumber(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl shadow-inner shadow-button/20"
                />
              </div>

              <div>
                <label className="block text-sm mb-2">
                  Enter Your Transaction Number
                </label>

                <input
                  type="text"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  placeholder="TRX123ABC456"
                  className="w-full px-4 py-3 rounded-xl shadow-inner shadow-button/20"
                />
              </div>
            </div>
          </div>

          {/* button */}

          <button
            onClick={handlePlaceOrder}
            disabled={loading}
            className="w-full mt-6 bg-button text-white py-3 rounded-lg"
          >
            {loading ? "Placing Order..." : "Place Order"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
