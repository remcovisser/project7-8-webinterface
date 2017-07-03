<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

/**
 * App\Device
 *
 * @property int $id
 * @property int $facility_id
 * @property string $mac
 * @property \Carbon\Carbon|null $created_at
 * @property \Carbon\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Device whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Device whereFacilityId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Device whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Device whereMac($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Device whereUpdatedAt($value)
 * @mixin \Eloquent
 * @property string $wan_ip
 * @property string $lan_ip
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Device whereLanIp($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Device whereWanIp($value)
 * @property string $colour
 * @property-read \App\Facility $facility
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Location[] $locations
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Device whereColour($value)
 */
class Device extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['mac'];

    public function locations()
    {
        /** @noinspection PhpIncompatibleReturnTypeInspection */
        return $this->hasMany(Location::class);
    }

    public function facility()
    {
        /** @noinspection PhpIncompatibleReturnTypeInspection */
        return $this->belongsTo(Facility::class);
    }
}
