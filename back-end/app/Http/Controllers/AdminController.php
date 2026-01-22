<?php

namespace App\Http\Controllers;

use App\Models\Report;
use App\Models\User;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function listUsers()
    {
        $users = User::all();
        return response()->json($users);
    }

    public function setUserRole(Request $request, $userId)
    {
        $request->validate([
            'role' => 'required|in:user,admin',
        ]);

        $user = User::findOrFail($userId);
        $user->update(['role' => $request->role]);

        return response()->json($user);
    }

    public function setUserBlocked(Request $request, $userId)
    {
        $request->validate([
            'is_blocked' => 'required|boolean',
        ]);

        $user = User::findOrFail($userId);
        $user->update(['is_blocked' => $request->is_blocked]);

        return response()->json($user);
    }

    public function listReports()
    {
        $reports = Report::orderBy('created_at', 'desc')->get();
        return response()->json($reports);
    }

    public function resolveReport($reportId)
    {
        $report = Report::findOrFail($reportId);
        $report->update(['status' => 'Traité']);

        return response()->json(['message' => 'Report resolved']);
    }
}
