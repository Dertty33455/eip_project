<?php

namespace Tests\Feature;

use App\Models\Book;
use App\Models\User;
use App\Models\Cart;
use App\Models\Category;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Laravel\Sanctum\Sanctum;

class CartTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_add_book_to_cart()
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $category = Category::create(['name' => 'Test Category', 'slug' => 'test-category']);
        $book = Book::create([
            'title' => 'Test Book',
            'author' => 'Test Author',
            'description' => 'Test Description',
            'price' => 1000,
            'stock' => 10,
            'category_id' => $category->id,
            'seller_id' => $user->id,
            'condition' => 'NEW',
            'language' => 'Français',
        ]);

        $response = $this->postJson('/api/cart', [
            'book_id' => $book->id,
            'quantity' => 2,
        ]);

        $response->assertStatus(200)
                 ->assertJsonPath('message', 'Livre ajouté au panier avec succès.');

        $this->assertDatabaseHas('carts', [
            'user_id' => $user->id,
        ]);

        $cart = Cart::where('user_id', $user->id)->first();
        $this->assertDatabaseHas('cart_items', [
            'cart_id' => $cart->id,
            'book_id' => $book->id,
            'quantity' => 2,
        ]);
    }

    public function test_user_can_add_book_to_cart_with_camel_case()
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $category = Category::create(['name' => 'Test Category', 'slug' => 'test-category']);
        $book = Book::create([
            'title' => 'Test Book',
            'author' => 'Test Author',
            'description' => 'Test Description',
            'price' => 1000,
            'stock' => 10,
            'category_id' => $category->id,
            'seller_id' => $user->id,
            'condition' => 'NEW',
            'language' => 'Français',
        ]);

        $response = $this->postJson('/api/cart', [
            'bookId' => $book->id,
            'quantity' => 1,
        ]);

        $response->assertStatus(200);

        $cart = Cart::where('user_id', $user->id)->first();
        $this->assertDatabaseHas('cart_items', [
            'cart_id' => $cart->id,
            'book_id' => $book->id,
            'quantity' => 1,
        ]);
    }

    public function test_user_can_get_cart()
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $cart = \App\Models\Cart::create(['user_id' => $user->id]);

        $response = $this->getJson('/api/cart');

        $response->assertStatus(200)
                 ->assertJsonPath('id', $cart->id);
    }
}
