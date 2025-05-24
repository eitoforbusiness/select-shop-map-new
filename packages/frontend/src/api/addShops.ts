import { Service } from '../../../scheme/generated';
import type { ShopInput } from '../../../scheme/generated/models/ShopInput';

/**
 * 新規店舗を追加するAPI呼び出し関数
 * @param {ShopInput} shopData - 追加する店舗のデータ
 * @returns {Promise<void>}
 */
export const addShops = async (shopData: ShopInput): Promise<void> => {
    try {
        await Service.addShops(shopData);
    } catch (error) {
        console.error('Error creating shop:', error);
        throw error;
    }
}; 