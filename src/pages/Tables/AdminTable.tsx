import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import AdminTable from "../../components/tables/BasicTables/AdminTable";

export default function BasicTables() {
  return (
    <>
      <PageMeta
        title="會員總覽 | MuscleCore 管理後台"
        description="MuscleCore 會員總覽的頁面"
      />
      <PageBreadcrumb pageTitle="管理者資訊" />
      <div className="space-y-6">
        <ComponentCard title="管理者資訊">
          <AdminTable />
        </ComponentCard>
      </div>
    </>
  );
}
