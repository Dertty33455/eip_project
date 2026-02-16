<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    protected $fillable = [
        'reporter_id',
        'target_id',
        'post_id',
        'comment_id',
        'reason',
        'description',
        'status',
        'resolved_by',
        'resolved_at',
    ];
}
