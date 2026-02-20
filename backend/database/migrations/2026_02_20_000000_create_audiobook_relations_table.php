<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('audiobook_relations', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('audiobook_id');
            $table->unsignedBigInteger('related_audiobook_id');
            $table->timestamps();

            $table->foreign('audiobook_id')->references('id')->on('audiobooks')->onDelete('cascade');
            $table->foreign('related_audiobook_id')->references('id')->on('audiobooks')->onDelete('cascade');
            $table->unique(['audiobook_id', 'related_audiobook_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('audiobook_relations');
    }
};
