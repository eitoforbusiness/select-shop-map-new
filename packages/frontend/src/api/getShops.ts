import { Service } from '../../../scheme/generated';
import type { Shop } from '../../../scheme/generated/models/Shop';

/**
 * 店舗一覧を取得するAPI呼び出し関数
 * @returns {Promise<Shop[]>} 店舗一覧データ
 */
export const getShops = async (): Promise<Shop[]> => {
    try {
        const response = await Service.getShops();
        return response as Shop[];
    } catch (error) {
        console.error('Error fetching shops:', error);
        throw error;
    }
}; 