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
        Schema::create('audio_progress', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('audiobook_id')->constrained('audiobooks')->cascadeOnDelete();
            $table->foreignId('chapter_id')->constrained('audio_chapters')->cascadeOnDelete();
            $table->integer('position')->default(0);
            $table->boolean('completed')->default(false);
            $table->float('speed')->default(1.0);
            $table->timestamps();
            $table->unique(['user_id','audiobook_id','chapter_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('audio_progress');
    }
};
