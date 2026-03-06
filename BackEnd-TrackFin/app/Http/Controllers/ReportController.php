<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use App\Models\Report;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        try {
            $user = Auth::user();
            if (!$user) {
                return response()->json(['success' => false, 'message' => 'Utilisateur non authentifié'], 401);
            }

            $periodType = $request->get('period_type');
            $periodDate = $request->get('period_date');

            $query = Report::where('user_id', $user->id);
            if ($periodType && in_array($periodType, ['daily', 'monthly', 'dashboard'])) {
                $query->where('period_type', $periodType);
            }
            if ($periodDate) {
                $query->where('period_date', $periodDate);
            }

            $reports = $query->orderBy('period_date', 'desc')->get();

            return response()->json(['success' => true, 'reports' => $reports]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Erreur lors de la récupération des rapports', 'error' => $e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        try {
            $user = Auth::user();
            if (!$user) {
                return response()->json(['success' => false, 'message' => 'Utilisateur non authentifié'], 401);
            }

            $report = Report::where('id', $id)->where('user_id', $user->id)->first();
            if (!$report) {
                return response()->json(['success' => false, 'message' => 'Rapport non trouvé'], 404);
            }

            return response()->json(['success' => true, 'report' => $report]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Erreur lors de la récupération du rapport', 'error' => $e->getMessage()], 500);
        }
    }
}
