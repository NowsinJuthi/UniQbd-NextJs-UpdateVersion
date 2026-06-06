import React from "react";
export const metadata = {
  title: "UniQbd-Contact",
  description:
    "Step-by-step guide to buy PUBG UC in Bangladesh using bKash, Nagad.",
};


const CubeIcon = ({ emoji }) => {
  
  return (
    <div className="cube-container">
      <div className="cube">
        <div className="face front">{emoji}</div>
        <div className="face back">{emoji}</div>
        <div className="face right">{emoji}</div>
        <div className="face left">{emoji}</div>
        <div className="face top">{emoji}</div>
        <div className="face bottom">{emoji}</div>
      </div>
    </div>
  );
};

const Contact = () => {
  return (
    <div className="text-text min-h-screen">
      {/* Header */}
      <div className="py-16 rounded-b-3xl text-center px-5 bg-button/30 backdrop-blur-md border border-white/10 shadow-lg">
        <h1 className="text-4xl font-bold mb-4 text-text">UniQbd</h1>
        <h2 className="text-2xl font-semibold mb-4 text-text">CONTACT US</h2>

        <p className="max-w-3xl mx-auto text-text">
          SMS To Our Facebook Page Without Calling To Get Fast Service Or Get
          Your Product Delivered.
        </p>

        <p className="max-w-3xl mx-auto text-text mt-2">
          দ্রুত পরিষেবা পেতে অথবা আপনার পণ্য দ্রুত ডেলিভারি পেতে কল না করে
          আমাদের ফেসবুক পেজে এসএমএস করুন।
        </p>

        <p className="max-w-3xl mx-auto text-red-400 mt-3">
          WhatsApp Call Support Available NO — Only SMS Support.
        </p>
      </div>

      {/* Contact Cards */}
      <div className="px-5 py-14  grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Address */}
        <div className="card bg-button/30">
          <CubeIcon emoji="📍" />
          <h3>Address</h3>
          <p>Razabari, Turag, Dhaka-1711</p>
          <p>House 13, Road 01, Block B, Ward 54</p>
        </div>

        {/* Support */}
        <div className="card bg-button/30">
          <CubeIcon emoji="📞" />
          <h3>Support</h3>
          <p>01777139777</p>
          <p>01977712177</p>
          <p>WhatsApp SMS: 01777139777</p>
        </div>

        {/* Email */}
        <div className="card bg-button/30">
          <CubeIcon emoji="@" />
          <h3>Email</h3>
          <p>support@uniqbd.com</p>
          <p>info@uniqbd.com</p>
        </div>

        {/* Social */}
        <div className="card bg-button/30">
          <CubeIcon emoji="🌐" />
          <h3>Social</h3>
          <p>Facebook.com/UniQbdOnline</p>
          <p>discord.gg/jAy5cUa5nh</p>
        </div>
      </div>

      
      {/* Support Info */}
      <div className="py-16 text-center px-5 border-t border-white/10">
        <h2 className="text-3xl font-bold mb-4 text-text">
          GET ANSWERS TO ALL YOUR QUESTIONS
        </h2>

        <p className="text-text/80 max-w-3xl mx-auto">
          We will answer any questions you may have about our online sales.
        </p>

        <p className="text-text/80 mt-2">Everyday 10:00 AM – 12:00 PM</p>

        <p className="text-text/80">7/365 Support Through Online Chat.</p>

        <button className="mt-6 bg-button hover:scale-105 text-text px-8 py-3 rounded-xl transition duration-300 shadow-lg">
          Visit Facebook Page
        </button>
      </div>

      {/* Google Map */}
      <div className="px-5 pb-16">
        <div className="rounded-3xl overflow-hidden border border-white/10 shadow-lg">
          <iframe
            className="w-full"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3647.972812943236!2d90.37379957967906!3d23.890582728158606!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c52f3fd8458f%3A0xa500e8bc3b7d39c4!2zUmFqYWJhcmkgQ2hvd3Jhc3RhIOCmsOCmvuCmnOCmvuCmrOCmvuCnnOCmvyDgpprgp4zgprDgpr7gprjgp43gpqTgpr4!5e0!3m2!1sen!2sbd!4v1733854438841!5m2!1sen!2sbd"
            height="450"
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Contact;
