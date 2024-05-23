<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;
use Illuminate\Validation\ValidationException;


class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $products = Product::all();  // Fetch all products from the database
        return response()->json([
            'message' => 'Products retrieved successfully',
            'data' => $products
        ], 200);
    }
    

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            // Validate incoming request data
            $validatedData = $request->validate([
                'name' => 'required|string|max:255', // Name is required
                'description' => 'nullable|string',
                'price' => 'required|numeric', // Price is required
                'vendor_id' => 'required|exists:users,id' // Vendor ID is required and must exist in the users table
            ]);
    
            // Create a new Product instance and save to database
            $product = new Product($validatedData);
            $product->save();
    
            // Return success response
            return response()->json([
                'message' => 'Product successfully created',
                'data' => $product
            ], 201);
            
        } catch (\Illuminate\Validation\ValidationException $e) {
            // Handle validation errors
            return response()->json([
                'errors' => $e->errors()
            ], 422); // HTTP status code 422: Unprocessable Entity
        } catch (\Exception $e) {
            // General error handling
            \Log::error('Error creating product: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to create product',
                'error' => $e->getMessage()
            ], 500); // HTTP status code 500: Internal Server Error
        }
    }
     

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        return response()->json([
            'message' => 'Product retrieved successfully',
            'data' => $product
        ], 200);
    }
    

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    {
        try {
            // Validate incoming request data
            $validatedData = $request->validate([
                'name' => 'nullable|string|max:255',
                'description' => 'nullable|string',
                'price' => 'nullable|numeric',
                'vendor_id' => 'nullable|exists:users,id'
            ]);
    
            // Update product with validated data
            $product->update($validatedData);
    
            // Return success response
            return response()->json([
                'message' => 'Product updated successfully',
                'data' => $product
            ], 200);
            
        } catch (\Illuminate\Validation\ValidationException $e) {
            // Handle validation errors
            return response()->json([
                'errors' => $e->errors()
            ], 422); // HTTP status code 422: Unprocessable Entity
        } catch (\Exception $e) {
            // General error handling
            \Log::error('Error updating product: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to update product',
                'error' => $e->getMessage()
            ], 500); // HTTP status code 500: Internal Server Error
        }
    }
    

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        try {
            $product->delete(); // Delete the product
    
            return response()->json([
                'message' => 'Product deleted successfully'
            ], 200);
            
        } catch (\Exception $e) {
            \Log::error('Error deleting product: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to delete product',
                'error' => $e->getMessage()
            ], 500); // HTTP status code 500: Internal Server Error
        }
    }
    
}
