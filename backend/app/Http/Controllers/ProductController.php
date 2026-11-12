<?php
namespace App\Http\Controllers;
use App\Models\Product;
use Illuminate\Http\{JsonResponse,Request};
class ProductController extends Controller {
 public function index(): JsonResponse{return response()->json(['success'=>true,'data'=>Product::where('is_active',true)->latest()->paginate(15)]);}
 public function show(Product $product): JsonResponse{abort_unless($product->is_active,404);return response()->json(['success'=>true,'data'=>$product]);}
 public function store(Request $request): JsonResponse{$product=Product::create($request->validate(['name'=>'required|string|max:255','description'=>'nullable|string','price'=>'required|numeric|min:0','stock'=>'required|integer|min:0','is_active'=>'sometimes|boolean']));return response()->json(['success'=>true,'data'=>$product],201);}
 public function update(Request $request,Product $product): JsonResponse{$product->update($request->validate(['name'=>'sometimes|string|max:255','description'=>'nullable|string','price'=>'sometimes|numeric|min:0','stock'=>'sometimes|integer|min:0','is_active'=>'sometimes|boolean']));return response()->json(['success'=>true,'data'=>$product->fresh()]);}
 public function destroy(Product $product): JsonResponse{$product->update(['is_active'=>false]);return response()->json(['success'=>true,'message'=>'Producto desactivado']);}
}
