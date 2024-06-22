<?php

namespace App\Http\Controllers;

use App\Models\VendorDetail;
use Illuminate\Http\Request;

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
        // Find the vendor detail by user_id
        $vendorDetail = VendorDetail::where('user_id', $user_id)->first();
    
        // Check if vendor detail exists
        if (!$vendorDetail) {
            return response()->json(['message' => 'Vendor detail not found'], 404);
        }
    
        // Update the vendor detail
        $vendorDetail->update($request->all());
    
        return response()->json(['message' => 'Vendor detail updated successfully']);
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
