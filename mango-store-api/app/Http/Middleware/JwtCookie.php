<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class JwtCookie
{
    public function handle(Request $request, Closure $next)
    {
        Log::debug('jwt cookie function'); // Log to check if middleware is called
        if ($jwt = $request->cookie('jwt')) {
            Log::debug('jwt: ' . $jwt);
            $request->headers->set('Authorization', 'Bearer ' . $jwt);
        }
        Log::debug('passed jwt');
        return $next($request);
    }
}
