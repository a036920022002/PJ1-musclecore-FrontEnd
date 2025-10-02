import React from "react";
// import { Link } from "react-router";

interface BannerProps {
  title?: string;
  subtitle?: string;
  imageUrl?: string;
  ctaText?: string;
  ctaLink?: string;
}

const Banner: React.FC<BannerProps> = ({
  title = "運動裝備，盡在掌握",
  subtitle = "探索最強跑鞋、健身服與裝備",
  imageUrl = "https://www.houyhnhnm.jp/wp-content/uploads/2025/02/hynm_ADISTAR_B.jpg", // 請依據專案替換圖片
  ctaText = "立即選購",
//   ctaLink = "/products",
}) => {
  const handleScroll = () => { // 處理點擊事件，滾動到產品列表區域
    const section = document.getElementById("product-list");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" }); // 平滑滾動動畫
    }
  };
  
  return (
    <div className="mt-8 relative w-full h-[60vh] bg-gray-100 overflow-hidden rounded-xl shadow-md">
      <img
        src={imageUrl}
        alt="Banner"
        className="w-full h-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center px-8 md:px-16 text-white">
        <h1 className="text-3xl md:text-5xl font-bold mb-2">{title}</h1>
        <p className="text-lg md:text-xl mb-6">{subtitle}</p>
       <button
          onClick={handleScroll}
          className="px-6 py-3 bg-orange-500 hover:bg-orange-600 rounded-full text-white text-lg font-medium transition"
        >
          {ctaText}
        </button>
      </div>
    </div>
  );
};

export default Banner;
