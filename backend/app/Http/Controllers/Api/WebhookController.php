<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\PaymentService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class WebhookController extends Controller
{
    public function mtn(Request $request, PaymentService $payments)
    {
        if ($request->method() === 'GET') {
            return response()->json(['message' => 'MTN webhook endpoint'], 200);
        }

        $data = $request->all();
        $referenceId = $data['referenceId'] ?? $data['externalId'] ?? null;
        $status = $data['status'] ?? $data['result']['status'] ?? null;

        if (! $referenceId || ! $status) {
            Log::warning('Invalid MTN webhook payload', $data);
            return response()->json(['error' => 'invalid payload'], 400);
        }

        $payments->handleWebhook('MTN_MOMO', $referenceId, $status, $data);
        return response()->json(['success' => true]);
    }

    public function moov(Request $request, PaymentService $payments)
    {
        if ($request->method() === 'GET') {
            return response()->json(['message' => 'Moov webhook endpoint'], 200);
        }

        $data = $request->all();
        $referenceId = $data['referenceId'] ?? $data['transactionId'] ?? null;
        $status = $data['status'] ?? null;

        if (! $referenceId || ! $status) {
            Log::warning('Invalid Moov webhook payload', $data);
            return response()->json(['error' => 'invalid payload'], 400);
        }

        $payments->handleWebhook('MOOV_MONEY', $referenceId, $status, $data);
        return response()->json(['success' => true]);
    }
}
