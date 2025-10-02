import React from "react";

interface DeleteProductModal {
  productId: string;
  onConfirm: (productId: string) => void;
  onCancel: () => void;
}

const DeleteProductModal: React.FC<DeleteProductModal> = ({
  productId,
  onConfirm,
  onCancel,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white p-6 rounded-xl shadow-md max-w-sm w-full">
        <h2 className="text-lg font-semibold mb-4">確認刪除</h2>
        <p className="text-gray-700 mb-6">
          確定要刪除這項商品嗎？刪除後將無法恢復。
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm text-gray-600 bg-gray-200 rounded hover:bg-gray-300"
          >
            取消
          </button>
          <button
            onClick={() => onConfirm(productId)}
            className="px-4 py-2 text-sm text-white bg-red-500 rounded hover:bg-red-600"
          >
            確定刪除
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteProductModal;
