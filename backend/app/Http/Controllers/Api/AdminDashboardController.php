<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Book;
use App\Models\Audiobook;
use App\Models\Order;
use App\Models\Report;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminDashboardController extends Controller
{
    public function stats()
    {
        $now = Carbon::now();
        $startOfMonth = $now->copy()->startOfMonth();
        $startOfLastMonth = $now->copy()->subMonth()->startOfMonth();
        $endOfLastMonth = $now->copy()->subMonth()->endOfMonth();

        // Totals
        $totalUsers = User::count();
        $totalBooks = Book::count();
        $totalAudiobooks = Audiobook::count();
        $totalRevenue = Order::where('status', 'DELIVERED')->sum('total_amount');
        $totalOrders = Order::count();
        $pendingOrders = Order::where('status', 'PENDING')->count();
        $totalReports = Report::where('status', 'PENDING')->count();

        // Growth (Current Month vs Last Month)
        $usersThisMonth = User::where('created_at', '>=', $startOfMonth)->count();
        $usersLastMonth = User::whereBetween('created_at', [$startOfLastMonth, $endOfLastMonth])->count();
        $userGrowth = $this->calculateGrowth($usersThisMonth, $usersLastMonth);

        $booksThisMonth = Book::where('created_at', '>=', $startOfMonth)->count();
        $booksLastMonth = Book::whereBetween('created_at', [$startOfLastMonth, $endOfLastMonth])->count();
        $bookGrowth = $this->calculateGrowth($booksThisMonth, $booksLastMonth);

        $revenueThisMonth = Order::where('status', 'DELIVERED')->where('created_at', '>=', $startOfMonth)->sum('total_amount');
        $revenueLastMonth = Order::where('status', 'DELIVERED')->whereBetween('created_at', [$startOfLastMonth, $endOfLastMonth])->sum('total_amount');
        $revenueGrowth = $this->calculateGrowth($revenueThisMonth, $revenueLastMonth);

        return response()->json([
            'totalUsers' => $totalUsers,
            'totalBooks' => $totalBooks,
            'totalAudiobooks' => $totalAudiobooks,
            'totalRevenue' => $totalRevenue,
            'totalOrders' => $totalOrders,
            'pendingOrders' => $pendingOrders,
            'totalReports' => $totalReports,
            'userGrowth' => $userGrowth,
            'bookGrowth' => $bookGrowth,
            'revenueGrowth' => $revenueGrowth,
        ]);
    }

    public function topBooks()
    {
        // Simple top books by sales (order items)
        $topBooks = DB::table('order_items')
            ->join('books', 'order_items.book_id', '=', 'books.id')
            ->select('books.id', 'books.title', 'books.author', DB::raw('SUM(order_items.quantity) as sales'), DB::raw('SUM(order_items.total_price) as revenue'))
            ->groupBy('books.id', 'books.title', 'books.author')
            ->orderByDesc('sales')
            ->take(5)
            ->get();

        return response()->json($topBooks);
    }

    private function calculateGrowth($current, $previous)
    {
        if ($previous == 0) {
            return $current > 0 ? 100 : 0;
        }

        return round((($current - $previous) / $previous) * 100, 1);
    }
}
