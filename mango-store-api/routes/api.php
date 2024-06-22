<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\UserProfileController;
use App\Http\Controllers\VendorDetailController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\OrderDetailController;
use App\Http\Controllers\CartController;

Route::get('/hello', function () {
    return response()->json('Hello World', 200);
});

Route::post('/hello', function () {
    return response()->json('Hello World Post', 200);
})->middleware(['jwt.cookie', 'role:Admin']);

Route::group([
    'middleware' => 'api',
    'prefix' => 'auth'
], function () {
    Route::post('/register', [AuthController::class, 'register'])->name('register');
    Route::post('/login', [AuthController::class, 'login'])->name('login');
    Route::post('/logout', [AuthController::class, 'logout'])->middleware(['jwt.cookie'])->name('logout');
    Route::post('/refresh', [AuthController::class, 'refresh'])->middleware(['jwt.cookie'])->name('refresh');
    Route::post('/me', [AuthController::class, 'me'])->middleware(['jwt.cookie'])->name('me');
    Route::delete('/user/{id}', [AuthController::class, 'deleteUser'])->middleware(['jwt.cookie', 'role:Admin'])->name('deleteUser');
});

// Product Routes
Route::group([
    'middleware' => 'api',
    'prefix' => 'products'
], function () {
    Route::get('/', [ProductController::class, 'index']); // List all products
    Route::get('/search', [ProductController::class, 'search'])->name('products.search');
    Route::post('/', [ProductController::class, 'store'])
        ->middleware(['jwt.cookie', 'role:vendor|admin'])
        ->name('products.store'); // Create a new product
    Route::put('/{product}', [ProductController::class, 'update'])
        ->middleware(['jwt.cookie', 'role:vendor|admin'])
        ->name('products.update'); // Update a specific product
    Route::delete('/{product}', [ProductController::class, 'destroy'])
        ->middleware(['jwt.cookie', 'role:vendor|admin'])
        ->name('products.destroy'); // Delete a specific product
});

// User Profile Routes with Middleware
Route::group([
    'middleware' => ['api', 'jwt.cookie'],
], function () {
    Route::put('user-profiles/{user_id}', [UserProfileController::class, 'update']);
    Route::get('user-profiles/by-user/{user_id}', [UserProfileController::class, 'showByUserId']);
    Route::put('vendor-details/{user_id}', [VendorDetailController::class, 'update']);
    Route::get('vendor-details/by-user/{user_id}', [VendorDetailController::class, 'showByUserId']);
});

Route::group([
    'middleware' => ['api', 'jwt.cookie'],
], function () {
    Route::resource('orders', OrderController::class);
    Route::get('orders/search/user/{userId}', [OrderController::class, 'searchByUserId']);
    Route::resource('orderdetails', OrderDetailController::class);
    Route::get('orderdetails/search/order/{orderId}', [OrderDetailController::class, 'searchByOrderId']);
    Route::get('cart', [CartController::class, 'index']);
    Route::post('cart/add', [CartController::class, 'addItem']);
    Route::get('carts', [CartController::class, 'getAllCartsForAdmin'])->middleware(['role:admin']);
    Route::put('cart/update/{itemId}', [CartController::class, 'updateItem']); // New route for updating cart item
    Route::delete('cart/remove/{itemId}', [CartController::class, 'removeItem']);
    Route::post('checkout', [OrderController::class, 'checkout']);
});
