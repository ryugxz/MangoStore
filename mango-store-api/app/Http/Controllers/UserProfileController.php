<?php

namespace App\Http\Controllers;

use App\Models\UserProfile;
use Illuminate\Http\Request;

class UserProfileController extends Controller
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
    public function show(UserProfile $userProfile)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(UserProfile $userProfile)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $user_id)
    {
        // Find the user profile by user_id
        $userProfile = UserProfile::where('user_id', $user_id)->first();
    
        // Check if user profile exists
        if (!$userProfile) {
            return response()->json(['message' => 'User profile not found'], 404);
        }
    
        // Update the user profile
        $userProfile->update($request->all());
    
        return response()->json(['message' => 'User profile updated successfully']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(UserProfile $userProfile)
    {
        //
    }

    public function showByUserId($user_id)
    {
        // Find the user profile by user_id
        $userProfile = UserProfile::where('user_id', $user_id)->first();
        
        // Check if user profile exists
        if (!$userProfile) {
            return response()->json(['message' => 'User profile not found'], 404);
        }
    
        return response()->json($userProfile);
    }
}
