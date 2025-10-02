import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import OrderTable from "../../components/tables/BasicTables/OrderTable";

export default function BasicTables() {
  return (
    <>
      <PageMeta
        title="訂單總覽 | MuscleCore 管理後台"
        description="MuscleCore 訂單總覽的頁面"
      />
      <PageBreadcrumb pageTitle="訂單總覽" />
      <div className="space-y-6">
        <ComponentCard title="訂單總覽">
          <OrderTable />
        </ComponentCard>
      </div>
    </>
  );
}
