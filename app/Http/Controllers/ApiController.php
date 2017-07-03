<?php

namespace App\Http\Controllers;

use App\Device;
use App\Facility;
use App\Location;
use Carbon\Carbon;
use Illuminate\Http\Request;

class ApiController extends Controller
{
    private const DEFAULT_COORD = 0.0000000;
    
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

        // Set random line colour if none have been defined
        if ($device->colour == null) $device->colour = substr(str_shuffle('ABCDEF0123456789'), 0, 6);

        if (!$device->save()) return response()->json(['message' => 'Unable to resolve device.'], 202);

        // Check if location changed
        /** @var Location $currentLocation */
        /** @noinspection PhpUndefinedMethodInspection */
        $currentLocation = $device->locations()->with('device')->orderBy('created_at', 'desc')->first() ?? new Location();
        $newLocation = $currentLocation;

        $lat = $this->sanitizeCoordinate($request->input('gps_latitude'));
        $long = $this->sanitizeCoordinate($request->input('gps_longitude'));

        if ($lat == ApiController::DEFAULT_COORD || $long == ApiController::DEFAULT_COORD) return response()->json(['message' => 'Successfully updated device, but did not store location because it was "nan" or "0.0".']);

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

            $newLocation = $location;
        }
        else
        {
            // If unchanged, just trigger updated_at
            $currentLocation->touch();
        }

        if (!$this->triggerSocket($newLocation->toArray())) return response()->json(['message' => 'Successfully updated device and location, but could not inform the socket server.']);

        return response()->json(['message' => 'Successfully updated device and location, and informed socket server.']);
    }

    /**
     * Standardise default coordinate format.
     *
     * @param $coordinate
     *
     * @return float
     */
    private function sanitizeCoordinate($coordinate)
    {
        if ($coordinate == '0.0' || $coordinate == 'nan')
        {
            return ApiController::DEFAULT_COORD;
        }

        return $coordinate;
    }

    /**
     * Passes new device location to socket server.
     *
     * @param array $data
     *
     * @return bool
     */
    private function triggerSocket($data)
    {
        $url = 'http://' . $_SERVER['HTTP_HOST'] . ':3000/submit';

        $curl = curl_init($url);
        curl_setopt($curl, CURLOPT_POST, true);
        curl_setopt($curl, CURLOPT_POSTFIELDS, http_build_query($data));
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        $response = curl_exec($curl);

        $http_code = curl_getinfo($curl, CURLINFO_HTTP_CODE);

        curl_close($curl);

        return ($http_code == 200 || $http_code == 204);
    }
}
