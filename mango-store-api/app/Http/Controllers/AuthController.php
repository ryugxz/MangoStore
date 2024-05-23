<?php
  namespace App\Http\Controllers;

  use App\Http\Controllers\Controller;
  use App\Models\User;
  use App\Models\UserProfile;
  use Illuminate\Http\Request;
  use Illuminate\Support\Facades\Auth;
  use Illuminate\Support\Facades\Validator;
  use Illuminate\Support\Facades\Log;
  
  class AuthController extends Controller
  {
      /**
       * Register a User.
       *
       * @return \Illuminate\Http\JsonResponse
       */
      public function register(Request $request)
      {
          $validator = Validator::make($request->all(), [
              'username' => 'required|unique:users,username',
              'password' => 'required|min:8',
              'firstname' => 'required|unique:userprofile,firstname',
              'lastname' => 'required|unique:userprofile,lastname',
              'role' => 'required',
              'email' => 'required|email|unique:userprofile,email',
              'address' => 'required',
              'phone' => 'required'
          ]);
      
          if ($validator->fails()) {
              Log::error('Registration failed: ' . $validator->errors());
              return response()->json($validator->errors(), 400);
          }
      
          try {
              // ตรวจสอบว่ามีผู้ใช้ที่มี role 'Admin' อยู่แล้วเกิน 3 คนหรือไม่
              if (strtolower($request->role) === 'admin' && User::whereRaw('lower(role) = ?', ['admin'])->count() >= 3) {
                  return response()->json(['error' => 'Unauthorized', 'message' => 'Cannot have more than 3 admin users'], 403);
              }
      
              // สร้าง User
              $user = User::create([
                  'username' => $request->username,
                  'password' => bcrypt($request->password),
                  'role' => $request->role
              ]);
      
              // สร้าง UserProfile และผูกกับ User ที่สร้างใหม่
              $userProfile = UserProfile::create([
                  'user_id' => $user->id,
                  'firstname' => $request->firstname,
                  'lastname' => $request->lastname,
                  'email' => $request->email,
                  'address' => $request->address,
                  'phone' => $request->phone
              ]);
      
              // Attempt to generate a token for the registered user
              $token = auth()->attempt([
                  'username' => $request->username,
                  'password' => $request->password
              ]);
      
              if (!$token) {
                  return response()->json(['error' => 'Unauthorized', 'message' => 'Authentication failed'], 401);
              }
      
              return $this->respondWithToken($token);
          } catch (\Exception $e) {
              Log::error('Registration process failed: ' . $e->getMessage());
              return response()->json(['error' => 'Registration failed', 'message' => $e->getMessage()], 500);
          }
      }      
      
  
      /**
       * Get a JWT via given credentials.
       *
       * @return \Illuminate\Http\JsonResponse
       */
      public function login(Request $request)
      {
          $credentials = $request->only('username', 'password');
  
          if (!$token = auth()->attempt($credentials)) {
              return response()->json(['error' => 'Unauthorized'], 401);
          }
  
          return $this->respondWithToken($token);
      }
  
      /**
       * Log the user out (Invalidate the token).
       *
       * @return \Illuminate\Http\JsonResponse
       */
      public function logout()
      {
          try {
              auth()->logout();
              auth()->invalidate(true); // Invalidate token
              $cookie = \Cookie::forget('jwt'); // ลบ cookie ที่เก็บ token
  
              return response()->json(['message' => 'Successfully logged out'])->withCookie($cookie);
          } catch (\Exception $e) {
              return response()->json(['error' => 'Logout failed', 'message' => $e->getMessage()], 500);
          }
      }
  
      /**
       * Refresh a token.
       *
       * @return \Illuminate\Http\JsonResponse
       */
      public function refresh()
      {
          try {
              return $this->respondWithToken(auth()->refresh());
          } catch (\Exception $e) {
              return response()->json(['error' => 'Token refresh failed', 'message' => $e->getMessage()], 401);
          }
      }
  
      /**
       * Get the authenticated User.
       *
       * @return \Illuminate\Http\JsonResponse
       */
      public function me()
      {
          return response()->json(auth()->user());
      }
  
      /**
       * Get the token array structure.
       *
       * @param  string $token
       *
       * @return \Illuminate\Http\JsonResponse
       */
      protected function respondWithToken($token)
      {
          $cookie = cookie('jwt', $token, 60); // สร้าง cookie ชื่อ 'jwt' ที่หมดอายุใน 60 นาที
  
          return response()->json([
              'access_token' => $token,
              'token_type' => 'bearer',
              'expires_in' => auth()->factory()->getTTL() * 60,
              'user' => auth()->user() // เพิ่มข้อมูลผู้ใช้ในการตอบกลับ
          ])->cookie($cookie); // แนบ cookie ไปกับการตอบกลับ
      }

      /**
     * Delete a User.
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function deleteUser($id)
    {
        try {
            // ตรวจสอบว่า user ที่ทำการขอมี role เป็น Admin โดยไม่สนใจ case
            if (strcasecmp(Auth::user()->role, 'admin') !== 0) {
                return response()->json(['error' => 'Forbidden', 'message' => 'Access denied'], 403);
            }

            // หา user ที่ต้องการลบ
            $user = User::find($id);
            if (!$user) {
                return response()->json(['error' => 'Not Found', 'message' => 'User not found'], 404);
            }

            // ลบ user profile ที่เกี่ยวข้อง
            $user->userProfile()->delete();

            // ลบ user
            $user->delete();

            return response()->json(['message' => 'User and related profile deleted successfully']);
        } catch (\Exception $e) {
            Log::error('User deletion failed: ' . $e->getMessage());
            return response()->json(['error' => 'Deletion failed', 'message' => $e->getMessage()], 500);
        }
    }

}
  