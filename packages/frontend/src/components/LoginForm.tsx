import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Alert } from '@mui/material';
import { login } from '../api/auth';
import type { LoginCredentials } from '../../../scheme/generated/models/LoginCredentials';

interface LoginFormProps {
    onLoginSuccess: () => void;
    onClose: () => void;
}

interface ApiError {
    message: string;
    errors?: {
        [key: string]: string[];
    };
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess, onClose }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setFieldErrors({});
        setIsLoading(true);

        try {
            const credentials: LoginCredentials = { email, password };
            await login(credentials);
            onLoginSuccess();
            onClose();
        } catch (error: any) {
            if (error.body) {
                try {
                    const apiError: ApiError = JSON.parse(error.body);
                    if (apiError.errors) {
                        // フィールドごとのエラーメッセージを設定
                        const errors: { [key: string]: string } = {};
                        for (const [field, messages] of Object.entries(apiError.errors)) {
                            errors[field] = messages[0];
                        }
                        setFieldErrors(errors);
                    } else {
                        setError(apiError.message);
                    }
                } catch {
                    setError('ログインに失敗しました。メールアドレスとパスワードを確認してください。');
                }
            } else {
                setError('ログインに失敗しました。メールアドレスとパスワードを確認してください。');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ p: 4 }}>
            <div className="text-center mb-4">
                <Typography variant="h4" className="fw-bold mb-2" style={{ color: '#ef4444' }}>
                    ログイン
                </Typography>
                <Typography variant="body2" className="text-muted">
                    アカウントにログインして、お気に入り機能をご利用ください
                </Typography>
            </div>
            
            {error && (
                <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                    {error}
                </Alert>
            )}

            <div className="mb-4">
                <TextField
                    fullWidth
                    label="メールアドレス"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    error={!!fieldErrors.email}
                    helperText={fieldErrors.email}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 3,
                            '& fieldset': {
                                borderColor: '#e5e5e5',
                                borderWidth: 2,
                            },
                            '&:hover fieldset': {
                                borderColor: '#ef4444',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#ef4444',
                            },
                        },
                    }}
                />
            </div>
            
            <div className="mb-4">
                <TextField
                    fullWidth
                    label="パスワード"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    error={!!fieldErrors.password}
                    helperText={fieldErrors.password}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 3,
                            '& fieldset': {
                                borderColor: '#e5e5e5',
                                borderWidth: 2,
                            },
                            '&:hover fieldset': {
                                borderColor: '#ef4444',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#ef4444',
                            },
                        },
                    }}
                />
            </div>
            
            <div className="d-flex gap-3">
                <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={isLoading}
                    className="flex-fill rounded-pill hover-lift"
                    style={{
                        background: isLoading 
                            ? '#9ca3af' 
                            : '#ef4444',
                        border: 'none'
                    }}
                >
                    {isLoading ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
                            ログイン中...
                        </>
                    ) : (
                        'ログイン'
                    )}
                </Button>
                <Button
                    variant="contained"
                    size="large"
                    onClick={onClose}
                    disabled={isLoading}
                    className="rounded-pill hover-lift"
                    style={{
                        background: '#ef4444',
                        border: 'none'
                    }}
                >
                    キャンセル
                </Button>
            </div>
        </Box>
    );
};

export default LoginForm; 