<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Debt extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'team_id',
        'contact_id',
        'amount',
        'type',
        'due_date',
        'status',
        'notes',
    ];

    protected $casts = [
        'due_date' => 'datetime',
        'amount' => 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function contact()
    {
        return $this->belongsTo(Contact::class);
    }

    public function team()
    {
        return $this->belongsTo(Team::class);
    }

    protected $appends = ['rest_to_pay'];

    public function transactions()
    {
        return $this->hasMany(Transaction::class, 'debt_id');
    }

    public function getRestToPayAttribute(): float
    {
        $paid = $this->transactions()->sum('amount');
        return max(0, $this->amount - $paid);
    }
}