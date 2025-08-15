import { Product } from "./app.list-products";
import Image from "next/image";
import Link from "next/link";
import "../styles/card.product.scss";

interface CardProductProps {
  product: Product;
}

const CardProduct = ({ product }: CardProductProps) => {
  const formatPrice = (price: number | string) => {
    const priceInt = Number(price);
    return priceInt.toLocaleString("vi-VN") + "₫";
  };

  return (
    <>
      <Link href={`/product/${product.id}`} className="product-container">
        <div className="product-img">
          <Image
            src={`/img/${product.image_url}`}
            alt="Ảnh sản phẩm"
            width={160}
            height={160}
            priority
          />
        </div>
        <div className="product-detail">
          <p className="product-name">{product.name}</p>
          <div className="price">
            <div className="new-price">{formatPrice(product.price)}</div>
            <div className="old-price">{formatPrice(product.price_old)}</div>
          </div>
        </div>
      </Link>
    </>
  );
};
export default CardProduct;
