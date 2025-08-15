"use client";
import AppBanner from "@/components/app.banner";
import ListProducts from "@/components/app.list-products";

const Home = () => {
  return (
    <>
      <div className="homepage-container">
        <AppBanner />
        <ListProducts />
      </div>
    </>
  );
};

export default Home;
