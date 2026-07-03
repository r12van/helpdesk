<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tickets', function (Blueprint $table) {
            $table->id();
            $table->string('ticket_number')->unique();
            $table->enum('type', ['support', 'technical'])->default('support');
            $table->date('date');
            $table->string('reporter');
            $table->string('division')->nullable();
            $table->string('receiver')->nullable();
            $table->string('source')->nullable();
            $table->string('category')->nullable();
            $table->string('application')->nullable();
            $table->text('description');
            $table->string('location')->nullable();
            $table->text('problem')->nullable();
            $table->text('action_taken')->nullable();
            $table->string('attachment')->nullable();
            $table->foreignId('assigned_to')->nullable()->constrained('users')->nullOnDelete();
            $table->enum('status', ['OPEN', 'SCHEDULED', 'ON PROGRESS', 'EVALUATE', 'REVISION', 'DONE'])->default('OPEN');
            $table->date('due_date')->nullable();
            $table->datetime('start_date')->nullable();
            $table->datetime('end_date')->nullable();
            $table->string('duration')->nullable();
            $table->text('note')->nullable();
            $table->string('feedback_token')->unique()->nullable();
            $table->unsignedTinyInteger('feedback_rating')->nullable();
            $table->text('feedback_comment')->nullable();
            $table->datetime('feedback_submitted_at')->nullable();
            $table->timestamps();

            $table->index(['status', 'type']);
            $table->index('date');
            $table->index('assigned_to');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tickets');
    }
};
