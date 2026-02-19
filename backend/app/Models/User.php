<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * The attributes that should be appended to arrays.
     *
     * @var list<string>
     */
    protected $appends = [
        'firstName',
        'lastName',
        'isVerified',
        'totalSales',
        'rating',
    ];

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'first_name',
        'last_name',
        'username',
        'name',
        'email',
        'phone',
        'avatar',
        'bio',
        'location',
        'country',
        'password',
        'role',
        'status',
        'is_verified_seller',
        'is_email_verified',
        'is_phone_verified',
        'last_login_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Get the user's first name in camelCase format.
     */
    public function getFirstNameAttribute()
    {
        return $this->attributes['first_name'] ?? null;
    }

    /**
     * Get the user's last name in camelCase format.
     */
    public function getLastNameAttribute()
    {
        return $this->attributes['last_name'] ?? null;
    }

    /**
     * Get whether the user is a verified seller.
     */
    public function getIsVerifiedAttribute()
    {
        return (bool) ($this->attributes['is_verified_seller'] ?? false);
    }

    /**
     * Get the total number of sales by this seller (placeholder).
     */
    public function getTotalSalesAttribute()
    {
        return $this->attributes['total_sales'] ?? 0;
    }

    /**
     * Get the seller's average rating (placeholder).
     */
    public function getRatingAttribute()
    {
        return $this->attributes['rating'] ?? 4.5;
    }
}
