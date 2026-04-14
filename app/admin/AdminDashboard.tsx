"use client";

import { useState } from "react";

export default function AdminDashboard({ initialProducts }: { initialProducts: any[] }) {
  const [products, setProducts] = useState(initialProducts);
  const [loading, setLoading] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [composition, setComposition] = useState('');
  const [technique, setTechnique] = useState('');
  const [scale, setScale] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('composition', composition);
    formData.append('technique', technique);
    formData.append('scale', scale);
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        const newProduct = await res.json();
        setProducts([...products, newProduct]);
        // Reset form
        setTitle('');
        setComposition('');
        setTechnique('');
        setScale('');
        setImageFile(null);
        (document.getElementById('image') as HTMLInputElement).value = '';
      } else {
        alert("Failed to upload product.");
      }
    } catch (e) {
      console.error(e);
      alert("Error uploading product.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts(products.filter(p => p.id !== id));
      } else {
        alert("Failed to delete.");
      }
    } catch (e) {
      console.error(e);
      alert("Error deleting product.");
    }
  };

  return (
    <div className="admin-content grid-layout">
      {/* Upload Form */}
      <section className="admin-card">
        <h2 className="card-title">Add New Product</h2>
        <form onSubmit={handleAddProduct} className="upload-form">
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input type="text" id="title" className="form-input" value={title} onChange={e => setTitle(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="composition">Composition (Thread)</label>
            <input type="text" id="composition" className="form-input" value={composition} onChange={e => setComposition(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="technique">Technique (Stitch)</label>
            <input type="text" id="technique" className="form-input" value={technique} onChange={e => setTechnique(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="scale">Scale (Dimensions)</label>
            <input type="text" id="scale" className="form-input" value={scale} onChange={e => setScale(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="image">Product Image</label>
            <input type="file" id="image" accept="image/*" className="form-input-file" onChange={e => setImageFile(e.target.files?.[0] || null)} required />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Uploading...' : 'Publish to Catalogue'}
          </button>
        </form>
      </section>

      {/* Inventory List */}
      <section className="admin-card">
        <h2 className="card-title">Inventory</h2>
        <div className="inventory-list">
          {products.map(product => (
            <div key={product.id} className="inventory-item">
              <img src={product.image} alt={product.title} className="inventory-image" />
              <div className="inventory-info">
                <h3>{product.title}</h3>
                <p>{product.composition} &bull; {product.scale}</p>
              </div>
              <div className="inventory-actions">
                <button onClick={() => handleDelete(product.id)} className="btn btn-secondary btn-small">Delete</button>
              </div>
            </div>
          ))}
          {products.length === 0 && <p>Catalogue is empty.</p>}
        </div>
      </section>
    </div>
  );
}
