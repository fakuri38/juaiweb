<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddForeignKeysToProductAttributeTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('product_attribute', function (Blueprint $table) {
            $table->foreign('attribute_id', 'product_attribute_id')->references('id')->on('attributes')->onUpdate('CASCADE')->onDelete('CASCADE');
            $table->foreign('product_id', 'product_id')->references('id')->on('products')->onUpdate('CASCADE')->onDelete('CASCADE');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('product_attribute', function (Blueprint $table) {
            $table->dropForeign('product_attribute_id');
            $table->dropForeign('product_id');
        });
    }
}
