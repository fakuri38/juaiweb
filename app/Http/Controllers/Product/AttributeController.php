<?php

namespace App\Http\Controllers\Product;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Redirect;
use DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use DataTables;

class AttributeController extends Controller
{
    public function index()
    {
       return view('admin.products.attribute');
    }

    public function add(Request $request)
    {
        if($request->ajax()){
            
            $attribute_name=$request->name;
            $store_id = DB::table('stores')
            ->where('user_id', Auth::id())
            ->select('id')
            ->first();
            
            $attribute_check = DB::table('attributes')
            ->where('store_id', $store_id->id)
            ->where('attribute_name', $attribute_name)
            ->first();
            
            if($attribute_check == null){
                $insert = DB::table('attributes')
                ->insert([
                    'store_id' => $store_id->id, 
                    'attribute_name' => $attribute_name,
                    'created_at'=> Carbon::now()->toDateTimeString(),
                    'updated_at'=> Carbon::now()->toDateTimeString(),
                ]);
                return response()->json('success');
            }else{
                return response()->json(['success'=>false, 'error'=>'Attribut Telah Wujud'], 400);
            }
        }  
    }

    public function view(Request $request)
    {
        $store_id = DB::table('stores')
        ->where('user_id', Auth::id())
        ->first();
        
        $attribute = DB::table('attributes')
        ->where('store_id', $store_id->id);
        
        return Datatables::of($attribute)
            ->addIndexColumn()
            ->addColumn('action', function ($attribute) {
                return 
                '<a href="javascript:;" class="btn btn-xl btn-clean btn-icon" title="Delete"><i class="la la-trash"></i></a>
                <a href="javascript:;" class="btn btn-xl btn-clean btn-icon" title="Delete"><i class="la la-trash"></i></a>';
            })
            ->rawColumns(['action'])
            ->make(true);     
    }
}