/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type Shop = {
    /**
     * 店舗ID
     */
    id?: number;
    /**
     * 店舗名
     */
    name?: string;
    /**
     * 住所
     */
    address?: string;
    /**
     * 緯度
     */
    latitude?: number;
    /**
     * 経度
     */
    longitude?: number;
    /**
     * 取扱ブランド一覧
     */
    brands?: Array<string>;
    /**
     * 店舗説明
     */
    description?: string;
    /**
     * 平均評価
     */
    average_rating?: number;
    /**
     * 作成日時
     */
    created_at?: string;
    /**
     * 更新日時
     */
    updated_at?: string;
};

