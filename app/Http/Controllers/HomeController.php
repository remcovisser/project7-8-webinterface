<?php
namespace App\Http\Controllers;
use App\Device;
use App\Location;

class HomeController extends Controller
{
    public function index() {
        $devices = Device::with('locations')->get();

        return view('home.index', compact('devices'));
    }

    public function locations() {
        return Location::get();
    }
}