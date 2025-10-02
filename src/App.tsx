import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
// import UserProfiles from "./pages/UserProfiles";
// import Videos from "./pages/UiElements/Videos";
// import Images from "./pages/UiElements/Images";
// import Alerts from "./pages/UiElements/Alerts";
// import Badges from "./pages/UiElements/Badges";
// import Avatars from "./pages/UiElements/Avatars";
// import Buttons from "./pages/UiElements/Buttons";
// import LineChart from "./pages/Charts/LineChart";
// import BarChart from "./pages/Charts/BarChart";
// import ProductList from "./components/products/products";
// import ProductDetailPage from "./pages/ProductsPages/ProductDetail";
// import Calendar from "./pages/Calendar";
// import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
// import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Welcome from "./pages/Dashboard/Welcome";
import FrontHome from "./pages/frontHome/home";
import ProductsDetail from "./pages/ProductsPages/ProductsDetail";
import CategoryProductList from "./pages/ProductsPages/CategoryProductList";
import Test from "./pages/test";
import ProductTables from "./pages/Tables/ProductTables";
import MemberTable from "./pages/Tables/MemberTable";
import OrderTable from "./pages/Tables/OrderTable";
import NewProductForm from "./pages/Forms/NewProductForm";
// import MemberCenter from "./pages/frontHome/memberCenter";
import MemberTest from "./pages/UserCenter/memberPage";
import UserProfileForm from "./pages/UserCenter/UserCenterPage";
import AdminSignin from "./pages/AuthPages/AdminSignIn";
import AdminTable from "./pages/Tables/AdminTable";
import ForgotPasswordPage from "./pages/AuthPages/ForgotPasswordPage";
import AdminNewTable from "./pages/Forms/NewAdmin";
import MemberCenter from "./components/UserProfile/MemberCenter";
// import ChangePassword from "./components/UserProfile/ChangePassword";
// import MemberOrder from "./components/UserProfile/MemberOrder";

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Front Page 前台首頁 */}
          <Route index path="/" element={<FrontHome />} />
          {/* Test Page 測試頁面 */}
          <Route path="/test" element={<Test />} />
          {/* Products Category List */}
          <Route
            path="/products/category/:categoryName"
            element={<CategoryProductList />} // 產品分類列表
          />
          <Route
            path="/products/categories/:categoryName?sub=:subItem"
            element={<CategoryProductList />} // 產品分類列表
          />
          {/* Products Detail */}
          <Route path="/products/:id" element={<ProductsDetail />} />  

          {/* Member Center 會員中心 */}
          <Route path="/membercenter" element={<MemberCenter />} />
          {/* <Route path="/changePassword" element={<ChangePassword />} />
          <Route path="/memberOrder" element={<MemberOrder />} /> */}
          <Route path="/member" element={<MemberTest />} />

          {/* UserCenter test page */}
          <Route path="/user-center" element={<UserProfileForm />} />

          {/* Dashboard Layout  後台 Layout*/}
          <Route element={<AppLayout />}>
            <Route path="/admin" element={<Welcome />} /> // 後台首頁 歡迎頁面
            <Route path="/NewProductForm" element={<NewProductForm />} />
            <Route path="/FormElements" element={<FormElements />} /> // 新增商品
            <Route path="/ProductTables" element={<ProductTables />} /> // 商品總覽
            <Route path="/MemberTable" element={<MemberTable />} /> // 會員總覽
            <Route path="/OrderTable" element={<OrderTable />} /> // 訂單總覽
            <Route path="/admin/table" element={<AdminTable />} /> //管理者身分登入
            <Route path="/admin/table/new" element={<AdminNewTable />} /> // 新增管理者
            {/* Others Page
            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/blank" element={<Blank />} />*/}

            {/* Forms 
            <Route path="/form-elements" element={<FormElements />} />*/}

            {/* Tables *
            <Route path="/basic-tables" element={<BasicTables />} />/}

            {/* Ui Elements 
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/avatars" element={<Avatars />} />
            <Route path="/badge" element={<Badges />} />
            <Route path="/buttons" element={<Buttons />} />
            <Route path="/images" element={<Images />} />
            <Route path="/videos" element={<Videos />} />*/}

            {/* Charts 
            <Route path="/line-chart" element={<LineChart />} />
            <Route path="/bar-chart" element={<BarChart />} />*/}
          </Route>

          {/* Auth Layout */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/admin/signin" element={<AdminSignin />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />


        </Routes>
      </Router>
    </>
  );
}
