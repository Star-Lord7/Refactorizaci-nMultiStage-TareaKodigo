<?php
namespace App\Http\Controllers;
use App\Models\{Order,Payment};
use Illuminate\Http\{JsonResponse,Request};
use Stripe\StripeClient;
use Stripe\Webhook;
class PaymentController extends Controller {
 public function createIntent(Order $order): JsonResponse { abort_unless($order->user_id===auth('api')->id(),404); abort_if($order->status!=='pending',422,'La orden no puede pagarse.'); $order->load('payment'); $stripe=new StripeClient(config('services.stripe.secret')); $intent=$stripe->paymentIntents->create(['amount'=>(int)round((float)$order->total*100),'currency'=>'eur','metadata'=>['order_id'=>(string)$order->id]],['idempotency_key'=>'order-'.$order->id]); $payment=Payment::updateOrCreate(['order_id'=>$order->id],['stripe_payment_intent_id'=>$intent->id,'amount'=>$intent->amount,'currency'=>$intent->currency,'status'=>$intent->status]); return response()->json(['success'=>true,'data'=>['client_secret'=>$intent->client_secret,'payment'=>$payment]]); }
 public function webhook(Request $request): mixed { try{$event=Webhook::constructEvent($request->getContent(),$request->header('Stripe-Signature'),config('services.stripe.webhook_secret'));}catch(\Throwable){return response('Invalid webhook',400);} $intent=$event->data->object; $payment=Payment::where('stripe_payment_intent_id',$intent->id)->first(); if($payment && $event->type==='payment_intent.succeeded'){ $payment->update(['status'=>'succeeded']); $payment->order()->where('status','pending')->update(['status'=>'paid']); } return response('ok'); }
}
