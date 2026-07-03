<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MasterOption;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class MasterOptionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        return Inertia::render('admin/options/index', [
            'statuses' => MasterOption::where('type', 'status')->orderBy('id')->get(),
            'categories' => MasterOption::where('type', 'category')->orderBy('value')->get(),
            'applications' => MasterOption::where('type', 'application')->orderBy('value')->get(),
            'sources' => MasterOption::where('type', 'source')->orderBy('value')->get(),
            'technicalCategories' => MasterOption::where('type', 'technical_category')->orderBy('value')->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'type' => 'required|in:status,category,application,source,technical_category',
            'value' => [
                'required',
                'string',
                'max:255',
                // Case-insensitive uniqueness check for value within the same type
                Rule::unique('master_options')->where(function ($query) use ($request) {
                    return $query->where('type', $request->type)
                        ->where('value', $request->value);
                }),
            ],
        ], [
            'value.unique' => 'Opsi ini sudah terdaftar.',
        ]);

        // Status values should be uppercase
        if ($validated['type'] === 'status') {
            $validated['value'] = strtoupper($validated['value']);
        }

        MasterOption::create($validated);

        return redirect()->route('admin.options.index')
            ->with('success', 'Opsi berhasil ditambahkan!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(MasterOption $option): RedirectResponse
    {
        // Prevent deleting core system statuses: OPEN and DONE
        if ($option->type === 'status' && in_array(strtoupper($option->value), ['OPEN', 'DONE'])) {
            return redirect()->back()
                ->with('error', 'Status OPEN dan DONE adalah status sistem inti yang tidak dapat dihapus!');
        }

        $optionValue = $option->value;
        $option->delete();

        return redirect()->route('admin.options.index')
            ->with('success', "Opsi \"{$optionValue}\" berhasil dihapus!");
    }
}
