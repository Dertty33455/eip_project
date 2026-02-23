<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class MoovMoneyService
{
    protected string $base;
    protected ?string $apiKey;
    protected ?string $merchantId;

    public function __construct()
    {
        $this->base = env('MOOV_MONEY_API_URL', 'https://api.moov-africa.com');
        // use nullable strings and default to empty if not set
        $this->apiKey = env('MOOV_MONEY_API_KEY', '');
        $this->merchantId = env('MOOV_MONEY_MERCHANT_ID', '');
    }

    protected function getAccessToken(): string
    {
        if (empty($this->apiKey) || empty($this->merchantId)) {
            throw new \RuntimeException('MoovMoney credentials are not configured');
        }

        $response = Http::post("{$this->base}/auth/token", [
            'apiKey' => $this->apiKey,
            'merchantId' => $this->merchantId,
        ]);

        return $response->json('token');
    }

    public function initiatePayment(float $amount, string $currency, string $msisdn, string $externalId, string $description = ''): array
    {
        $token = $this->getAccessToken();
        $ref = (string) Str::uuid();

        $response = Http::withHeaders([
            'Authorization' => "Bearer $token",
            'Content-Type' => 'application/json',
        ])->post("{$this->base}/payment/collect", [
            'merchantId' => $this->merchantId,
            'referenceId' => $ref,
            'amount' => $amount,
            'currency' => $currency,
            'phone' => $msisdn,
            'description' => $description,
            'transactionId' => $externalId,
            'callbackUrl' => env('MOOV_MONEY_CALLBACK_URL'),
        ]);

        return [
            'success' => $response->ok(),
            'referenceId' => $response->json('referenceId', $ref),
            'status' => 'PENDING',
            'data' => $response->json(),
            'error' => $response->ok() ? null : $response->json('message'),
        ];
    }

    public function transfer(float $amount, string $currency, string $msisdn, string $externalId, string $description = ''): array
    {
        $token = $this->getAccessToken();
        $ref = (string) Str::uuid();

        $response = Http::withHeaders([
            'Authorization' => "Bearer $token",
            'Content-Type' => 'application/json',
        ])->post("{$this->base}/payment/disburse", [
            'merchantId' => $this->merchantId,
            'referenceId' => $ref,
            'amount' => $amount,
            'currency' => $currency,
            'phone' => $msisdn,
            'description' => $description,
            'transactionId' => $externalId,
            'callbackUrl' => env('MOOV_MONEY_CALLBACK_URL'),
        ]);

        return [
            'success' => $response->ok(),
            'referenceId' => $response->json('referenceId', $ref),
            'status' => 'PENDING',
            'data' => $response->json(),
            'error' => $response->ok() ? null : $response->json('message'),
        ];
    }

    public function getPaymentStatus(string $referenceId): array
    {
        $token = $this->getAccessToken();
        $response = Http::withHeaders([
            'Authorization' => "Bearer $token",
        ])->get("{$this->base}/payment/status/{$referenceId}");

        return [
            'success' => $response->ok(),
            'status' => $response->json('status'),
            'data' => $response->json(),
        ];
    }

    public function getTransferStatus(string $referenceId): array
    {
        $token = $this->getAccessToken();
        $response = Http::withHeaders([
            'Authorization' => "Bearer $token",
        ])->get("{$this->base}/payment/status/{$referenceId}");

        return [
            'success' => $response->ok(),
            'status' => $response->json('status'),
            'data' => $response->json(),
        ];
    }
}
