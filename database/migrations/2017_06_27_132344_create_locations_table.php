<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateLocationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('locations', function (Blueprint $table) {
            $table->increments('id');

            $table->integer('device_id')->unsigned();
            $table->foreign('device_id')->references('id')->on('devices');

            $table->double('gps_latitude', 10, 7);
            $table->double('gps_longitude', 10, 7);
            $table->float('gps_accuracy');

            $table->double('bt_latitude', 10, 7);
            $table->double('bt_longitude', 10, 7);
            $table->float('bt_accuracy');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('locations');
    }
}
