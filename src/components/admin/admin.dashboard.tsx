"use client";

import { useEffect, useState } from "react";

interface DashBoardDetail {
  monthlyRevenue: number;
  productsSold: string;
  uniqueCustomers: number;
  topCustomer: {
    name: string;
    phone_number: string;
    totalSpent: number;
  };
}

const DashBoard = ({ token }: { token: string }) => {
  const [dashboard, setDashboard] = useState<DashBoardDetail>();

  useEffect(() => {
    if (!token) {
      return;
    }

    const fetchAdminHome = async () => {
      const res = await fetch(`http://localhost:8080/admin`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const jsonRes = await res.json();
      setDashboard(jsonRes);
    };

    fetchAdminHome();
  }, [token]);

  const formatPrice = (price: number | string) => {
    const priceInt = Number(price);
    return priceInt.toLocaleString("vi-VN") + "₫";
  };

  return (
    <div className="dashboard-container container mt-4">
      <div>
        Doanh thu tháng này:{" "}
        {dashboard?.monthlyRevenue
          ? formatPrice(dashboard.monthlyRevenue)
          : "Chưa có dữ liệu"}
      </div>
      <div>Số sản phẩm bán ra: {dashboard?.productsSold}</div>
      <div>Số khách mua hàng: {dashboard?.uniqueCustomers}</div>
      {dashboard?.topCustomer ? (
        <div>
          Khách hàng có chi tiêu cao nhất: {dashboard.topCustomer.name} -{" "}
          {dashboard.topCustomer.phone_number} -{" "}
          {formatPrice(dashboard.topCustomer.totalSpent)}
        </div>
      ) : (
        <div>Chưa có dữ liệu khách hàng</div>
      )}
    </div>
  );
};

export default DashBoard;
