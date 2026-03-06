<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthentificationController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\BudgetController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\DebtController;

Route::get('/test', [AuthentificationController::class, 'test'])->name('api.test');

//Authentification
Route::post('/register', [AuthentificationController::class, 'register'])->name('api.register');
Route::post('/login', [AuthentificationController::class, 'login'])->name('api.login');
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthentificationController::class, 'logout'])->name('api.logout');
    Route::get('/user', [AuthentificationController::class, 'user'])->name('api.user');
    Route::get('/user/{id}', [AuthentificationController::class, 'getUser'])->name('api.getUser');
    Route::put('/user/{id}', [AuthentificationController::class, 'updateUser'])->name('api.updateUser');
    Route::get('/users', [AuthentificationController::class, 'userList'])->name('api.userList');
    Route::delete('/user/{id}', [AuthentificationController::class, 'deleteUser'])->name('api.deleteUser');

    // Categories
    Route::get('/categories', [CategoryController::class, 'index'])->name('api.categories.index');
    Route::get('/categories/{id}', [CategoryController::class, 'show'])->name('api.categories.show');
    Route::post('/categories', [CategoryController::class, 'store'])->name('api.categories.store');
    Route::put('/categories/{id}', [CategoryController::class, 'update'])->name('api.categories.update');
    Route::delete('/categories/{id}', [CategoryController::class, 'destroy'])->name('api.categories.destroy');

    // Contacts
    Route::get('/contacts', [ContactController::class, 'index'])->name('api.contacts.index');
    Route::get('/contacts/{id}', [ContactController::class, 'show'])->name('api.contacts.show');
    Route::post('/contacts', [ContactController::class, 'store'])->name('api.contacts.store');
    Route::put('/contacts/{id}', [ContactController::class, 'update'])->name('api.contacts.update');
    Route::delete('/contacts/{id}', [ContactController::class, 'destroy'])->name('api.contacts.destroy');

    // Budgets
    Route::get('/budgets', [BudgetController::class, 'index'])->name('api.budgets.index');
    Route::get('/budgets/{id}', [BudgetController::class, 'show'])->name('api.budgets.show');
    Route::post('/budgets', [BudgetController::class, 'store'])->name('api.budgets.store');
    Route::put('/budgets/{id}', [BudgetController::class, 'update'])->name('api.budgets.update');
    Route::delete('/budgets/{id}', [BudgetController::class, 'destroy'])->name('api.budgets.destroy');

    // Transactions
    Route::get('/transactions', [TransactionController::class, 'index'])->name('api.transactions.index');
    Route::get('/transactions/{id}', [TransactionController::class, 'show'])->name('api.transactions.show');
    Route::post('/transactions', [TransactionController::class, 'store'])->name('api.transactions.store');
    Route::put('/transactions/{id}', [TransactionController::class, 'update'])->name('api.transactions.update');
    Route::delete('/transactions/{id}', [TransactionController::class, 'destroy'])->name('api.transactions.destroy');

    // Debts
    Route::get('/debts', [DebtController::class, 'index'])->name('api.debts.index');
    Route::get('/debts/{id}', [DebtController::class, 'show'])->name('api.debts.show');
    Route::post('/debts', [DebtController::class, 'store'])->name('api.debts.store');
    Route::put('/debts/{id}', [DebtController::class, 'update'])->name('api.debts.update');
    Route::delete('/debts/{id}', [DebtController::class, 'destroy'])->name('api.debts.destroy');
});


//