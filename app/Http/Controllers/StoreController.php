<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Redirect;
use DB;
class StoreController extends Controller
{
    /**
     * Show the profile for a given user.
     *
     * @param  int  $id
     * @return \Illuminate\View\View
     */
    public function index($store_name)
    {
        if($store_name=="www"){
            return Redirect::to('https://juai.my');
        }else{
            $store=DB::table('stores')->where('store_name', '=', $store_name)->get();
            //dump($store);
            if($store->isEmpty()){
                return view('store.null');
            }else{
                return view('store.index')->with('store_name', $store_name);
            }
        }
       
    }
}