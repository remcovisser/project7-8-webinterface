<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

/**
 * App\Location
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
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Location whereBtAccuracy($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Location whereBtLatitude($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Location whereBtLongitude($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Location whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Location whereDeviceId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Location whereGpsAccuracy($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Location whereGpsLatitude($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Location whereGpsLongitude($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Location whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Location whereUpdatedAt($value)
 * @mixin \Eloquent
 * @property-read \App\Device $device
 */
class Location extends Model
{
    public function device()
    {
        return $this->belongsTo(Device::class);
    }
}
