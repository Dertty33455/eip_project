<?php

namespace Database\Seeders;

use App\Models\Conversation;
use App\Models\Message;
use App\Models\User;
use App\Models\Book;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ConversationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get existing users
        $alice = User::where('email', 'alice@example.com')->first();
        $bob = User::where('email', 'bob@example.com')->first();
        $testUser = User::where('email', 'test@example.com')->first();

        // Get existing books
        $gatsby = Book::where('title', 'The Great Gatsby')->first();
        $harryPotter = Book::where('title', 'Harry Potter and the Philosopher\'s Stone')->first();
        $nineteenEightyFour = Book::where('title', '1984')->first();

        if (!$alice || !$bob || !$testUser || !$gatsby || !$harryPotter || !$nineteenEightyFour) {
            return; // Skip if required data doesn't exist
        }

        // Create conversation between Alice and Test User about Gatsby
        $conversation1 = Conversation::create([
            'book_id' => $gatsby->id,
            'buyer_user_id' => $testUser->id,
            'seller_user_id' => $alice->id,
            'last_message_at' => now()->subHours(2),
            'unread_count_by_user_id' => json_encode([$testUser->id => 0, $alice->id => 1]),
        ]);

        Message::create([
            'conversation_id' => $conversation1->id,
            'sender_user_id' => $testUser->id,
            'text' => 'Hi Alice! I\'m interested in your copy of The Great Gatsby. Is it still available?',
        ]);

        Message::create([
            'conversation_id' => $conversation1->id,
            'sender_user_id' => $alice->id,
            'text' => 'Hello! Yes, it\'s still available. The book is in excellent condition with no markings.',
        ]);

        Message::create([
            'conversation_id' => $conversation1->id,
            'sender_user_id' => $testUser->id,
            'text' => 'Great! Can we meet at the central library tomorrow at 3 PM?',
        ]);

        // Create conversation between Bob and Test User about Harry Potter
        $conversation2 = Conversation::create([
            'book_id' => $harryPotter->id,
            'buyer_user_id' => $testUser->id,
            'seller_user_id' => $bob->id,
            'last_message_at' => now()->subHours(5),
            'unread_count_by_user_id' => json_encode([$testUser->id => 1, $bob->id => 0]),
        ]);

        Message::create([
            'conversation_id' => $conversation2->id,
            'sender_user_id' => $testUser->id,
            'text' => 'Hi Bob, I saw your Harry Potter book. Is the price negotiable?',
        ]);

        Message::create([
            'conversation_id' => $conversation2->id,
            'sender_user_id' => $bob->id,
            'text' => 'Hi! The price is firm at 14,000 XOF, but I can include a bookmark with it!',
        ]);

        // Create conversation between Alice and Bob about 1984
        $conversation3 = Conversation::create([
            'book_id' => $nineteenEightyFour->id,
            'buyer_user_id' => $bob->id,
            'seller_user_id' => $alice->id,
            'last_message_at' => now()->subDays(1),
            'unread_count_by_user_id' => json_encode([$bob->id => 0, $alice->id => 0]),
        ]);

        Message::create([
            'conversation_id' => $conversation3->id,
            'sender_user_id' => $bob->id,
            'text' => 'Alice, do you have any other Orwell books?',
        ]);

        Message::create([
            'conversation_id' => $conversation3->id,
            'sender_user_id' => $alice->id,
            'text' => 'I have Animal Farm as well. Interested?',
        ]);
    }
}
