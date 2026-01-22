<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BookController;
use App\Http\Controllers\ConversationController;
use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ReportController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/books', [BookController::class, 'index']);
Route::get('/books/{id}', [BookController::class, 'show']);

// Protected routes (require authentication)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::put('/users/{userId}/profile', [AuthController::class, 'updateProfile']);

    // Book management
    Route::post('/books', [BookController::class, 'store']);
    Route::put('/books/{id}', [BookController::class, 'update']);
    Route::delete('/books/{id}', [BookController::class, 'destroy']);

    // Favorites
    Route::get('/users/{userId}/favorites', [FavoriteController::class, 'getFavorites']);
    Route::post('/users/{userId}/favorites/{bookId}/toggle', [FavoriteController::class, 'toggleFavorite']);

    // Conversations
    Route::get('/users/{userId}/conversations', [ConversationController::class, 'index']);
    Route::post('/conversations/get-or-create', [ConversationController::class, 'getOrCreate']);
    Route::post('/conversations/{conversationId}/mark-read', [ConversationController::class, 'markRead']);

    // Messages
    Route::get('/conversations/{conversationId}/messages', [MessageController::class, 'index']);
    Route::post('/messages', [MessageController::class, 'store']);

    // Orders
    Route::get('/users/{userId}/orders', [OrderController::class, 'index']);
    Route::post('/orders', [OrderController::class, 'store']);

    // Reports
    Route::post('/reports', [ReportController::class, 'store']);
});

// Admin routes (require authentication + admin role)
Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    Route::get('/users', [AdminController::class, 'listUsers']);
    Route::put('/users/{userId}/role', [AdminController::class, 'setUserRole']);
    Route::put('/users/{userId}/blocked', [AdminController::class, 'setUserBlocked']);
    Route::get('/reports', [AdminController::class, 'listReports']);
    Route::post('/reports/{reportId}/resolve', [AdminController::class, 'resolveReport']);
});