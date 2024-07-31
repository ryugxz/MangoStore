<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PromotionType extends Model
{
    use HasFactory;
    
    protected $table = 'promotion_types';

    protected $fillable = [
        'name', // เช่น Percentage Discount, Fixed Discount, Buy X Get Y
        'description' // รายละเอียดเพิ่มเติมถ้ามี
    ];

    public function promotions() {
        return $this->hasMany(Promotion::class);
    }
}