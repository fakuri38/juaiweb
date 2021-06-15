<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Prettus\Validator\Exceptions\ValidatorException;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class UserAPI extends Controller
{

      /**
     * Create a new user instance after a valid registration.
     *
     * @param array $data
     * @return
     */
    function register(Request $request)
    {
        try {
            $this->validate($request, [
                'name' => 'required',
                'email' => 'required|unique:users|email',
                'password' => 'required',
            ]);
            $user = new User;
            $user->name = $request->input('name');
            $user->email = $request->input('email');
            //$user->device_token = $request->input('device_token', '');
            $user->password = Hash::make($request->input('password'));
            $user->save();
            $token = $user->createToken('auth_token');
      

        } catch (\Exception $e) {
            return $this->sendError($e->getMessage(), 401);
        }


        return $this->sendResponse($user, 'User retrieved successfully');
    }

    function login(Request $request){
        try{
            $this->validate($request, [
                'email' => 'required',
                'password' => 'required',
            ]);
        
        if(Auth::attempt(['email'=>$request->input('email'), 'password'=>$request->input('password')])){
            $user=Auth::user();
            $token = $user->createToken('auth_token')->plainTextToken;
            //$user->save();
            return $this->sendResponse(['user_data' => $user, 'token' => $token], "User Retrieved Successfully");
        }else{
            return $this->sendError('Invalid Credentials', 200);
        }


        } catch(\Exception $e){
            return $this->sendError($e->getMessage(), 401);
        }
    }
}