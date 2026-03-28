<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class Report extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'team_id',
        'period_type',
        'period_date',
        'total_income',
        'total_expense',
        'balance',
        'income_transactions_count',
        'expense_transactions_count',
        'total_debts',
        'total_receivables',
    ];

    protected $casts = [
        'period_date' => 'date',
        'total_income' => 'decimal:2',
        'total_expense' => 'decimal:2',
        'balance' => 'decimal:2',
        'total_debts' => 'decimal:2',
        'total_receivables' => 'decimal:2',
    ];

    /**
     * Relation avec l'utilisateur
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Méthode statique pour créer ou mettre à jour un rapport pour une période donnée
     */
    public static function updateOrCreateForPeriod($userId, $periodType, $periodDate)
    {
        $team_id = Auth::user()->team_id;
        $report = self::firstOrCreate([
            'user_id' => $userId,
            'team_id' => $team_id,
            'period_type' => $periodType,
            'period_date' => $periodDate,
        ]);

        $report->recalculate();

        return $report;
    }

    /**
     * Méthode pour recalculer les statistiques du rapport
     */
    public function recalculate()
    {
        // Calcul des transactions
        $transactionQuery = \App\Models\Transaction::where('user_id', $this->user_id);

        if ($this->period_type === 'daily') {
            $transactionQuery->whereDate('date', $this->period_date);
        } elseif ($this->period_type === 'monthly') {
            $transactionQuery->whereYear('date', $this->period_date->year)
                  ->whereMonth('date', $this->period_date->month);
        } elseif ($this->period_type === 'dashboard') {
            // Pour le dashboard, on peut prendre les 30 derniers jours ou une période personnalisée
            $transactionQuery->where('date', '>=', now()->subDays(30));
        }

        $transactions = $transactionQuery->get();

        $totalIncome = $transactions->where('type', 'income')->sum('amount');
        $totalExpense = $transactions->where('type', 'expense')->sum('amount');
        $incomeCount = $transactions->where('type', 'income')->count();
        $expenseCount = $transactions->where('type', 'expense')->count();

        // Calcul des dettes
        $debtQuery = \App\Models\Debt::where('user_id', $this->user_id);

        if ($this->period_type === 'daily') {
            $debtQuery->whereDate('created_at', $this->period_date);
        } elseif ($this->period_type === 'monthly') {
            $debtQuery->whereYear('created_at', $this->period_date->year)
                  ->whereMonth('created_at', $this->period_date->month);
        } elseif ($this->period_type === 'dashboard') {
            $debtQuery->where('created_at', '>=', now()->subDays(30));
        }

        $debts = $debtQuery->get();

        $totalDebts = $debts->where('type', 'to_pay')->sum('amount');
        $totalReceivables = $debts->where('type', 'to_receive')->sum('amount');

        $this->update([
            'total_income' => $totalIncome,
            'total_expense' => $totalExpense,
            'balance' => $totalIncome - $totalExpense,
            'income_transactions_count' => $incomeCount,
            'expense_transactions_count' => $expenseCount,
            'total_debts' => $totalDebts,
            'total_receivables' => $totalReceivables,
        ]);
    }

    public function team()
    {
        return $this->belongsTo(Team::class);
    }
}