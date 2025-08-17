"use client";
import { useEffect, useState } from "react";
import React from "react";
import Image from "next/image";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import CommentCard from "@/components/card.comment";
import { getToken, getUser } from "@/utils/auth";
import { toast } from "react-toastify";
import { redirect } from "next/navigation";
import "@/styles/product.detail.scss";

interface Product {
  id: number;
  category_id: number;
  name: string;
  price: number;
  price_old: number;
  screen_size: string;
  screen_tech: string;
  chipset: string;
  nfc: boolean;
  RAM: string;
  ROM: string;
  battery: string;
  sim_slots: string;
  os: string;
  water_resistant: boolean;
  stock: number;
  image_url: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export type Comment = {
  id: number;
  comment: string;
  create_at: Date;
  censor: boolean;
  user_name: string;
};

const ProductDetail = ({ params }: { params: Promise<{ id: string }> }) => {
  const resolvedParams = React.use(params);
  const { id } = resolvedParams;

  const [product, setProduct] = useState<Product>({
    id: 0,
    category_id: 0,
    name: "",
    price: 0,
    price_old: 0,
    screen_size: "",
    screen_tech: "",
    chipset: "",
    nfc: false,
    RAM: "",
    ROM: "",
    battery: "",
    sim_slots: "",
    os: "",
    water_resistant: false,
    stock: 0,
    image_url: "",
  });
  const [comments, setComments] = useState<Comment[]>();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const [writeComment, setWriteComment] = useState("");

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

  const fetchProductDetail = async () => {
    const res = await fetch(`http://localhost:8080/product/${id}`);
    const data = await res.json();

    if (data && data.product) {
      setProduct(data.product);
    }

    if (data && data.comments) {
      setComments(data.comments);
    }
  };

  useEffect(() => {
    fetchProductDetail();
  }, []);

  const formatPrice = (price: number | string) => {
    const priceInt = Number(price);
    return priceInt.toLocaleString("vi-VN") + "₫";
  };

  const handleAddProductToCart = async () => {
    if (user && token) {
      const res = await fetch(`http://localhost:8080/cart`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: user?.id,
          product_id: id,
          quantity: 1,
        }),
      });
      if (res.ok) {
        toast.success("Đã thêm vào giỏ hàng");
      }
    } else {
      toast.error("Bạn hãy đăng nhập!");
    }
  };

  const handleBuyNow = async () => {
    await handleAddProductToCart();
    if (user && token) {
      redirect("/cart");
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !token) {
      toast.error("Bạn chưa đăng nhập");
      return;
    }

    const res = await fetch(`http://localhost:8080/review`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        user_id: user.id,
        product_id: id,
        comment: writeComment,
      }),
    });

    const jsonRes = await res.json();

    if (res.ok) {
      toast.success(jsonRes.message);
      setWriteComment("");
    } else {
      toast.error(jsonRes.message);
    }
  };

  return (
    <>
      <div className="product-detail-container container">
        <div className="left-side">
          <div className="product-img">
            {product?.image_url && (
              <Image
                src={`/img/${product.image_url}`}
                alt="Ảnh sản phẩm"
                width={160}
                height={160}
                priority
              />
            )}
            <h3>{product.name}</h3>
            <div className="price">
              Giá ưu đãi: {formatPrice(product.price)}
              <p className="old-price">{formatPrice(product.price_old)}</p>
            </div>
            <div className="action">
              <Button
                size="lg"
                variant="secondary"
                onClick={handleAddProductToCart}
              >
                Thêm vào giỏ hàng
              </Button>
              <Button size="lg" variant="danger" onClick={handleBuyNow}>
                Mua ngay
              </Button>
            </div>
          </div>
        </div>
        <div className="right-side">
          <div className="functions">
            <div className="product-information">
              <h2>Thông số kỹ thuật</h2>
              <div className="information-form">
                <ul>
                  <li>Kích thước màn hình: {product.screen_size} inches</li>
                  <li>Công nghệ màn hình: {product.screen_tech}</li>
                  <li>Chipset: {product.chipset}</li>
                  <li>Công nghệ NFC: {product.nfc ? "Có" : "Không"}</li>
                  <li>Dung lượng RAM: {product.RAM}</li>
                  <li>Bộ nhớ trong: {product.ROM}</li>
                  <li>Pin: {product.battery}</li>
                  <li>Số thẻ SIM: {product.sim_slots}</li>
                  <li>Hệ điều hành: {product.os}</li>
                  <li>Chỉ số kháng nước: {product.water_resistant}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="comment-container container">
        <Form onSubmit={handleComment}>
          <Form.Label htmlFor="comment">Đánh giá:</Form.Label>
          <Form.Control
            id="comment"
            type="text"
            aria-describedby="comment"
            value={writeComment}
            onChange={(event) => setWriteComment(event.target.value)}
            required
          />
          <Form.Text id="passwordHelpBlock" muted>
            Khách hàng đã mua hàng mới có thể gửi đánh giá
          </Form.Text>
          <Button className="btn-submit" type="submit">
            Gửi đánh giá
          </Button>
        </Form>
        {comments && comments.length > 0 && (
          <div className="list-comments">
            {comments.map((item, index) => (
              <div key={`comment-${item.id}`}>
                <CommentCard comment={item} />
                {index < comments.length - 1 && <hr />}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};
export default ProductDetail;
