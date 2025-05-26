import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { Box, Paper, Typography, Rating, IconButton, Alert, Snackbar, TextField, Button } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import SearchIcon from '@mui/icons-material/Search';
import DirectionsIcon from '@mui/icons-material/Directions';
import type { Shop } from '../../../scheme/generated/models/Shop';
import type { Review } from '../../../scheme/generated/models/Review';
import ReviewForm from './ReviewForm';
import ReviewList from './ReviewList';
import { addFavoriteShop, removeFavoriteShop, getFavoriteShops } from '../api/favoriteShops';
import { isAuthenticated } from '../api/auth';

interface MapProps {
    shops: Shop[];
}

const mapContainerStyle = {
    width: '100%',
    height: '500px',
};

const center = {
    lat: 35.6812,
    lng: 139.7671,
};

const Map: React.FC<MapProps> = ({ shops }) => {
    const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [mapError, setMapError] = useState<string | null>(null);
    const [favoriteShops, setFavoriteShops] = useState<number[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

    // 検索クエリに基づいて店舗をフィルタリング
    const filteredShops = shops.filter(shop =>
        shop.name?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false
    );

    // お気に入り店舗の初期状態を取得
    useEffect(() => {
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
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(reviewData),
            });

            if (!response.ok) throw new Error('レビューの投稿に失敗しました');
            const newReview = await response.json();
            setReviews([newReview, ...reviews]);
        } catch (error) {
            console.error('レビューの投稿エラー:', error);
        }
    };

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
            console.error('お気に入り操作エラー:', error);
            setErrorMessage(error.message || 'お気に入り操作に失敗しました');
        }
    };

    const handleCloseError = () => {
        setErrorMessage(null);
    };

    return (
        <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
            <Box sx={{ position: 'absolute', top: 10, left: 10, zIndex: 1, width: '250px' }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="店舗名で検索"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                        startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                    sx={{
                        backgroundColor: 'white',
                        borderRadius: 1,
                        '& .MuiOutlinedInput-root': {
                            height: '40px',
                            '& fieldset': {
                                borderColor: 'rgba(0, 0, 0, 0.23)',
                            },
                            '&:hover fieldset': {
                                borderColor: 'primary.main',
                            },
                        },
                    }}
                />
            </Box>

            {mapError && (
                <Box sx={{ color: 'error.main', p: 2 }}>
                    {mapError}
                </Box>
            )}

            <Snackbar
                open={!!errorMessage}
                autoHideDuration={6000}
                onClose={handleCloseError}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
                    {errorMessage}
                </Alert>
            </Snackbar>

            {apiKey && (
                <LoadScript
                    googleMapsApiKey={apiKey}
                    onError={(error) => setMapError('Google Mapsの読み込みに失敗しました: ' + error.message)}
                >
                    <GoogleMap
                        mapContainerStyle={mapContainerStyle}
                        center={center}
                        zoom={13}
                        onLoad={() => setMapError(null)}
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

                        {selectedShop && selectedShop.latitude !== undefined && selectedShop.longitude !== undefined && (
                            <InfoWindow
                                position={{ lat: selectedShop.latitude, lng: selectedShop.longitude }}
                                onCloseClick={() => setSelectedShop(null)}
                            >
                                <Paper sx={{ p: 2, maxWidth: 300 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                        <Typography variant="h6">{selectedShop.name}</Typography>
                                        {isAuthenticated() && (
                                            <IconButton
                                                onClick={() => handleFavoriteClick(selectedShop.id!)}
                                                color={favoriteShops.includes(selectedShop.id!) ? "error" : "default"}
                                                sx={{
                                                    '&:hover': {
                                                        color: favoriteShops.includes(selectedShop.id!) ? 'error.dark' : 'primary.main'
                                                    }
                                                }}
                                            >
                                                {favoriteShops.includes(selectedShop.id!) ? (
                                                    <FavoriteIcon />
                                                ) : (
                                                    <FavoriteBorderIcon />
                                                )}
                                            </IconButton>
                                        )}
                                    </Box>
                                    <Typography variant="body2">{selectedShop.address}</Typography>
                                    <Typography variant="body2">
                                        取扱ブランド: {selectedShop.brands?.join(', ') || 'なし'}
                                    </Typography>
                                    <Typography variant="body2">{selectedShop.description}</Typography>
                                    <Box sx={{ mt: 1 }}>
                                        <Typography variant="body2" component="span">
                                            平均評価: 
                                        </Typography>
                                        <Rating
                                            value={selectedShop.average_rating || 0}
                                            readOnly
                                            precision={0.5}
                                        />
                                    </Box>
                                    <Box sx={{ mt: 2 }}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            startIcon={<DirectionsIcon />}
                                            onClick={() => {
                                                const url = `https://www.google.com/maps/dir/?api=1&destination=${selectedShop.latitude},${selectedShop.longitude}`;
                                                window.open(url, '_blank');
                                            }}
                                            fullWidth
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

export default Map; 