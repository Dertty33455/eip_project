<?php

namespace App\Http\Controllers\Api;

use App\Models\Post;
use App\Models\Like;
use App\Models\Comment;
use App\Models\Share;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PostController extends CrudController
{
    protected string $modelClass = Post::class;

    protected array $rules = [
        'author_id' => 'required|exists:users,id',
        'type' => 'required|string',
        'content' => 'required|string',
        'images' => 'sometimes|array',
        'book_title' => 'sometimes|string',
        'book_author' => 'sometimes|string',
        'rating' => 'sometimes|numeric|min:0|max:5',
        'is_published' => 'sometimes|boolean',
        'is_reported' => 'sometimes|boolean',
        'view_count' => 'sometimes|integer',
    ];

    protected function withRelations(): ?array
    {
        return ['author', 'comments.author', 'likes', 'shares', 'reports'];
    }

    /**
     * Override store to set author_id from authenticated user
     */
    public function store(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $data = $request->validate([
            'content' => 'required|string',
            'images' => 'sometimes|array',
            'type' => 'sometimes|string',
            'book_title' => 'sometimes|string',
            'book_author' => 'sometimes|string',
            'rating' => 'sometimes|numeric|min:0|max:5',
        ]);

        // Force author_id to current user
        $data['author_id'] = $user->id;
        $data['is_published'] = true;
        $data['type'] = $data['type'] ?? 'text';

        $post = Post::create($data);
        $post->load($this->withRelations());

        return response()->json(['post' => $post], 201);
    }

    /**
     * Like a post
     */
    public function like(Request $request, $id)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $post = Post::find($id);
        if (!$post) {
            return response()->json(['error' => 'Post not found'], 404);
        }

        // Check if already liked
        $existingLike = Like::where('user_id', $user->id)
            ->where('post_id', $id)
            ->first();

        if ($existingLike) {
            // Unlike
            $existingLike->delete();
            $likesCount = $post->likes()->count();
            return response()->json([
                'message' => 'Post unliked',
                'liked' => false,
                'likes_count' => $likesCount,
                'post_id' => $id
            ]);
        }

        // Like
        $like = Like::create([
            'user_id' => $user->id,
            'post_id' => $id,
        ]);

        $likesCount = $post->likes()->count();
        return response()->json([
            'message' => 'Post liked',
            'liked' => true,
            'likes_count' => $likesCount,
            'post_id' => $id,
            'like' => $like->load('user')
        ]);
    }

    /**
     * Comment on a post
     */
    public function comment(Request $request, $id)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $post = Post::find($id);
        if (!$post) {
            return response()->json(['error' => 'Post not found'], 404);
        }

        $validated = $request->validate([
            'content' => 'required|string|min:1|max:500',
        ]);

        $comment = Comment::create([
            'author_id' => $user->id,
            'post_id' => $id,
            'content' => $validated['content'],
        ]);

        $comment->load('author:id,firstName,lastName,username,avatar');

        return response()->json([
            'message' => 'Comment created',
            'comment' => $comment,
            'comments_count' => $post->comments()->count()
        ], 201);
    }

    /**
     * Share a post
     */
    public function share(Request $request, $id)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $post = Post::find($id);
        if (!$post) {
            return response()->json(['error' => 'Post not found'], 404);
        }

        $validated = $request->validate([
            'platform' => 'sometimes|string',
        ]);

        $share = Share::create([
            'user_id' => $user->id,
            'post_id' => $id,
            'platform' => $validated['platform'] ?? null,
        ]);

        return response()->json([
            'message' => 'Post shared',
            'share' => $share,
            'shares_count' => $post->shares()->count()
        ], 201);
    }
}
