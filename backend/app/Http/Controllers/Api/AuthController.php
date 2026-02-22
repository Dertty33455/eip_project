<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        // Accept both camelCase (from frontend) and snake_case (conventions)
        $input = $request->all();
        $input['first_name'] = $input['first_name'] ?? $input['firstName'] ?? null;
        $input['last_name'] = $input['last_name'] ?? $input['lastName'] ?? null;

        $validator = Validator::make($input, [
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'username' => 'required|string|unique:users,username',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $validator->validated();
        $user = User::create([
            'first_name' => $data['first_name'],
            'last_name' => $data['last_name'],
            'username' => $data['username'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
        ]);

        $token = $user->createToken('api_token')->plainTextToken;

        $user->load('wallet','books','ordersAsBuyer','ordersAsSeller','notifications','favorites');
        return response()->json(['user' => $user, 'token' => $token], 201);
    }

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::where('email', $request->email)->first();
        if (! $user || ! Hash::check($request->password, $user->password)) {
            return response()->json(['error' => 'Invalid credentials'], 401);
        }

        $token = $user->createToken('api_token')->plainTextToken;
        $user->load('wallet','books','ordersAsBuyer','ordersAsSeller','notifications','favorites');
        return response()->json(['user' => $user, 'token' => $token]);
    }

    public function me(Request $request)
    {
        $user = $request->user()->load('wallet','books','ordersAsBuyer','ordersAsSeller','notifications','favorites');
        return response()->json(['user' => $user]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out successfully']);
    }

    public function redirectToGoogle()
    {
        // This starts the OAuth flow. we use stateless because the SPA
        // doesn't maintain Laravel session state.
        return Socialite::driver('google')->stateless()->redirect();
    }

    public function handleGoogleCallback(Request $request)
    {
        try {
            $socialUser = Socialite::driver('google')->stateless()->user();
        } catch (\Exception $e) {
            return response()->json(['error' => 'Unable to authenticate with Google'], 400);
        }

        // create or update local user record
        $user = User::firstOrCreate(
            ['email' => $socialUser->getEmail()],
            [
                'first_name' => $this->splitName($socialUser->getName())['first'],
                'last_name' => $this->splitName($socialUser->getName())['last'],
                'username' => Str::slug($socialUser->getNickname() ?? $socialUser->getName(), '_') ?: 'user_'.Str::random(6),
                'password' => Hash::make(Str::random(16)), // random password since login is via Google
            ]
        );

        $token = $user->createToken('api_token')->plainTextToken;
        $user->load('wallet','books','ordersAsBuyer','ordersAsSeller','notifications','favorites');

        // redirect back to frontend with token in query string
        $frontend = config('app.frontend_url', env('FRONTEND_URL', 'http://localhost:3000'));
        return redirect($frontend . '/auth/callback?token=' . $token);
    }

    /**
     * Helper to split a full name into first/last.
     */
    protected function splitName($name)
    {
        $parts = explode(' ', trim($name));
        if (count($parts) === 1) {
            return ['first' => $parts[0], 'last' => ''];
        }
        $first = array_shift($parts);
        $last = implode(' ', $parts);
        return ['first' => $first, 'last' => $last];
    }

    public function updateProfile(Request $request)
    {
        // Handle both camelCase and snake_case field names
        $input = $request->all();
        $input['first_name'] = $input['first_name'] ?? $input['firstName'] ?? null;
        $input['last_name'] = $input['last_name'] ?? $input['lastName'] ?? null;

        $validator = Validator::make($input, [
            'first_name' => 'sometimes|string|max:255',
            'last_name' => 'sometimes|string|max:255',
            'username' => 'sometimes|string|unique:users,username,' . $request->user()->id,
            'email' => 'sometimes|email|unique:users,email,' . $request->user()->id,
            'bio' => 'sometimes|string|max:1000',
            'avatar' => 'sometimes|url',
            'phone' => 'sometimes|string|max:20',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $validator->validated();
        
        // Map snake_case back to database columns
        $updateData = [];
        if (isset($data['first_name'])) $updateData['first_name'] = $data['first_name'];
        if (isset($data['last_name'])) $updateData['last_name'] = $data['last_name'];
        if (isset($data['username'])) $updateData['username'] = $data['username'];
        if (isset($data['email'])) $updateData['email'] = $data['email'];
        if (isset($data['bio'])) $updateData['bio'] = $data['bio'];
        if (isset($data['avatar'])) $updateData['avatar'] = $data['avatar'];
        if (isset($data['phone'])) $updateData['phone'] = $data['phone'];

        $user = $request->user();
        $user->update($updateData);

        $user->load('wallet','books','ordersAsBuyer','ordersAsSeller','notifications','favorites');
        return response()->json(['user' => $user, 'message' => 'Profile updated successfully']);
    }
}

