<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Shop extends Model
{
    protected $fillable = [
        'name',
        'address',
        'latitude',
        'longitude',
        'brands',
        'description',
    ];

    protected $casts = [
        'brands' => 'array',
        'latitude' => 'float',
        'longitude' => 'float',
    ];
} 