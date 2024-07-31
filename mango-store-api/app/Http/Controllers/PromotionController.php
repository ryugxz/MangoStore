<?php

namespace App\Http\Controllers;

use App\Models\Promotion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log; // Import Log facade

class PromotionController extends Controller
{
    public function store(Request $request)
    {
        try {
            $request->validate([
                'product_id' => 'required|exists:products,id',
                'promotion_type_id' => 'required|exists:promotion_types,id',
                'discount_value' => 'required|numeric',
                'start_date' => 'required|date',
                'end_date' => 'required|date|after_or_equal:start_date',
                'min_quantity' => 'nullable|integer',
                'min_price' => 'nullable|numeric',
                'description' => 'nullable|string',
            ]);

            // Check if the product already has a promotion
            $existingPromotion = Promotion::where('product_id', $request->product_id)->where('end_date', '>=', now())->first();
            if ($existingPromotion) {
                return response()->json([
                    'message' => 'Failed to create promotion',
                    'error' => 'Product already has an existing promotion'
                ], 400);
            }

            $promotion = Promotion::create([
                'product_id' => $request->product_id,
                'promotion_type_id' => $request->promotion_type_id,
                'discount_value' => $request->discount_value,
                'start_date' => $request->start_date,
                'end_date' => $request->end_date,
                'min_quantity' => $request->min_quantity,
                'min_price' => $request->min_price,
                'description' => $request->description,
            ]);

            return response()->json([
                'message' => 'Promotion created successfully',
                'data' => $promotion
            ], 201);
        } catch (\Exception $e) {
            Log::error('Error creating promotion: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to create promotion',
                'error' => $e->getMessage()
            ], 500);
        }
    }
        
    // Get all Promotions
    public function index()
    {
        try {
            $promotions = Promotion::where('end_date', '>=', now())->get();

            return response()->json([
                'message' => 'Promotions retrieved successfully',
                'data' => $promotions
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error retrieving promotions: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to retrieve promotions',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Get a single Promotion
    public function show($id)
    {
        try {
            $promotion = Promotion::where('end_date', '>=', now())->findOrFail($id);

            return response()->json([
                'message' => 'Promotion retrieved successfully',
                'data' => $promotion
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error retrieving promotion: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to retrieve promotion',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Update a Promotion
    public function update(Request $request, $id)
    {
        try {
            $request->validate([
                'product_id' => 'required|exists:products,id',
                'promotion_type_id' => 'required|exists:promotion_types,id',
                'discount_value' => 'required|numeric',
                'start_date' => 'required|date',
                'end_date' => 'required|date|after_or_equal:start_date',
                'min_quantity' => 'nullable|integer',
                'min_price' => 'nullable|numeric',
                'description' => 'nullable|string',
            ]);

            $promotion = Promotion::where('end_date', '>=', now())->findOrFail($id);
            $promotion->update([
                'product_id' => $request->product_id,
                'promotion_type_id' => $request->promotion_type_id,
                'discount_value' => $request->discount_value,
                'start_date' => $request->start_date,
                'end_date' => $request->end_date,
                'min_quantity' => $request->min_quantity,
                'min_price' => $request->min_price,
                'description' => $request->description,
            ]);

            return response()->json([
                'message' => 'Promotion updated successfully',
                'data' => $promotion
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error updating promotion: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to update promotion',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Delete a Promotion
    public function destroy($id)
    {
        try {
            $promotion = Promotion::findOrFail($id);
            $promotion->delete();

            return response()->json([
                'message' => 'Promotion deleted successfully'
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error deleting promotion: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to delete promotion',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
