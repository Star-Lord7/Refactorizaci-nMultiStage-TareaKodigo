<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder; use App\Models\Product;
class DatabaseSeeder extends Seeder { public function run(): void { Product::insert([['name'=>'Teclado mecánico','description'=>'Teclado RGB','price'=>79.99,'stock'=>25,'is_active'=>true,'created_at'=>now(),'updated_at'=>now()],['name'=>'Ratón inalámbrico','description'=>'Ratón ergonómico','price'=>34.50,'stock'=>40,'is_active'=>true,'created_at'=>now(),'updated_at'=>now()]]); } }
