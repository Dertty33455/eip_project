<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'is_blocked',
        'display_name',
        'phone',
        'location',
        'avatar_url',
        'joined_at',
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
            'joined_at' => 'datetime',
            'is_blocked' => 'boolean',
        ];
    }

    public function favoriteBooks(): BelongsToMany
    {
        return $this->belongsToMany(Book::class, 'user_favorites');
    }

    public function books()
    {
        return $this->hasMany(Book::class, 'seller_id');
    }

    public function buyerOrders()
    {
        return $this->hasMany(Order::class, 'buyer_user_id');
    }

    public function sellerOrders()
    {
        return $this->hasMany(Order::class, 'seller_user_id');
    }

    public function buyerConversations()
    {
        return $this->hasMany(Conversation::class, 'buyer_user_id');
    }

    public function sellerConversations()
    {
        return $this->hasMany(Conversation::class, 'seller_user_id');
    }

    public function sentMessages()
    {
        return $this->hasMany(Message::class, 'sender_user_id');
    }

    public function reviews()
    {
        return $this->hasMany(Review::class, 'seller_user_id');
    }
}
