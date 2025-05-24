import React, { useState } from 'react';
import { Box, TextField, Button, Rating, Typography } from '@mui/material';
import type { Review } from '../api/generated/models/Review';

interface ReviewFormProps {
    shopId: number;
    onSubmit: (review: Omit<Review, 'id' | 'shop_id' | 'created_at' | 'updated_at'>) => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ shopId, onSubmit }) => {
    const [userName, setUserName] = useState('');
    const [rating, setRating] = useState<number | null>(0);
    const [comment, setComment] = useState('');
    const [brands, setBrands] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === null) return;

        onSubmit({
            user_name: userName,
            rating,
            comment: comment || undefined,
            brands: brands.split(',').map(brand => brand.trim()).filter(brand => brand !== ''),
            description: description || undefined,
        });

        // フォームをリセット
        setUserName('');
        setRating(0);
        setComment('');
        setBrands('');
        setDescription('');
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
                レビューを投稿
            </Typography>
            <TextField
                fullWidth
                label="お名前"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
                margin="normal"
            />
            <Box sx={{ my: 2 }}>
                <Typography component="legend">評価</Typography>
                <Rating
                    value={rating}
                    onChange={(_, newValue) => setRating(newValue)}
                />
            </Box>
            <TextField
                fullWidth
                label="コメント"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                multiline
                rows={4}
                margin="normal"
            />
            <TextField
                fullWidth
                label="取扱ブランド（カンマ区切り）"
                value={brands}
                onChange={(e) => setBrands(e.target.value)}
                margin="normal"
                helperText="例: ブランド1, ブランド2, ブランド3"
            />
            <TextField
                fullWidth
                label="店舗説明"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                multiline
                rows={4}
                margin="normal"
            />
            <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={!userName || rating === null || rating === 0}
                sx={{ mt: 2 }}
            >
                投稿する
            </Button>
        </Box>
    );
};

export default ReviewForm; 