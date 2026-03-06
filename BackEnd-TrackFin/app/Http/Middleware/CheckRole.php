<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CheckRole
{
    /**
     * Handle an incoming request.
     * Syntax in route: ->middleware('role:admin') or ->middleware('role:admin,accountant')
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string  $roles
     * @return mixed
     */
    public function handle(Request $request, Closure $next, $roles)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Utilisateur non authentifié'], 401);
        }

        $allowed = explode(',', $roles);
        if (!in_array($user->role, $allowed)) {
            return response()->json(['success' => false, 'message' => 'Accès interdit, rôle requis: ' . $roles], 403);
        }

        return $next($request);
    }
}
