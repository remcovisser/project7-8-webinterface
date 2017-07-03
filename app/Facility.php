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
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Device[] $devices
 */
class Facility extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['name'];

    public function beacons()
    {
        return $this->hasMany(Beacon::class);
    }

    public function devices()
    {
        return $this->hasMany(Device::class);
    }

    /**
     * Get the first record matching the attributes or create it.
     *
     * @return Facility
     */
    public static function default() : Facility
    {
        /** @noinspection PhpIncompatibleReturnTypeInspection */
        return Facility::firstOrCreate(['name' => 'Default']);
    }
}
