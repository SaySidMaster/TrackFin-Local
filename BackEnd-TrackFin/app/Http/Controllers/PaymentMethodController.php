<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use App\Models\PaymentMethod;

class PaymentMethodController extends Controller
{
    public function index(Request $request)
    {
        try {
            $user = Auth::user();
            if (!$user) {
                return response()->json(['success' => false, 'message' => 'Utilisateur non authentifié'], 401);
            }

            $search = $request->get('search');
            $query = PaymentMethod::query();
            $team_id = $user->team_id;
            $query->where('team_id', $team_id);

            if ($search) {
                $query->where('name', 'like', '%' . $search . '%');
            }

            $paymentMethods = $query->orderBy('id', 'asc')->get();

            return response()->json(['success' => true, 'payment_methods' => $paymentMethods]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Erreur lors de la récupération des méthodes de paiement', 'error' => $e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        try {
            $user = Auth::user();
            if (!$user) {
                return response()->json(['success' => false, 'message' => 'Utilisateur non authentifié'], 401);
            }

            $paymentMethod = PaymentMethod::where('id', $id)->where('team_id', $user->team_id)->first();
            if (!$paymentMethod) {
                return response()->json(['success' => false, 'message' => 'Méthode de paiement non trouvée'], 404);
            }

            return response()->json(['success' => true, 'payment_method' => $paymentMethod]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Erreur lors de la récupération de la méthode de paiement', 'error' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'message' => 'Erreur de validation', 'errors' => $validator->errors()], 422);
        }

        try {
            $user = Auth::user();
            if (!$user) {
                return response()->json(['success' => false, 'message' => 'Utilisateur non authentifié'], 401);
            }

            $paymentMethod = PaymentMethod::create([
                'user_id' => $user->id,
                'team_id' => $user->team_id,
                'name' => $request->name,
            ]);

            return response()->json(['success' => true, 'message' => 'Méthode de paiement créée avec succès', 'payment_method' => $paymentMethod], 201);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Erreur lors de la création de la méthode de paiement', 'error' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'message' => 'Erreur de validation', 'errors' => $validator->errors()], 422);
        }

        try {
            $user = Auth::user();
            if (!$user) {
                return response()->json(['success' => false, 'message' => 'Utilisateur non authentifié'], 401);
            }

            $paymentMethod = PaymentMethod::where('id', $id)->where('team_id', $user->team_id)->first();
            if (!$paymentMethod) {
                return response()->json(['success' => false, 'message' => 'Méthode de paiement non trouvée'], 404);
            }

            $updateData = [];
            if ($request->has('name')) $updateData['name'] = $request->name;

            $paymentMethod->update($updateData);

            return response()->json(['success' => true, 'message' => 'Méthode de paiement mise à jour avec succès', 'payment_method' => $paymentMethod]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Erreur lors de la mise à jour de la méthode de paiement', 'error' => $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $user = Auth::user();
            if (!$user) {
                return response()->json(['success' => false, 'message' => 'Utilisateur non authentifié'], 401);
            }

            $paymentMethod = PaymentMethod::where('id', $id)->where('team_id', $user->team_id)->first();
            if (!$paymentMethod) {
                return response()->json(['success' => false, 'message' => 'Méthode de paiement non trouvée'], 404);
            }

            $paymentMethod->delete();

            return response()->json(['success' => true, 'message' => 'Méthode de paiement supprimée avec succès']);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Erreur lors de la suppression de la méthode de paiement', 'error' => $e->getMessage()], 500);
        }
    }
}
