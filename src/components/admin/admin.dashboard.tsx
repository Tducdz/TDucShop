"use client";

import { useEffect } from "react";
import { getUser, getToken } from "@/utils/auth";
import { useState } from "react";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

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

const DashBoard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [dashboard, setDashboard] = useState<DashBoardDetail>();

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
  }, [user, token]);

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
