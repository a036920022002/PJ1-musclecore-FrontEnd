import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import Header from "../../components/header/newHeader";
// import Products from "../../data/products";
import { useCart } from "../../context/CartContext"; // 引入購物車 Hook
import axios from "axios";
import Alert from "../../components/ui/alert/Alert"; // 假設有一個 alert 函數來顯示提示訊息


type Product = {
  productId: number;
  productIsNew: boolean;
  productIsSale: boolean;
  productName: string;
  productImage: string;
  productImageAlt: string;
  productCategory: string;
  productSubcategory: string;
  productPrice: number;
  productDescription: string;
  productInventory: number;
  productBrand: string;
  isActive: boolean;
  createdAt: string; // 後端 Date 會變成字串
};

const ProductsDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("M");
  const { addToCart, setIsCartOpen } = useCart(); // 從 Context 取得 addToCart 函數
  const [alertMessage, setAlertMessage] = useState<string>(""); // 用於顯示提示訊息
  const [isAlertVisible, setAlertVisible] = useState<boolean>(false); // 用於控制提示訊息的顯示狀態

  const showAlert = (message: string) => {
    // 假設有一個 alert 函數來顯示提示訊息
    setAlertMessage(message);
    setAlertVisible(true);
    setTimeout(() => setAlertVisible(false), 2000);
  };

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    setError(null);

    // 從後端 API 請求該商品資料，假設路徑為 /products/:id
    axios
      .get(`http://localhost:3000/products/${id}`)
      .then((res) => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("商品資料讀取失敗");
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    // 載入中處理
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div>載入中...</div>
      </div>
    );
  }

  if (!product) {
    // 商品不存在處理
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h1
            style={{
              fontSize: "2rem",
              fontWeight: "bold",
              marginBottom: "1rem",
            }}
          >
            商品不存在{error}
          </h1>
          <button onClick={() => navigate("/")}>返回首頁</button>
        </div>
      </div>
    );
  }
   if (product.productInventory ===0) {
    // 商品售完處理
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h1
            style={{
              fontSize: "2rem",
              fontWeight: "bold",
              marginBottom: "1rem",
            }}
          >
            商品已售完
          </h1>
          <button onClick={() => navigate("/")}>返回首頁</button>
        </div>
      </div>
    );
  }

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.preventDefault(); // 防止 Link 導航
    e.stopPropagation(); // 防止事件冒泡

    const cartItem = {
      productId: product.productId,
      productIsNew: product.productIsNew,
      productIsSale: product.productIsSale,
      productName: product.productName,
      productImage: product.productImage,
      productImageAlt: product.productImageAlt,
      productCategory: product.productCategory,
      productSubcategory: product.productSubcategory,
      productPrice: product.productPrice,
      productDescription: product.productDescription,
      productInventory: product.productInventory,
      productBrand: product.productBrand,
      isActive: product.isActive,
      createdAt: product.createdAt,
    };

    addToCart(cartItem, quantity); // 加入購物車
    // alert(`已加入購物車：${product.productName}`); // 可選：顯示成功訊息
    setIsCartOpen(true); // 打開購物車抽屜
    showAlert(`已加入購物車：${product.productName}，數量：${quantity}`);
  };

  // 如果沒有找到商品，顯示一個404頁面或返回上一頁
  return (
    <>
      <Header />

      <main className=" px-4 sm:px-6 lg:px-8">
        <div
          style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem 1rem" }}
        >
          <button
            className="m-3 p-3 hover:bg-gray-700 hover:text-white bg-black rounded-3xl text-white"
            // style={{
            //   marginBottom: "2rem",
            //   padding: "0.5rem 1rem",
            //   background: "black",
            //   borderRadius: "2rem",
            //   border: "none",
            //   color: "#fff",
            //   cursor: "pointer", // 鼠標指針變為手形
            //   boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",// 陰影效果
            // }}
            //沒反應
            onClick={() => navigate("/")}
          >
            ← 返回商品列表
          </button>

          <div style={{ display: "flex", gap: "3rem", flexWrap: "wrap" }}>
            {/* Product Images */}
            <div style={{ flex: "1 1 300px", minWidth: "300px" }}>
              <div
                style={{
                  aspectRatio: "1/1", // 確保圖片容器為正方形
                  overflow: "hidden", // 確保圖片不會溢出容器
                  display: "flex",
                  borderRadius: "1rem", // 圓角邊框
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)", // 陰影效果
                }}
              >
                {/* 確保圖片填滿容器並保持比例 */}
                <img
                  src={product.productImage}
                  alt={product.productName}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              </div>
            </div>

            {/* Product Info */}
            <div style={{ flex: "2 1 400px", minWidth: "350px" }}>
              <div>
                {/*商品分類/新品/特價 標籤 */}
                <span
                  style={{
                    border: "1px solid #ccc",
                    borderRadius: "0.5rem",
                    padding: "0.2rem 0.7rem",
                    marginRight: "0.5rem",
                  }}
                >
                  {product.productCategory}
                </span>
                {product.productIsNew && (
                  <span
                    style={{
                      background: "#007bff",
                      color: "#fff",
                      borderRadius: "0.5rem",
                      padding: "0.2rem 0.7rem",
                      marginRight: "0.5rem",
                    }}
                  >
                    新品
                  </span>
                )}
                {product.productIsSale && (
                  <span
                    style={{
                      background: "#ee0000ff",
                      color: "#fff",
                      borderRadius: "0.5rem",
                      padding: "0.2rem 0.7rem",
                    }}
                  >
                    特價
                  </span>
                )}
              </div>

              {/*商品名稱*/}
              <h1
                style={{
                  fontSize: "2rem",
                  fontWeight: "bold",
                  margin: "1rem 0",
                }}
              >
                {product.productName}
              </h1>

              {/*價格*/}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  marginBottom: "1.5rem",
                }}
              >
                <span
                  style={{
                    fontSize: "2rem",
                    fontWeight: "bold",
                    color: "#36416bff",
                  }}
                >
                  NT$ {product.productPrice}
                </span>
              </div>

              {/*商品描述*/}
              <p style={{ margin: "1rem 0", color: "#666" }}>
                {product.productDescription}
              </p>

              {/* 尺寸Size Selection  服飾跟鞋款才有分size */}
              {(product.productCategory === "服飾" ||
                product.productCategory === "鞋款") && (
                <div>
                  <h3 style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>
                    尺寸選擇
                  </h3>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    {["S", "M", "L", "XL"].map((size) => (
                      <button
                        key={size}
                        style={{
                          width: "3rem",
                          height: "3rem",
                          borderRadius: "0.5rem",
                          border:
                            selectedSize === size
                              ? "2px solid #007bff"
                              : "1px solid #ccc",
                          background:
                            selectedSize === size ? "#e3f2fd" : "#fff",
                          fontWeight: "bold",
                          cursor: "pointer",
                        }}
                        onClick={() => setSelectedSize(size)}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 數量Quantity Selection */}
              <div style={{ marginTop: "1rem" }}>
                <h3 style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>
                  數量
                </h3>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <button
                    style={{
                      width: "2rem",
                      height: "2rem",
                      borderRadius: "0.5rem",
                      border: "1px solid #ccc",
                      background: "#fff",
                      cursor: "pointer",
                    }}
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </button>
                  <span
                    style={{
                      width: "1.5rem",
                      textAlign: "center",
                      fontWeight: "bold",
                    }}
                  >
                    {quantity}
                  </span>

                  <button
                    style={{
                      width: "2rem",
                      height: "2rem",
                      borderRadius: "0.5rem",
                      border: "1px solid #ccc",
                      background: "#fff",
                      cursor: "pointer",
                    }}
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* 加入購物車Action Buttons */}
              <div
                style={{ marginTop: "1.5rem", display: "flex", gap: "1rem" }}
              >
                {/* */}
                <button
                  className="w-full rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                  onClick={(e) => {
                    handleAddToCart(product, e);
                  }}
                >
                  加入購物車
                </button>
              </div>

              {/* 顯示提示訊息 */}
              {isAlertVisible && (
                <div className="fixed bottom-4 right-4 z-50 w-80 animate-slide-up">
                  <Alert
                    variant="success"
                    title="成功"
                    message={alertMessage}
                  />
                </div>
              )}

              {/* 保障ICON Features */}
              <div
                style={{
                  display: "flex",
                  gap: "2rem",
                  paddingTop: "2rem",
                  borderTop: "1px solid #eee",
                  marginTop: "2rem",
                }}
              >
                <div style={{ textAlign: "center", flex: 1 }}>
                  <div style={{ fontSize: "2rem", color: "#597490ff" }}>🚚</div>
                  <div style={{ fontWeight: "bold" }}>免費配送</div>
                  <div style={{ color: "#888", fontSize: "0.9rem" }}>
                    滿千免運
                  </div>
                </div>

                <div style={{ textAlign: "center", flex: 1 }}>
                  <div style={{ fontSize: "2rem", color: "#007bff" }}>🛡️</div>
                  <div style={{ fontWeight: "bold" }}>品質保證</div>
                  <div style={{ color: "#888", fontSize: "0.9rem" }}>
                    原廠保固
                  </div>
                </div>

                <div style={{ textAlign: "center", flex: 1 }}>
                  <div style={{ fontSize: "2rem", color: "#007bff" }}>🔄</div>
                  <div style={{ fontWeight: "bold" }}>退換服務</div>
                  <div style={{ color: "#888", fontSize: "0.9rem" }}>
                    7天鑑賞期
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div style={{ marginTop: "4rem" }}>
            <div
              style={{
                background: "#fff",
                borderRadius: "1rem",
                boxShadow: "0 2px 8px #eee",
                padding: "2rem",
              }}
            >
              <h2
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  marginBottom: "2rem",
                }}
              >
                商品資訊(須再改為由資料庫帶出)
              </h2>
              {/*資訊要改成由資料庫帶出*/}
              {/* Product Description */}
              <div style={{ marginBottom: "2rem" }}>
                <h3
                  style={{
                    fontSize: "1.2rem",
                    fontWeight: "bold",
                    marginBottom: "1rem",
                  }}
                >
                  商品特色
                </h3>
                <div style={{ color: "#666" }}>
                  <p style={{ marginBottom: "1rem" }}>
                    商品{product.productName}
                  </p>
                  <ul style={{ marginBottom: "1rem", paddingLeft: "1.2rem" }}>
                    <li>採用高品質材料，耐用性強</li>
                    <li>人體工學設計，舒適度佳</li>
                    <li>透氣排汗，保持乾爽</li>
                    <li>多功能設計，適合各種運動</li>
                    <li>時尚外觀，彰顯個人風格</li>
                  </ul>
                  <p>
                    我們致力於為每位客戶提供最優質的運動用品，讓您在運動中發揮最佳潛能。
                  </p>
                </div>
              </div>

              <hr
                style={{
                  margin: "2rem 0",
                  border: "none",
                  borderTop: "1px solid #eee",
                }}
              />

              {/* Specifications */}
              <div>
                <h3
                  style={{
                    fontSize: "1.2rem",
                    fontWeight: "bold",
                    marginBottom: "1.5rem",
                  }}
                >
                  規格說明
                </h3>
                <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
                  <div style={{ flex: "1 1 250px", minWidth: "220px" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "0.7rem 0",
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      <span style={{ fontWeight: "bold" }}>品牌</span>
                      <span style={{ color: "#888" }}>{product.productBrand}</span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "0.7rem 0",
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      <span style={{ fontWeight: "bold" }}>材質</span>
                      <span style={{ color: "#888" }}>高品質聚酯纖維</span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "0.7rem 0",
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      <span style={{ fontWeight: "bold" }}>顏色</span>
                      <span style={{ color: "#888" }}>多色可選</span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "0.7rem 0",
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      <span style={{ fontWeight: "bold" }}>重量</span>
                      <span style={{ color: "#888" }}>約 300g</span>
                    </div>
                  </div>
                  <div style={{ flex: "1 1 250px", minWidth: "220px" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "0.7rem 0",
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      <span style={{ fontWeight: "bold" }}>產地</span>
                      <span style={{ color: "#888" }}>台灣製造</span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "0.7rem 0",
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      <span style={{ fontWeight: "bold" }}>保固</span>
                      <span style={{ color: "#888" }}>一年保固</span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "0.7rem 0",
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      <span style={{ fontWeight: "bold" }}>認證</span>
                      <span style={{ color: "#888" }}>SGS檢驗合格</span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "0.7rem 0",
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      <span style={{ fontWeight: "bold" }}>適用</span>
                      <span style={{ color: "#888" }}>各種運動</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default ProductsDetail;
