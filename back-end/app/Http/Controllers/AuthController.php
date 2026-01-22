<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'email' => 'required_without:phone|email|unique:users,email',
            'phone' => 'required_without:email|string|unique:users,phone',
            'password' => 'required|string|min:6',
            'display_name' => 'required|string|max:255',
        ]);

        $user = User::create([
            'name' => $request->display_name,
            'display_name' => $request->display_name,
            'email' => $request->email,
            'phone' => $request->phone,
            'password' => Hash::make($request->password),
            'role' => 'user',
            'is_blocked' => false,
            'joined_at' => now(),
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;
        
        return response()->json([
            'user' => [
                'id' => $user->id,
                'role' => $user->role,
                'isBlocked' => $user->is_blocked,
                'displayName' => $user->display_name,
                'email' => $user->email,
                'phone' => $user->phone,
                'location' => $user->location,
                'avatarUrl' => $user->avatar_url,
                'joinedAtISO' => $user->joined_at ? $user->joined_at->toISOString() : null,
            ],
            'token' => $token,
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'identifier' => 'required|string',
            'password' => 'required|string',
        ]);

        $identifier = trim($request->identifier);

        $user = User::where('email', $identifier)
            ->orWhere('phone', $identifier)
            ->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'identifier' => ['Identifiants invalides.'],
            ]);
        }

        if ($user->is_blocked) {
            return response()->json(['error' => 'Compte bloqué. Contactez le support.'], 403);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => [
                'id' => $user->id,
                'role' => $user->role,
                'isBlocked' => $user->is_blocked,
                'displayName' => $user->display_name,
                'email' => $user->email,
                'phone' => $user->phone,
                'location' => $user->location,
                'avatarUrl' => $user->avatar_url,
                'joinedAtISO' => $user->joined_at ? $user->joined_at->toISOString() : null,
            ],
            'token' => $token,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Déconnexion réussie']);
    }

    public function updateProfile(Request $request, $userId)
    {
        // Authorization: Users can only update their own profile, or admins can update any profile
        if ($userId != $request->user()->id && $request->user()->role !== 'admin') {
            return response()->json(['error' => 'Non autorisé'], 403);
        }

        $user = User::findOrFail($userId);

        $request->validate([
            'display_name' => 'sometimes|string|max:255',
            'phone' => 'sometimes|string|nullable|unique:users,phone,' . $userId,
            'location' => 'sometimes|string|nullable',
            'avatar_url' => 'sometimes|string|nullable',
        ]);

        $user->update($request->only(['display_name', 'phone', 'location', 'avatar_url']));

        return response()->json([
            'id' => $user->id,
            'role' => $user->role,
            'isBlocked' => $user->is_blocked,
            'displayName' => $user->display_name,
            'email' => $user->email,
            'phone' => $user->phone,
            'location' => $user->location,
            'avatarUrl' => $user->avatar_url,
            'joinedAtISO' => $user->joined_at ? $user->joined_at->toISOString() : null,
        ]);
    }
}
