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
export class DefaultService {
    /**
     * 店舗一覧を取得
     * @returns Shop 成功
     * @throws ApiError
     */
    public static getShops(): CancelablePromise<Array<Shop>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/shops',
            errors: {
                401: `認証エラー`,
            },
        });
    }
    /**
     * 新規店舗を登録
     * @param requestBody
     * @returns Shop 作成成功
     * @throws ApiError
     */
    public static postShops(
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
    /**
     * 店舗詳細の取得
     * @param shopId
     * @returns Shop 成功
     * @throws ApiError
     */
    public static getShops1(
        shopId: number,
    ): CancelablePromise<Shop> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/shops/{shopId}',
            path: {
                'shopId': shopId,
            },
            errors: {
                404: `店舗が見つかりません`,
            },
        });
    }
    /**
     * ログイン
     * @param requestBody
     * @returns AuthResponse ログイン成功
     * @throws ApiError
     */
    public static postAuthLogin(
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
     * アカウント作成
     * @param requestBody
     * @returns AuthResponse 作成成功
     * @throws ApiError
     */
    public static postAuthRegister(
        requestBody: RegisterCredentials,
    ): CancelablePromise<AuthResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/register',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                409: `メールアドレス重複エラー`,
                422: `バリデーションエラー`,
            },
        });
    }
    /**
     * ログアウト
     * @returns any ログアウト成功
     * @throws ApiError
     */
    public static postAuthLogout(): CancelablePromise<{
        message: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/logout',
            errors: {
                401: `認証エラー`,
            },
        });
    }
}
