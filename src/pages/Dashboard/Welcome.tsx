import AdminWelcome from '../../components/welcome';

const WelcomePage: React.FC = () => {
  return (
    <div>
      <AdminWelcome adminName="" /> {/* 可以新增管理者名稱 */}
    </div>
  );
};

export default WelcomePage;
