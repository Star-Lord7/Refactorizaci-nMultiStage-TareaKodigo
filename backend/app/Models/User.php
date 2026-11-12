<?php
namespace App\Models;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use PHPOpenSourceSaver\JWTAuth\Contracts\JWTSubject;
use Illuminate\Database\Eloquent\Relations\HasMany;
class User extends Authenticatable implements JWTSubject {
 use Notifiable;
 protected $fillable=['name','email','password']; protected $hidden=['password','remember_token'];
 protected function casts(): array{return ['email_verified_at'=>'datetime','password'=>'hashed'];}
 public function getJWTIdentifier(): mixed{return $this->getKey();} public function getJWTCustomClaims(): array{return [];}
 public function orders(): HasMany{return $this->hasMany(Order::class);}
}
