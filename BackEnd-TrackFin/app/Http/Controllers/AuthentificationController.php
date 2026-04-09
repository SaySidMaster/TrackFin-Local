<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\Team;
use App\Models\Category;
use App\Models\PaymentMethod;

class AuthentificationController extends Controller
{
    public function test()
    {
        return response()->json([
            'message' => 'API en ligne !!'
        ]);
    }
    
    public function register(Request $request)
    {
        // Validation des données
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'role' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur de validation',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Vérification de l'existence de l'utilisateur
            if (User::where('email', $request->email)->exists()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Un utilisateur avec cet email existe déjà'
                ], 409);
            }
            
            // Récupération du team_id de l'utilisateur connecté, sinon création d'une équipe
            if (Auth::check()) {
                $team_id = Auth::user()->team_id;
            } elseif (!$request->has('team_id')) {
                $team = Team::create([
                    'admin_email' => $request->email,
                ]);
                $team_id = $team->id;
            } else {
                $team_id = $request->team_id;
            }

            // Création de l'utilisateur
            $user = User::create([
                'name' => $request->name,
                'team_id' => $team_id,
                'email' => $request->email,
                'role' => $request->role,
                'password' => Hash::make($request->password), // Hashage explicite du mot de passe
            ]);

            // Créer les catégories par défaut si c'est une nouvelle team
            if (!$request->has('team_id')) {
                Category::create([
                    'name' => 'Ventes',
                    'type' => 'income',
                    'user_id' => $user->id,
                    'team_id' => $team_id,
                ]);

                Category::create([
                    'name' => 'Dettes',
                    'type' => 'expense',
                    'user_id' => $user->id,
                    'team_id' => $team_id,
                ]);

                // Créer les méthodes de paiement par défaut
                PaymentMethod::create([
                    'name' => 'Espèce',
                    'user_id' => $user->id,
                    'team_id' => $team_id,
                ]);

                PaymentMethod::create([
                    'name' => 'Orange Money',
                    'user_id' => $user->id,
                    'team_id' => $team_id,
                ]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Utilisateur créé avec succès',
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'created_at' => $user->created_at,
                    'updated_at' => $user->updated_at,
                ]
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création de l\'utilisateur',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    public function store(Request $request)
    {
        // Validation des données
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'role' => 'required|string|in:admin,accountant,cashier,user',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur de validation',
                'errors' => $validator->errors()
            ], 422);
        }

        $currentUser = Auth::user();

        if (!$currentUser) {
            return response()->json([
                'success' => false,
                'message' => 'Utilisateur non authentifié'
            ], 401);
        }

        if (!$currentUser->team_id) {
            return response()->json([
                'success' => false,
                'message' => 'Aucune équipe associée à l\'utilisateur connecté'
            ], 400);
        }

        try {
            if (User::where('email', $request->email)->exists()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Un utilisateur avec cet email existe déjà'
                ], 409);
            }

            $user = User::create([
                'name' => $request->name,
                'team_id' => $currentUser->team_id,
                'email' => $request->email,
                'role' => $request->role,
                'password' => Hash::make($request->password),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Utilisateur ajouté à l\'équipe avec succès',
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'team_id' => $user->team_id,
                    'created_at' => $user->created_at,
                    'updated_at' => $user->updated_at,
                ]
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de l\'ajout de l\'utilisateur',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    public function login(Request $request)
    {
        // Validation des données
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur de validation',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Recherche de l'utilisateur par email
            $user = User::where('email', $request->email)->first();

            // Vérification si l'utilisateur existe et si le mot de passe est correct
            if (!$user || !Hash::check($request->password, $user->password)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Identifiants incorrects'
                ], 401);
            }

            // Création du token d'authentification
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'success' => true,
                'message' => 'Connexion réussie',
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                ],
                'token' => $token,
                'token_type' => 'Bearer'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la connexion',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    public function logout(Request $request)
    {
        try {
            // Suppression du token actuel
            $request->user()->currentAccessToken()->delete();

            return response()->json([
                'success' => true,
                'message' => 'Déconnexion réussie'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la déconnexion',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    public function user(Request $request)
    {
        try {
            // Récupération de l'utilisateur authentifié
            $user = Auth::user();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Utilisateur non authentifié'
                ], 401);
            }

            return response()->json([
                'success' => true,
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'email_verified_at' => $user->email_verified_at,
                    'created_at' => $user->created_at,
                    'updated_at' => $user->updated_at,
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération de l\'utilisateur',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    public function getUser($id)
    {
        try {
            // La vérification de rôle se fait via middleware 'role:admin'
            $user = User::findOrFail($id);

            return response()->json([
                'success' => true,
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'email_verified_at' => $user->email_verified_at,
                    'created_at' => $user->created_at,
                    'updated_at' => $user->updated_at,
                ]
            ]);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Utilisateur non trouvé'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération de l\'utilisateur',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    public function updateUser(Request $request, $id)
    {
        // Validation des données
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|string|email|max:255|unique:users,email,' . $id,
            'role' => 'sometimes|string|in:admin,accountant,cashier,user',
            'password' => 'sometimes|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur de validation',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Recherche de l'utilisateur
            $user = User::findOrFail($id);

            // Préparation des données à mettre à jour
            $updateData = [];

            if ($request->has('name')) $updateData['name'] = $request->name;
            if ($request->has('email')) $updateData['email'] = $request->email;
            if ($request->has('role')) $updateData['role'] = $request->role;
            if ($request->has('password')) $updateData['password'] = Hash::make($request->password);

            // Mise à jour de l'utilisateur
            $user->update($updateData);

            return response()->json([
                'success' => true,
                'message' => 'Utilisateur mis à jour avec succès',
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'updated_at' => $user->updated_at,
                ]
            ]);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Utilisateur non trouvé'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la mise à jour',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    public function userList(Request $request) //S'assurer de ne retourner que les utilisateurs de la même équipe que l'utilisateur connecté
    {
        try {
            // Récupération des paramètres de pagination et filtrage
            $perPage = $request->get('per_page', 15);
            $role = $request->get('role');
            $search = $request->get('search');

            // Construction de la requête
            $query = User::select('id', 'name', 'status', 'email', 'role', 'email_verified_at', 'created_at', 'updated_at');
            $team_id = Auth::user()->team_id;
            $query->where('team_id', $team_id);
            // Filtrage par rôle
            if ($role) {
                $query->where('role', $role);
            }

            // Recherche par nom ou email
            if ($search) {
                $query->where(function($q) use ($search) {
                    $q->where('name', 'like', '%' . $search . '%')
                      ->orWhere('email', 'like', '%' . $search . '%');
                });
            }

            // Tri par date de création (plus récent en premier)
            $query->orderBy('created_at', 'desc');

            // Récupération de tous les utilisateurs sans pagination
            $users = $query->get();

            return response()->json([
                'success' => true,
                'users' => $users
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des utilisateurs',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    public function deleteUser($id)
    {
        try {
            // Recherche de l'utilisateur
            $user = User::findOrFail($id);

            // Suppression de l'utilisateur
            $user->delete();

            return response()->json([
                'success' => true,
                'message' => 'Utilisateur supprimé avec succès'
            ]);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Utilisateur non trouvé'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function toggleStatus(Request $request)
    {
        try {
            $user = Auth::user();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Utilisateur non authentifié'
                ], 401);
            }

            $user->toggleStatus();

            return response()->json([
                'success' => true,
                'message' => 'Statut mis à jour avec succès',
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'status' => $user->status,
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la mise à jour du statut',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Changer son propre mot de passe (tout utilisateur connecté)
    public function changeOwnPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'password'              => 'required|string|min:8',
            'password_confirmation' => 'required|same:password',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'message' => 'Erreur de validation', 'errors' => $validator->errors()], 422);
        }

        $user = Auth::user();
        $user->password = bcrypt($request->password);
        $user->save();

        return response()->json(['success' => true, 'message' => 'Mot de passe mis à jour avec succès']);
    }

    // Changer le mot de passe d'un membre de la team (admin uniquement)
    public function changeUserPassword(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'password'              => 'required|string|min:8',
            'password_confirmation' => 'required|same:password',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'message' => 'Erreur de validation', 'errors' => $validator->errors()], 422);
        }

        $admin  = Auth::user();
        $target = User::where('id', $id)->where('team_id', $admin->team_id)->first();

        if (!$target) {
            return response()->json(['success' => false, 'message' => 'Utilisateur non trouvé dans votre équipe'], 404);
        }

        $target->password = bcrypt($request->password);
        $target->save();

        return response()->json(['success' => true, 'message' => 'Mot de passe du membre mis à jour avec succès']);
    }
}
