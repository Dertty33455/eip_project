<?php

namespace App\Services;

use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class PmfCohortService
{
    /**
     * PMF target percentage.
     */
    public const PMF_TARGET = 75;

    /**
     * Get the full cohort heatmap data.
     *
     * @param int $maxRelativeWeeks Maximum number of relative weeks to show (columns).
     * @return array{pmf_target: int, cohorts: array}
     */
    public function getCohortData(int $maxRelativeWeeks = 12): array
    {
        $now = Carbon::now();
        $driver = DB::getDriverName();

        // 1. Find the earliest user signup to determine first cohort
        $firstUser = DB::table('users')->orderBy('created_at')->first();

        if (!$firstUser) {
            return [
                'pmf_target' => self::PMF_TARGET,
                'cohorts' => [],
            ];
        }

        $firstSignup = Carbon::parse($firstUser->created_at)->startOfWeek(Carbon::MONDAY);
        $currentWeekStart = $now->copy()->startOfWeek(Carbon::MONDAY);

        // 2. Build cohort weeks list
        $cohortWeeks = [];
        $weekCursor = $firstSignup->copy();
        while ($weekCursor->lte($currentWeekStart)) {
            $cohortWeeks[] = $weekCursor->copy();
            $weekCursor->addWeek();
        }

        // 3. Get user counts per cohort week
        $userCounts = $this->getUserCountsByCohort($driver);

        // 4. Get active users (audio.played) per cohort + relative week
        $activityData = $this->getAudioActivityByCohort($driver);

        // 5. Build the response structure
        $cohorts = [];

        foreach ($cohortWeeks as $cohortStart) {
            $cohortKey = $cohortStart->format('Y-m-d');
            $cohortEnd = $cohortStart->copy()->endOfWeek(Carbon::SUNDAY);
            $weekNumber = (int) $cohortStart->format('W');
            $totalUsers = $userCounts[$cohortKey] ?? 0;

            $weeks = [];
            for ($rw = 0; $rw < $maxRelativeWeeks; $rw++) {
                $relativeWeekStart = $cohortStart->copy()->addWeeks($rw);
                $relativeWeekEnd = $relativeWeekStart->copy()->addDays(6)->endOfDay();

                // If this relative week hasn't started yet, values are null
                if ($relativeWeekStart->gt($now)) {
                    $weeks[] = [
                        'relative_week' => $rw,
                        'active_users'  => null,
                        'total_users'   => $totalUsers,
                        'percentage'    => null,
                    ];
                    continue;
                }

                // If cohort has 0 users, all values are null
                if ($totalUsers === 0) {
                    $weeks[] = [
                        'relative_week' => $rw,
                        'active_users'  => null,
                        'total_users'   => 0,
                        'percentage'    => null,
                    ];
                    continue;
                }

                // Look up active users for this cohort + relative week
                $activeUsers = $activityData[$cohortKey][$rw] ?? 0;

                // If relative week is not fully elapsed, still show partial data
                $percentage = round(($activeUsers / $totalUsers) * 100, 2);

                $weeks[] = [
                    'relative_week' => $rw,
                    'active_users'  => $activeUsers,
                    'total_users'   => $totalUsers,
                    'percentage'    => $percentage,
                ];
            }

            $cohorts[] = [
                'cohort_week'  => $cohortKey,
                'cohort_label' => 'Sem. ' . $weekNumber . ' (' . $cohortStart->translatedFormat('d M') . ')',
                'total_users'  => $totalUsers,
                'weeks'        => $weeks,
            ];
        }

        return [
            'pmf_target' => self::PMF_TARGET,
            'cohorts'    => $cohorts,
        ];
    }

    /**
     * Get the PMF score for the latest completed cohort (7 days elapsed).
     *
     * @return array
     */
    public function getPmfScore(): array
    {
        $now = Carbon::now();
        $driver = DB::getDriverName();

        // Latest cohort that has had 7 full days
        $latestCohortStart = $now->copy()->subDays(7)->startOfWeek(Carbon::MONDAY);

        // If the latest cohort week hasn't finished its 7-day window, go back one more week
        $cohortEnd = $latestCohortStart->copy()->endOfWeek(Carbon::SUNDAY);
        if ($cohortEnd->copy()->addDays(7)->gt($now)) {
            $latestCohortStart->subWeek();
        }

        $cohortKey = $latestCohortStart->format('Y-m-d');
        $cohortEndDate = $latestCohortStart->copy()->endOfWeek(Carbon::SUNDAY);

        // Count users in this cohort
        $totalUsers = DB::table('users')
            ->where('created_at', '>=', $latestCohortStart)
            ->where('created_at', '<=', $cohortEndDate->endOfDay())
            ->count();

        if ($totalUsers === 0) {
            return [
                'pmf_target'          => self::PMF_TARGET,
                'latest_cohort'       => $cohortKey,
                'total_users'         => 0,
                'users_with_audio_7d' => null,
                'score'               => null,
                'target_met'          => null,
            ];
        }

        // Count users who played at least 1 audio within 7 days of signup
        $sevenDaysAfterCohortEnd = $cohortEndDate->copy()->addDays(7);

        $usersWithAudio = DB::table('users as u')
            ->join('user_activities as ua', function ($join) {
                $join->on('ua.user_id', '=', 'u.id')
                     ->where('ua.action', '=', 'audio.played');
            })
            ->where('u.created_at', '>=', $latestCohortStart)
            ->where('u.created_at', '<=', $cohortEndDate->endOfDay())
            ->whereRaw('ua.created_at <= ' . $this->dateAddDays($driver, 'u.created_at', 7))
            ->distinct('u.id')
            ->count('u.id');

        $score = round(($usersWithAudio / $totalUsers) * 100, 2);

        return [
            'pmf_target'          => self::PMF_TARGET,
            'latest_cohort'       => $cohortKey,
            'total_users'         => $totalUsers,
            'users_with_audio_7d' => $usersWithAudio,
            'score'               => $score,
            'target_met'          => $score >= self::PMF_TARGET,
        ];
    }

    /**
     * Get user counts grouped by cohort week.
     */
    private function getUserCountsByCohort(string $driver): array
    {
        $weekExpr = $this->weekStartExpression($driver, 'created_at');

        $rows = DB::table('users')
            ->selectRaw("{$weekExpr} as cohort_week, COUNT(*) as total")
            ->groupByRaw($weekExpr)
            ->get();

        $result = [];
        foreach ($rows as $row) {
            $key = Carbon::parse($row->cohort_week)->format('Y-m-d');
            $result[$key] = (int) $row->total;
        }

        return $result;
    }

    /**
     * Get distinct active users (audio.played) grouped by cohort week + relative week.
     */
    private function getAudioActivityByCohort(string $driver): array
    {
        $cohortWeekExpr = $this->weekStartExpression($driver, 'u.created_at');
        $relativeWeekExpr = $this->relativeWeekExpression($driver);

        $rows = DB::table('users as u')
            ->join('user_activities as ua', function ($join) {
                $join->on('ua.user_id', '=', 'u.id')
                     ->where('ua.action', '=', 'audio.played');
            })
            ->selectRaw("{$cohortWeekExpr} as cohort_week")
            ->selectRaw("{$relativeWeekExpr} as relative_week")
            ->selectRaw('COUNT(DISTINCT u.id) as active_users')
            ->groupByRaw("{$cohortWeekExpr}, {$relativeWeekExpr}")
            ->get();

        $result = [];
        foreach ($rows as $row) {
            $key = Carbon::parse($row->cohort_week)->format('Y-m-d');
            $rw = (int) $row->relative_week;
            $result[$key][$rw] = (int) $row->active_users;
        }

        return $result;
    }

    /**
     * SQL expression for the start of the ISO week (Monday) containing a date column.
     */
    private function weekStartExpression(string $driver, string $column): string
    {
        if ($driver === 'sqlite') {
            // SQLite: compute Monday of the week
            return "DATE({$column}, 'weekday 1', '-7 days')";
        }

        // PostgreSQL / MySQL
        if ($driver === 'pgsql') {
            return "DATE_TRUNC('week', {$column})::date";
        }

        // MySQL
        return "DATE(DATE_SUB({$column}, INTERVAL WEEKDAY({$column}) DAY))";
    }

    /**
     * SQL expression for the relative week number (0-based) between signup and activity.
     */
    private function relativeWeekExpression(string $driver): string
    {
        if ($driver === 'sqlite') {
            return "CAST((JULIANDAY(ua.created_at) - JULIANDAY(u.created_at)) / 7 AS INTEGER)";
        }

        if ($driver === 'pgsql') {
            return "FLOOR(EXTRACT(EPOCH FROM (ua.created_at - u.created_at)) / 604800)::int";
        }

        // MySQL
        return "FLOOR(TIMESTAMPDIFF(SECOND, u.created_at, ua.created_at) / 604800)";
    }

    /**
     * SQL expression to add N days to a date column.
     */
    private function dateAddDays(string $driver, string $column, int $days): string
    {
        if ($driver === 'sqlite') {
            return "DATETIME({$column}, '+{$days} days')";
        }

        if ($driver === 'pgsql') {
            return "({$column} + INTERVAL '{$days} days')";
        }

        // MySQL
        return "DATE_ADD({$column}, INTERVAL {$days} DAY)";
    }
}
