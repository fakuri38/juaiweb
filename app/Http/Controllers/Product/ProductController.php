<?php

namespace App\Http\Controllers\Product;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Redirect;
use DB;

class ProductController extends Controller
{
    public function index()
    {
       return view('admin.products.index');
    }
}