<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Cart;
use App\Models\CartItem;

class CartController extends Controller
{
    public function index(Request $request)
    {
        $cart = $this->getCart($request);

        if (!$cart) {
            return response()->json(['message' => 'Cart not found'], 404);
        }

        return response()->json($cart->load('items.product'));
    }

    public function addItem(Request $request)
    {
        $validatedData = $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $cart = $this->getCart($request);

        if (!$cart) {
            return response()->json(['message' => 'Unable to find or create cart'], 500);
        }

        $item = $cart->items()->where('product_id', $validatedData['product_id'])->first();

        if ($item) {
            $item->quantity += $validatedData['quantity'];
            $item->save();
        } else {
            $cart->items()->create($validatedData);
        }

        return response()->json($cart->load('items.product'));
    }

    public function updateItem(Request $request, $itemId)
    {
        $validatedData = $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        $cart = $this->getCart($request);

        if (!$cart) {
            return response()->json(['message' => 'Cart not found'], 404);
        }

        $item = $cart->items()->find($itemId);

        if (!$item) {
            return response()->json(['message' => 'Item not found'], 404);
        }

        $item->quantity = $validatedData['quantity'];
        $item->save();

        return response()->json($cart->load('items.product'));
    }

    public function removeItem(Request $request, $itemId)
    {
        $cart = $this->getCart($request);

        if (!$cart) {
            return response()->json(['message' => 'Cart not found'], 404);
        }

        $item = $cart->items()->find($itemId);

        if (!$item) {
            return response()->json(['message' => 'Item not found'], 404);
        }

        $item->delete();

        return response()->json($cart->load('items.product'));
    }

    protected function getCart(Request $request)
    {
        if ($request->user()) {
            $cart = Cart::firstOrCreate(['user_id' => $request->user()->id]);
        } else {
            $token = $request->header('Authorization');
            if ($token) {
                $token = str_replace('Bearer ', '', $token);
                $cart = Cart::firstOrCreate(['token' => $token]);
            } else {
                $token = bin2hex(random_bytes(32));
                $cart = Cart::create(['token' => $token]);
                $request->headers->set('Authorization', 'Bearer ' . $token);
            }
        }

        return $cart;
    }

    public function getAllCartsForAdmin(Request $request)
    {
        if ($request->user() && $request->user()->role === 'admin') {
            $carts = Cart::with('items.product')->get();
            return response()->json($carts);
        } else {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
    }
}
