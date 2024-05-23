<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;

Route::get('/hello', function () {
    return response()->json('Hello World', 200);
});

Route::post('/hello', function () {
    return response()->json('Hello World Postx', 200);
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
