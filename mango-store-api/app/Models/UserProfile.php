<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserProfile extends Model
{
    use HasFactory;

    protected $table = 'userprofile';

    protected $fillable = [
        'user_id',
        'firstname',
        'lastname',
        'email', 
        'address', 
        'phone'
    ];
    

    public function user() {
        return $this->belongsTo(User::class);
    }
}
