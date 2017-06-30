<?php

namespace App\Http\Controllers;

use App\Device;
use App\Location;

class HomeController extends Controller
{
    /**
     * Return the index view with all the devices.
     *
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function index()
    {
        $devices = Device::with('locations')->get();

        return view('index', compact('devices'));
    }

    /**
     * Return the last know location for each device
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getLastLocation()
    {
        return Location::orderBy('id', 'desc')->get()->unique('device_id');
    }

    /**
     * Return all the know locations for each device for this day
     *
     * @return array
     */
    public function getDailyLocations()
    {
        $data = [];
        $devices = Device::all();
        foreach ($devices as $device)
        {
            $data[$device->id]['device_id'] = $device->id;
            $data[$device->id]['facility_id'] = $device->facility_id;
            $data[$device->id]['locations'] = $device->locations()->orderBy('created_at')->get()->toArray();
        }

        return $data;
    }
}