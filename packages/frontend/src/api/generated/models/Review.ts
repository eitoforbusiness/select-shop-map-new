export type Review = {
    id: number;
    shop_id: number;
    user_name: string;
    rating: number;
    comment?: string;
    brands?: string[];
    description?: string;
    created_at: string;
    updated_at: string;
}; 