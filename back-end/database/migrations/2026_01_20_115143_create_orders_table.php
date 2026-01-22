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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('book_id')->constrained('books')->onDelete('cascade');
            $table->foreignId('buyer_user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('seller_user_id')->constrained('users')->onDelete('cascade');
            $table->integer('amount_xof');
            $table->enum('payment_method', ['Mobile Money', 'Cash', 'Carte']);
            $table->enum('status', ['En cours', 'Livré', 'Terminé', 'Annulé']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
