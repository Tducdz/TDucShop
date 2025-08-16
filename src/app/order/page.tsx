"use client";

import Table from "react-bootstrap/Table";
import "@/styles/user.order.scss";
import { useEffect, useState } from "react";
import { getToken, getUser } from "@/utils/auth";
import { redirect } from "next/navigation";
import { toast } from "react-toastify";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface UserProductOrder {
  name: string;
  quantity: number;
}

interface UserOrder {
  order_id: number;
  order_date: Date;
  total_price: string;
  order_status: "pending" | "processing" | "completed" | "cancelled";
  products: UserProductOrder[];
}

const orderStatusMap: Record<string, string> = {
  pending: "Chờ xử lý",
  processing: "Đang xử lý",
  completed: "Hoàn thành",
  cancelled: "Đã hủy",
};

const UserOrder = () => {
  const [listOrder, setListOrder] = useState<UserOrder[]>([
    {
      order_id: -1,
      order_date: new Date(),
      total_price: "",
      order_status: "pending",
      products: [],
    },
  ]);

  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const updateAuth = () => {
    setToken(getToken());
    setUser(getUser());
  };

  useEffect(() => {
    updateAuth();
    window.addEventListener("authChange", updateAuth);

    return () => {
      window.removeEventListener("authChange", updateAuth);
    };
  }, []);

  useEffect(() => {
    if (!user || !token) {
      setListOrder([]);
      return;
    }

    const fetchListOrder = async () => {
      const res = await fetch(`http://localhost:8080/order/${user.id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const jsonRes = await res.json();
        setListOrder(jsonRes);
      } else {
        console.error("Fetch order failed");
      }
    };

    fetchListOrder();
  }, [user, token]);

  const formatPrice = (price: number | string) => {
    const priceInt = Number(price);
    return priceInt.toLocaleString("vi-VN") + "₫";
  };

  return (
    <div className="user-order-container container">
      <div className="title">Danh sách đơn hàng của bạn</div>
      <div className="list-order mt-3">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Mã đơn</th>
              <th>Ngày đặt</th>
              <th>Sản phẩm</th>
              <th>Tổng số tiền</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {listOrder && listOrder.length > 0 ? (
              listOrder.map((item) => {
                return (
                  <tr key={item.order_id}>
                    <td>{item.order_id}</td>
                    <td>
                      {new Date(item.order_date).toLocaleString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </td>
                    <td>
                      {item.products.map((product) => {
                        return (
                          <div
                            key={product.name}
                          >{`${product.name} (SL: ${product.quantity})`}</div>
                        );
                      })}
                    </td>
                    <td>{formatPrice(item.total_price)}</td>
                    <td>{orderStatusMap[item.order_status]}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5}>Không có dữ liệu đơn hàng</td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default UserOrder;
