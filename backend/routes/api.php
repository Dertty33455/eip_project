<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BookController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\WalletController;
use App\Http\Controllers\Api\TransactionController;
use App\Http\Controllers\Api\OrderItemController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\CartItemController;
use App\Http\Controllers\Api\InvoiceController;
use App\Http\Controllers\Api\AudiobookController;
use App\Http\Controllers\Api\AudioChapterController;
use App\Http\Controllers\Api\AudioProgressController;
use App\Http\Controllers\Api\SubscriptionController;
use App\Http\Controllers\Api\SubscriptionPricingController;
use App\Http\Controllers\Api\PostController;
use App\Http\Controllers\Api\CommentController;
use App\Http\Controllers\Api\LikeController;
use App\Http\Controllers\Api\ShareController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\FollowController;
use App\Http\Controllers\Api\MessageController;
use App\Http\Controllers\Api\ConversationController;
use App\Http\Controllers\Api\ConversationParticipantController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\FavoriteController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\SettingController;
use App\Http\Controllers\Api\AnalyticsController;

// public endpoints
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

// public resources
Route::get('/books', [BookController::class, 'index']);

// protected routes (Sanctum)
Route::middleware('auth:sanctum')->group(function () {
    // Auth endpoints
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::patch('/auth/me', [AuthController::class, 'updateProfile']);

    Route::post('/books', [BookController::class, 'store']);

    // generic resource routes (you can restrict methods as needed)
    Route::apiResource('categories', CategoryController::class);
    Route::apiResource('orders', OrderController::class);
    Route::apiResource('wallets', WalletController::class);
    Route::apiResource('transactions', TransactionController::class);
    Route::apiResource('order-items', OrderItemController::class);
    Route::apiResource('carts', CartController::class);
    Route::apiResource('cart-items', CartItemController::class);
    Route::apiResource('invoices', InvoiceController::class);
    Route::apiResource('audiobooks', AudiobookController::class);
    Route::apiResource('audio-chapters', AudioChapterController::class);
    Route::apiResource('audio-progress', AudioProgressController::class);
    Route::apiResource('subscriptions', SubscriptionController::class);
    Route::apiResource('subscription-pricings', SubscriptionPricingController::class);
    Route::apiResource('posts', PostController::class);
    Route::apiResource('comments', CommentController::class);
    Route::apiResource('likes', LikeController::class);
    Route::apiResource('shares', ShareController::class);
    Route::apiResource('reports', ReportController::class);
    Route::apiResource('follows', FollowController::class);
    Route::apiResource('messages', MessageController::class);
    Route::apiResource('conversations', ConversationController::class);
    Route::apiResource('conversation-participants', ConversationParticipantController::class);
    Route::apiResource('notifications', NotificationController::class);
    Route::apiResource('favorites', FavoriteController::class);
    Route::apiResource('reviews', ReviewController::class);
    Route::apiResource('settings', SettingController::class);
    Route::apiResource('analytics', AnalyticsController::class);
});
