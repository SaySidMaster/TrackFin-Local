<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    
    
    public function up(): void
    {
        Schema::create('payment_methods', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->unsignedBigInteger('team_id')->nullable();
            $table->string('name');
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
            $table->foreign('team_id')->references('id')->on('teams')->onDelete('set null');
        });

        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            //Clé étrangère
            $table->unsignedBigInteger('user_id')->nullable();
            $table->unsignedBigInteger('category_id')->nullable();
            $table->unsignedBigInteger('contact_id')->nullable();
            $table->unsignedBigInteger('debt_id')->nullable();
            $table->unsignedBigInteger('team_id')->nullable();
            
            $table->decimal('amount', 12, 2);
            $table->enum('type', ['income', 'expense'])->default('income');
            $table->string('label');
            $table->text('description')->nullable();
            $table->unsignedBigInteger('payment_method_id')->nullable();
            $table->dateTime('date');
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
            $table->foreign('category_id')->references('id')->on('categories')->onDelete('set null');
            $table->foreign('contact_id')->references('id')->on('contacts')->onDelete('set null');
            $table->foreign('debt_id')->references('id')->on('debts')->onDelete('set null');
            $table->foreign('team_id')->references('id')->on('teams')->onDelete('set null');
            $table->foreign('payment_method_id')->references('id')->on('payment_methods')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
