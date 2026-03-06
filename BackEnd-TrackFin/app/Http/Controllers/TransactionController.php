<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use App\Models\Transaction;
use App\Models\Category;
use App\Models\Contact;
use App\Models\Debt;

class TransactionController extends Controller
{
    public function index(Request $request)
    {
        try {
            $user = Auth::user();
            if (!$user) {
                return response()->json(['success' => false, 'message' => 'Utilisateur non authentifié'], 401);
            }

            $type = $request->get('type');
            $categoryId = $request->get('category_id');
            $contactId = $request->get('contact_id');
            $search = $request->get('search');

            $query = Transaction::where('user_id', $user->id);
            if ($type && in_array($type, ['income', 'expense'])) {
                $query->where('type', $type);
            }
            if ($categoryId) {
                $query->where('category_id', $categoryId);
            }
            if ($contactId) {
                $query->where('contact_id', $contactId);
            }
            if ($search) {
                $query->where('label', 'like', '%' . $search . '%');
            }
            $transactions = $query->orderBy('date', 'desc')->get();

            return response()->json(['success' => true, 'transactions' => $transactions]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Erreur lors de la récupération des transactions', 'error' => $e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        try {
            $user = Auth::user();
            if (!$user) {
                return response()->json(['success' => false, 'message' => 'Utilisateur non authentifié'], 401);
            }

            $transaction = Transaction::where('id', $id)->where('user_id', $user->id)->first();
            if (!$transaction) {
                return response()->json(['success' => false, 'message' => 'Transaction non trouvée'], 404);
            }

            return response()->json(['success' => true, 'transaction' => $transaction]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Erreur lors de la récupération de la transaction', 'error' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'amount' => 'required|numeric',
            'type' => 'required|in:income,expense',
            'label' => 'required|string|max:255',
            'description' => 'nullable|string',
            'date' => 'required|date',
            'category_id' => 'sometimes|integer|exists:categories,id',
            'contact_id' => 'sometimes|integer|exists:contacts,id',
            'debt_id' => 'sometimes|integer|exists:debts,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'message' => 'Erreur de validation', 'errors' => $validator->errors()], 422);
        }

        try {
            $user = Auth::user();
            if (!$user) {
                return response()->json(['success' => false, 'message' => 'Utilisateur non authentifié'], 401);
            }

            $data = [
                'user_id' => $user->id,
                'amount' => $request->amount,
                'type' => $request->type,
                'label' => $request->label,
                'description' => $request->description,
                'date' => $request->date,
            ];

            if ($request->has('category_id')) {
                $cat = Category::where('id', $request->category_id)->where('user_id', $user->id)->first();
                if (!$cat) {
                    return response()->json(['success' => false, 'message' => 'Catégorie invalide'], 404);
                }
                $data['category_id'] = $request->category_id;
            }
            if ($request->has('contact_id')) {
                $cont = Contact::where('id', $request->contact_id)->where('user_id', $user->id)->first();
                if (!$cont) {
                    return response()->json(['success' => false, 'message' => 'Contact invalide'], 404);
                }
                $data['contact_id'] = $request->contact_id;
            }
            if ($request->has('debt_id')) {
                $debt = Debt::where('id', $request->debt_id)->where('user_id', $user->id)->first();
                if (!$debt) {
                    return response()->json(['success' => false, 'message' => 'Dette invalide'], 404);
                }
                $data['debt_id'] = $request->debt_id;
            }

            $transaction = Transaction::create($data);

            // Ajuster la dette si nécessaire
            if (!empty($transaction->debt_id)) {
                $this->adjustDebt($transaction->debt_id, -$transaction->amount);
            }

            // Mettre à jour les rapports automatiquement
            \App\Models\Report::updateOrCreateForPeriod($user->id, 'daily', $transaction->date);
            \App\Models\Report::updateOrCreateForPeriod($user->id, 'monthly', $transaction->date->startOfMonth());
            \App\Models\Report::updateOrCreateForPeriod($user->id, 'dashboard', now()->toDateString());

            return response()->json(['success' => true, 'message' => 'Transaction créée avec succès', 'transaction' => $transaction], 201);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Erreur lors de la création de la transaction', 'error' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'amount' => 'sometimes|numeric',
            'type' => 'sometimes|in:income,expense',
            'label' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'date' => 'sometimes|date',
            'category_id' => 'sometimes|integer|exists:categories,id',
            'contact_id' => 'sometimes|integer|exists:contacts,id',
            'debt_id' => 'sometimes|integer|exists:debts,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'message' => 'Erreur de validation', 'errors' => $validator->errors()], 422);
        }

        try {
            $user = Auth::user();
            if (!$user) {
                return response()->json(['success' => false, 'message' => 'Utilisateur non authentifié'], 401);
            }

            $oldDate = $transaction->date;

            $updateData = [];
            if ($request->has('amount')) $updateData['amount'] = $request->amount;
            if ($request->has('type')) $updateData['type'] = $request->type;
            if ($request->has('label')) $updateData['label'] = $request->label;
            if ($request->has('description')) $updateData['description'] = $request->description;
            if ($request->has('date')) $updateData['date'] = $request->date;

            if ($request->has('category_id')) {
                $cat = Category::where('id', $request->category_id)->where('user_id', $user->id)->first();
                if (!$cat) {
                    return response()->json(['success' => false, 'message' => 'Catégorie invalide'], 404);
                }
                $updateData['category_id'] = $request->category_id;
            }
            if ($request->has('contact_id')) {
                $cont = Contact::where('id', $request->contact_id)->where('user_id', $user->id)->first();
                if (!$cont) {
                    return response()->json(['success' => false, 'message' => 'Contact invalide'], 404);
                }
                $updateData['contact_id'] = $request->contact_id;
            }
            if ($request->has('debt_id')) {
                $debt = Debt::where('id', $request->debt_id)->where('user_id', $user->id)->first();
                if (!$debt) {
                    return response()->json(['success' => false, 'message' => 'Dette invalide'], 404);
                }
                $updateData['debt_id'] = $request->debt_id;
            }

            $transaction->update($updateData);

            // Mettre à jour les rapports automatiquement (ancienne et nouvelle période si la date a changé)
            \App\Models\Report::updateOrCreateForPeriod($user->id, 'daily', $transaction->date);
            \App\Models\Report::updateOrCreateForPeriod($user->id, 'monthly', $transaction->date->startOfMonth());
            \App\Models\Report::updateOrCreateForPeriod($user->id, 'dashboard', now()->toDateString());

            if ($oldDate != $transaction->date) {
                \App\Models\Report::updateOrCreateForPeriod($user->id, 'daily', $oldDate);
                \App\Models\Report::updateOrCreateForPeriod($user->id, 'monthly', $oldDate->startOfMonth());
            }

            return response()->json(['success' => true, 'message' => 'Transaction mise à jour avec succès', 'transaction' => $transaction]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Erreur lors de la mise à jour de la transaction', 'error' => $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $user = Auth::user();
            if (!$user) {
                return response()->json(['success' => false, 'message' => 'Utilisateur non authentifié'], 401);
            }

            $transaction = Transaction::where('id', $id)->where('user_id', $user->id)->first();
            if (!$transaction) {
                return response()->json(['success' => false, 'message' => 'Transaction non trouvée'], 404);
            }

            $transactionDate = $transaction->date;
            $debtId = $transaction->debt_id;
            $amount = $transaction->amount;
            $transaction->delete();

            // ajuster dette si nécessaire
            if ($debtId) {
                $this->adjustDebt($debtId, +$amount);
            }

            // Mettre à jour les rapports automatiquement après suppression
            \App\Models\Report::updateOrCreateForPeriod($user->id, 'daily', $transactionDate);
            \App\Models\Report::updateOrCreateForPeriod($user->id, 'monthly', $transactionDate->startOfMonth());
            \App\Models\Report::updateOrCreateForPeriod($user->id, 'dashboard', now()->toDateString());

            return response()->json(['success' => true, 'message' => 'Transaction supprimée avec succès']);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Erreur lors de la suppression de la transaction', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Ajuste le montant d'une dette et met à jour son statut.
     *
     * @param int $debtId
     * @param float $deltaAmount positif augmente, négatif diminue
     */
    private function adjustDebt($debtId, $deltaAmount)
    {
        $debt = Debt::where('id', $debtId)->first();
        if (!$debt) {
            return;
        }

        $original = $debt->getOriginal('amount');
        $debt->amount += $deltaAmount;

        if ($debt->amount <= 0) {
            $debt->amount = 0;
            $debt->status = 'paid';
        } elseif ($debt->amount < $original) {
            $debt->status = 'partially_paid';
        } else {
            $debt->status = 'pending';
        }

        $debt->save();
    }
}
