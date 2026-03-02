<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\UserActivity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class UserActivityController extends Controller
{
    /**
     * List the authenticated user's activities (paginated, filterable by action).
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $query = UserActivity::where('user_id', $user->id)
            ->orderBy('created_at', 'desc');

        // Optional filter by action
        if ($action = $request->query('action')) {
            $query->where('action', $action);
        }

        // Optional filter by target_type
        if ($targetType = $request->query('target_type')) {
            $query->where('target_type', $targetType);
        }

        $limit = (int) $request->query('limit', 20);
        $limit = max(1, min($limit, 100));

        return response()->json($query->paginate($limit));
    }

    /**
     * Get aggregated activity stats for the authenticated user.
     */
    public function stats(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $stats = UserActivity::where('user_id', $user->id)
            ->select('action', DB::raw('COUNT(*) as count'))
            ->groupBy('action')
            ->orderByDesc('count')
            ->get();

        $total = $stats->sum('count');

        return response()->json([
            'total' => $total,
            'by_action' => $stats,
        ]);
    }
}
