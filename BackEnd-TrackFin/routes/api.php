<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthentificationController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\BudgetController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\DebtController;
use App\Http\Controllers\PaymentMethodController;
use App\Http\Controllers\ReportController;

Route::get('/test', [AuthentificationController::class, 'test'])->name('api.test');

//Authentification
Route::post('/register', [AuthentificationController::class, 'register'])->name('api.register');
Route::post('/login', [AuthentificationController::class, 'login'])->name('api.login');
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthentificationController::class, 'logout'])->name('api.logout');
    Route::get('/user', [AuthentificationController::class, 'user'])->name('api.user');

    // Admin-only operations
    Route::get('/user/{id}', [AuthentificationController::class, 'getUser'])
        ->middleware('role:admin')
        ->name('api.getUser');
    Route::put('/user/{id}', [AuthentificationController::class, 'updateUser'])
        ->middleware('role:admin')
        ->name('api.updateUser');
    Route::get('/users', [AuthentificationController::class, 'userList'])
        ->middleware('role:admin')
        ->name('api.userList');
    Route::delete('/user/{id}', [AuthentificationController::class, 'deleteUser'])
        ->middleware('role:admin')
        ->name('api.deleteUser');


    // Categories
    Route::get('/categories', [CategoryController::class, 'index'])->name('api.categories.index');
    Route::get('/categories/{id}', [CategoryController::class, 'show'])->name('api.categories.show');

    // create/update/delete reserved for admins and accountants
    Route::post('/categories', [CategoryController::class, 'store'])
        ->middleware('role:admin,accountant')
        ->name('api.categories.store');
    Route::put('/categories/{id}', [CategoryController::class, 'update'])
        ->middleware('role:admin,accountant')
        ->name('api.categories.update');
    Route::delete('/categories/{id}', [CategoryController::class, 'destroy'])
        ->middleware('role:admin,accountant')
        ->name('api.categories.destroy');


    // Contacts
    Route::get('/contacts', [ContactController::class, 'index'])->name('api.contacts.index');
    Route::get('/contacts/{id}', [ContactController::class, 'show'])->name('api.contacts.show');

    // modifications réservées aux rôles admin/accountant
    Route::post('/contacts', [ContactController::class, 'store'])
        ->middleware('role:admin,accountant')
        ->name('api.contacts.store');
    Route::put('/contacts/{id}', [ContactController::class, 'update'])
        ->middleware('role:admin,accountant')
        ->name('api.contacts.update');
    Route::delete('/contacts/{id}', [ContactController::class, 'destroy'])
        ->middleware('role:admin,accountant')
        ->name('api.contacts.destroy');


    // Budgets
    Route::get('/budgets', [BudgetController::class, 'index'])->name('api.budgets.index');
    Route::get('/budgets/{id}', [BudgetController::class, 'show'])->name('api.budgets.show');

    // nécessitent rôle admin ou accountant
    Route::post('/budgets', [BudgetController::class, 'store'])
        ->middleware('role:admin,accountant')
        ->name('api.budgets.store');
    Route::put('/budgets/{id}', [BudgetController::class, 'update'])
        ->middleware('role:admin,accountant')
        ->name('api.budgets.update');
    Route::delete('/budgets/{id}', [BudgetController::class, 'destroy'])
        ->middleware('role:admin,accountant')
        ->name('api.budgets.destroy');


    // Transactions
    Route::get('/transactions', [TransactionController::class, 'index'])->name('api.transactions.index');
    Route::get('/transactions/{id}', [TransactionController::class, 'show'])->name('api.transactions.show');

    // création/modification suppression réservées aux roles admin/accountant
    Route::post('/transactions', [TransactionController::class, 'store'])
        ->middleware('role:admin,accountant')
        ->name('api.transactions.store');
    Route::put('/transactions/{id}', [TransactionController::class, 'update'])
        ->middleware('role:admin,accountant')
        ->name('api.transactions.update');
    Route::delete('/transactions/{id}', [TransactionController::class, 'destroy'])
        ->middleware('role:admin,accountant')
        ->name('api.transactions.destroy');

    // Payment methods
    Route::get('/payment-methods', [PaymentMethodController::class, 'index'])->name('api.paymentMethods.index');
    Route::get('/payment-methods/{id}', [PaymentMethodController::class, 'show'])->name('api.paymentMethods.show');

    Route::post('/payment-methods', [PaymentMethodController::class, 'store'])
        ->middleware('role:admin,accountant')
        ->name('api.paymentMethods.store');
    Route::put('/payment-methods/{id}', [PaymentMethodController::class, 'update'])
        ->middleware('role:admin,accountant')
        ->name('api.paymentMethods.update');
    Route::delete('/payment-methods/{id}', [PaymentMethodController::class, 'destroy'])
        ->middleware('role:admin,accountant')
        ->name('api.paymentMethods.destroy');


    // Debts
    Route::get('/debts', [DebtController::class, 'index'])->name('api.debts.index');
    Route::get('/debts/{id}', [DebtController::class, 'show'])->name('api.debts.show');

    // opérations sensibles réservées aux admins/accountants
    Route::post('/debts', [DebtController::class, 'store'])
        ->middleware('role:admin,accountant')
        ->name('api.debts.store');
    Route::put('/debts/{id}', [DebtController::class, 'update'])
        ->middleware('role:admin,accountant')
        ->name('api.debts.update');
    Route::delete('/debts/{id}', [DebtController::class, 'destroy'])
        ->middleware('role:admin,accountant')
        ->name('api.debts.destroy');

    // paiement de dette
    Route::post('/debts/{id}/pay', [DebtController::class, 'pay'])
        ->middleware('role:admin,accountant')
        ->name('api.debts.pay');

    // Reports (read-only)
    Route::get('/reports', [ReportController::class, 'index'])->name('api.reports.index');
    Route::get('/reports/{id}', [ReportController::class, 'show'])->name('api.reports.show');
});
