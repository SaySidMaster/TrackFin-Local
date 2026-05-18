<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    // database/migrations/xxxx_create_test_table.php
    public function up(): void
    {
        Schema::create('test', function (Blueprint $table) {
            $table->id();
            $table->timestamp('createdAt')->useCurrent();
            $table->string('url');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('test');
    }
};
