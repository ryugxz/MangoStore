<?php

namespace App\Http\Controllers;

use App\Models\VendorDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;


class VendorDetailController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(VendorDetail $vendorDetail)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(VendorDetail $vendorDetail)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $user_id)
    {
        Log::info('VendorDetail update operation started.', ['user_id' => $user_id]);

        // Log the incoming request data
        Log::info('Incoming request data:', $request->all());

        try {
            // Find the vendor detail by user_id
            $vendorDetail = VendorDetail::where('user_id', $user_id)->first();

            // Log the result of the vendor detail search
            if (!$vendorDetail) {
                Log::warning('Vendor detail not found.', ['user_id' => $user_id]);
                return response()->json(['message' => 'Vendor detail not found'], 404);
            }

            Log::info('Vendor detail found.', ['vendorDetail' => $vendorDetail]);

            // Update the vendor detail
            $vendorDetail->update($request->all());

            Log::info('Vendor detail updated successfully.', ['vendorDetail' => $vendorDetail]);

            return response()->json(['message' => 'Vendor detail updated successfully']);
        } catch (\Exception $e) {
            Log::error('Error updating vendor detail.', [
                'user_id' => $user_id,
                'error' => $e->getMessage(),
                'stack' => $e->getTraceAsString()
            ]);

            return response()->json(['message' => 'Failed to update vendor detail'], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(VendorDetail $vendorDetail)
    {
        //
    }

    public function showByUserId($user_id)
    {
        // Find the vendor detail by user_id
        $vendorDetail = VendorDetail::where('user_id', $user_id)->first();
    
        // Check if vendor detail exists
        if (!$vendorDetail) {
            return response()->json(['message' => 'Vendor detail not found'], 404);
        }
    
        return response()->json($vendorDetail);
    }
}
