import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import ProductTable from "../../components/tables/BasicTables/ProductTable";

export default function BasicTables() {
  return (
    <>
      <PageMeta
        title="商品總覽 | MuscleCore 管理後台"
        description="MuscleCore 商品總覽的頁面"
      />
      <PageBreadcrumb pageTitle="商品總覽" />
      <div className="space-y-6">
        <ComponentCard title="商品總覽">
          <ProductTable />
        </ComponentCard>
      </div>
    </>
  );
}
