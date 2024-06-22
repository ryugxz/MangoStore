<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderDetail;
use App\Models\Cart;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $orders = Order::all();
        return response()->json($orders);
    }
    

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'user_id' => 'required|exists:users,id',
            'total_price' => 'required|numeric',
            'status' => 'required|string',
            'order_details' => 'required|array',
            'order_details.*.product_id' => 'required|exists:products,id',
            'order_details.*.quantity' => 'required|integer',
            'order_details.*.price' => 'required|numeric'
        ]);
    
        // Create the order without the order details
        $orderData = $validatedData;
        unset($orderData['order_details']);
        $order = Order::create($orderData);
    
        // Create each order detail
        foreach ($validatedData['order_details'] as $detail) {
            $order->orderDetails()->create($detail);
        }
    
        return response()->json($order->load('orderDetails.product'), 201);
    }
    

    /**
     * Display the specified resource.
     */
    public function show(Order $order)
    {
        return response()->json($order->load('orderDetails.product'));
    }
    

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Order $order)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Order $order)
    {
        $validatedData = $request->validate([
            'total_price' => 'required|numeric',
            'status' => 'required|string',
            'order_details' => 'sometimes|array',
            'order_details.*.id' => 'sometimes|exists:orderdetails,id',
            'order_details.*.product_id' => 'required|exists:products,id',
            'order_details.*.quantity' => 'required|integer',
            'order_details.*.price' => 'required|numeric'
        ]);
    
        $order->update($validatedData);
    
        if ($request->has('order_details')) {
            foreach ($request->order_details as $detail) {
                if (isset($detail['id'])) {
                    $orderDetail = OrderDetail::find($detail['id']);
                    $orderDetail->update($detail);
                } else {
                    $order->orderDetails()->create($detail);
                }
            }
        }
    
        return response()->json($order);
    }
    

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Order $order)
    {
        $order->orderDetails()->delete();
        $order->delete();
    
        return response()->json(null, 204);
    }


     public function searchByUserId($userId)
    {
        $orders = Order::where('user_id', $userId)->with('orderDetails.product')->get();
        return response()->json($orders);
    }

    public function checkout(Request $request)
    {
        $cart = $this->getCart($request);

        if ($cart->items()->count() == 0) {
            return response()->json(['error' => 'Cart is empty'], 400);
        }

        $order = Order::create([
            'user_id' => $request->user() ? $request->user()->id : null,
            'total_price' => $cart->items->sum(fn($item) => $item->quantity * $item->product->price),
            'status' => 'pending',
        ]);

        foreach ($cart->items as $item) {
            OrderDetail::create([
                'order_id' => $order->id,
                'product_id' => $item->product_id,
                'quantity' => $item->quantity,
                'price' => $item->product->price,
            ]);
        }

        $cart->items()->delete();

        return response()->json($order->load('orderDetails.product'), 201);
    }

    protected function getCart(Request $request)
    {
        if ($request->user()) {
            return Cart::where('user_id', $request->user()->id)->firstOrFail();
        }

        return Cart::where('session_id', $request->session()->getId())->firstOrFail();
    }
    
}
