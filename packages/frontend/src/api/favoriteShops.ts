import { DefaultService } from './generated';
import type { Shop } from './generated';

/**
 * お気に入り店舗一覧を取得するAPI呼び出し関数
 * @returns {Promise<Shop[]>} お気に入り店舗一覧データ
 */
export const getFavoriteShops = async (): Promise<Shop[]> => {
    try {
        const response = await DefaultService.getFavoriteShops();
        return response;
    } catch (error) {
        console.error('Error fetching favorite shops:', error);
        throw error;
    }
};

/**
 * お気に入り店舗を追加するAPI呼び出し関数
 * @param {number} shopId - 店舗ID
 * @returns {Promise<void>}
 */
export const addFavoriteShop = async (shopId: number): Promise<void> => {
    try {
        await DefaultService.postFavoriteShops(shopId);
    } catch (error) {
        console.error('Error adding favorite shop:', error);
        throw error;
    }
};

/**
 * お気に入り店舗を削除するAPI呼び出し関数
 * @param {number} shopId - 店舗ID
 * @returns {Promise<void>}
 */
export const removeFavoriteShop = async (shopId: number): Promise<void> => {
    try {
        await DefaultService.deleteFavoriteShops(shopId);
    } catch (error) {
        console.error('Error removing favorite shop:', error);
        throw error;
    }
}; 