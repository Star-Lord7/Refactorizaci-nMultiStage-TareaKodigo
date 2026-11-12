<?php
use Illuminate\Database\Migrations\Migration; use Illuminate\Database\Schema\Blueprint; use Illuminate\Support\Facades\Schema;
return new class extends Migration { public function up(): void { Schema::create('payments',function(Blueprint $t){$t->id();$t->foreignId('order_id')->unique()->constrained()->cascadeOnDelete();$t->string('stripe_payment_intent_id')->unique();$t->unsignedInteger('amount');$t->string('currency',3);$t->string('status')->index();$t->timestamps();}); } public function down(): void {Schema::dropIfExists('payments');} };
