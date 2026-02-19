<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});
// Placeholder login route to prevent RouteNotFoundException
Route::get('/login', function () {
    return response()->json(['message' => 'Login page placeholder.'], 401);
})->name('login');
