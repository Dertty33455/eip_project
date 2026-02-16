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
        Schema::create('audio_chapters', function (Blueprint $table) {
            $table->id();
            $table->foreignId('audiobook_id')->constrained('audiobooks')->cascadeOnDelete();
            $table->string('title');
            $table->integer('chapter_number');
            $table->integer('duration');
            $table->string('audio_url');
            $table->boolean('is_free')->default(false);
            $table->timestamps();
            $table->unique(['audiobook_id','chapter_number']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('audio_chapters');
    }
};
