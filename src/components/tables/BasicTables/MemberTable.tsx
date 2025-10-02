import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";

import Badge from "../../ui/badge/Badge";
import { useEffect, useState } from "react";
import {PencilIcon} from "../../../icons/";
import EditMember from "./EditMember" ;

interface Member {
  _id: string;
  firstName: string;
  lastName:string;
  gender?: "Male" | "Female" | "Other";
  email:string;
  birth: Date;
  phone: string;
  password: string; 
  role:string;
  isActive:boolean;
  createdAt:Date;
}

export default function BasicTableOne() {
  const [tableData,setTableData]=useState<Member[]>([]);
  const [editmember, setEditMember] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

    useEffect(() => {
    fetch("http://localhost:3000/members") // 換成你後端實際的 URL
      .then((res) => res.json())
      .then((data) => {
        setTableData(data);
      })
      .catch((error) => {
        console.error("載入資料失敗", error);
      });
  }, []);

  const editMember = (_id: string) => {
    setEditMember(_id);
    setShowEditModal(true); 
};
  
  
  
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1102px]">
          <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Name
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Birth
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Role
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  E-mail
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Phone Number
                </TableCell><TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  編輯
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {tableData.map((member) => (
                <TableRow key={member._id}>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <div className="flex items-center gap-3">
                      <div>
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {member.firstName} {member.lastName}
                        </span>
                        <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                          {member.gender}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {new Date(member.birth).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <Badge
                      size="sm"
                      color={
                        member.role === "customer"
                          ? "success"
                          : member.role === "admin"
                          ? "warning"
                          : "error"
                      }
                    >
                      {member.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {member.email}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {member.phone}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    <button onClick={()=>{
                      editMember(member._id)}}>
                      <PencilIcon className="w-4 h-4 text-gray-500" />
                    </button>
                  </TableCell>                  
                </TableRow>
              ))}

            </TableBody>         
          </Table>
          {showEditModal && editmember && (
                <EditMember
                _id={editmember}
                onClose={() => setShowEditModal(false)}
                />
                )}
        </div>
      </div>
    </div>
  );
}
