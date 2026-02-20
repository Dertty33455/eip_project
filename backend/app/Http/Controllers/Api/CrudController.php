<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Validation\Rule;

abstract class CrudController extends Controller
{
    /**
     * Eloquent model class name (set in subclass).
     *
     * @var string
     */
    protected string $modelClass;

    /**
     * Validation rules used for store/update (set in subclass).
     *
     * @var array<string, mixed>
     */
    protected array $rules = [];

    /**
     * Optional relations to eager load on fetch.
     *
     * @return array<string>|null
     */
    protected function withRelations(): ?array
    {
        return null;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        /** @var \Illuminate\Database\Eloquent\Builder $query */
        $query = ($this->modelClass)::query();

        if ($relations = $this->withRelations()) {
            $query->with($relations);
        }

        // basic pagination
        $limit = (int) $request->query('limit', 20);
        $limit = max(1, min($limit, 100));

        return response()->json($query->paginate($limit));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate($this->rules);
        /** @var Model $item */
        $item = ($this->modelClass)::create($data);

        if ($relations = $this->withRelations()) {
            $item->load($relations);
        }

        return response()->json($item, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $query = ($this->modelClass)::query();
        if ($relations = $this->withRelations()) {
            $query->with($relations);
        }
        $item = $query->find($id);
        if (! $item) {
            return response()->json(['error' => 'Resource not found'], 404);
        }
        return response()->json($item);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        /** @var Model|null $item */
        $item = ($this->modelClass)::find($id);
        if (! $item) {
            return response()->json(['error' => 'Resource not found'], 404);
        }

        $data = $request->validate($this->rules);
        $item->update($data);
        return response()->json($item);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $item = ($this->modelClass)::find($id);
        if (! $item) {
            return response()->json(['error' => 'Resource not found'], 404);
        }
        $item->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }
}
