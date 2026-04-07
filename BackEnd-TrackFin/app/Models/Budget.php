<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Transaction;

class Budget extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'team_id',
        'category_id',
        'month',
        'year',
        'amount_limit',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function team()
    {
        return $this->belongsTo(Team::class);
    }

    public function getSpentAmount()
    {
        return Transaction::where('category_id', $this->category_id)
            ->where('user_id', $this->user_id)
            ->where('team_id', $this->team_id)
            ->whereYear('date', $this->year)
            ->whereMonth('date', $this->month)
            ->where('type', 'expense')
            ->sum('amount');
    }
}