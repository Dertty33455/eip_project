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
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            // personal info
            $table->string('first_name');
            $table->string('last_name');
            $table->string('username')->unique();
            $table->string('name')->nullable(); // optional display name
            $table->string('email')->unique();
            $table->string('phone')->unique()->nullable();
            $table->string('avatar')->nullable();
            $table->text('bio')->nullable();
            $table->string('location')->nullable();
            $table->string('country')->nullable();

            // auth & status
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->string('role')->default('USER'); // USER, SELLER, ADMIN
            $table->string('status')->default('PENDING_VERIFICATION'); // ACTIVE, SUSPENDED, BANNED, ...
            $table->boolean('is_verified_seller')->default(false);
            $table->boolean('is_email_verified')->default(false);
            $table->boolean('is_phone_verified')->default(false);
            $table->timestamp('last_login_at')->nullable();

            $table->rememberToken();
            $table->timestamps();
        });

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        // custom session table used by our API for JWT sessions
        Schema::create('sessions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->cascadeOnDelete();
            $table->string('token')->unique();
            $table->dateTime('expires_at');
            $table->string('user_agent')->nullable();
            $table->string('ip_address')->nullable();
            $table->timestamp('created_at')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};
