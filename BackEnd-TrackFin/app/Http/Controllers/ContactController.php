<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use App\Models\Contact;
use App\Models\Team;

class ContactController extends Controller
{
    public function index(Request $request)
    {
        try {
            $user = Auth::user();
            if (!$user) {
                return response()->json(['success' => false, 'message' => 'Utilisateur non authentifié'], 401);
            }

            $type = $request->get('type'); // client ou supplier
            $search = $request->get('search');

            $query = Contact::query();
            $team_id = $user->team_id;
            $query->where('team_id', $team_id);

            if ($type && in_array($type, ['client', 'supplier'])) {
                $query->where('type', $type);
            }
            if ($search) {
                $query->where('name', 'like', '%' . $search . '%');
            }

            $contacts = $query->orderBy('name')->get();

            return response()->json(['success' => true, 'contacts' => $contacts]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Erreur lors de la récupération des contacts', 'error' => $e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        try {
            $user = Auth::user();
            if (!$user) {
                return response()->json(['success' => false, 'message' => 'Utilisateur non authentifié'], 401);
            }

            $contact = Contact::where('id', $id)->where('team_id', $user->team_id)->first();
            if (!$contact) {
                return response()->json(['success' => false, 'message' => 'Contact non trouvé'], 404);
            }

            return response()->json(['success' => true, 'contact' => $contact]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Erreur lors de la récupération du contact', 'error' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'type' => 'required|in:client,supplier',
            'phone' => 'required|string|max:50',
            'email' => 'required|string|email|max:255',
            'notes' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'message' => 'Erreur de validation', 'errors' => $validator->errors()], 422);
        }

        try {
            $user = Auth::user();
            if (!$user) {
                return response()->json(['success' => false, 'message' => 'Utilisateur non authentifié'], 401);
            }

            $team_id = Auth::user()->team_id;
            
            $contact = Contact::create([
                'user_id' => $user->id,
                'team_id' => $team_id,
                'name' => $request->name,
                'type' => $request->type,
                'phone' => $request->phone,
                'email' => $request->email,
                'notes' => $request->notes,
            ]);

            return response()->json(['success' => true, 'message' => 'Contact créé avec succès', 'contact' => $contact], 201);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Erreur lors de la création du contact', 'error' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'type' => 'sometimes|in:client,supplier',
            'phone' => 'sometimes|string|max:50',
            'email' => 'sometimes|string|email|max:255',
            'notes' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'message' => 'Erreur de validation', 'errors' => $validator->errors()], 422);
        }

        try {
            $user = Auth::user();
            if (!$user) {
                return response()->json(['success' => false, 'message' => 'Utilisateur non authentifié'], 401);
            }

            $contact = Contact::where('id', $id)->where('team_id', $user->team_id)->first();
            if (!$contact) {
                return response()->json(['success' => false, 'message' => 'Contact non trouvé'], 404);
            }

            $updateData = [];
            if ($request->has('name')) $updateData['name'] = $request->name;
            if ($request->has('type')) $updateData['type'] = $request->type;
            if ($request->has('phone')) $updateData['phone'] = $request->phone;
            if ($request->has('email')) $updateData['email'] = $request->email;
            if ($request->has('notes')) $updateData['notes'] = $request->notes;

            $contact->update($updateData);

            return response()->json(['success' => true, 'message' => 'Contact mis à jour avec succès', 'contact' => $contact]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Erreur lors de la mise à jour du contact', 'error' => $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $user = Auth::user();
            if (!$user) {
                return response()->json(['success' => false, 'message' => 'Utilisateur non authentifié'], 401);
            }

            $contact = Contact::where('id', $id)->where('team_id', $user->team_id)->first();
            if (!$contact) {
                return response()->json(['success' => false, 'message' => 'Contact non trouvé'], 404);
            }

            $contact->delete();
            return response()->json(['success' => true, 'message' => 'Contact supprimé avec succès']);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Erreur lors de la suppression du contact', 'error' => $e->getMessage()], 500);
        }
    }
}
