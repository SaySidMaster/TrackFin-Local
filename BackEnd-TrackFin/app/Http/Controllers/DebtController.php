<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use App\Models\Debt;
use App\Models\Contact;

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
            if (!$user) {
                return response()->json(['success' => false, 'message' => 'Utilisateur non authentifié'], 401);
            }

            $data = [
                'user_id' => $user->id,
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
            return response()->json(['success' => true, 'message' => 'Dette supprimée avec succès']);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Erreur lors de la suppression de la dette', 'error' => $e->getMessage()], 500);
        }
    }
}
