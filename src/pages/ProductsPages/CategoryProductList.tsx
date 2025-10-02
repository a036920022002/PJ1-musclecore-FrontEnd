import { useParams, useSearchParams } from "react-router";
import { useEffect, useState } from "react";
import Header from "../../components/header/newHeader";
import ProductList from "../../components/products/products";

const categories = [
  {
    name: "運動器材",
    subItems: ["重訓器材", "瑜珈用品"],
  },
  {
    name: "運動配件",
    subItems: ["水壺", "毛巾"],
  },
  {
    name: "服飾",
    subItems: ["上衣", "褲子", "外套"],
  },
  {
    name: "鞋款",
    subItems: ["跑鞋", "訓練鞋", "休閒鞋"],
  },
];

export default function CategoryProductList() {
  const { categoryName } = useParams(); //拿到網址中的categoryName
  const [searchParams] = useSearchParams();
  const subFromUrl = searchParams.get("sub"); // 取得 ?sub=跑鞋 中的跑鞋

  // 當 subFromUrl 變化時，更新 selectedSub
  useEffect(() => {
    if (subFromUrl) {
      setSelectedSub(decodeURIComponent(subFromUrl));
    }
  }, [subFromUrl]);

  const decodedName = decodeURIComponent(categoryName as string);
  const matchedCategory = categories.find(
    (category) => category.name === decodedName
  );
  const [selectedSub, setSelectedSub] = useState<string | null>(null); // 👈 儲存當前小分類

  if (!matchedCategory) {
    return <p>找不到該分類</p>;
  }

  return (
    <>
      <Header />

      <div className="p-5 bg-gray-100 min-h-auto flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-4">{decodedName}</h2>

        <ul className="flex flex-wrap gap-3 mb-6">
          <li>
            <button
              onClick={() => setSelectedSub(null)} // 如果沒有選擇子分類
              className={`px-7 py-3 rounded-full border text-lg font-medium ${
                selectedSub === null
                  ? "bg-gray-500 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              全部
            </button>
          </li>
          {matchedCategory.subItems.map((subItem) => (
            <li key={subItem}>
              <button
                onClick={() => setSelectedSub(subItem)}
                className={`px-7 py-3 rounded-full border text-lg font-medium ${
                  selectedSub === subItem
                    ? "bg-gray-700 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {subItem}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* 顯示商品列表 */}
      <ProductList
        category={decodedName}
        subcategory={selectedSub ?? undefined}
      />
    </>
  );
}
