<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Transaction;
use App\Models\Debt;
use App\Models\Budget;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        try {
            $user    = Auth::user();
            $teamId  = $user->team_id;
            $now     = Carbon::now();

            // ── Base queries ────────────────────────────────────────────
            $txQuery = Transaction::where('team_id', $teamId);
            $debtQuery = Debt::where('team_id', $teamId);

            // ── Mois courant ────────────────────────────────────────────
            $currentMonth = $txQuery->clone()
                ->whereYear('date',  $now->year)
                ->whereMonth('date', $now->month);

            $totalIncome  = (clone $currentMonth)->where('type', 'income')->sum('amount');
            $totalExpense = (clone $currentMonth)->where('type', 'expense')->sum('amount');
            $txCount      = (clone $currentMonth)->count();

            // ── Dettes / Créances ────────────────────────────────────────
            $totalDebts       = $debtQuery->clone()->where('type', 'to_pay')
                                    ->whereIn('status', ['pending', 'partially_paid'])
                                    ->get()->sum('rest_to_pay');

            $totalReceivables = $debtQuery->clone()->where('type', 'to_receive')
                                    ->whereIn('status', ['pending', 'partially_paid'])
                                    ->get()->sum('rest_to_pay');

            // ── Budget mois courant ──────────────────────────────────────
            $budgets = Budget::where('team_id', $teamId)
                ->where('month', $now->month)
                ->where('year',  $now->year)
                ->get();

            $totalBudget = $budgets->sum('amount_limit');
            $totalSpent  = $budgets->sum(fn($b) => $b->getSpentAmount());
            $restBudget  = max(0, $totalBudget - $totalSpent);

            // ── Évolution du solde — 12 derniers mois ───────────────────
            $evolution = [];
            for ($i = 11; $i >= 0; $i--) {
                $month = $now->copy()->subMonths($i);
                $q = $txQuery->clone()
                    ->whereYear('date',  $month->year)
                    ->whereMonth('date', $month->month);

                $income  = (clone $q)->where('type', 'income')->sum('amount');
                $expense = (clone $q)->where('type', 'expense')->sum('amount');

                $evolution[] = [
                    'mois'   => $month->locale('fr')->isoFormat('MMM'),
                    'valeur' => round($income - $expense, 2),
                ];
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'periode'           => $now->locale('fr')->isoFormat('MMMM YYYY'),
                    'transaction_count' => $txCount,
                    'total_income'      => round($totalIncome,      2),
                    'total_expense'     => round($totalExpense,     2),
                    'total_debts'       => round($totalDebts,       2),
                    'total_receivables' => round($totalReceivables, 2),
                    'total_budget'      => round($totalBudget,      2),
                    'rest_budget'       => round($restBudget,       2),
                    'evolution'         => $evolution,
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors du chargement du dashboard',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }
}