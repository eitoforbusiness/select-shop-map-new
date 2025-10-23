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
            console.error('Registration error:', error);
            
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
                        setError(apiError.message || 'アカウント作成に失敗しました。入力内容を確認してください。');
                    }
                } catch (parseError) {
                    console.error('Error parsing API response:', parseError);
                    setError('アカウント作成に失敗しました。入力内容を確認してください。');
                }
            } else if (error.message) {
                setError(error.message);
            } else {
                setError('アカウント作成に失敗しました。入力内容を確認してください。');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ p: 4 }}>
            <div className="text-center mb-4">
                <Typography variant="h4" className="fw-bold mb-2" style={{ color: '#ef4444' }}>
                    アカウント作成
                </Typography>
                <Typography variant="body2" className="text-muted">
                    新しいアカウントを作成して、セレクトショップマップを始めましょう
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
                    label="ユーザー名"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    error={!!fieldErrors.name}
                    helperText={fieldErrors.name}
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
                    helperText={fieldErrors.password || '8文字以上、大文字・小文字・数字を含めてください'}
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
                    label="パスワード（確認）"
                    type="password"
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    required
                    error={!!fieldErrors.password_confirmation}
                    helperText={fieldErrors.password_confirmation}
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
                            作成中...
                        </>
                    ) : (
                        'アカウント作成'
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

export default RegisterForm; 