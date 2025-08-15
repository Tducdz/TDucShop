"use client";
import React, { useEffect, useState } from "react";
import CardProduct from "./card.product";
import { getToken, getUser } from "@/utils/auth";
import { toast } from "react-toastify";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import "@/styles/user.cart.scss";

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
  const [totalMoney, setTotalMoney] = useState<number>(0);
  const [showModalOrder, setShowModalOrder] = useState<boolean>(false);

  // order infor
  const [orderName, setOrderName] = useState<string>("");
  const [orderPhone, setOrderPhone] = useState<string>("");
  const [orderAddress, setOrderAddress] = useState<string>("");

  const updateAuth = () => {
    setToken(getToken());
    setUser(getUser());
  };

  const formatPrice = (price: number | string) => {
    const priceInt = Number(price);
    return priceInt.toLocaleString("vi-VN") + "₫";
  };

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
      toast.error("Lỗi khi lấy dữ liệu, hãy thử đăng nhập lại");
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
    updateAuth();
    window.addEventListener("authChange", updateAuth);
    return () => {
      window.removeEventListener("authChange", updateAuth);
    };
  }, []);

  useEffect(() => {
    fetchListCard(user, token);
  }, [user, token]);

  useEffect(() => {
    const total = cart.reduce((sum, item) => {
      return sum + Number(item.price) * item.quantity;
    }, 0);
    setTotalMoney(total);
  }, [cart]);

  const handleClickOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !token) {
      toast.error("Bạn chưa đăng nhập");
      return;
    }

    setShowModalOrder(true);
  };

  const handleConfirmOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`http://localhost:8080/order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        user_id: user?.id,
        payment_method: "COD",
        shipping_address: `${orderName} || ${orderPhone} || ${orderAddress}`,
      }),
    });

    if (res.ok) {
      toast.success("Đặt hàng thành công!");
    } else {
      toast.error("Lỗi đặt hàng, hãy thử đăng nhập lại");
    }
  };

  const handleCloseBtn = () => {
    setShowModalOrder(false);
  };

  return (
    <div className="container user-cart-container">
      <div className="title">Giỏ hàng của bạn</div>
      <div className="cart-content">
        <div className="products mb-4">
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
          <Form onSubmit={handleClickOrder}>
            <Form.Group className="mb-3" controlId="formBasicName">
              <Form.Label>Tên người nhận</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="..."
                value={orderName}
                onChange={(event) => setOrderName(event.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPhone">
              <Form.Label>Số điện thoại</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="..."
                value={orderPhone}
                onChange={(event) => setOrderPhone(event.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicAddress">
              <Form.Label>Địa chỉ giao hàng</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="..."
                value={orderAddress}
                onChange={(event) => setOrderAddress(event.target.value)}
              />
            </Form.Group>

            <Form.Control
              className="mb-3"
              type="text"
              placeholder={`Tạm tính: ${formatPrice(totalMoney)}`}
              disabled
            />

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
      <Modal
        show={showModalOrder}
        onHide={handleCloseBtn}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title className="login-title">Xác nhận đặt hàng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleConfirmOrder}>
            <div className="title-order">Đơn hàng của bạn bao gồm: </div>
            {cart &&
              cart.length > 0 &&
              cart.map((item) => {
                return (
                  <div key={item.product_id}>
                    <b>{item.name}</b> (SL: {item.quantity})
                  </div>
                );
              })}
            <div>
              Bạn cần thanh toán:{" "}
              <b style={{ color: "red" }}>{formatPrice(totalMoney)}</b>
            </div>
            <div className="mb-2">
              <i style={{ fontSize: "12px" }}>
                Hãy kiểm tra kỹ thông tin liên hệ trước khi đặt hàng!
              </i>
            </div>
            <div className="action-form">
              <Button variant="outline-danger" type="submit">
                Đặt hàng
              </Button>
              <Button variant="secondary" onClick={handleCloseBtn}>
                Hủy
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default UserCart;
