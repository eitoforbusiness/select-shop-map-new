/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type Review = {
    /**
     * レビューID
     */
    id?: number;
    /**
     * 店舗ID
     */
    shop_id?: number;
    /**
     * ユーザー名
     */
    user_name?: string;
    /**
     * 評価（1-5）
     */
    rating?: number;
    /**
     * コメント
     */
    comment?: string;
    /**
     * 取扱ブランド一覧
     */
    brands?: Array<string>;
    /**
     * 店舗説明
     */
    description?: string;
    /**
     * 作成日時
     */
    created_at?: string;
    /**
     * 更新日時
     */
    updated_at?: string;
};

