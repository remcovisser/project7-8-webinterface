<?php

namespace App\Http\Controllers;

use App\Device;
use App\Facility;
use App\Location;
use Carbon\Carbon;
use Illuminate\Http\Request;

class ApiController extends Controller
{
    /**
     * Update device and location.
     *
     * @param Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function submit(Request $request)
    {
        // Update device info
        /** @var Device $device */
        $device = Device::firstOrNew(['mac' => $request->input('mac_address')]);
        $device->lan_ip = $request->input('lan_ip');
        $device->wan_ip = $request->ip();
        $device->updated_at = Carbon::now(); // force datetime change

        // Set facility if none is defined
        if ($device->facility_id == null) $device->facility()->associate(Facility::default());

        if (!$device->save()) return response()->json(['message' => 'Unable to resolve device.'], 202);

        // Check if location changed
        /** @var Location $currentLocation */
        /** @noinspection PhpUndefinedMethodInspection */
        $currentLocation = $device->locations()->orderBy('created_at', 'desc')->first() ?? new Location();

        $lat = $this->sanatizeCoordinate($request->input('gps_latitude'));
        $long = $this->sanatizeCoordinate($request->input('gps_longitude'));

        // Add location if it changed
        if ($currentLocation->gps_latitude != $lat || !$currentLocation->gps_longitude == $long)
        {
            $location = new Location();
            $location->device()->associate($device);
            $location->gps_latitude = $lat;
            $location->gps_longitude = $long;

            // TODO: Assign values
            $location->gps_accuracy = 0;
            $location->bt_latitude = 0.0;
            $location->bt_longitude = 0.0;
            $location->bt_accuracy = 0;

            if (!$location->save()) return response()->json(['message' => 'Unable to store new location.'], 202);
        }
        else
        {
            // If unchanged, just trigger updated_at
            $currentLocation->touch();
        }

        return response()->json(['message' => 'Successfully updated device and location.']);
    }

    private function sanatizeCoordinate($coordinate)
    {
        if ($coordinate == '0.0' || $coordinate == 'nan')
        {
            return 0.0000000;
        }

        return $coordinate;
    }
}
