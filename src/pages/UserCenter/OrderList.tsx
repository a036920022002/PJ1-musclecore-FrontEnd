import React from "react";

interface Order {
  _id: string;
  products: { name: string; quantity: number; price: number }[];
  status: string;
  createdAt: string;
}

interface Props {
  orders: Order[];
}

const OrderList: React.FC<Props> = ({ orders }) => {
  return (
    <section className="border p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">訂單列表</h2>
      {orders.length === 0 ? (
        <p>目前沒有訂單紀錄</p>
      ) : (
        <table className="w-full border-collapse border">
          <thead>
            <tr>
              <th className="border p-2">訂單編號</th>
              <th className="border p-2">狀態</th>
              <th className="border p-2">產品</th>
              <th className="border p-2">成立時間</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td className="border p-2">{order._id}</td>
                <td className="border p-2">{order.status}</td>
                <td className="border p-2">
                  {order.products.map((p, i) => (
                    <div key={i}>
                      {p.name} x {p.quantity}
                    </div>
                  ))}
                </td>
                <td className="border p-2">
                  {new Date(order.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
};

export default OrderList;
