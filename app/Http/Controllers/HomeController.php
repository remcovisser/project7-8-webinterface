<?php
namespace App\Http\Controllers;
use App\Models\Carts;
use App\Models\Locations;

class HomeController extends Controller
{
    public function index() {
        $carts = Carts::with('locations')->get();

        return view('home.index', compact('carts'));
    }

    public function locations() {
        return Locations::get();
    }
}