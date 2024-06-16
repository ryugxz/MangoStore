<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VendorDetail extends Model
{
    use HasFactory;

    protected $table = 'vendordetails';

    protected $fillable = [
        'store_name',
        'user_id', 
        'bank_name', 
        'promptpay_number', 
        'additional_qr_info'
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }
}
