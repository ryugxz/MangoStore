<?php

namespace App\Http\Controllers;

use App\Models\PromotionType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log; // Import Log facade

class PromotionTypeController extends Controller
{
    // Create a new PromotionType
    public function store(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255',
                'description' => 'nullable|string',
            ]);

            $promotionType = PromotionType::create([
                'name' => $request->name,
                'description' => $request->description,
            ]);

            return response()->json([
                'message' => 'Promotion Type created successfully',
                'data' => $promotionType
            ], 201);
        } catch (\Exception $e) {
            Log::error('Error creating promotion type: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to create promotion type',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Get all PromotionTypes
    public function index()
    {
        try {
            $promotionTypes = PromotionType::all();

            return response()->json([
                'message' => 'Promotion Types retrieved successfully',
                'data' => $promotionTypes
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error retrieving promotion types: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to retrieve promotion types',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Get a single PromotionType
    public function show($id)
    {
        try {
            $promotionType = PromotionType::findOrFail($id);

            return response()->json([
                'message' => 'Promotion Type retrieved successfully',
                'data' => $promotionType
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error retrieving promotion type: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to retrieve promotion type',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Update a PromotionType
    public function update(Request $request, $id)
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255',
                'description' => 'nullable|string',
            ]);

            $promotionType = PromotionType::findOrFail($id);
            $promotionType->update([
                'name' => $request->name,
                'description' => $request->description,
            ]);

            return response()->json([
                'message' => 'Promotion Type updated successfully',
                'data' => $promotionType
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error updating promotion type: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to update promotion type',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Delete a PromotionType
    public function destroy($id)
    {
        try {
            $promotionType = PromotionType::findOrFail($id);
            $promotionType->delete();

            return response()->json([
                'message' => 'Promotion Type deleted successfully'
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error deleting promotion type: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to delete promotion type',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
