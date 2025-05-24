<?php

namespace App\Http\Controllers;

use App\Models\Review;
use App\Models\Shop;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function store(Request $request, Shop $shop)
    {
        $validated = $request->validate([
            'user_name' => 'required|string|max:255',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string',
            'brands' => 'nullable|array',
            'brands.*' => 'string',
            'description' => 'nullable|string',
        ]);

        $review = $shop->reviews()->create($validated);

        return response()->json($review, 201);
    }

    public function index(Shop $shop)
    {
        $reviews = $shop->reviews()->latest()->get();
        return response()->json($reviews);
    }
} 