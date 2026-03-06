<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contact extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'type',
        'phone',
        'email',
        'notes',
    ];

    /**
     * Relation avec l'utilisateur
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Toutes les transactions liées à ce contact
     */
    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }

    /**
     * Les dettes associées
     */
    public function debts()
    {
        return $this->hasMany(Debt::class);
    }
}