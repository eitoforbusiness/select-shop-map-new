import { Service } from '../../../scheme/generated';
import type { LoginCredentials } from '../../../scheme/generated/models/LoginCredentials';
import type { RegisterCredentials } from '../../../scheme/generated/models/RegisterCredentials';
import type { AuthResponse } from '../../../scheme/generated/models/AuthResponse';

export type { LoginCredentials, RegisterCredentials, AuthResponse };

/**
 * ログインAPI呼び出し関数
 * @param {LoginCredentials} credentials - ログイン認証情報
 * @returns {Promise<AuthResponse>} 認証レスポンス
 */
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
        const response = await Service.login(credentials);
        if (response.token) {
            localStorage.setItem('authToken', response.token);
            if (response.expires_at) {
                localStorage.setItem('tokenExpiresAt', response.expires_at);
            }
        }
        return response;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};

/**
 * アカウント作成API呼び出し関数
 * @param {RegisterCredentials} credentials - アカウント作成情報
 * @returns {Promise<AuthResponse>} 認証レスポンス
 */
export const register = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    try {
        const response = await Service.register(credentials);
        if (response.token) {
            localStorage.setItem('authToken', response.token);
            if (response.expires_at) {
                localStorage.setItem('tokenExpiresAt', response.expires_at);
            }
        }
        return response;
    } catch (error) {
        console.error('Registration error:', error);
        throw error;
    }
};

/**
 * ログアウト関数
 */
export const logout = async (): Promise<void> => {
    try {
        await Service.logout();
    } finally {
        localStorage.removeItem('authToken');
        localStorage.removeItem('tokenExpiresAt');
    }
};

/**
 * 現在の認証状態を取得する関数
 * @returns {boolean} ログイン状態
 */
export const isAuthenticated = (): boolean => {
    const token = localStorage.getItem('authToken');
    const expiresAt = localStorage.getItem('tokenExpiresAt');
    
    if (!token || !expiresAt) {
        return false;
    }

    // トークンの有効期限をチェック
    const expirationDate = new Date(expiresAt);
    if (expirationDate < new Date()) {
        // トークンが期限切れの場合、ローカルストレージをクリア
        localStorage.removeItem('authToken');
        localStorage.removeItem('tokenExpiresAt');
        return false;
    }

    return true;
}; 