<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('wallet_id')->constrained('wallets')->cascadeOnDelete();
            $table->string('type');
            $table->string('status')->default('PENDING');
            $table->float('amount');
            $table->float('fee')->default(0);
            $table->float('net_amount');
            $table->string('currency')->default('XOF');
            $table->string('provider')->nullable();
            $table->string('provider_ref')->nullable();
            $table->text('description')->nullable();
            $table->text('metadata')->nullable();
            $table->string('order_id')->nullable();
            $table->string('subscription_id')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
