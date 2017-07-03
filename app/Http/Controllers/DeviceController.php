<?php

namespace App\Http\Controllers;

use App\Device;

class DeviceController extends Controller
{
    public function index()
    {
        return response()->json(Device::all());
    }
}
