"use client";
import React, { useEffect, useState } from "react";
import CardProduct from "./card.product";
import { getToken, getUser } from "@/utils/auth";
import "@/styles/user.cart.scss";
import { toast } from "react-toastify";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

interface CartItem {
  cart_id: number;
  user_id: number;
  product_id: number;
  quantity: number;
  name: string;
  price: string;
  image_url: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

const UserCart = () => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);

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

  const fetchListCard = async (user: User | null, token: string | null) => {
    if (!user?.id || !token) {
      setCart([]);
      return;
    }

    const res = await fetch(`http://localhost:8080/cart/${user.id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      const formatRes = await res.json();
      setCart(formatRes.data);
    } else {
      toast.error("Lỗi khi lấy dữ liệu");
    }
  };

  const handleChangeQuantity = async (productId: number, quantity: number) => {
    const res = await fetch(`http://localhost:8080/cart`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        user_id: user?.id,
        product_id: productId,
        quantity,
      }),
    });
    if (res.ok) {
      await fetchListCard(user, token);
    }
  };

  useEffect(() => {
    fetchListCard(user, token);
  }, [user, token]);

  return (
    <div className="container user-cart-container">
      <div className="title">Giỏ hàng của bạn</div>
      <div className="cart-content">
        <div className="products">
          {cart.length > 0 ? (
            cart.map((item) => {
              return (
                <CardProduct
                  key={item.cart_id}
                  product={item}
                  handleChangeQuantity={handleChangeQuantity}
                />
              );
            })
          ) : (
            <div className="empty-cart">Giỏ hàng trống</div>
          )}
        </div>
        <div className="user-infor">
          <Form>
            <Form.Group className="mb-3" controlId="formBasicName">
              <Form.Label>Tên người nhận</Form.Label>
              <Form.Control type="text" placeholder="..." />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPhone">
              <Form.Label>Số điện thoại</Form.Label>
              <Form.Control type="text" placeholder="..." />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicAddress">
              <Form.Label>Địa chỉ giao hàng</Form.Label>
              <Form.Control type="text" placeholder="..." />
            </Form.Group>

            <Button
              variant="outline-danger"
              type="submit"
              className="btn-submit"
            >
              Đặt hàng
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default UserCart;
