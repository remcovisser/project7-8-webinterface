<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Carts extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'description',
    ];

    /* Relations */
    public function locations()
    {
        return $this->hasMany(Locations::class, 'cart_id', 'id');
    }
}