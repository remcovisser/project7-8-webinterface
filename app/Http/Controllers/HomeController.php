<?php
namespace App\Http\Controllers;
use App\Device;
use App\Location;

class HomeController extends Controller
{
    // Return the index view with all the devices
    public function index() {
        $devices = Device::with('locations')->get();

        return view('home.index', compact('devices'));
    }

    // Return the last know location for each device
    public function getLastLocation() {
        return Location::groupBy('device_id')->get();
    }

    // Return all the know locations for each device for this day
    public function getDailyLocations() {
        $data = [];
        $devices = Device::all();
        foreach($devices as $device) {
            $data[$device->id]['device_id'] = $device->id;
            $data[$device->id]['facility_id'] = $device->facility_id;
            $data[$device->id]['locations'] = $device->locations->toArray();
        }
        return $data;
    }

    // Temp -- seed locations
    public function seedLocations() {
        $lat = 51.9171000;
        $long = 4.4878380;
        for($i = 0; $i < 1000; $i++) {
            $location = new Location();
            $location->device_id = 2;
            $location->gps_latitude = $lat;
            $location->gps_longitude = $long;
            $location->gps_accuracy = 25;
            $location->save();

            $long += 0.00005;
        }
        echo "Done seeding";
    }
}