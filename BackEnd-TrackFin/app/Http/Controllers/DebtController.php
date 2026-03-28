<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use App\Models\Debt;
use App\Models\Report;
use App\Models\Contact;
use App\Models\Transaction;
use App\Models\Team;

class DebtController extends Controller
{
    public function index(Request $request)
    {
        try {
            $user = Auth::user();
            if (!$user) {
                return response()->json(['success' => false, 'message' => 'Utilisateur non authentifié'], 401);
            }

            $type = $request->get('type');
            $status = $request->get('status');

            $query = Debt::where('user_id', $user->id);
            $team_id = Auth::user()->team_id;
            $query->where('team_id', $team_id);
            if ($type && in_array($type, ['to_receive', 'to_pay'])) {
                $query->where('type', $type);
            }
            if ($status && in_array($status, ['pending', 'partially_paid', 'paid'])) {
                $query->where('status', $status);
            }

            $debts = $query->orderBy('due_date', 'asc')->get();

            return response()->json(['success' => true, 'debts' => $debts]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Erreur lors de la récupération des dettes', 'error' => $e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        try {
            $user = Auth::user();
            if (!$user) {
                return response()->json(['success' => false, 'message' => 'Utilisateur non authentifié'], 401);
            }

            $debt = Debt::where('id', $id)->where('user_id', $user->id)->first();
            if (!$debt) {
                return response()->json(['success' => false, 'message' => 'Dette non trouvée'], 404);
            }

            return response()->json(['success' => true, 'debt' => $debt]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Erreur lors de la récupération de la dette', 'error' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'amount' => 'required|numeric|min:0',
            'type' => 'required|in:to_receive,to_pay',
            'due_date' => 'required|date',
            'status' => 'sometimes|in:pending,partially_paid,paid',
            'notes' => 'nullable|string',
            'contact_id' => 'sometimes|integer|exists:contacts,id',
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
                'due_date' => $request->due_date,
                'status' => $request->status ?? 'pending',
                'notes' => $request->notes,
            ];

            if ($request->has('contact_id')) {
                $cont = Contact::where('id', $request->contact_id)->where('user_id', $user->id)->first();
                if (!$cont) {
                    return response()->json(['success' => false, 'message' => 'Contact invalide'], 404);
                }
                $data['contact_id'] = $request->contact_id;
            }

            $debt = Debt::create($data);

            // Mettre à jour les rapports automatiquement
            $createdDate = now();
            Report::updateOrCreateForPeriod($user->id, 'daily', $createdDate->toDateString());
            Report::updateOrCreateForPeriod($user->id, 'monthly', $createdDate->startOfMonth());
            Report::updateOrCreateForPeriod($user->id, 'dashboard', $createdDate->toDateString());

            return response()->json(['success' => true, 'message' => 'Dette créée avec succès', 'debt' => $debt], 201);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Erreur lors de la création de la dette', 'error' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'amount' => 'sometimes|numeric|min:0',
            'type' => 'sometimes|in:to_receive,to_pay',
            'due_date' => 'sometimes|date',
            'status' => 'sometimes|in:pending,partially_paid,paid',
            'notes' => 'nullable|string',
            'contact_id' => 'sometimes|integer|exists:contacts,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'message' => 'Erreur de validation', 'errors' => $validator->errors()], 422);
        }

        try {
            $user = Auth::user();
            if (!$user) {
                return response()->json(['success' => false, 'message' => 'Utilisateur non authentifié'], 401);
            }

            $debt = Debt::where('id', $id)->where('user_id', $user->id)->first();
            if (!$debt) {
                return response()->json(['success' => false, 'message' => 'Dette non trouvée'], 404);
            }

            $updateData = [];
            if ($request->has('amount')) $updateData['amount'] = $request->amount;
            if ($request->has('type')) $updateData['type'] = $request->type;
            if ($request->has('due_date')) $updateData['due_date'] = $request->due_date;
            if ($request->has('status')) $updateData['status'] = $request->status;
            if ($request->has('notes')) $updateData['notes'] = $request->notes;

            if ($request->has('contact_id')) {
                $cont = Contact::where('id', $request->contact_id)->where('user_id', $user->id)->first();
                if (!$cont) {
                    return response()->json(['success' => false, 'message' => 'Contact invalide'], 404);
                }
                $updateData['contact_id'] = $request->contact_id;
            }

            $debt->update($updateData);

            // Mettre à jour les rapports automatiquement
            $updatedDate = now();
            Report::updateOrCreateForPeriod($user->id, 'daily', $updatedDate->toDateString());
            Report::updateOrCreateForPeriod($user->id, 'monthly', $updatedDate->startOfMonth());
            Report::updateOrCreateForPeriod($user->id, 'dashboard', $updatedDate->toDateString());

            return response()->json(['success' => true, 'message' => 'Dette mise à jour avec succès', 'debt' => $debt]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Erreur lors de la mise à jour de la dette', 'error' => $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $user = Auth::user();
            if (!$user) {
                return response()->json(['success' => false, 'message' => 'Utilisateur non authentifié'], 401);
            }

            $debt = Debt::where('id', $id)->where('user_id', $user->id)->first();
            if (!$debt) {
                return response()->json(['success' => false, 'message' => 'Dette non trouvée'], 404);
            }

            $debt->delete();

            // Mettre à jour les rapports automatiquement après suppression
            $deletedDate = now();
            Report::updateOrCreateForPeriod($user->id, 'daily', $deletedDate->toDateString());
            Report::updateOrCreateForPeriod($user->id, 'monthly', $deletedDate->startOfMonth());
            Report::updateOrCreateForPeriod($user->id, 'dashboard', $deletedDate->toDateString());

            return response()->json(['success' => true, 'message' => 'Dette supprimée avec succès']);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Erreur lors de la suppression de la dette', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Enregistrer un paiement de dette : créera une transaction et ajustera la dette.
     */
    public function pay(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'amount' => 'required|numeric|min:0',
            'date' => 'sometimes|date',
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'message' => 'Erreur de validation', 'errors' => $validator->errors()], 422);
        }

        try {
            $user = Auth::user();
            if (!$user) {
                return response()->json(['success' => false, 'message' => 'Utilisateur non authentifié'], 401);
            }

            $debt = Debt::where('id', $id)->where('user_id', $user->id)->first();
            if (!$debt) {
                return response()->json(['success' => false, 'message' => 'Dette non trouvée'], 404);
            }

            $amount = $request->amount;
            if ($amount > $debt->amount) {
                return response()->json(['success' => false, 'message' => 'Le montant de paiement dépasse la dette restante'], 422);
            }

            $team_id = Auth::user()->team_id;

            // créer transaction de paiement
            $trans = Transaction::create([
                'user_id' => $user->id,
                'team_id' => $team_id,
                'amount' => $amount,
                'type' => 'expense',
                'label' => 'Paiement dette #' . $debt->id,
                'description' => $request->description,
                'date' => $request->date ?? now(),
                'debt_id' => $debt->id,
            ]);

            // ajuster la dette
            $debt->amount -= $amount;
            if ($debt->amount <= 0) {
                $debt->amount = 0;
                $debt->status = 'paid';
            } elseif ($debt->amount > 0) {
                $debt->status = 'partially_paid';
            }
            $debt->save();

            // mettre à jour les rapports via la même logique que transaction store
            Report::updateOrCreateForPeriod($user->id, 'daily', $trans->date);
            Report::updateOrCreateForPeriod($user->id, 'monthly', $trans->date->startOfMonth());
            Report::updateOrCreateForPeriod($user->id, 'dashboard', now()->toDateString());

            return response()->json(['success' => true, 'message' => 'Paiement enregistré', 'transaction' => $trans, 'debt' => $debt]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Erreur lors du paiement', 'error' => $e->getMessage()], 500);
        }
    }
}
