<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

/**
 * App\Facility
 *
 * @property int $id
 * @property string $name
 * @property \Carbon\Carbon|null $created_at
 * @property \Carbon\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Beacon[] $beacons
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Facility whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Facility whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Facility whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Facility whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class Facility extends Model
{
    public function beacons()
    {
        return $this->hasMany(Beacon::class);
    }
}
