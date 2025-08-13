import AppBanner from "@/components/app.banner";
import ListProducts from "@/components/app.list-products";

export default function Home() {
  return (
    <>
      <div className="homepage-container">
        <AppBanner />
        <ListProducts />
      </div>
    </>
  );
}
