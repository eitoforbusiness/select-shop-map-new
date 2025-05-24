/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type AuthResponse = {
    /**
     * 認証トークン
     */
    token?: string;
    user?: {
        /**
         * ユーザーID
         */
        id?: number;
        /**
         * ユーザー名
         */
        name?: string;
        /**
         * メールアドレス
         */
        email?: string;
    };
    /**
     * トークンの有効期限
     */
    expires_at?: string;
};

