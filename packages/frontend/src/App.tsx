import React, { useState, useEffect } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './theme';
import MapComponent from './components/Map';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import type { Shop } from '../../scheme/generated/models/Shop';
import type { ShopInput } from '../../scheme/generated/models/ShopInput';
import { getShops } from './api/getShops';
import { addShops } from './api/addShops';
import { isAuthenticated, logout } from './api/auth';
import { getFavoriteShops } from './api/favoriteShops';

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
  const [showFavorites, setShowFavorites] = useState(false); // お気に入り店舗表示フラグ
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
   * お気に入り店舗を取得する関数
   */
  const fetchFavoriteShops = async () => {
    try {
      const response = await getFavoriteShops();
      setFilteredShops(response);
    } catch (error) {
      console.error('Error fetching favorite shops:', error);
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
    setShowFavorites(false);
    fetchShops();
  };

  const handleToggleFavorites = async () => {
    if (!showFavorites) {
      await fetchFavoriteShops();
    } else {
      fetchShops();
    }
    setShowFavorites(!showFavorites);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="min-vh-100 gradient-bg">
        {/* ナビゲーションバー */}
        <nav className="navbar navbar-expand-lg" style={{ 
          background: '#ffffff',
          borderBottom: '1px solid #e5e5e5',
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)'
        }}>
          <div className="container">
            <span className="navbar-brand fw-bold fs-4" style={{ color: '#ef4444' }}>
               セレクトショップマップ
            </span>
            <div className="ms-auto">
              {isLoggedIn ? (
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-danger rounded-pill px-3 hover-lift"
                    onClick={handleToggleFavorites}
                    style={{ 
                      background: '#ef4444',
                      border: 'none',
                      fontWeight: '600',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {showFavorites ? '全店舗表示' : 'お気に入り店舗'}
                  </button>
                  <button
                    className="btn btn-danger rounded-pill px-3 hover-lift"
                    onClick={handleLogout}
                    style={{ 
                      background: '#ef4444',
                      border: 'none',
                      fontWeight: '600',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    ログアウト
                  </button>
                </div>
              ) : (
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-danger rounded-pill px-3 hover-lift"
                    onClick={() => setShowLogin(true)}
                    style={{ 
                      background: '#ef4444',
                      border: 'none',
                      fontWeight: '600',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    ログイン
                  </button>
                  <button
                    className="btn btn-danger rounded-pill px-3 hover-lift"
                    onClick={() => setShowRegister(true)}
                    style={{ 
                      background: '#ef4444',
                      border: 'none',
                      fontWeight: '600',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    アカウント作成
                  </button>
                </div>
              )}
            </div>
          </div>
        </nav>

        <div className="container py-5">
          {/* 検索と新規追加ボタンのセクション */}
          <div className="row mb-4 animate-slide-up">
            <div className="col-md-8">
              <div className="search-container">
                <input
                  type="text"
                  className="search-input"
                  placeholder="ブランド名で検索..."
                  value={searchBrand}
                  onChange={(e) => setSearchBrand(e.target.value)}
                />
                <button
                  className="search-clear-btn"
                  type="button"
                  onClick={() => setSearchBrand('')}
                >
                  クリア
                </button>
              </div>
            </div>
            <div className="col-md-4 text-end">
              <button
                className="btn btn-danger btn-lg rounded-pill px-4 hover-lift"
                onClick={() => setOpen(true)}
                style={{ 
                  background: '#ef4444',
                  border: 'none',
                  fontWeight: '600',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
              >
                ➕ 新しい店舗を追加
              </button>
            </div>
          </div>

          {/* 地図表示エリア */}
          <div className="row animate-fade-in">
            <div className="col">
              <div 
                className="card shadow-sm rounded-3 overflow-hidden"
                style={{
                  background: '#ffffff',
                  border: '1px solid #e5e5e5'
                }}
              >
                <div className="card-body p-0">
                  <MapComponent shops={filteredShops} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ログインモーダル */}
        {showLogin && (
          <div className="modal show d-block animate-fade-in" tabIndex={-1} style={{ background: 'rgba(0, 0, 0, 0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div 
                className="modal-content rounded-3 shadow-lg"
                style={{
                  background: '#ffffff',
                  border: '1px solid #e5e5e5'
                }}
              >
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
          <div className="modal show d-block animate-fade-in" tabIndex={-1} style={{ background: 'rgba(0, 0, 0, 0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div 
                className="modal-content rounded-3 shadow-lg"
                style={{
                  background: '#ffffff',
                  border: '1px solid #e5e5e5'
                }}
              >
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
          <div className="modal show d-block animate-fade-in" tabIndex={-1} style={{ background: 'rgba(0, 0, 0, 0.5)' }}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div 
                className="modal-content rounded-3 shadow-lg"
                style={{
                  background: '#ffffff',
                  border: '1px solid #e5e5e5'
                }}
              >
                <div className="modal-header border-0 pb-0">
                  <h5 className="modal-title fw-bold" style={{ color: '#ef4444' }}>
                    新しい店舗を追加
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setOpen(false)}
                    style={{ fontSize: '1.2rem' }}
                  ></button>
                </div>
                <div className="modal-body pt-0">
                  {/* 店舗名入力フォーム */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold text-dark">
                      店舗名
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-lg rounded-pill"
                      value={newShop.name}
                      onChange={(e) => setNewShop({ ...newShop, name: e.target.value })}
                      placeholder="店舗名を入力してください"
                      style={{
                        border: '2px solid #e5e5e5',
                        transition: 'all 0.3s ease'
                      }}
                    />
                  </div>
                  {/* 住所入力フォーム */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold text-dark">
                      住所
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-lg rounded-pill"
                      value={newShop.address}
                      onChange={(e) => setNewShop({ ...newShop, address: e.target.value })}
                      placeholder="住所を入力してください"
                      style={{
                        border: '2px solid #e5e5e5',
                        transition: 'all 0.3s ease'
                      }}
                    />
                  </div>
                  {/* 取扱ブランド入力フォーム */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold text-dark">
                      取扱ブランド（カンマ区切り）
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-lg rounded-pill"
                      value={newShop.brands?.join(', ') || ''}
                      onChange={(e) => setNewShop({ 
                        ...newShop, 
                        brands: e.target.value.split(',').map(brand => brand.trim()).filter(brand => brand !== '')
                      })}
                      placeholder="例: Ourlegacy, Acne Studios, など"
                      style={{
                        border: '2px solid #e5e5e5',
                        transition: 'all 0.3s ease'
                      }}
                    />
                  </div>
                  {/* 店舗説明入力フォーム */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold text-dark">
                      店舗説明
                    </label>
                    <textarea
                      className="form-control rounded-3"
                      value={newShop.description || ''}
                      onChange={(e) => setNewShop({ ...newShop, description: e.target.value })}
                      rows={3}
                      placeholder="店舗の説明を入力してください"
                      style={{
                        border: '2px solid #e5e5e5',
                        transition: 'all 0.3s ease',
                        resize: 'none'
                      }}
                    />
                  </div>
                </div>
                {/* モーダルのフッター（ボタン） */}
                <div className="modal-footer border-0 pt-0">
                  <button
                    type="button"
                    className="btn btn-danger rounded-pill px-4 hover-lift"
                    onClick={handleSubmit}
                    style={{ 
                      background: '#ef4444',
                      border: 'none',
                      fontWeight: '600',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                  >
                    追加
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;
