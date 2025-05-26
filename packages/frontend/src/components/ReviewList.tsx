import React from 'react';
import { Box, Typography, Rating, Paper, Divider } from '@mui/material';
import type { Review } from '../api/generated/models/Review';

interface ReviewListProps {
    reviews: Review[];
}

const ReviewList: React.FC<ReviewListProps> = ({ reviews }) => {
    if (reviews.length === 0) {
        return (
            <Box sx={{ mt: 2 }}>
                <Typography variant="body1" color="text.secondary">
                    まだレビューがありません。
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
                レビュー一覧
            </Typography>
            {reviews.map((review, index) => (
                <React.Fragment key={review.id}>
                    <Paper sx={{ p: 2, mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography variant="subtitle1">
                                {review.user_name}
                            </Typography>
                            <Rating value={review.rating} readOnly />
                        </Box>
                        {review.comment && (
                            <Typography variant="body2" color="text.secondary">
                                {review.comment}
                            </Typography>
                        )}
                        {review.created_at && (
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                                {new Date(review.created_at).toLocaleDateString('ja-JP')}
                            </Typography>
                        )}
                    </Paper>
                    {index < reviews.length - 1 && <Divider />}
                </React.Fragment>
            ))}
        </Box>
    );
};

export default ReviewList; 