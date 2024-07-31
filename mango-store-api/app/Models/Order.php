<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $table = 'orders';

    protected $fillable = [
        'user_id', 
        'total_price', 
        'status',
        'payment_slip'
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function vendorDetail() {
        return $this->belongsTo(VendorDetail::class, 'vendor_detail_id');
    }

    public function orderDetails() {
        return $this->hasMany(OrderDetail::class);
    }
}

