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
            
            $attribute_name=$request->attribute_name;

            $validated = $request->validate([
                'attribute_name' => 'required',
            ], $this->messages());

            $store_id = DB::table('stores')
            ->where('user_id', Auth::id())
            ->select('id')
            ->first();

            if(empty($attribute_name)){
                return response()->json(['success'=>false, 'error'=>'Attribut Telah Wujud'], 400);
            }else{
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
            ->editColumn('action', function ($attribute) {
                return 
                '
                <a href="'.route('AttributeEdit', $attribute->id).'" type="button" d class="btn btn-primary btn-sm" >Edit</a>
                <button type="button" data-id="'.$attribute->id.'" data-toggle="modal" data-target="#DeleteArticleModal" class="btn btn-danger btn-sm" id="getDeleteId">Hapus</button>';
            })
            ->rawColumns(['action'])
            ->make(true);     
    }

    public function destroy(Request $request){
        if($request->ajax()){
            $attribute_id = $request->id;
            $attribute = DB::table('attributes')->where('id',  $attribute_id)->delete();
            return response()->json('success');
        }
    }

    public function attrDestroy(Request $request){
        if($request->ajax()){
            $attribute_id = $request->id;
            $attribute = DB::table('attribute_options')->where('id',  $attribute_id)->delete();
            return response()->json('success');
        }
    }
    

    public function edit(Request $request, $attribute_id){

            $user_attribute = DB::table('stores')
            ->join('attributes', 'attributes.store_id', 'stores.id')
            ->select(
                'attributes.attribute_name',
                'attributes.id'
            )
            ->where('stores.user_id', Auth::id())
            ->where('attributes.id', $attribute_id)
            ->first();

        if($request->ajax()){
            $user_attribute = DB::table('users')
            ->join('stores', 'stores.user_id', 'users.id')
            ->join('attributes', 'attributes.store_id', 'stores.id')
            ->join('attribute_options', 'attribute_options.attribute_id', 'attributes.id')
            ->select(
                'attribute_options.id',
                'attribute_options.option_name',
                'attribute_options.option_price',
                'attribute_options.option_stock',
            )
            ->where('stores.user_id', Auth::id())
            ->where('attributes.id', $attribute_id);

            return Datatables::of($user_attribute)
            ->addIndexColumn()
            ->editColumn('action', function ($user_attribute) {
                return 
                '
                <a href="#" type="button" d class="btn btn-primary btn-sm" >Edit</a>
                <button type="button" data-id="'.$user_attribute->id.'" class="btn btn-danger btn-sm" id="getDeleteId">Hapus</button>';
            })
            ->rawColumns(['action'])
            ->make(true);;
        }

        $attribute_name = $user_attribute->attribute_name;
        $attribute_id = $user_attribute->id;
        
        return view('admin.products.attribute-add')->with(compact('attribute_name', 'attribute_id'));
    }

    public function attributeOption(Request $request){
        if($request->ajax()){
            $form = $request->get('form');
            parse_str($form, $data);

            if(empty($data['price']) && !empty($data['stock'])){
                $attribute_option = DB::table('attribute_options')
                ->insert([
                    'attribute_id' => $request->id,
                    'option_name' => $data['name'],
                    'option_price' => "0.00",
                    'option_stock' => $data['stock']
                ]);
                return response()->json('success');
            }
            if(!empty($data['price']) && empty($data['stock'])){
                $attribute_option = DB::table('attribute_options')
                ->insert([
                    'attribute_id' => $request->id,
                    'option_name' => $data['name'],
                    'option_price' => $data['price'],
                    'option_stock' => "0"
                ]);
                return response()->json('success');
            }
            if(empty($data['price']) && empty($data['stock'])){
                $attribute_option = DB::table('attribute_options')
                ->insert([
                    'attribute_id' => $request->id,
                    'option_name' => $data['name'],
                    'option_price' => "0.00",
                    'option_stock' => "0"
                ]);
                return response()->json('success');
            }
            else{
                $attribute_option = DB::table('attribute_options')
                ->insert([
                    'attribute_id' => $request->id,
                    'option_name' => $data['name'],
                    'option_price' => $data['price'],
                    'option_stock' => $data['stock']
                ]);
            }
        }
    }
}