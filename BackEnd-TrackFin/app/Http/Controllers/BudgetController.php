<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use App\Models\Budget;
use App\Models\Category;

class BudgetController extends Controller
{
    public function index(Request $request)
    {
        try {
            $user = Auth::user();
            if (!$user) {
                return response()->json(['success' => false, 'message' => 'Utilisateur non authentifié'], 401);
            }

            $month = $request->get('month');
            $year = $request->get('year');

            $query = Budget::where('user_id', $user->id);
            if ($month) $query->where('month', $month);
            if ($year) $query->where('year', $year);
            $budgets = $query->orderBy('year', 'desc')->orderBy('month', 'desc')->get();

            return response()->json(['success' => true, 'budgets' => $budgets]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Erreur lors de la récupération des budgets', 'error' => $e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        try {
            $user = Auth::user();
            if (!$user) {
                return response()->json(['success' => false, 'message' => 'Utilisateur non authentifié'], 401);
            }

            $budget = Budget::where('id', $id)->where('user_id', $user->id)->first();
            if (!$budget) {
                return response()->json(['success' => false, 'message' => 'Budget non trouvé'], 404);
            }

            return response()->json(['success' => true, 'budget' => $budget]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Erreur lors de la récupération du budget', 'error' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'category_id' => 'required|integer|exists:categories,id',
            'month' => 'required|integer|between:1,12',
            'year' => 'required|integer|min:2000',
            'amount_limit' => 'required|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'message' => 'Erreur de validation', 'errors' => $validator->errors()], 422);
        }

        try {
            $user = Auth::user();
            if (!$user) {
                return response()->json(['success' => false, 'message' => 'Utilisateur non authentifié'], 401);
            }

            // s'assurer que la catégorie appartient à l'utilisateur
            $category = Category::where('id', $request->category_id)->where('user_id', $user->id)->first();
            if (!$category) {
                return response()->json(['success' => false, 'message' => 'Catégorie invalide'], 404);
            }

            $budget = Budget::create([
                'user_id' => $user->id,
                'category_id' => $request->category_id,
                'month' => $request->month,
                'year' => $request->year,
                'amount_limit' => $request->amount_limit,
            ]);

            return response()->json(['success' => true, 'message' => 'Budget créé avec succès', 'budget' => $budget], 201);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Erreur lors de la création du budget', 'error' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'category_id' => 'sometimes|integer|exists:categories,id',
            'month' => 'sometimes|integer|between:1,12',
            'year' => 'sometimes|integer|min:2000',
            'amount_limit' => 'sometimes|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'message' => 'Erreur de validation', 'errors' => $validator->errors()], 422);
        }

        try {
            $user = Auth::user();
            if (!$user) {
                return response()->json(['success' => false, 'message' => 'Utilisateur non authentifié'], 401);
            }

            $budget = Budget::where('id', $id)->where('user_id', $user->id)->first();
            if (!$budget) {
                return response()->json(['success' => false, 'message' => 'Budget non trouvé'], 404);
            }

            $updateData = [];
            if ($request->has('category_id')) {
                $cat = Category::where('id', $request->category_id)->where('user_id', $user->id)->first();
                if (!$cat) {
                    return response()->json(['success' => false, 'message' => 'Catégorie invalide'], 404);
                }
                $updateData['category_id'] = $request->category_id;
            }
            if ($request->has('month')) $updateData['month'] = $request->month;
            if ($request->has('year')) $updateData['year'] = $request->year;
            if ($request->has('amount_limit')) $updateData['amount_limit'] = $request->amount_limit;

            $budget->update($updateData);
            return response()->json(['success' => true, 'message' => 'Budget mis à jour avec succès', 'budget' => $budget]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Erreur lors de la mise à jour du budget', 'error' => $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $user = Auth::user();
            if (!$user) {
                return response()->json(['success' => false, 'message' => 'Utilisateur non authentifié'], 401);
            }

            $budget = Budget::where('id', $id)->where('user_id', $user->id)->first();
            if (!$budget) {
                return response()->json(['success' => false, 'message' => 'Budget non trouvé'], 404);
            }

            $budget->delete();
            return response()->json(['success' => true, 'message' => 'Budget supprimé avec succès']);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Erreur lors de la suppression du budget', 'error' => $e->getMessage()], 500);
        }
    }
}
