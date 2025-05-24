<?php

namespace App\Http\Controllers;

use App\Models\Shop;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class ShopController extends Controller
{
    public function index()
    {
        try {
            $shops = Shop::with('reviews')->get();
            return $shops->map(function ($shop) {
                return [
                    'id' => $shop->id,
                    'name' => $shop->name,
                    'address' => $shop->address,
                    'latitude' => $shop->latitude,
                    'longitude' => $shop->longitude,
                    'average_rating' => $shop->average_rating,
                    'brands' => $shop->brands,
                    'reviews' => $shop->reviews
                ];
            });
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string|max:255',
        ]);

        // Google Geocoding APIを使用して住所から緯度経度を取得
        $apiKey = config('services.google.maps_api_key');
        
        if (empty($apiKey)) {
            return response()->json(['error' => 'Google Maps API key is not configured'], 500);
        }

        try {
            $response = Http::get('https://maps.googleapis.com/maps/api/geocode/json', [
                'address' => $validated['address'],
                'key' => $apiKey,
            ]);

            if (!$response->successful()) {
                return response()->json(['error' => 'Failed to connect to Google Maps API'], 500);
            }

            $data = $response->json();
            
            if ($data['status'] !== 'OK' || empty($data['results'])) {
                return response()->json(['error' => 'Geocoding failed: ' . ($data['status'] ?? 'Unknown error')], 400);
            }

            $location = $data['results'][0]['geometry']['location'];
            $validated['latitude'] = $location['lat'];
            $validated['longitude'] = $location['lng'];

            $shop = Shop::create($validated);
            $shop->average_rating = $shop->average_rating;
            $shop->brands = $shop->brands;
            return response()->json($shop, 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Geocoding service error: ' . $e->getMessage()], 500);
        }
    }

    public function show(Shop $shop)
    {
        $shop->average_rating = $shop->average_rating;
        $shop->brands = $shop->brands;
        return $shop;
    }

    public function update(Request $request, Shop $shop)
    {
        $validated = $request->validate([
            'name' => 'string|max:255',
            'address' => 'string|max:255',
            'brands' => 'nullable|array',
            'description' => 'nullable|string',
        ]);

        if (isset($validated['address'])) {
            $response = Http::get('https://maps.googleapis.com/maps/api/geocode/json', [
                'address' => $validated['address'],
                'key' => config('services.google.maps_api_key'),
            ]);

            if ($response->successful() && $response['status'] === 'OK') {
                $location = $response['results'][0]['geometry']['location'];
                $validated['latitude'] = $location['lat'];
                $validated['longitude'] = $location['lng'];
            }
        }

        $shop->update($validated);
        return $shop;
    }

    public function destroy(Shop $shop)
    {
        $shop->delete();
        return response()->json(null, 204);
    }
} 