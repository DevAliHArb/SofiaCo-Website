#!/bin/bash


# Exit immediately if a command exits with a non-zero status
set -e

# Variables
REPO_URL="https://github.com/DevAliHArb/SofiaCo-Website.git" # Replace with your repo URL
APP_GIT_DIR="sofiaco-git"
BUILD_DIR="build"
CONFIG_FILE="clients-sofiaco-config.json"

# ── Change this per deployment ───────────────────────────────────────────────
ECOM_TYPE="sofiaco"  # VITE_ECOM_TYPE — was missing from the .env this script
                      # generates entirely, meaning every real deploy wiped it
                      # out (the checked-in repo .env has it, but this script's
                      # `cat > .env` heredoc overwrites the whole file with only
                      # the vars listed below, and VITE_ECOM_TYPE wasn't one of
                      # them). Anything reading it (e.g. scripts/generate-sitemap.mjs
                      # via process.env.VITE_ECOM_TYPE) was getting undefined on
                      # every real deploy. Same constant across all clients/envs
                      # for this site, so it's a script-level variable rather
                      # than a per-client config key.
# ─────────────────────────────────────────────────────────────────────────────
# NOTE: Prerender.io removed as of 2026-10-02. That account's paid plan
# expired (2026-07-24) and was returning errors on every bot request —
# confirmed as the cause of Google Search Console "Server error (5xx)"
# indexing failures on Hanout (ohanoot.fr), and this account was shared
# across Albouraq/Hanout/SofiaCo. Rather than leave a permanently-disabled
# proxy block lying around, it's been deleted outright; see
# ~/prerender-service on apiweb for the self-hosted replacement effort.
#
# The .htaccess this script generates uses %{HTTP_HOST} dynamically for the
# www/https redirect (not a hardcoded "sofiaco.fr"), so the same script is
# safe to reuse for dev/recette/prod without editing anything per run — same
# pattern already applied to Albouraq's and Hanout's deploy scripts.

restore_generated_files() {
    git restore --worktree --staged .env .gitignore package.json package-lock.json 2>/dev/null || true
}



# Check if the config file exists
if [ ! -f "$CONFIG_FILE" ]; then
    echo "Config file not found: $CONFIG_FILE"
    exit 1
fi

# Read client details using Python
readarray -t clients_info < <(python3 - <<EOF
import json
import sys

with open("$CONFIG_FILE") as f:
    config = json.load(f)

if "clients" not in config:
    print("Error: 'clients' key not found in the configuration.")
    sys.exit(1)

clients = []
for client, details in config["clients"].items():
    if not all(key in details for key in [
        "APP_FOLDER",
        "VITE_STRIPE_TEST_CODE",
        "VITE_COLISSIMO_LOGIN",
        "VITE_COLISSIMO_PASSWORD",
        "VITE_TESTING_API",
        "VITE_TESTING_API_IMAGE",
        "VITE_DATABASE_NAME",
        "VITE_TITLE",
        "VITE_PDF_API",
        "VITE_DECRYPT_PASSPHRASE",
        "VITE_DECRYPT_IV",
        "VITE_GOOGLE_CLIENT_ID",
        "VITE_APP_VERSION"]):
        print(f"Warning: Missing configuration for {client}. Skipping...", file=sys.stderr)
        continue
    clients.append(f"{client}|{details['APP_FOLDER']}|{details['VITE_STRIPE_TEST_CODE']}|{details['VITE_COLISSIMO_LOGIN']}|{details['VITE_COLISSIMO_PASSWORD']}|{details['VITE_TESTING_API']}|{details['VITE_TESTING_API_IMAGE']}|{details['VITE_DATABASE_NAME']}|{details['VITE_TITLE']}|{details['VITE_PDF_API']}|{details['VITE_DECRYPT_PASSPHRASE']}|{details['VITE_DECRYPT_IV']}|{details['VITE_GOOGLE_CLIENT_ID']}|{details['VITE_APP_VERSION']}")
print("\n".join(clients))
EOF
)

# Check if any clients were found
if [ ${#clients_info[@]} -eq 0 ]; then
    echo "No valid clients found in the configuration file. Exiting..."
    exit 1
fi

echo "Processing clients in config file..."

# Process each client
for client_info in "${clients_info[@]}"; do
    IFS='|' read -r client APP_FOLDER VITE_STRIPE_TEST_CODE VITE_COLISSIMO_LOGIN VITE_COLISSIMO_PASSWORD VITE_TESTING_API VITE_TESTING_API_IMAGE VITE_DATABASE_NAME VITE_TITLE VITE_PDF_API VITE_DECRYPT_PASSPHRASE VITE_DECRYPT_IV VITE_GOOGLE_CLIENT_ID VITE_APP_VERSION <<< "$client_info"

    echo "Processing client: $client"
    git ls-remote "$REPO_URL"
    # Clone the repository (if not already cloned)
    echo "Cloning the repository $REPO_URL to $APP_GIT_DIR..."
    if [ -d "$APP_GIT_DIR" ]; then
        echo "Repository already exists. Pulling the latest changes..."
        cd "$APP_GIT_DIR"
        restore_generated_files
        if ! git pull --ff-only; then
            echo "Failed to pull latest changes. Please check the repository and try again."
        exit 1
    fi
    else
        git clone "$REPO_URL" "$APP_GIT_DIR"
        cd "$APP_GIT_DIR"
    fi


    # Create a .env file with client-specific variables
    echo "Configuring .env for $client..."
    cat > ".env" <<EOL
VITE_ECOM_TYPE=$ECOM_TYPE
VITE_STRIPE_TEST_CODE=$VITE_STRIPE_TEST_CODE
VITE_COLISSIMO_LOGIN=$VITE_COLISSIMO_LOGIN
VITE_COLISSIMO_PASSWORD=$VITE_COLISSIMO_PASSWORD
VITE_TESTING_API=$VITE_TESTING_API
VITE_TESTING_API_IMAGE=$VITE_TESTING_API_IMAGE
VITE_DATABASE_NAME=$VITE_DATABASE_NAME
VITE_TITLE=$VITE_TITLE
VITE_PDF_API=$VITE_PDF_API
VITE_DECRYPT_PASSPHRASE=$VITE_DECRYPT_PASSPHRASE
VITE_DECRYPT_IV=$VITE_DECRYPT_IV
VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID
VITE_APP_VERSION=$VITE_APP_VERSION
EOL

    # IMPORTANT: scripts/generate-sitemap.mjs runs as a plain `node` script (not
    # through Vite), so it only ever sees real shell environment variables via
    # process.env — it does NOT read the .env file above (only Vite's own build
    # step does that, for the browser bundle). Without exporting these here, the
    # sitemap generator silently falls back to its hardcoded default API domain
    # instead of this client's real $VITE_TESTING_API, producing a sitemap built
    # from the wrong backend. Same fix already applied to Albouraq's and
    # Hanout's deploy scripts.
    export VITE_TESTING_API VITE_ECOM_TYPE

    # Install Node.js dependencies, then build (build's prebuild hook regenerates
    # the sitemap automatically — no need to also run `npm run sitemap`
    # separately beforehand, that was generating it twice on every deploy).
    echo "Installing dependencies and building the app for $client..."
    node version-sync.cjs env-to-package
    npm install

    echo "Building the app for $client..."
    if ! NODE_OPTIONS="--max_old_space_size=4096" GENERATE_SOURCEMAP=false CI=false npm run build; then
        echo "Build failed. Checking for an existing dist folder to deploy..."
        if [ ! -d "dist" ] || [ -z "$(find dist -mindepth 1 -maxdepth 1 -print -quit 2>/dev/null)" ]; then
            echo "No usable dist folder found. Aborting deployment."
            exit 1
        fi
        echo "Using existing dist folder for deployment."
    fi

    unset VITE_TESTING_API VITE_ECOM_TYPE

    # Copy the build files to the client's directory
    echo "Copying build files to folder $APP_FOLDER..."
    cd ..
    mkdir -p "$APP_FOLDER"
    cp -rv "./$APP_GIT_DIR/dist/"* "./$APP_FOLDER"/

    cd "$APP_GIT_DIR"
    restore_generated_files
    cd ..

    # Remove any .env files that might have been copied (security measure)
    echo "Removing any .env files from $APP_FOLDER for security..."
    rm -f "$APP_FOLDER/.env" "$APP_FOLDER/.env.local" "$APP_FOLDER/.env.production"


# Add .htaccess file to the client's folder
echo "Adding .htaccess file to $APP_FOLDER..."
cat > "$APP_FOLDER/.htaccess" <<'HTACCESS'
# Deny access to sensitive files
<FilesMatch "^\.env">
  Require all denied
</FilesMatch>

# Scoped by filename, not by a blanket extension — a blanket "\.json$"/"\.md$"
# rule also risks 403'ing any legitimate public data file shipped in dist/
# and fetched at runtime (e.g. a public/<something>.json the app reads via
# fetch/axios) — that only breaks in production, since local/dev never
# enforce .htaccess. Same fix already applied to Hanout's and Albouraq's
# deploy scripts, where a public/cities/<ISO>.json fetched by the checkout
# city picker was silently 403'd by the old blanket rule.
<FilesMatch "^(composer\.(json|lock)|package(-lock)?\.json|\.npmrc|\.gitignore|README\.md|CHANGELOG\.md)$">
  Require all denied
</FilesMatch>

<FilesMatch "\.(log|htaccess|htpasswd)$">
  Require all denied
</FilesMatch>

Options -MultiViews
RewriteEngine On

# -----------------------------------------------------------------------------
# 0) Non-production hosts (dev/recette/staging) must never be indexed.
#    Safe-by-default: only blocks when the hostname clearly looks like a
#    non-prod environment; an unrecognized host is left alone so this can
#    never accidentally noindex production.
# -----------------------------------------------------------------------------
RewriteCond %{HTTP_HOST} (dev|recette|staging|test|localhost|^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$) [NC]
RewriteRule ^ - [E=NOTPROD:1]
<IfModule mod_headers.c>
  Header always set X-Robots-Tag "noindex, nofollow, noarchive" env=NOTPROD
</IfModule>

# -----------------------------------------------------------------------------
# 1) HTTPS + canonical host (prevents http/https/www duplicate content).
#    Uses the actual request host dynamically instead of a hardcoded domain,
#    so this same .htaccess is correct for sofiaco.fr, dev.sofiaco.fr,
#    recette.sofiaco.fr, etc. without editing anything per deploy.
# -----------------------------------------------------------------------------
RewriteCond %{HTTP_HOST} ^www\.(.+)$ [NC]
RewriteRule ^ https://%1%{REQUEST_URI} [L,R=301]
RewriteCond %{HTTPS} off
RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# -----------------------------------------------------------------------------
# 2) SPA fallback: anything that isn't a real file -> index.html
# -----------------------------------------------------------------------------
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ index.html [L]
HTACCESS

    cat >> "$APP_FOLDER/.htaccess" <<'HTACCESS'
# -----------------------------------------------------------------------------
# Security headers, including a CSP built from SofiaCo's actual third-party
# script/style domains (Stripe, Mapbox, Colissimo, MondialRelay, unpkg/Leaflet,
# PayPal, OpenWidget, GTM, Google APIs, Facebook Connect — confirmed present
# in source by a live audit). frame-src also includes YouTube/YouTube-nocookie/
# TikTok — needed for the product-page video previews (VideoPreviewSection)
# to actually embed and play instead of being silently blocked; this was the
# same gap found and fixed on Hanout and Maktabox.
# -----------------------------------------------------------------------------
<IfModule mod_headers.c>
  Header always set X-Frame-Options "SAMEORIGIN"
  Header always set X-Content-Type-Options "nosniff"
  Header always set X-XSS-Protection "1; mode=block"
  Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
  Header always set Referrer-Policy "strict-origin-when-cross-origin"
  Header always set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://apis.google.com https://connect.facebook.net https://checkout.paypal.com https://www.paypal.com https://www.paypalobjects.com https://www.stripe.com https://js.stripe.com https://ajax.googleapis.com https://api.mapbox.com https://cdn.jsdelivr.net https://cdn.openwidget.com https://api.openwidget.com https://widget.mondialrelay.com https://www.googletagmanager.com https://ws.colissimo.fr https://unpkg.com; style-src 'self' 'unsafe-inline' https://api.mapbox.com https://fonts.googleapis.com https://widget.mondialrelay.com https://ws.colissimo.fr https://unpkg.com https://www.paypalobjects.com; img-src 'self' data: https:; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https:; frame-src 'self' https://checkout.paypal.com https://www.paypal.com https://js.stripe.com https://www.google.com https://www.facebook.com https://widget.mondialrelay.com https://www.youtube.com https://www.youtube-nocookie.com https://www.tiktok.com"
  Header always set Permissions-Policy "geolocation=(), microphone=(), camera=()"
  Header set Access-Control-Allow-Origin "*"
</IfModule>

<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json image/svg+xml
</IfModule>

<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType font/woff2 "access plus 1 year"
  ExpiresByType text/html "access plus 0 seconds"
</IfModule>

<IfModule mod_headers.c>
  <FilesMatch "\.(js|css|png|jpe?g|gif|svg|webp|avif|woff2?)$">
    Header set Cache-Control "public, max-age=31536000, immutable"
  </FilesMatch>
  <FilesMatch "\.html$">
    Header set Cache-Control "no-cache"
  </FilesMatch>
</IfModule>
HTACCESS
    echo "Completed processing for client: $client"
done

echo "All clients processed successfully."
echo "Deployment completed successfully."
