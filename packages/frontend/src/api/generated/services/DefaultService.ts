/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Shop } from '../models/Shop';
import type { ShopInput } from '../models/ShopInput';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DefaultService {
    /**
     * 店舗一覧の取得
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
     * 新規店舗の追加
     * @param requestBody
     * @returns Shop 作成成功
     * @throws ApiError
     */
    public static createShop(
        requestBody: ShopInput,
    ): CancelablePromise<Shop> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/shops',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
