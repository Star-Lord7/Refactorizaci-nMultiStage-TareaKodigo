<?php
namespace App\Http\Controllers;
use App\Models\User;
use Illuminate\Http\{JsonResponse,Request};
use Illuminate\Support\Facades\Hash;
class AuthController extends Controller {
 public function register(Request $request): JsonResponse { $data=$request->validate(['name'=>'required|string|max:255','email'=>'required|email|unique:users,email','password'=>'required|string|min:8|confirmed']); $user=User::create(['name'=>$data['name'],'email'=>$data['email'],'password'=>Hash::make($data['password'])]); return response()->json(['success'=>true,'data'=>['user'=>$user,'token'=>auth('api')->login($user),'token_type'=>'Bearer']],201); }
 public function login(Request $request): JsonResponse { $data=$request->validate(['email'=>'required|email','password'=>'required|string']); if(!$token=auth('api')->attempt($data)) return response()->json(['success'=>false,'message'=>'Credenciales incorrectas'],401); return response()->json(['success'=>true,'data'=>['user'=>auth('api')->user(),'token'=>$token,'token_type'=>'Bearer']]); }
 public function me(): JsonResponse{return response()->json(['success'=>true,'data'=>auth('api')->user()]);}
 public function logout(): JsonResponse{auth('api')->logout();return response()->json(['success'=>true,'message'=>'Sesión cerrada']);}
}
