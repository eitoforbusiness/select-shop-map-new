import { ShopService } from '../../../scheme/generated';
import type { Shop } from '../../../scheme/generated';

/**
 * 特定の店舗の詳細情報を取得するAPI呼び出し関数
 * @param {number} id - 店舗ID
 * @returns {Promise<Shop>} 店舗の詳細情報
 */
export const getShop = async (id: number): Promise<Shop> => {
    try {
        const response = await ShopService.getShop(id);
        return response as Shop;
    } catch (error) {
        console.error(`Error fetching shop with id ${id}:`, error);
        throw error;
    }
}; 