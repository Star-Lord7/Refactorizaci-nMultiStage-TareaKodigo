<?php

use Illuminate\Foundation\Application;
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

// Cargar las dependencias de Composer
require __DIR__.'/../vendor/autoload.php';

// Inicializar Laravel
/** @var Application $app */
$app = require_once __DIR__.'/../bootstrap/app.php';

// Procesar las solicitudes HTTP
$app->handleRequest(Request::capture());