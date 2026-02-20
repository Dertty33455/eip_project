<?php

namespace App\Http\Controllers\Api;

use App\Models\Invoice;
use Illuminate\Http\Request;

class InvoiceController extends CrudController
{
    protected string $modelClass = Invoice::class;

    protected array $rules = [
        'order_id' => 'required|exists:orders,id',
        'invoice_number' => 'required|string',
        'pdf_url' => 'sometimes|url',
    ];

    protected function withRelations(): ?array
    {
        return ['order'];
    }
}
