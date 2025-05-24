/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AuthResponse } from '../models/AuthResponse';
import type { LoginCredentials } from '../models/LoginCredentials';
import type { RegisterCredentials } from '../models/RegisterCredentials';
import type { Shop } from '../models/Shop';
import type { ShopInput } from '../models/ShopInput';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class Service {
    /**
     * ユーザーログイン
     * メールアドレスとパスワードでログインします
     * @param requestBody
     * @returns AuthResponse ログイン成功
     * @throws ApiError
     */
    public static login(
        requestBody: LoginCredentials,
    ): CancelablePromise<AuthResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/login',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `認証エラー`,
                422: `バリデーションエラー`,
            },
        });
    }
    /**
     * ユーザー登録
     * 新しいユーザーアカウントを作成します
     * @param requestBody
     * @returns AuthResponse 登録成功
     * @throws ApiError
     */
    public static register(
        requestBody: RegisterCredentials,
    ): CancelablePromise<AuthResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/register',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                409: `メールアドレスが既に使用されています`,
                422: `バリデーションエラー`,
            },
        });
    }
    /**
     * ログアウト
     * 現在のユーザーをログアウトします
     * @returns any ログアウト成功
     * @throws ApiError
     */
    public static logout(): CancelablePromise<{
        message?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/logout',
            errors: {
                401: `認証エラー`,
            },
        });
    }
    /**
     * 店舗一覧取得
     * 全店舗の一覧を取得します
     * @returns Shop 成功
     * @throws ApiError
     */
    public static getShops(): CancelablePromise<Array<Shop>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/shops',
        });
    }
    /**
     * 店舗追加
     * 新しい店舗を追加します
     * @param requestBody
     * @returns Shop 作成成功
     * @throws ApiError
     */
    public static addShops(
        requestBody: ShopInput,
    ): CancelablePromise<Shop> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/shops',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `認証エラー`,
                422: `バリデーションエラー`,
            },
        });
    }
}
