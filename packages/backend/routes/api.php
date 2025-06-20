<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ShopController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\FavoriteShopController;

Route::middleware('api')->group(function () {
    Route::apiResource('shops', ShopController::class);
    Route::get('/shops/{shop}/reviews', [ReviewController::class, 'index']);
    Route::post('/shops/{shop}/reviews', [ReviewController::class, 'store']);
});

// 認証関連のルート
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

// お気に入り店舗関連のルート
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/favorite-shops', [FavoriteShopController::class, 'index']);
    Route::post('/favorite-shops/{shop}', [FavoriteShopController::class, 'store']);
    Route::delete('/favorite-shops/{shop}', [FavoriteShopController::class, 'destroy']);
}); 