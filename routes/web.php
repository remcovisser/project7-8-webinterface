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

Route::get('/', 'HomeController@index')->name('index');

// Browser API calls
Route::get('get-last-location', 'HomeController@getLastLocation')->name('getLastLocation');
Route::get('get-daily-locations', 'HomeController@getDailyLocations')->name('getDailyLocations');

Route::get('realtime', 'HomeController@realtime')->name('realtime');
Route::get('devices', 'DeviceController@index')->name('devices');
Route::get('locations/{date}', 'LocationController@showByDate')->name('showByDate');

// Device API calls
Route::post('submit', 'ApiController@submit')->name('submit');
