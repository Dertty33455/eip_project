<?php

namespace App\Http\Controllers\Api;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends CrudController
{
    protected string $modelClass = Category::class;

    protected array $rules = [
        'name' => 'required|string',
        'slug' => 'sometimes|string|unique:categories,slug',
        'description' => 'sometimes|string',
        'icon' => 'sometimes|string',
        'image' => 'sometimes|string',
        'parent_id' => 'sometimes|exists:categories,id',
        'is_active' => 'sometimes|boolean',
        'order' => 'sometimes|integer',
    ];

    protected function withRelations(): ?array
    {
        return ['children','books','audiobooks'];
    }

    public function index(Request $request)
    {
        $categories = Category::where('is_active', true)
            ->orderBy('order')
            ->with('children')
            ->get();
        
        return response()->json([
            'categories' => $categories
        ]);
    }

    public function show(string $id)
    {
        $category = Category::with(['children','books','audiobooks'])->find($id);
        
        if (!$category) {
            return response()->json(['error' => 'Category not found'], 404);
        }
        
        return response()->json($category);
    }
}
