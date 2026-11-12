<?php
namespace App\Services;
use App\Models\{Order,Product};
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
class OrderService {
 public function create(int $userId, array $payload): Order {
  return DB::transaction(function() use($userId,$payload) {
   $lines=[]; $total=0.0;
   foreach($payload['items'] as $line) {
    $product=Product::whereKey($line['product_id'])->where('is_active',true)->lockForUpdate()->first();
    if(!$product || $product->stock < $line['quantity']) throw ValidationException::withMessages(['items'=>'Stock insuficiente.']);
    $subtotal=round((float)$product->price*(int)$line['quantity'],2); $total+=$subtotal;
    $lines[]=['product_id'=>$product->id,'quantity'=>$line['quantity'],'price'=>$product->price,'subtotal'=>$subtotal];
    $product->decrement('stock',$line['quantity']);
   }
   $order=Order::create(['user_id'=>$userId,'total'=>round($total,2),'status'=>'pending']);
   $order->items()->createMany($lines); return $order->load('items.product');
  });
 }
 public function cancel(Order $order): Order {
  return DB::transaction(function() use($order) {
   if($order->status!=='pending') throw ValidationException::withMessages(['order'=>'La orden no puede cancelarse.']);
   foreach($order->items as $item) Product::whereKey($item->product_id)->lockForUpdate()->increment('stock',$item->quantity);
   $order->update(['status'=>'cancelled']); return $order->fresh('items.product');
  });
 }
}
