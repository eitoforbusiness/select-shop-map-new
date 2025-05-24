/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ShopInput = {
    /**
     * 店舗名
     */
    name: string;
    /**
     * 住所
     */
    address: string;
    /**
     * 緯度
     */
    latitude: number;
    /**
     * 経度
     */
    longitude: number;
    /**
     * 取扱ブランド一覧
     */
    brands?: Array<string>;
    /**
     * 店舗説明
     */
    description?: string;
};

