<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class JwtCookie
{
    public function handle(Request $request, Closure $next)
    {        
        // Check if a valid Authorization header is already present
        $authorizationHeader = $request->header('Authorization');
        if ($authorizationHeader && str_starts_with($authorizationHeader, 'Bearer ')) {
        } else {
            // Attempt to get JWT from cookie
            $jwt = $request->cookie('jwt');
            if ($jwt && $this->isValidJwt($jwt)) {
                $request->headers->set('Authorization', 'Bearer ' . $jwt);
            } else {
            }
        }

        return $next($request);
    }

    /**
     * Validate the JWT format (You can expand this function to include more robust validation as required)
     */
    private function isValidJwt($jwt): bool
    {
        // Basic format check – you might want to replace this with actual decoding/validation logic
        return preg_match('/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/', $jwt) > 0;
    }
}
