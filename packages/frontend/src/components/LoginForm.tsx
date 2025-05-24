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
                        Object.entries(apiError.errors).forEach(([field, messages]) => {
                            errors[field] = messages[0];
                        });
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
        <Box component="form" onSubmit={handleSubmit} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
                ログイン
            </Typography>
            
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <TextField
                fullWidth
                label="メールアドレス"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                margin="normal"
                error={!!fieldErrors.email}
                helperText={fieldErrors.email}
            />
            <TextField
                fullWidth
                label="パスワード"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                margin="normal"
                error={!!fieldErrors.password}
                helperText={fieldErrors.password}
            />
            <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={isLoading}
                    fullWidth
                >
                    {isLoading ? 'ログイン中...' : 'ログイン'}
                </Button>
                <Button
                    variant="outlined"
                    onClick={onClose}
                    disabled={isLoading}
                >
                    キャンセル
                </Button>
            </Box>
        </Box>
    );
};

export default LoginForm; 