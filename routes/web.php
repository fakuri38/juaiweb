<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Product\ProductController;
use App\Http\Controllers\Product\AttributeController;
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
Route::domain('juai.my')->group(function () {
    Route::get('/', function () {
        return view('welcome');
    });

    Route::middleware(['auth:sanctum', 'verified'])->group(function () {

        Route::get('/dashboard', function () {
            return view('admin.index');
        })->name('dashboard');

        Route::get('/product', [ProductController::class, 'index'])->name('product');

        Route::group(['prefix' => 'attribute'], function () {

            Route::get('/', [AttributeController::class, 'index'])->name('attribute');
            Route::get('/add', [AttributeController::class, 'add'])->name('AttributeAdd');
            Route::get('/view', [AttributeController::class, 'view'])->name('AttributeView');
            Route::get('/destroy', [AttributeController::class, 'destroy'])->name('AttributeDestroy');
            Route::get('/edit/{attribute_id}', [AttributeController::class, 'edit'])->name('AttributeEdit');
            Route::get('/add/attribute-option', [AttributeController::class, 'attributeOption'])->name('AttributeOption');
            Route::get('/destroy/attribute-option', [AttributeController::class, 'attrDestroy'])->name('AttrOptionDestroy');
        });
    });

});

Route::domain('{store_name}.juai.my')->group(function () {
    Route::get('/', 'App\Http\Controllers\StoreController@index');
});

/*
Route::get('/', function () {
    return view('welcome');
});*/




