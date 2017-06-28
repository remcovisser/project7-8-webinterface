<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

/**
 * App\Beacon
 *
 * @property int $id
 * @property int $facility_id
 * @property string $uuid
 * @property float $latitude
 * @property float $longitude
 * @property \Carbon\Carbon|null $created_at
 * @property \Carbon\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Beacon whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Beacon whereFacilityId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Beacon whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Beacon whereLatitude($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Beacon whereLongitude($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Beacon whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Beacon whereUuid($value)
 * @mixin \Eloquent
 */
class Beacon extends Model
{
    //
}
