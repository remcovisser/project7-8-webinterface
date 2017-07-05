<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', 'HomeController@realtime');

// Browser API calls
Route::get('devices', 'DeviceController@index');
Route::get('locations/dates', 'LocationController@getDates');
Route::get('locations/{date}', 'LocationController@showByDate');

// Device API calls
Route::post('submit', 'ApiController@submit');

// Archive version
Route::get('archive', 'HomeController@index');
Route::get('get-last-location', 'HomeController@getLastLocation');
Route::get('get-daily-locations', 'HomeController@getDailyLocations');