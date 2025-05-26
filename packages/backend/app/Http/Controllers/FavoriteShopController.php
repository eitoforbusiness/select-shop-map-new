<?php

namespace App\Http\Controllers;

use App\Models\FavoriteShop;
use App\Models\Shop;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FavoriteShopController extends Controller
{
    /**
     * お気に入り店舗一覧を取得
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $favoriteShops = $user->favoriteShops()
            ->with('shop.reviews')
            ->get()
            ->map(function ($favoriteShop) {
                $shop = $favoriteShop->shop;
                return [
                    'id' => $shop->id,
                    'name' => $shop->name,
                    'address' => $shop->address,
                    'latitude' => $shop->latitude,
                    'longitude' => $shop->longitude,
                    'average_rating' => $shop->average_rating,
                    'brands' => $shop->brands,
                ];
            });

        return response()->json($favoriteShops);
    }

    /**
     * お気に入り店舗を追加
     *
     * @param Shop $shop
     * @return JsonResponse
     */
    public function store(Shop $shop): JsonResponse
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        
        try {
            $favoriteShop = $user->favoriteShops()->create([
                'shop_id' => $shop->id,
            ]);
            return response()->json(['message' => 'お気に入りに追加しました'], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => '既にお気に入りに追加されています'], 400);
        }
    }

    /**
     * お気に入り店舗を削除
     *
     * @param Shop $shop
     * @return JsonResponse
     */
    public function destroy(Shop $shop): JsonResponse
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $user->favoriteShops()->where('shop_id', $shop->id)->delete();
        return response()->json(['message' => 'お気に入りから削除しました']);
    }
} 