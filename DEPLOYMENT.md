# Deployment Guide: Apache Subfolder (Ubuntu)

This guide explains how to deploy the IT Helpdesk application on an Ubuntu VPS under Apache in the subfolder `/supports` (`https://pemadam.jakarta.go.id/supports/`) without using Docker.

---

## Step 1: Install Prerequisites on VPS

Log in to your VPS and ensure you have PHP, Composer, and Node.js installed:

```bash
sudo apt update
sudo apt install -y php8.3-cli php8.3-fpm php8.3-sqlite3 php8.3-mbstring php8.3-xml php8.3-curl php8.3-zip php8.3-intl
sudo apt install -y apache2 libapache2-mod-fcgid

# Install Composer
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer

# Install Node.js & npm (for compiling frontend assets on the server)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

---

## Step 2: Upload Application Files

1. Clone or upload your Laravel codebase to `/var/www/helpdesk` on the VPS.
2. Ensure permissions are set correctly for Apache (`www-data` group):

```bash
sudo chown -R www-data:www-data /var/www/helpdesk
sudo chmod -R 775 /var/www/helpdesk/storage
sudo chmod -R 775 /var/www/helpdesk/bootstrap/cache
```

---

## Step 3: Configure Environment (.env)

Create a `.env` file in the root directory (`/var/www/helpdesk/.env`) and set the following parameters:

```ini
APP_NAME="IT Helpdesk"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://pemadam.jakarta.go.id/supports

# Enable SQLite Database
DB_CONNECTION=sqlite
DB_DATABASE=/var/www/helpdesk/database/database.sqlite

# Asset URL for compiled JS/CSS
ASSET_URL=https://pemadam.jakarta.go.id/supports

# Custom Subdirectory Route Prefix (Important for Inertia Client-side routing)
ROUTE_PREFIX=supports
```

Initialize the database file and make it writable:
```bash
touch /var/www/helpdesk/database/database.sqlite
chmod 664 /var/www/helpdesk/database/database.sqlite
chown www-data:www-data /var/www/helpdesk/database/database.sqlite
```

---

## Step 4: Configure Subfolder Routing in Laravel

To make all generated URLs and client-side Inertia routing work seamlessly under the `/supports` subfolder, wrap the routes inside a conditional prefix in your `routes/web.php` file:

```php
$prefix = env('ROUTE_PREFIX', '');

Route::prefix($prefix)->group(function () {
    Route::inertia('/', 'welcome')->name('home');

    Route::middleware(['auth', 'verified'])->group(function () {
        Route::get('dashboard', function () {
            // ... (dashboard logic)
        })->name('dashboard');

        Route::resource('tickets', TicketController::class);
    });

    Route::get('feedback/{token}', [FeedbackController::class, 'show'])->name('feedback.show');
    Route::post('feedback/{token}', [FeedbackController::class, 'store'])->name('feedback.store');
});
```

---

## Step 5: Install Dependencies & Build Frontend

Run these commands inside `/var/www/helpdesk` on your VPS to build the production assets:

```bash
# Install PHP dependencies
composer install --no-dev --optimize-autoloader

# Run database migrations
php artisan migrate --force

# Install frontend dependencies
npm install

# Compile assets with Vite
# Vite will read the ROUTE_PREFIX and ASSET_URL and compile the bundle with the correct paths
npm run build
```

---

## Step 6: Configure Apache VirtualHost

Open or edit your Apache VirtualHost configuration file (usually `/etc/apache2/sites-available/000-default.conf` or your custom SSL config file):

```apache
<VirtualHost *:443>
    ServerName pemadam.jakarta.go.id

    # ... Your existing SSL configuration (Certificates, etc.)

    # Subfolder mapping to Laravel Public directory
    Alias /supports /var/www/helpdesk/public

    <Directory /var/www/helpdesk/public>
        Options Indexes FollowSymLinks MultiViews
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

Enable mod_rewrite and restart Apache:
```bash
sudo a2enmod rewrite
sudo systemctl restart apache2
```

---

## Step 7: Adjust public/.htaccess RewriteBase

Inside `/var/www/helpdesk/public/.htaccess`, ensure that `RewriteBase` matches the subdirectory path so Apache redirects correctly:

```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /supports/
    
    # ... Rest of the rewrite rules
</IfModule>
```

---

## Step 8: Keep queue workers running (Optional)

To process ticket notifications or actions in the background without Docker:

```bash
# Run the queue worker daemon
php artisan queue:work --daemon
```
For production, it is recommended to manage the queue worker with **Supervisor**. Create `/etc/supervisor/conf.d/helpdesk-worker.conf`:

```ini
[program:helpdesk-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/helpdesk/artisan queue:work --sleep=3 --tries=3 --max-time=3600
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=www-data
numprocs=2
redirect_stderr=true
stdout_logfile=/var/www/helpdesk/storage/logs/worker.log
stopwaitsecs=3600
```
Then start it:
```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start helpdesk-worker:*
```
