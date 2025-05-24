<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ShopController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\AuthController;

Route::middleware('api')->group(function () {
    Route::apiResource('shops', ShopController::class);
});

Route::get('/shops', [ShopController::class, 'index']);
Route::post('/shops', [ShopController::class, 'store']);
Route::get('/shops/{shop}', [ShopController::class, 'show']);

Route::get('/shops/{shop}/reviews', [ReviewController::class, 'index']);
Route::post('/shops/{shop}/reviews', [ReviewController::class, 'store']);

// 認証関連のルート
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum'); 