"use client";

import { useEffect, useState } from "react";
import CardProduct from "./card.product";
import Button from "react-bootstrap/Button";
import { useSearchParams } from "next/navigation";

export interface Product {
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

const ListProducts = () => {
  const [listProduct, setListProduct] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showBtn, setShowBtn] = useState<boolean>(true);

  const searchParams = useSearchParams();
  const q = searchParams.get("q");

  const fetchListProduct = async () => {
    const res = await fetch(`http://localhost:8080/product/list`);
    const jsonRes = await res.json();
    if (jsonRes && jsonRes.data) {
      setListProduct(jsonRes.data);
    }
  };

  useEffect(() => {
    fetchListProduct();
  }, []);

  const handleMoreProducts = async () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    const res = await fetch(
      `http://localhost:8080/product/list?page=${currentPage}`
    );
    const jsonRes = await res.json();

    if (jsonRes && jsonRes.data.length) {
      setListProduct((prevList) => [...prevList, ...jsonRes.data]);
      if (jsonRes.data.length < 20) {
        setShowBtn(false);
      }
    } else {
      setShowBtn(false);
    }
  };

  const handleSearch = async () => {
    if (q) {
      const res = await fetch(
        `http://localhost:8080/product/search?keyword=${q}`
      );
      const jsonRes = await res.json();
      if (jsonRes && jsonRes.data) {
        setListProduct(jsonRes.data);
      }
    } else {
      fetchListProduct();
    }
  };

  useEffect(() => {
    handleSearch();
  }, [q]);

  return (
    <div className="container">
      <div className="list-products-container ">
        {listProduct &&
          listProduct.map((item) => (
            <CardProduct key={Math.random()} product={item} />
          ))}
      </div>
      {showBtn ? (
        <div className="more-products" onClick={() => handleMoreProducts()}>
          <Button
            variant="outline-dark"
            size="lg"
            className="btn-more-products"
          >
            Xem thêm
          </Button>
        </div>
      ) : (
        <div className="more-products">
          <Button
            variant="outline-dark"
            size="lg"
            disabled
            className="btn-more-products"
          >
            Đã hiển thị hết sản phẩm
          </Button>
        </div>
      )}
    </div>
  );
};
export default ListProducts;
