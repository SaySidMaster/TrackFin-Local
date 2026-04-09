<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use App\Models\Transaction;
use App\Models\Category;
use App\Models\Contact;
use App\Models\PaymentMethod;
use App\Models\Debt;
use App\Models\Team;

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

            $query = Transaction::query();
            $team_id = $user->team_id;
            $query->where('team_id', $team_id);
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

            $query = Transaction::where('id', $id)->where('team_id', $user->team_id);

            $transaction = $query->first();
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
            'payment_method_id' => 'nullable|integer|exists:payment_methods,id',
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
            $team_id = Auth::user()->team_id;
            if (!$user) {
                return response()->json(['success' => false, 'message' => 'Utilisateur non authentifié'], 401);
            }

            $data = [
                'user_id' => $user->id,
                'team_id' => $team_id,
                'amount' => $request->amount,
                'type' => $request->type,
                'label' => $request->label,
                'description' => $request->description ?? '',
                'payment_method_id' => $request->payment_method_id,
                'date' => $request->date,
            ];

            if ($request->has('category_id')) {
                $cat = Category::where('id', $request->category_id)->where('team_id', $team_id)->first();
                if (!$cat) {
                    return response()->json(['success' => false, 'message' => 'Catégorie invalide'], 404);
                }
                $data['category_id'] = $request->category_id;
            }
            if ($request->has('contact_id')) {
                $cont = Contact::where('id', $request->contact_id)->where('team_id', $team_id)->first();
                if (!$cont) {
                    return response()->json(['success' => false, 'message' => 'Contact invalide'], 404);
                }
                $data['contact_id'] = $request->contact_id;
            }
            if ($request->has('debt_id')) {
                $debt = Debt::where('id', $request->debt_id)->where('team_id', $team_id)->first();
                if (!$debt) {
                    return response()->json(['success' => false, 'message' => 'Dette invalide'], 404);
                }
                $data['debt_id'] = $request->debt_id;
            }

            if ($request->has('payment_method_id')) {
                $paymentMethod = PaymentMethod::where('id', $request->payment_method_id)->where('team_id', $team_id)->first();
                if (!$paymentMethod) {
                    return response()->json(['success' => false, 'message' => 'Méthode de paiement invalide'], 404);
                }
                $data['payment_method_id'] = $request->payment_method_id;
            }

            $transaction = Transaction::create($data);

            // Ajuster la dette si nécessaire
            if (!empty($transaction->debt_id)) {
                $this->adjustDebt($transaction->debt_id);
            }

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
            'description' => 'sometimes|nullable|string',
            'payment_method_id' => 'sometimes|nullable|integer|exists:payment_methods,id',
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

            $transaction = Transaction::where('id', $id)->where('team_id', $user->team_id)->first();
            if (!$transaction) {
                return response()->json(['success' => false, 'message' => 'Transaction non trouvée'], 404);
            }

            $oldDate = $transaction->date;

            $updateData = [];
            if ($request->has('amount')) $updateData['amount'] = $request->amount;
            if ($request->has('type')) $updateData['type'] = $request->type;
            if ($request->has('label')) $updateData['label'] = $request->label;
            if ($request->has('description')) $updateData['description'] = $request->description;
            if ($request->has('payment_method_id')) $updateData['payment_method_id'] = $request->payment_method_id;
            if ($request->has('date')) $updateData['date'] = $request->date;

            if ($request->has('category_id')) {
                $cat = Category::where('id', $request->category_id)->where('team_id', $user->team_id)->first();
                if (!$cat) {
                    return response()->json(['success' => false, 'message' => 'Catégorie invalide'], 404);
                }
                $updateData['category_id'] = $request->category_id;
            }
            if ($request->has('contact_id')) {
                $cont = Contact::where('id', $request->contact_id)->where('team_id', $user->team_id)->first();
                if (!$cont) {
                    return response()->json(['success' => false, 'message' => 'Contact invalide'], 404);
                }
                $updateData['contact_id'] = $request->contact_id;
            }
            if ($request->has('payment_method_id')) {
                $paymentMethod = PaymentMethod::where('id', $request->payment_method_id)->where('team_id', $user->team_id)->first();
                if (!$paymentMethod) {
                    return response()->json(['success' => false, 'message' => 'Méthode de paiement invalide'], 404);
                }
                $updateData['payment_method_id'] = $request->payment_method_id;
            }
            if ($request->has('debt_id')) {
                $debt = Debt::where('id', $request->debt_id)->where('team_id', $user->team_id)->first();
                if (!$debt) {
                    return response()->json(['success' => false, 'message' => 'Dette invalide'], 404);
                }
                $updateData['debt_id'] = $request->debt_id;
            }

            $transaction->update($updateData);

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

            $transaction = Transaction::where('id', $id)->where('team_id', $user->team_id)->first();
            if (!$transaction) {
                return response()->json(['success' => false, 'message' => 'Transaction non trouvée'], 404);
            }

            $transactionDate = $transaction->date;
            $debtId = $transaction->debt_id;
            $amount = $transaction->amount;
            $transaction->delete();

            // ajuster dette si nécessaire
            if ($debtId) {
                $this->adjustDebt($debtId); // ← sans delta
            }

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
    private function adjustDebt(int $debtId): void
    {
        $debt = Debt::find($debtId);
        if (!$debt) return;

        $totalPaid = $debt->transactions()->sum('amount');

        if ($totalPaid >= $debt->amount) {
            $debt->status = 'paid';
        } elseif ($totalPaid > 0) {
            $debt->status = 'partially_paid';
        } else {
            $debt->status = 'pending';
        }

        $debt->save(); // ← on ne touche JAMAIS à debt->amount
    }
}
