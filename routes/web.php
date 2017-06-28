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

// Temp
Route::get('seed-locations', 'HomeController@seedLocations')->name('seedLocations');

// Device API calls
Route::post('submit', 'ApiController@submit');