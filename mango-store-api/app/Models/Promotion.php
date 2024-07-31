<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Promotion extends Model
{
    use HasFactory;
    
    protected $table = 'promotions';

    protected $fillable = [
        'product_id', 
        'promotion_type_id', 
        'discount_value', 
        'start_date', 
        'end_date',
        'min_quantity',
        'min_price', 
        'description',  
    ];

    public function product() {
        return $this->belongsTo(Product::class);
    }

    public function promotionType() {
        return $this->belongsTo(PromotionType::class);
    }

    public function toArray()
    {
        $array = parent::toArray();
        $array['promotion_type'] = $this->promotionType->name;
        return $array;
    }

    public function isApplicable($quantity, $price)
    {
        if ($this->min_quantity && $quantity < $this->min_quantity) {
            return false;
        }

        if ($this->min_price && $price < $this->min_price) {
            return false;
        }

        return true;
    }
}