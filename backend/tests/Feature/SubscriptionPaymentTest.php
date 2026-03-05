<?php

namespace Tests\Feature;

use App\Models\Subscription;
use App\Models\SubscriptionPricing;
use App\Models\User;
use App\Models\Wallet;
use App\Models\Transaction;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Services\MtnMomoService;
use App\Services\MoovMoneyService;
use Mockery;

class SubscriptionPaymentTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Create a test plan
        SubscriptionPricing::create([
            'plan' => 'MONTHLY',
            'price' => 2500,
            'duration' => 30,
            'currency' => 'XOF',
            'is_active' => true,
        ]);
    }

    public function test_user_can_subscribe_via_wallet()
    {
        $user = User::factory()->create();
        $wallet = Wallet::create(['user_id' => $user->id, 'balance' => 5000]);

        $response = $this->actingAs($user)->postJson('/api/subscriptions', [
            'plan' => 'MONTHLY',
            'provider' => 'WALLET',
        ]);

        $response->assertStatus(201);
        $this->assertEquals(2500, $wallet->fresh()->balance);
        $this->assertEquals('ACTIVE', Subscription::where('user_id', $user->id)->first()->status);
    }

    public function test_user_cannot_subscribe_with_insufficient_wallet_balance()
    {
        $user = User::factory()->create();
        $wallet = Wallet::create(['user_id' => $user->id, 'balance' => 1000]);

        $response = $this->actingAs($user)->postJson('/api/subscriptions', [
            'plan' => 'MONTHLY',
            'provider' => 'WALLET',
        ]);

        $response->assertStatus(400);
        $this->assertEquals('FAILED', Subscription::where('user_id', $user->id)->first()->status);
    }

    public function test_user_can_initiate_momo_subscription()
    {
        $user = User::factory()->create();
        
        // Mock MOMO service
        $mtnMock = Mockery::mock(MtnMomoService::class);
        $mtnMock->shouldReceive('requestToPay')->once()->andReturn([
            'success' => true,
            'referenceId' => 'test-ref-123'
        ]);
        $this->app->instance(MtnMomoService::class, $mtnMock);

        $response = $this->actingAs($user)->postJson('/api/subscriptions', [
            'plan' => 'MONTHLY',
            'provider' => 'MTN_MOMO',
            'phoneNumber' => '22507070707',
        ]);

        $response->assertStatus(201);
        $subscription = Subscription::where('user_id', $user->id)->first();
        $this->assertEquals('PENDING', $subscription->status);
        
        $transaction = Transaction::where('subscription_id', $subscription->id)->first();
        $this->assertEquals('test-ref-123', $transaction->provider_ref);
    }

    public function test_subscription_activates_on_webhook()
    {
        $user = User::factory()->create();
        $wallet = Wallet::create(['user_id' => $user->id, 'balance' => 0]);
        
        $subscription = Subscription::create([
            'user_id' => $user->id,
            'plan' => 'MONTHLY',
            'status' => 'PENDING',
            'price' => 2500,
        ]);

        $transaction = Transaction::create([
            'wallet_id' => $wallet->id,
            'subscription_id' => $subscription->id,
            'type' => 'SUB_PAYMENT',
            'status' => 'PENDING',
            'amount' => 2500,
            'net_amount' => 2500,
            'provider' => 'MTN_MOMO',
            'provider_ref' => 'test-ref-123',
        ]);

        $response = $this->postJson('/api/webhooks/mtn', [
            'referenceId' => 'test-ref-123',
            'status' => 'SUCCESSFUL'
        ]);

        $response->assertStatus(200);
        $this->assertEquals('ACTIVE', $subscription->fresh()->status);
        $this->assertNotNull($subscription->fresh()->start_date);
    }
}
