import { getProducts } from "@/lib/db";
import Link from "next/link";
import "./catalogue.css";

export const dynamic = "force-dynamic";

export default async function Home() {
  const products = await getProducts();

  return (
    <div className="catalogue-container">
      <header className="catalogue-header text-center my-lg">
        <h1 className="catalogue-title">The Collection</h1>
        <p className="catalogue-subtitle">Handcrafted with intention. Designed for modern life.</p>
      </header>
      
      <div className="product-grid">
        {products && products.length > 0 ? (
          products.map((product) => (
            <Link href={`/product/${product.id}`} key={product.id} className="product-card">
              <div className="product-image-wrapper">
                <img 
                  src={product.image} 
                  alt={product.title} 
                  className="product-image"
                />
                <div className="product-overlay">
                  <span>View Details</span>
                </div>
              </div>
              <div className="product-info">
                <h2 className="product-name">{product.title}</h2>
                <p className="product-composition">{product.composition}</p>
              </div>
            </Link>
          ))
        ) : (
          <div className="text-center" style={{ gridColumn: '1 / -1' }}>
            <p>Our collection is currently being curated. Please check back soon.</p>
          </div>
        )}
      </div>
    </div>
  );
}
