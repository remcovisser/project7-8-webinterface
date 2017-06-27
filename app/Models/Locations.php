<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * App\Models\Locations
 *
 * @property int $id
 * @property int $device_id
 * @property float $gps_latitude
 * @property float $gps_longitude
 * @property float $gps_accuracy
 * @property float $bt_latitude
 * @property float $bt_longitude
 * @property float $bt_accuracy
 * @property \Carbon\Carbon|null $created_at
 * @property \Carbon\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Locations whereBtAccuracy($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Locations whereBtLatitude($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Locations whereBtLongitude($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Locations whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Locations whereDeviceId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Locations whereGpsAccuracy($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Locations whereGpsLatitude($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Locations whereGpsLongitude($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Locations whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Locations whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class Locations extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'cart_id', 'latitude', 'longitude'
    ];
}