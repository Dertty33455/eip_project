<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Follow;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Display a public profile by username.
     *
     * Responses roughly match the shape expected by the frontend.
     */
    public function show($username)
    {
        $user = User::where('username', $username)->first();
        if (! $user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        // compute simple stats
        $booksListed = $user->books()->count();
        $booksSold = $user->ordersAsSeller()->where('status', 'completed')->count();
        $followers = Follow::where('following_id', $user->id)->count();
        $following = Follow::where('follower_id', $user->id)->count();
        $reviewCount = $user->reviews()->count();

        // load a few relations used by the UI
        $recentPosts = $user->posts()->orderBy('created_at', 'desc')->take(5)->get();
        $listedBooks = $user->books()->get();

        return response()->json([
            'id' => $user->id,
            'username' => $user->username,
            'firstName' => $user->first_name,
            'lastName' => $user->last_name,
            'bio' => $user->bio,
            'avatar' => $user->avatar,
            'coverImage' => $user->cover_image ?? null,
            'email' => $user->email,
            'phone' => $user->phone,
            'city' => $user->location,
            'country' => $user->country,
            'isVerified' => $user->is_verified_seller,
            'isSeller' => $user->role === 'SELLER',
            'createdAt' => $user->created_at->toDateString(),
            'stats' => [
                'booksListed' => $booksListed,
                'booksSold' => $booksSold,
                'followers' => $followers,
                'following' => $following,
                'rating' => $user->rating,
                'reviewCount' => $reviewCount,
            ],
            'badges' => [], // badges not implemented in backend yet
            'recentPosts' => $recentPosts,
            'listedBooks' => $listedBooks,
            'favoriteAudiobooks' => [],
        ]);
    }
}
