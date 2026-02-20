<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

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

    /* relationship helpers */

    public function books(): HasMany
    {
        return $this->hasMany(Book::class, 'seller_id');
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class, 'author_id');
    }

    public function ordersAsBuyer(): HasMany
    {
        return $this->hasMany(Order::class, 'buyer_id');
    }

    public function ordersAsSeller(): HasMany
    {
        return $this->hasMany(Order::class, 'seller_id');
    }

    public function wallet(): HasOne
    {
        return $this->hasOne(Wallet::class);
    }

    public function transactions(): HasManyThrough
    {
        return $this->hasManyThrough(Transaction::class, Wallet::class);
    }

    public function carts(): HasMany
    {
        return $this->hasMany(Cart::class);
    }

    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class, 'author_id');
    }

    public function posts(): HasMany
    {
        return $this->hasMany(Post::class, 'author_id');
    }

    public function shares(): HasMany
    {
        return $this->hasMany(Share::class);
    }

    public function notifications(): HasMany
    {
        return $this->hasMany(Notification::class);
    }

    public function audioProgress(): HasMany
    {
        return $this->hasMany(AudioProgress::class);
    }

    public function favorites(): HasMany
    {
        return $this->hasMany(Favorite::class);
    }

    public function subscriptions(): HasMany
    {
        return $this->hasMany(Subscription::class);
    }

    public function conversationParticipants(): HasMany
    {
        return $this->hasMany(ConversationParticipant::class);
    }

    public function messagesSent(): HasMany
    {
        return $this->hasMany(Message::class, 'sender_id');
    }

    public function messagesReceived(): HasMany
    {
        return $this->hasMany(Message::class, 'receiver_id');
    }

    public function reportsMade(): HasMany
    {
        return $this->hasMany(Report::class, 'reporter_id');
    }

    public function reportsReceived(): HasMany
    {
        return $this->hasMany(Report::class, 'target_id');
    }

    public function followers(): HasMany
    {
        return $this->hasMany(Follow::class, 'following_id');
    }

    public function following(): HasMany
    {
        return $this->hasMany(Follow::class, 'follower_id');
    }
}
