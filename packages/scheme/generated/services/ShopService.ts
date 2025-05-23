/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Shop } from '../models/Shop';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ShopService {
    /**
     * 店舗一覧の取得
     * 登録されている全ての店舗情報を取得します
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
     * 店舗詳細の取得
     * 指定されたIDの店舗情報を取得します
     * @param id
     * @returns Shop 成功
     * @throws ApiError
     */
    public static getShop(
        id: number,
    ): CancelablePromise<Shop> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/shops/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `店舗が見つかりません`,
            },
        });
    }
}
