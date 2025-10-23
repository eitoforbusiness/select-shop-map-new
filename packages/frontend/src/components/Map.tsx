import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { 
    Box, 
    Paper, 
    Typography, 
    Rating, 
    IconButton, 
    Alert, 
    Snackbar, 
    Button,
    List,
    ListItem,
    ListItemText,
    ListItemButton,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import SearchIcon from '@mui/icons-material/Search';
import DirectionsIcon from '@mui/icons-material/Directions';
import HistoryIcon from '@mui/icons-material/History';
import type { Shop } from '../../../scheme/generated/models/Shop';
import type { Review } from '../../../scheme/generated/models/Review';
import ReviewForm from './ReviewForm';
import ReviewList from './ReviewList';
import { addFavoriteShop, removeFavoriteShop, getFavoriteShops } from '../api/favoriteShops';
import { isAuthenticated } from '../api/auth';

interface MapProps {
    shops: Shop[];
}

// 定数
const MAP_CONFIG = {
    containerStyle: { width: '100%', height: '800px' },
    center: { lat: 35.6812, lng: 139.7671 },
    zoom: 13,
};

const SEARCH_STYLES = {
    container: {
        position: 'absolute' as const,
        top: 20,
        left: 20,
        zIndex: 1,
        width: '500px',
        animation: 'slideDown 0.5s ease-out'
    },
    searchContainer: {
        display: 'flex',
        gap: '0.25rem',
        alignItems: 'center',
        width: '100%',
    },
    input: {
        flex: 1,
        padding: '0.75rem 1rem',
        fontSize: '1rem',
        border: '2px solid #e5e5e5',
        borderRadius: '50px',
        background: '#ffffff',
        boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
        transition: 'all 0.3s ease',
        outline: 'none',
    },
    clearButton: {
        padding: '0.75rem 1rem',
        background: '#ef4444',
        color: 'white',
        border: 'none',
        borderRadius: '50px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        whiteSpace: 'nowrap' as const,
        fontSize: '1rem',
    }
};

const MapComponent: React.FC<MapProps> = ({ shops }) => {
    // 状態管理
    const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [favoriteShops, setFavoriteShops] = useState<number[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchHistory, setSearchHistory] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [suggestions, setSuggestions] = useState<Shop[]>([]);
    
    const searchRef = useRef<HTMLDivElement>(null);
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

    // 検索機能
    const filteredShops = shops.filter(shop =>
        shop.name?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false
    );

    const generateSuggestions = (query: string) => {
        if (query.length < 1) return [];
        
        const exactMatches = shops.filter(shop => 
            shop.name?.toLowerCase().startsWith(query.toLowerCase())
        );
        
        const partialMatches = shops.filter(shop => 
            shop.name?.toLowerCase().includes(query.toLowerCase()) && 
            !shop.name?.toLowerCase().startsWith(query.toLowerCase())
        );
        
        return [...exactMatches, ...partialMatches].slice(0, 5);
    };

    const saveToHistory = (query: string) => {
        if (query.trim() && !searchHistory.includes(query.trim())) {
            const newHistory = [query.trim(), ...searchHistory.slice(0, 4)];
            setSearchHistory(newHistory);
            localStorage.setItem('searchHistory', JSON.stringify(newHistory));
        }
    };

    const handleSuggestionClick = (shop: Shop) => {
        setSearchQuery(shop.name || '');
        setSelectedShop(shop);
        setShowSuggestions(false);
        saveToHistory(shop.name || '');
    };

    const handleHistoryClick = (query: string) => {
        setSearchQuery(query);
        setShowSuggestions(false);
    };

    const handleSearch = () => {
        if (searchQuery.trim()) {
            saveToHistory(searchQuery);
            setShowSuggestions(false);
        }
    };

    const handleClearSearch = () => {
        setSearchQuery('');
        setShowSuggestions(false);
        setSuggestions([]);
    };

    // お気に入り機能
    const handleFavoriteClick = async (shopId: number) => {
        if (!isAuthenticated()) {
            setErrorMessage('お気に入り機能を使用するにはログインが必要です');
            return;
        }

        try {
            if (favoriteShops.includes(shopId)) {
                await removeFavoriteShop(shopId);
                setFavoriteShops(favoriteShops.filter(id => id !== shopId));
            } else {
                await addFavoriteShop(shopId);
                setFavoriteShops([...favoriteShops, shopId]);
            }
        } catch (error: any) {
            setErrorMessage(error.message || 'お気に入り操作に失敗しました');
        }
    };

    // レビュー機能
    const fetchReviews = async (shopId: number) => {
        try {
            const response = await fetch(`http://localhost/api/shops/${shopId}/reviews`);
            if (!response.ok) throw new Error('レビューの取得に失敗しました');
            const data = await response.json();
            setReviews(data);
        } catch (error) {
            console.error('レビューの取得エラー:', error);
        }
    };

    const handleReviewSubmit = async (reviewData: Omit<Review, 'id' | 'shop_id' | 'created_at' | 'updated_at'>) => {
        if (!selectedShop) return;

        try {
            const response = await fetch(`http://localhost/api/shops/${selectedShop.id}/reviews`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(reviewData),
            });

            if (!response.ok) throw new Error('レビューの投稿に失敗しました');
            const newReview = await response.json();
            setReviews([newReview, ...reviews]);
        } catch (error) {
            console.error('レビューの投稿エラー:', error);
        }
    };

    // 初期化とイベントハンドラー
    useEffect(() => {
        // 検索履歴の読み込み
        const savedHistory = localStorage.getItem('searchHistory');
        if (savedHistory) {
            setSearchHistory(JSON.parse(savedHistory));
        }

        // お気に入り店舗の取得
        const fetchFavoriteShops = async () => {
            if (isAuthenticated()) {
                try {
                    const favoriteShopsData = await getFavoriteShops();
                    setFavoriteShops(favoriteShopsData.map(shop => shop.id!));
                } catch (error) {
                    console.error('お気に入り店舗の取得エラー:', error);
                }
            }
        };
        fetchFavoriteShops();
    }, []);

    useEffect(() => {
        if (selectedShop) {
            fetchReviews(selectedShop.id!);
        }
    }, [selectedShop]);

    useEffect(() => {
        if (searchQuery.length > 0) {
            const newSuggestions = generateSuggestions(searchQuery);
            setSuggestions(newSuggestions);
            setShowSuggestions(true);
        } else {
            setShowSuggestions(false);
            setSuggestions([]);
        }
    }, [searchQuery, shops]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
            {/* 検索バー */}
            <Box sx={SEARCH_STYLES.container} ref={searchRef}>
                <Box sx={{ position: 'relative' }}>
                    <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center', width: '100%' }}>
                        <div style={{ position: 'relative', flex: 1 }}>
                            <SearchIcon sx={{ 
                                position: 'absolute', 
                                left: '1rem', 
                                top: '50%', 
                                transform: 'translateY(-50%)', 
                                color: '#ef4444',
                                zIndex: 1
                            }} />
                            <input
                                type="text"
                                placeholder="店舗名で検索"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                onFocus={() => searchQuery.length > 0 && setShowSuggestions(true)}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem 1rem 0.75rem 3rem',
                                    fontSize: '1rem',
                                    border: 'none',
                                    borderRadius: '50px',
                                    background: '#ffffff',
                                    boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
                                    transition: 'all 0.3s ease',
                                    outline: 'none',
                                }}
                            />
                        </div>
                        {searchQuery && (
                            <button
                                type="button"
                                onClick={handleClearSearch}
                                style={{
                                    padding: '0.75rem 1rem',
                                    background: '#ef4444',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '50px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                                    whiteSpace: 'nowrap',
                                    fontSize: '1rem',
                                }}
                            >
                                クリア
                            </button>
                        )}
                    </div>
                    
                    {/* 検索候補と履歴 */}
                    {showSuggestions && (
                        <Paper sx={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            right: 0,
                            zIndex: 1000,
                            mt: 1,
                            maxHeight: '300px',
                            overflow: 'auto',
                            borderRadius: 3,
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                            border: '1px solid #e5e5e5',
                            backgroundColor: '#ffffff',
                        }}>
                            {/* 検索候補 */}
                            {suggestions.length > 0 && (
                                <Box>
                                    <Box sx={{ px: 2, py: 1, borderBottom: '1px solid #f0f0f0' }}>
                                        <Typography variant="caption" sx={{ color: '#ef4444', fontWeight: 600 }}>
                                            検索候補
                                        </Typography>
                                    </Box>
                                    <List dense>
                                        {suggestions.map((shop) => (
                                            <ListItem key={shop.id} disablePadding>
                                                <ListItemButton
                                                    onClick={() => handleSuggestionClick(shop)}
                                                    sx={{ '&:hover': { backgroundColor: '#fef2f2' } }}
                                                >
                                                    <ListItemText
                                                        primary={shop.name}
                                                        secondary={shop.address}
                                                        slotProps={{
                                                            primary: { sx: { fontWeight: 500, color: '#ef4444' } },
                                                            secondary: { sx: { fontSize: '0.75rem', color: '#666' } }
                                                        }}
                                                    />
                                                </ListItemButton>
                                            </ListItem>
                                        ))}
                                    </List>
                                </Box>
                            )}
                            
                            {/* 検索履歴 */}
                            {searchQuery.length === 0 && searchHistory.length > 0 && (
                                <Box>
                                    <Box sx={{ px: 2, py: 1, borderBottom: '1px solid #f0f0f0' }}>
                                        <Typography variant="caption" sx={{ color: '#ef4444', fontWeight: 600 }}>
                                            検索履歴
                                        </Typography>
                                    </Box>
                                    <List dense>
                                        {searchHistory.map((query) => (
                                            <ListItem key={query} disablePadding>
                                                <ListItemButton
                                                    onClick={() => handleHistoryClick(query)}
                                                    sx={{ '&:hover': { backgroundColor: '#fef2f2' } }}
                                                >
                                                    <HistoryIcon sx={{ mr: 1, color: '#ef4444', fontSize: 16 }} />
                                                    <ListItemText
                                                        primary={query}
                                                        slotProps={{ primary: { sx: { fontSize: '0.875rem' } }}}
                                                    />
                                                </ListItemButton>
                                            </ListItem>
                                        ))}
                                    </List>
                                </Box>
                            )}
                            
                            {/* 検索結果がない場合 */}
                            {searchQuery.length > 0 && suggestions.length === 0 && (
                                <Box sx={{ px: 2, py: 3, textAlign: 'center' }}>
                                    <Typography variant="body2" sx={{ color: '#666' }}>
                                        「{searchQuery}」に一致する店舗が見つかりませんでした
                                    </Typography>
                                </Box>
                            )}
                        </Paper>
                    )}
                </Box>
            </Box>

            {/* エラーメッセージ */}
            <Snackbar
                open={!!errorMessage}
                autoHideDuration={6000}
                onClose={() => setErrorMessage(null)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={() => setErrorMessage(null)} severity="error" sx={{ width: '100%' }}>
                    {errorMessage}
                </Alert>
            </Snackbar>

            {/* Google Map */}
            {apiKey && (
                <LoadScript googleMapsApiKey={apiKey}>
                    <GoogleMap
                        mapContainerStyle={MAP_CONFIG.containerStyle}
                        center={MAP_CONFIG.center}
                        zoom={MAP_CONFIG.zoom}
                    >
                        {filteredShops.map((shop) => (
                            shop.latitude !== undefined && shop.longitude !== undefined && (
                                <Marker
                                    key={shop.id}
                                    position={{ lat: shop.latitude, lng: shop.longitude }}
                                    onClick={() => setSelectedShop(shop)}
                                />
                            )
                        ))}

                        {selectedShop?.latitude !== undefined && selectedShop?.longitude !== undefined && (
                            <InfoWindow
                                position={{ lat: selectedShop.latitude, lng: selectedShop.longitude }}
                                onCloseClick={() => setSelectedShop(null)}
                            >
                                <Paper sx={{ 
                                    p: 3, 
                                    maxWidth: 350,
                                    borderRadius: 3,
                                    background: '#ffffff',
                                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                                    border: '1px solid #e5e5e5',
                                    animation: 'scaleIn 0.3s ease-out'
                                }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#ef4444' }}>
                                            {selectedShop.name}
                                        </Typography>
                                        {isAuthenticated() && (
                                            <IconButton
                                                onClick={() => handleFavoriteClick(selectedShop.id!)}
                                                color={favoriteShops.includes(selectedShop.id!) ? "error" : "default"}
                                                sx={{
                                                    '&:hover': {
                                                        transform: 'scale(1.1)',
                                                        color: favoriteShops.includes(selectedShop.id!) ? 'error.dark' : '#ef4444'
                                                    },
                                                    transition: 'all 0.2s ease',
                                                    fontSize: { xs: '1.25rem', sm: '1.5rem' },
                                                    padding: { xs: '0.5rem', sm: '0.75rem' }
                                                }}
                                            >
                                                {favoriteShops.includes(selectedShop.id!) ? (
                                                    <FavoriteIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
                                                ) : (
                                                    <FavoriteBorderIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
                                                )}
                                            </IconButton>
                                        )}
                                    </Box>
                                    
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                                            {selectedShop.address}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                                            取扱ブランド: {selectedShop.brands?.join(', ') || 'なし'}
                                        </Typography>
                                        {selectedShop.description && (
                                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                {selectedShop.description}
                                            </Typography>
                                        )}
                                    </Box>
                                    
                                    <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                            平均評価:
                                        </Typography>
                                        <Rating
                                            value={selectedShop.average_rating || 0}
                                            readOnly
                                            precision={0.5}
                                            size="small"
                                        />
                                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                            ({selectedShop.average_rating?.toFixed(1) || '0.0'})
                                        </Typography>
                                    </Box>
                                    
                                    <Box sx={{ mb: 2 }}>
                                        <Button
                                            variant="contained"
                                            size="large"
                                            startIcon={<DirectionsIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />}
                                            onClick={() => {
                                                const url = `https://www.google.com/maps/dir/?api=1&destination=${selectedShop.latitude},${selectedShop.longitude}`;
                                                window.open(url, '_blank');
                                            }}
                                            fullWidth
                                            sx={{
                                                borderRadius: 2,
                                                background: '#ef4444',
                                                '&:hover': {
                                                    transform: 'translateY(-1px)',
                                                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                                },
                                                transition: 'all 0.2s ease'
                                            }}
                                        >
                                            経路案内
                                        </Button>
                                    </Box>
                                    
                                    <ReviewForm
                                        shopId={selectedShop.id!}
                                        onSubmit={handleReviewSubmit}
                                    />
                                    <ReviewList reviews={reviews} />
                                </Paper>
                            </InfoWindow>
                        )}
                    </GoogleMap>
                </LoadScript>
            )}
        </Box>
    );
};

export default MapComponent;