"use client";
import Image from "next/image";
import { FaSquarePlus } from "react-icons/fa6";
import { FaSquareMinus } from "react-icons/fa6";
import { FaTrashAlt } from "react-icons/fa";
import { useState } from "react";

interface CardProductProps {
  product: CartItem;
  handleChangeQuantity: (productId: number, quantity: number) => void;
}

interface CartItem {
  cart_id: number;
  user_id: number;
  product_id: number;
  quantity: number;
  name: string;
  price: string;
  image_url: string;
}

const CardProduct = ({ product, handleChangeQuantity }: CardProductProps) => {
  const formatPrice = (price: number | string) => {
    const priceInt = Number(price);
    return priceInt.toLocaleString("vi-VN") + "₫";
  };

  return (
    <div className="card-product">
      <div className="detail">
        <div className="left">
          <Image
            src={`/img/${product.image_url}`}
            alt="Ảnh sản phẩm"
            width={80}
            height={80}
          />
        </div>
        <div className="right">
          <div className="name">{product.name}</div>
          <div className="price">{formatPrice(product.price)}</div>
          <div className="quantity">
            <FaSquareMinus
              size="24px"
              onClick={() =>
                handleChangeQuantity(product.product_id, product.quantity - 1)
              }
              className="quantity-btn"
            />
            <span>{product.quantity}</span>
            <FaSquarePlus
              size="24px"
              onClick={() =>
                handleChangeQuantity(product.product_id, product.quantity + 1)
              }
              className="quantity-btn"
            />
          </div>
        </div>
        <div className="btn-delete">
          <FaTrashAlt
            color="red"
            style={{ marginTop: "auto" }}
            onClick={() => handleChangeQuantity(product.product_id, 0)}
          />
        </div>
      </div>
    </div>
  );
};

export default CardProduct;
