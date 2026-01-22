<?php

namespace App\Http\Controllers;

use App\Models\Report;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'target' => 'required|in:Livre,Utilisateur',
            'target_id' => 'required|string',
            'reason' => 'required|string',
        ]);

        $report = Report::create([
            'target' => $request->target,
            'target_id' => $request->target_id,
            'reason' => $request->reason,
        ]);

        return response()->json($report, 201);
    }
}
