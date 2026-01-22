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
        Schema::create('books', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('author');
            $table->string('category');
            $table->text('description');
            $table->integer('price_xof');
            $table->enum('condition', ['Neuf', 'Occasion']);
            $table->enum('status', ['Disponible', 'Réservé', 'Vendu']);
            $table->string('location');
            $table->json('photos');
            $table->foreignId('seller_id')->constrained('users')->onDelete('cascade');
            $table->timestamp('published_at');
            $table->integer('views')->default(0);
            $table->integer('favorites_count')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('books');
    }
};
