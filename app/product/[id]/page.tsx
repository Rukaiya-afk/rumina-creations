import { getProduct } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import "./product.css";

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.id);
  
  if (!product) {
    notFound();
  }

  const whatsappNumber = "916377965956"; // Your WhatsApp business number
  const message = encodeURIComponent(`Hello Rumina Creations, I'd like to request a quote for the "${product.title}".`);
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

  return (
    <div className="product-detail-container">
      <Link href="/" className="back-link">
        &larr; Back to Catalogue
      </Link>
      
      <div className="product-detail-grid">
        <div className="product-image-section">
          <img 
            src={product.image} 
            alt={product.title} 
            className="detail-image"
          />
        </div>
        
        <div className="product-info-section">
          <h1 className="detail-title">{product.title}</h1>
          <p className="detail-subtitle">Handcrafted to order</p>
          
          <div className="specs-list">
            <div className="spec-item">
              <span className="spec-label">Composition</span>
              <span className="spec-value">{product.composition}</span>
            </div>
            <hr className="spec-divider" />
            <div className="spec-item">
              <span className="spec-label">Technique</span>
              <span className="spec-value">{product.technique}</span>
            </div>
            <hr className="spec-divider" />
            <div className="spec-item">
              <span className="spec-label">Scale</span>
              <span className="spec-value">{product.scale}</span>
            </div>
          </div>
          
          <div className="cta-section">
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">
              Request Quote via WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
