import PageMeta from "../../components/common/PageMeta";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Select from "../../components/form/Select";
import { useState, useRef } from "react";
import ComponentCard from "../../components/common/ComponentCard";
// import MultiSelect from "../../components/form/MultiSelect";
import TextArea from "../../components/form/input/TextArea";
import FileInput from "../../components/form/input/FileInputRef";

export default function FormElements() {
  const [productName, setProductName] = useState("");
  const [productId, setProductId] = useState("");
  const [productBrand, setProductBrand] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productInventory, setProductInventory] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productImage, setProductImage] = useState<File | null>(null);
  const [productSubCategory, setProductSubCategory] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const toggleSwitchRef = useRef<HTMLInputElement | null>(null);
  // const [productIsActive, setProductIsActive] = useState(false);
  const [productIsNew, setProductIsNew] = useState(true);
  const [productIsSale, setProductIsSale] = useState(false);

 async function handleSubmit(e: React.FormEvent<HTMLFormElement> ) {
  e.preventDefault();
  const formData = new FormData();
  formData.append("productName", productName);
  formData.append("productId", productId);
  formData.append("productBrand", productBrand);
  formData.append("productPrice", productPrice);
  formData.append("productInventory", productInventory);
  formData.append("productCategory", productCategory);    // 改成複數
  formData.append("productDescription", productDescription);
  formData.append("productSubCategory", productSubCategory); // 改成複數
  formData.append(
    "productIsActive",
    toggleSwitchRef.current?.checked ? "true" : "false"
  );
  formData.append("productIsNew", productIsNew ? "true" : "false");
  formData.append("productIsSale", productIsSale ? "true" : "false");

  if (productImage) {
    formData.append("image", productImage);  // multer 預設接收 key 是 "image"
  }

  console.log("送出的商品資料：", formData);
for (const pair of formData.entries()) {
  console.log(pair[0] + ": " + pair[1]);
}
  try {
    const res = await fetch("http://localhost:3000/products", {
      method: "POST",
      body: formData,
    });

    const result = await res.json();
    if (res.ok) {
      alert("商品已成功儲存！");
      setProductName("");
      setProductId("");
      setProductBrand("");
      setProductPrice("");
      setProductInventory("");
      setProductCategory("");
      setProductDescription("");
      setProductImage(null);
      setProductSubCategory("");
      setProductIsNew(true);
      setProductIsSale(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } else {
      alert("儲存失敗：" + result.message);
    }
  } catch (err) {
    console.error("傳送錯誤", err);
  }
}


  const brandOptions = [
    { value: "Nike", label: "Nike" },
    { value: "adidas", label: "adidas" },
    { value: "Under Armour", label: "Under Armour" },
  ];

  const Category = [
    { value: "運動器材", label: "運動器材" },
    { value: "運動配件", label: "運動配件" },
    { value: "服飾", label: "服飾" },
    { value: "鞋款", label: "鞋款" },
  ];

  const SubCategory = [
    { value: "重訓器材", label: "重訓器材", category: "運動器材" },
    { value: "瑜珈用品", label: "瑜珈用品", category: "運動器材" },
    { value: "水壺", label: "水壺", category: "運動配件" },
    { value: "毛巾", label: "毛巾", category: "運動配件" },
    { value: "上衣", label: "上衣", category: "服飾" },
    { value: "褲子", label: "褲子", category: "服飾" },
    { value: "外套", label: "外套", category: "服飾" },
    { value: "跑鞋", label: "跑鞋", category: "鞋款" },
    { value: "訓練鞋", label: "訓練鞋", category: "鞋款" },
    { value: "休閒鞋", label: "休閒鞋", category: "鞋款" },
  ];

  return (
    <div>
      <PageMeta
        title="新增商品 | MuscleCore 管理後台"
        description="MuscleCore 新增與編輯商品資訊的頁面"
      />
      <ComponentCard title="新增商品">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <div className="space-y-6">
              <div>
                <Label htmlFor="productName">商品名稱</Label>
                <Input
                  id="productName"
                  name="productName"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="productId">商品ID</Label>
                <Input
                  id="productId"
                  name="productId"
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                />
              </div>
              <div>
                <Label>品牌</Label>
                <Select
                  options={brandOptions}
                  placeholder="品牌"
                  onChange={(value: string) => setProductBrand(value)}
                />
              </div>
              <div>
                <Label htmlFor="productPrice">價格</Label>
                <Input
                  type="number"
                  id="productPrice"
                  name="productPrice"
                  value={productPrice}
                  onChange={(e) => setProductPrice(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="productInventory">庫存</Label>
                <Input
                  type="number"
                  id="productInventory"
                  name="productInventory"
                  value={productInventory}
                  onChange={(e) => setProductInventory(e.target.value)}
                />
              </div>
              <div>
                <Label>商品分類</Label>
                <Select
                  options={Category}
                  placeholder="商品分類"
                  onChange={(value: string) => {
                    console.log("選擇分類：", value);
                    setProductCategory(value);
                  }}
                  value={productCategory}
                />
              </div>
              <div>
                <Label>商品子分類</Label>
                <Select
                  options={SubCategory.filter(
                    (sub) => sub.category === productCategory
                  )}
                  placeholder={
                    productCategory ? "請選擇商品子分類" : "請先選擇商品分類"
                  }
                  onChange={(value) => {
                    console.log("選擇子分類：", value);
                    setProductSubCategory(value);
                  }}
                  value={productSubCategory}
                />
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <Label>新品</Label>
                <input
                  type="checkbox"
                  checked={productIsNew}
                  onChange={(e) => setProductIsNew(e.target.checked)}
                  className="w-10 h-6 rounded-full bg-gray-200 checked:bg-blue-600 relative appearance-none cursor-pointer"
                />
                <Label>特價</Label>
                <input
                  type="checkbox"
                  checked={productIsSale}
                  onChange={(e) => setProductIsSale(e.target.checked)}
                  className="w-10 h-6 rounded-full bg-gray-200 checked:bg-blue-600 relative appearance-none cursor-pointer"
                />

              
              </div>

              <div>
                <Label>商品描述</Label>
                <TextArea
                  value={productDescription}
                  onChange={(val: string) => setProductDescription(val)}
                  rows={6}
                />
              </div>
              <div>
                <Label>照片上傳</Label>
                <FileInput
                  ref={fileInputRef}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setProductImage(file);
                  }}
                />
              </div>
              <div>
                <button
                  type="submit" // 提交按鈕
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  儲存商品
                </button>
              </div>
            </div>
            {/* <div className="space-y-6">
            AAA
          </div> */}
          </div>
        </form>
      </ComponentCard>

      {/* <NewProductSelectInput />
          
        </div>
        <div className="space-y-6">
          <NewProductText />
          <NewProductDropZone />
          <NewProductSubmit/>
        </div> */}
    </div>
  );
}
