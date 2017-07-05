<?php

namespace App\Http\Controllers;

use App\Location;
use DB;
use Illuminate\Http\Request;

class LocationController extends Controller
{
    /**
     * Get all locations produced on the specified date.
     *
     * @param string $date
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function showByDate($date)
    {
        $date = \DateTime::createFromFormat('d-m-Y', $date);
        $locations = Location::whereDate('created_at', $date->format('Y-m-d'))->get(['device_id', 'gps_latitude', 'gps_longitude', 'gps_accuracy', 'created_at']);
        return response()->json($locations);
    }

    public function getDates()
    {
        $days = Location::groupBy('date')->get([ DB::raw('Date(created_at) as date'), /*DB::raw('COUNT(*) as "count"')*/ ]);

        // Reduce traffic
        $compact = [];
        foreach ($days as $day)
        {
            $compact[] = $day->date;
        }

        return response()->json($compact);
    }
}
