import React, { useState, useEffect } from 'react';
import Map from './components/Map';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import 'bootstrap/dist/css/bootstrap.min.css';
import type { Shop } from '../../scheme/generated/models/Shop';
import type { ShopInput } from '../../scheme/generated/models/ShopInput';
import { getShops } from './api/getShops';
import { addShops } from './api/addShops';
import { isAuthenticated, logout } from './api/auth';

/**
 * セレクトショップマップのメインアプリケーションコンポーネント
 * 地図上にセレクトショップを表示し、ブランド検索や新規店舗追加が可能
 */
function App() {
  // 状態管理
  const [shops, setShops] = useState<Shop[]>([]); // 全店舗データを保持
  const [filteredShops, setFilteredShops] = useState<Shop[]>([]); // 検索条件に合致する店舗を保持
  const [searchBrand, setSearchBrand] = useState(''); // ブランド検索用の入力値
  const [open, setOpen] = useState(false); // 新規店舗追加モーダルの表示状態
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [newShop, setNewShop] = useState<ShopInput>({ // 新規店舗追加用のフォームデータ
    name: '',
    address: '',
    latitude: 35.6812, // デフォルトの緯度（東京）
    longitude: 139.7671, // デフォルトの経度（東京）
    brands: [],
    description: ''
  });

  // 初期表示時に店舗データを取得
  useEffect(() => {
    fetchShops();
    // 初期表示時にログイン状態を確認
    setIsLoggedIn(isAuthenticated());
  }, []);

  // ブランド検索条件が変更されたときに店舗リストをフィルタリング
  useEffect(() => {
    if (searchBrand.trim() === '') {
      setFilteredShops(shops);
    } else {
      const searchTerms = searchBrand.toLowerCase().split(/\s+/).filter(term => term !== '');
      const filtered = shops.filter(shop => 
        shop.brands?.some(brand => 
          searchTerms.every(term => 
            brand.toLowerCase().includes(term)
          )
        )
      );
      setFilteredShops(filtered);
    }
  }, [searchBrand, shops]);

  /**
   * APIから店舗データを取得する関数
   * 取得したデータは全店舗リストとフィルタリング済みリストに設定
   */
  const fetchShops = async () => {
    try {
      const response = await getShops();
      setShops(response);
      setFilteredShops(response);
    } catch (error) {
      console.error('Error fetching shops:', error);
    }
  };

  /**
   * 新規店舗を追加する関数
   * APIを呼び出して店舗を追加し、成功時に店舗リストを更新
   */
  const handleSubmit = async () => {
    try {
      const shopData: ShopInput = {
        ...newShop,
        brands: newShop.brands || []
      };
      
      await addShops(shopData);
      setOpen(false);
      setNewShop({ 
        name: '', 
        address: '', 
        latitude: 35.6812,
        longitude: 139.7671,
        brands: [], 
        description: '' 
      });
      fetchShops();
    } catch (error) {
      console.error('Error creating shop:', error);
    }
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleRegisterSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
  };

  return (
    <div className="min-vh-100 bg-light">
      {/* ナビゲーションバー */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container">
          <span className="navbar-brand">セレクトショップマップ</span>
          <div className="ms-auto">
            {isLoggedIn ? (
              <button
                className="btn btn-outline-light"
                onClick={handleLogout}
              >
                ログアウト
              </button>
            ) : (
              <div className="d-flex gap-2">
                <button
                  className="btn btn-outline-light"
                  onClick={() => setShowLogin(true)}
                >
                  ログイン
                </button>
                <button
                  className="btn btn-outline-light"
                  onClick={() => setShowRegister(true)}
                >
                  アカウント作成
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="container py-4">
        {/* 検索と新規追加ボタンのセクション */}
        <div className="row mb-4">
          <div className="col-md-6">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="ブランド名で検索..."
                value={searchBrand}
                onChange={(e) => setSearchBrand(e.target.value)}
              />
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={() => setSearchBrand('')}
              >
                クリア
              </button>
            </div>
          </div>
          <div className="col-md-6 text-end">
            <button
              className="btn btn-primary"
              onClick={() => setOpen(true)}
            >
              <i className="bi bi-plus-circle me-2"></i>
              新しい店舗を追加
            </button>
          </div>
        </div>

        {/* 地図表示エリア */}
        <div className="row">
          <div className="col">
            <div className="card shadow-sm">
              <div className="card-body p-0">
                <Map shops={filteredShops} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ログインモーダル */}
      {showLogin && (
        <div className="modal show d-block" tabIndex={-1}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <LoginForm
                onLoginSuccess={handleLoginSuccess}
                onClose={() => setShowLogin(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* アカウント作成モーダル */}
      {showRegister && (
        <div className="modal show d-block" tabIndex={-1}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <RegisterForm
                onRegisterSuccess={handleRegisterSuccess}
                onClose={() => setShowRegister(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* 新規店舗追加モーダル */}
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
                {/* 店舗名入力フォーム */}
                <div className="mb-3">
                  <label className="form-label">店舗名</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newShop.name}
                    onChange={(e) => setNewShop({ ...newShop, name: e.target.value })}
                  />
                </div>
                {/* 住所入力フォーム */}
                <div className="mb-3">
                  <label className="form-label">住所</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newShop.address}
                    onChange={(e) => setNewShop({ ...newShop, address: e.target.value })}
                  />
                </div>
                {/* 取扱ブランド入力フォーム */}
                <div className="mb-3">
                  <label className="form-label">取扱ブランド（カンマ区切り）</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newShop.brands?.join(', ') || ''}
                    onChange={(e) => setNewShop({ 
                      ...newShop, 
                      brands: e.target.value.split(',').map(brand => brand.trim()).filter(brand => brand !== '')
                    })}
                    placeholder="例: Ourlegacy, Acne Studios, など"
                  />
                </div>
                {/* 店舗説明入力フォーム */}
                <div className="mb-3">
                  <label className="form-label">店舗説明</label>
                  <textarea
                    className="form-control"
                    value={newShop.description || ''}
                    onChange={(e) => setNewShop({ ...newShop, description: e.target.value })}
                    rows={3}
                  />
                </div>
              </div>
              {/* モーダルのフッター（ボタン） */}
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
