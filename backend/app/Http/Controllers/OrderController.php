<?php
namespace App\Http\Controllers;
use App\Http\Requests\StoreOrderRequest;
use App\Models\Order;
use App\Services\OrderService;
use Illuminate\Http\JsonResponse;
class OrderController extends Controller {
 public function __construct(private OrderService $orders) {}
 public function index(): JsonResponse { return response()->json(['success'=>true,'data'=>auth('api')->user()->orders()->with(['items.product','payment'])->latest()->paginate(15)]); }
 public function store(StoreOrderRequest $request): JsonResponse { $order=$this->orders->create(auth('api')->id(),$request->validated()); return response()->json(['success'=>true,'message'=>'Orden creada','data'=>$order],201); }
 public function show(Order $order): JsonResponse { abort_unless($order->user_id===auth('api')->id(),404); return response()->json(['success'=>true,'data'=>$order->load(['items.product','payment'])]); }
 public function cancel(Order $order): JsonResponse { abort_unless($order->user_id===auth('api')->id(),404); return response()->json(['success'=>true,'message'=>'Orden cancelada','data'=>$this->orders->cancel($order)]); }
}
