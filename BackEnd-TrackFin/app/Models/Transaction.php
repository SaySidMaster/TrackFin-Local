<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'team_id',
        'category_id',
        'contact_id',
        'debt_id',
        'amount',
        'type',
        'label',
        'description',
        'date',
    ];

    protected $casts = [
        'date' => 'datetime',
        'amount' => 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function contact()
    {
        return $this->belongsTo(Contact::class);
    }

    public function debt()
    {
        return $this->belongsTo(Debt::class);
    }

    public function team()
    {
        return $this->belongsTo(Team::class);
    }
}