<?php

namespace App\Http\Controllers;

use App\Models\UserProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;


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
        // Log the incoming request data and user_id
        Log::info('Update User Profile Request', [
            'user_id' => $user_id,
            'request_data' => $request->all()
        ]);
    
        // Find the user profile by user_id
        $userProfile = UserProfile::where('user_id', $user_id)->first();
    
        // Check if user profile exists
        if (!$userProfile) {
            Log::warning('User profile not found', ['user_id' => $user_id]);
            return response()->json(['message' => 'User profile not found'], 404);
        }
    
        // Update the user profile
        $userProfile->update($request->all());
    
        // Log the successful update
        Log::info('User profile updated successfully', ['user_id' => $user_id]);
    
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
