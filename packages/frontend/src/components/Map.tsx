import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { Box, Paper, Typography, Rating } from '@mui/material';
import type { Shop } from '../api/generated/models/Shop';
import type { Review } from '../api/generated/models/Review';
import ReviewForm from './ReviewForm';
import ReviewList from './ReviewList';

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
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

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

    return (
        <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
            {mapError && (
                <Box sx={{ color: 'error.main', p: 2 }}>
                    {mapError}
                </Box>
            )}

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
                        {shops.map((shop) => (
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
                                    <Typography variant="h6">{selectedShop.name}</Typography>
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