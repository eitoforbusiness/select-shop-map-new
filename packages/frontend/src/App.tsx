import React, { useState, useEffect } from 'react';
import Map from './components/Map';
import 'bootstrap/dist/css/bootstrap.min.css';
import type { Shop, ShopInput } from './api/generated';
import { DefaultService } from './api/generated';

function App() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [open, setOpen] = useState(false);
  const [newShop, setNewShop] = useState<ShopInput>({
    name: '',
    address: '',
    brands: [],
    description: ''
  });

  useEffect(() => {
    fetchShops();
  }, []);

  const fetchShops = async () => {
    try {
      const response = await DefaultService.getShops();
      setShops(response as Shop[]);
    } catch (error) {
      console.error('Error fetching shops:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      const shopData: ShopInput = {
        ...newShop,
        brands: newShop.brands
      };
      
      await DefaultService.createShop(shopData);
      setOpen(false);
      setNewShop({ name: '', address: '', brands: [], description: '' });
      fetchShops();
    } catch (error) {
      console.error('Error creating shop:', error);
    }
  };

  return (
    <div className="min-vh-100 bg-light">
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container">
          <span className="navbar-brand">セレクトショップマップ</span>
        </div>
      </nav>

      <div className="container py-4">
        <div className="row mb-4">
          <div className="col">
            <button
              className="btn btn-primary"
              onClick={() => setOpen(true)}
            >
              <i className="bi bi-plus-circle me-2"></i>
              新しい店舗を追加
            </button>
          </div>
        </div>

        <div className="row">
          <div className="col">
            <div className="card shadow-sm">
              <div className="card-body p-0">
                <Map shops={shops} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {open && (
        <div className="modal show d-block" tabIndex={-1}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">新しい店舗を追加</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setOpen(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">店舗名</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newShop.name}
                    onChange={(e) => setNewShop({ ...newShop, name: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">住所</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newShop.address}
                    onChange={(e) => setNewShop({ ...newShop, address: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">取扱ブランド（カンマ区切り）</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newShop.brands.join(', ')}
                    onChange={(e) => setNewShop({ 
                      ...newShop, 
                      brands: e.target.value.split(',').map(brand => brand.trim()).filter(brand => brand !== '')
                    })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">説明</label>
                  <textarea
                    className="form-control"
                    rows={4}
                    value={newShop.description}
                    onChange={(e) => setNewShop({ ...newShop, description: e.target.value })}
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setOpen(false)}
                >
                  キャンセル
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSubmit}
                >
                  追加
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
