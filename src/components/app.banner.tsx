"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

const images = ["/img/ad1.jpg", "/img/ad2.jpg", "/img/ad3.jpg", "/img/ad4.jpg"];

const AppBanner = () => {
  const [currentImg, setCurrentImg] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImg((currentImg) => (currentImg + 1) % images.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="banner-container container">
      <Image
        src={images[currentImg]}
        alt="Ảnh quảng cáo"
        width={"720"}
        height={"120"}
        priority
      />
    </div>
  );
};

export default AppBanner;
