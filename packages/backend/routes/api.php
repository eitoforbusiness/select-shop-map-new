<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ShopController;

Route::middleware('api')->group(function () {
    Route::apiResource('shops', ShopController::class);
}); 