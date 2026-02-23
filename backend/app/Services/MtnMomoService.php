<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class MtnMomoService
{
    protected string $base;
    protected string $apiKey;
    protected string $userId;
    protected string $subKey;

    public function __construct()
    {
        $this->base   = env('MTN_MOMO_API_URL', 'https://sandbox.momodeveloper.mtn.com');
        $this->apiKey = env('MTN_MOMO_API_KEY');
        $this->userId = env('MTN_MOMO_USER_ID');
        $this->subKey = env('MTN_MOMO_SUBSCRIPTION_KEY');
    }

    protected function getAccessToken(): string
    {
        $response = Http::withHeaders([
            'Authorization' => 'Basic ' . base64_encode($this->userId . ':' . $this->apiKey),
            'Ocp-Apim-Subscription-Key' => $this->subKey,
        ])->post("{$this->base}/collection/token/");

        return $response->json('access_token');
    }

    public function requestToPay(float $amount, string $currency, string $msisdn, string $externalId): array
    {
        $token = $this->getAccessToken();
        $ref   = (string) Str::uuid();

        $response = Http::withHeaders([
            'Authorization' => "Bearer $token",
            'X-Reference-Id' => $ref,
            'X-Target-Environment' => config('app.env') === 'production' ? 'production' : 'sandbox',
            'Ocp-Apim-Subscription-Key' => $this->subKey,
            'X-Callback-Url' => env('MTN_MOMO_CALLBACK_URL'),
        ])->post("{$this->base}/collection/v1_0/requesttopay", [
            'amount' => (string) $amount,
            'currency' => $currency,
            'externalId' => $externalId,
            'payer' => [
                'partyIdType' => 'MSISDN',
                'partyId' => $msisdn,
            ],
            'payerMessage' => 'Recharge portefeuille',
            'payeeNote' => "Recharge wallet $externalId",
        ]);

        return [
            'success' => $response->status() === 202,
            'referenceId' => $ref,
            'status' => $response->status() === 202 ? 'PENDING' : null,
            'error' => $response->status() === 202 ? null : $response->json('message'),
        ];
    }

    public function transfer(float $amount, string $currency, string $msisdn, string $externalId): array
    {
        // disbursement flow
        $creds = base64_encode($this->userId . ':' . $this->apiKey);
        $tokenResp = Http::withHeaders([
            'Authorization' => "Basic $creds",
            'Ocp-Apim-Subscription-Key' => $this->subKey,
        ])->post("{$this->base}/disbursement/token/");

        $token = $tokenResp->json('access_token');
        $ref = (string) Str::uuid();

        $response = Http::withHeaders([
            'Authorization' => "Bearer $token",
            'X-Reference-Id' => $ref,
            'X-Target-Environment' => config('app.env') === 'production' ? 'production' : 'sandbox',
            'Ocp-Apim-Subscription-Key' => $this->subKey,
            'X-Callback-Url' => env('MTN_MOMO_CALLBACK_URL'),
        ])->post("{$this->base}/disbursement/v1_0/transfer", [
            'amount' => (string) $amount,
            'currency' => $currency,
            'externalId' => $externalId,
            'payee' => [
                'partyIdType' => 'MSISDN',
                'partyId' => $msisdn,
            ],
            'payerMessage' => 'Retrait portefeuille',
            'payeeNote' => "Retrait wallet $externalId",
        ]);

        return [
            'success' => $response->status() === 202,
            'referenceId' => $ref,
            'status' => $response->status() === 202 ? 'PENDING' : null,
            'error' => $response->status() === 202 ? null : $response->json('message'),
        ];
    }

    public function getPaymentStatus(string $referenceId): array
    {
        $token = $this->getAccessToken();
        $response = Http::withHeaders([
            'Authorization' => "Bearer $token",
            'X-Target-Environment' => config('app.env') === 'production' ? 'production' : 'sandbox',
            'Ocp-Apim-Subscription-Key' => $this->subKey,
        ])->get("{$this->base}/collection/v1_0/requesttopay/{$referenceId}");

        return [
            'success' => $response->ok(),
            'status' => $response->json('status'),
            'data' => $response->json(),
        ];
    }

    public function getTransferStatus(string $referenceId): array
    {
        // similar to getPaymentStatus but disbursement path
        $creds = base64_encode($this->userId . ':' . $this->apiKey);
        $tokenResp = Http::withHeaders([
            'Authorization' => "Basic $creds",
            'Ocp-Apim-Subscription-Key' => $this->subKey,
        ])->post("{$this->base}/disbursement/token/");

        $token = $tokenResp->json('access_token');
        $response = Http::withHeaders([
            'Authorization' => "Bearer $token",
            'X-Target-Environment' => config('app.env') === 'production' ? 'production' : 'sandbox',
            'Ocp-Apim-Subscription-Key' => $this->subKey,
        ])->get("{$this->base}/disbursement/v1_0/transfer/{$referenceId}");

        return [
            'success' => $response->ok(),
            'status' => $response->json('status'),
            'data' => $response->json(),
        ];
    }
}
