import React from "react";

interface NavButtonProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const NavButton: React.FC<NavButtonProps> = ({ icon, label, active, onClick }) => {
  return (
    <button
      className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors duration-200
        ${active ? "bg-blue-100 text-blue-600" : "text-gray-700 hover:bg-gray-100"}
      `}
      onClick={onClick}
    >
      <span className="flex-shrink-0">{icon}</span>
      <span className="flex-1">{label}</span>
    </button>
  );
};

export default NavButton;
