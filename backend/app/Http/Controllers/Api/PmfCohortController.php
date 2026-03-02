<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\PmfCohortService;
use Illuminate\Http\Request;

class PmfCohortController extends Controller
{
    protected PmfCohortService $pmfService;

    public function __construct(PmfCohortService $pmfService)
    {
        $this->pmfService = $pmfService;
    }

    /**
     * Get the full cohort heatmap data for PMF analysis.
     *
     * Query params:
     *   - weeks: max relative weeks to display (default 12)
     */
    public function cohorts(Request $request)
    {
        $maxWeeks = (int) $request->query('weeks', 12);
        $maxWeeks = max(1, min($maxWeeks, 52));

        $data = $this->pmfService->getCohortData($maxWeeks);

        return response()->json($data);
    }

    /**
     * Get the current PMF score based on the latest completed cohort.
     */
    public function score()
    {
        $data = $this->pmfService->getPmfScore();

        return response()->json($data);
    }
}
