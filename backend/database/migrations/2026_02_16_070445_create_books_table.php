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
            $table->string('isbn')->nullable();
            $table->text('description');
            $table->float('price');
            $table->float('original_price')->nullable();
            $table->string('condition');
            $table->string('status')->default('DRAFT');
            $table->integer('quantity')->default(1);
            $table->string('location')->nullable();
            $table->string('city')->nullable();
            $table->string('country')->nullable();
            $table->text('images');
            $table->string('cover_image')->nullable();
            $table->string('language')->default('Français');
            $table->integer('published_year')->nullable();
            $table->integer('pages')->nullable();
            $table->float('weight')->nullable();
            $table->integer('view_count')->default(0);
            $table->foreignId('seller_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('category_id')->constrained('categories');
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
