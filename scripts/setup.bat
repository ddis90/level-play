@echo off
REM Levelplay Portal - Local Development Setup (Windows)
REM This script requires Node.js and npm to be installed

setlocal enabledelayedexpansion

echo ======================================
echo Levelplay Portal - Local Setup
echo ======================================
echo.

REM Check Node.js
where node >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed. Please install Node.js 18.x or higher.
    echo Download from: https://nodejs.org/
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo [OK] Node.js %NODE_VERSION% detected

REM Check npm
where npm >nul 2>&1
if errorlevel 1 (
    echo [ERROR] npm is not installed.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo [OK] npm %NPM_VERSION% detected

REM Check Docker
where docker >nul 2>&1
if errorlevel 1 (
    echo [INFO] Docker not found. You can still use embedded PostgreSQL or a cloud database.
    set DOCKER_AVAILABLE=0
) else (
    echo [OK] Docker detected
    set DOCKER_AVAILABLE=1
)

echo.
echo Setting up database...
echo.

REM Check if .env exists
if not exist ".env" (
    echo [INFO] Creating .env file from .env.example
    copy .env.example .env >nul
    echo [OK] .env file created
)

echo Choose your database option:
echo   1) Docker Compose (PostgreSQL in container) - Recommended
echo   2) Embedded PostgreSQL (built-in, for testing)
echo   3) Skip (I'll configure DATABASE_URL manually)
echo.
set /p DB_CHOICE="Enter choice [1-3]: "

if "%DB_CHOICE%"=="1" (
    if %DOCKER_AVAILABLE%==0 (
        echo [ERROR] Docker is not available. Please install Docker Desktop or choose another option.
        pause
        exit /b 1
    )

    echo [INFO] Starting PostgreSQL with Docker Compose...
    docker compose up -d postgres

    echo [INFO] Waiting for PostgreSQL to be ready...
    timeout /t 5 /nobreak >nul

    echo [OK] PostgreSQL started via Docker Compose
    echo [INFO] Make sure DATABASE_URL in .env is set to:
    echo        postgresql://postgres:postgres@localhost:5432/levelplay?schema=public
) else if "%DB_CHOICE%"=="2" (
    echo [INFO] Using embedded PostgreSQL
    echo [INFO] Make sure DATABASE_URL in .env is set to:
    echo        postgresql://postgres:postgres@localhost:55432/levelplay?schema=public
    echo.
    echo [INFO] You'll need to run in a separate terminal:
    echo        npm run db:local
) else if "%DB_CHOICE%"=="3" (
    echo [INFO] Skipping database setup. Make sure DATABASE_URL is set in .env
) else (
    echo [ERROR] Invalid choice. Exiting.
    pause
    exit /b 1
)

echo.
echo Installing dependencies...
echo.

call npm install
if errorlevel 1 (
    echo [ERROR] Failed to install dependencies
    pause
    exit /b 1
)
echo [OK] Dependencies installed

echo.
echo Setting up database schema...
echo.

call npm run db:generate
if errorlevel 1 (
    echo [ERROR] Failed to generate Prisma client
    pause
    exit /b 1
)
echo [OK] Prisma client generated

if "%DB_CHOICE%"=="1" (
    call npm run db:push
    if errorlevel 1 (
        echo [ERROR] Failed to push database schema
        pause
        exit /b 1
    )
    echo [OK] Database schema created

    echo.
    set /p SEED_CHOICE="Seed database with demo data? [Y/n]: "
    if /i "!SEED_CHOICE!"=="Y" (
        call npm run db:seed
        echo [OK] Database seeded with demo data
    )
    if /i "!SEED_CHOICE!"=="" (
        call npm run db:seed
        echo [OK] Database seeded with demo data
    )
)

echo.
echo ======================================
echo Setup Complete!
echo ======================================
echo.
echo Next steps:
echo.

if "%DB_CHOICE%"=="2" (
    echo 1. Start embedded PostgreSQL in a separate terminal:
    echo    npm run db:local
    echo.
    echo 2. In another terminal, run:
    echo    npm run db:push
    echo    npm run db:seed
    echo.
    echo 3. Start the development server:
    echo    npm run dev
) else (
    echo 1. Start the development server:
    echo    npm run dev
)

echo.
echo 2. Open your browser to: http://localhost:3000
echo.
echo Demo accounts (password: Passw0rd!):
echo   - admin@demo.test (Admin)
echo   - client@demo.test (Client)
echo   - engineer@demo.test (Engineer)
echo   - architect@demo.test (Architect)
echo.
echo [OK] Happy coding!
echo.
pause
