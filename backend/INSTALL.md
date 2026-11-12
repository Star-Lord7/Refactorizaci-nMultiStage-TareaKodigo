# Ecommerce API — Laravel 12

1. Instala PHP 8.2+, Composer y MySQL 8+.
2. En esta carpeta ejecuta `composer install`.
3. Copia `.env.example` a `.env`, configura MySQL y ejecuta `php artisan key:generate`.
4. Ejecuta `php artisan jwt:secret` y `php artisan migrate --seed`.
5. Inicia con `php artisan serve`.

Configura `STRIPE_SECRET` y `STRIPE_WEBHOOK_SECRET` antes de activar pagos.

## Docker Compose

Desde la raíz del monorepo, copia `.env.example` a `.env` y completa las claves de MySQL, Laravel, JWT y Stripe. No compartas ni subas `.env` al repositorio.

```powershell
Copy-Item .env.example .env
docker compose build
docker compose up -d db
docker compose --profile tools run --rm migrate
docker compose up -d
docker compose ps
```

La tienda queda en `http://localhost:3000` y el API en `http://localhost:8000`. MySQL solo está disponible dentro de la red privada de Compose y sus datos persisten en el volumen `mysql_data`. En producción, publica ambas aplicaciones detrás de un proxy HTTPS; configura el webhook de Stripe con la URL HTTPS pública del API.
