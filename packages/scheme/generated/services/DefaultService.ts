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
     * 新規店舗の登録
     * 新しい店舗情報を登録します
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
                400: `バリデーションエラー`,
            },
        });
    }
}
