import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Alert } from '@mui/material';
import { register } from '../api/auth';
import type { RegisterCredentials } from '../../../scheme/generated/models/RegisterCredentials';

interface RegisterFormProps {
    onRegisterSuccess: () => void;
    onClose: () => void;
}

interface ApiError {
    message: string;
    errors?: {
        [key: string]: string[];
    };
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onRegisterSuccess, onClose }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setFieldErrors({});

        // パスワードの一致確認
        if (password !== passwordConfirmation) {
            setFieldErrors({
                password_confirmation: 'パスワードが一致しません'
            });
            return;
        }

        setIsLoading(true);

        try {
            const credentials: RegisterCredentials = {
                name,
                email,
                password,
                password_confirmation: passwordConfirmation
            };
            await register(credentials);
            onRegisterSuccess();
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
                    setError('アカウント作成に失敗しました。入力内容を確認してください。');
                }
            } else {
                setError('アカウント作成に失敗しました。入力内容を確認してください。');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
                アカウント作成
            </Typography>
            
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <TextField
                fullWidth
                label="ユーザー名"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                margin="normal"
                error={!!fieldErrors.name}
                helperText={fieldErrors.name}
            />
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
            <TextField
                fullWidth
                label="パスワード（確認）"
                type="password"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                required
                margin="normal"
                error={!!fieldErrors.password_confirmation}
                helperText={fieldErrors.password_confirmation}
            />
            <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={isLoading}
                    fullWidth
                >
                    {isLoading ? '作成中...' : 'アカウント作成'}
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

export default RegisterForm; 