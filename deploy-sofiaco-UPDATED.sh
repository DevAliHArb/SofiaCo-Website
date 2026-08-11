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
PRERENDER_TOKEN="scLOOLhbvI42gbbxUFTU"  # Prerender.io token (shared with Albouraq/Hanout)
# ─────────────────────────────────────────────────────────────────────────────
# NOTE: the .htaccess this script generates uses %{HTTP_HOST} dynamically for
# the www/https redirect and Prerender.io proxy target (not a hardcoded
# "sofiaco.fr"), so the same script is safe to reuse for dev/recette/prod
# without editing anything per run — same pattern already applied to
# Albouraq's and Hanout's deploy scripts.

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

    # Install Node.js dependencies and build the vite app
    echo "Installing dependencies and building the app for $client..."
    node version-sync.cjs env-to-package

    npm install
    GENERATE_SOURCEMAP=false CI=false npm run build

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

<FilesMatch "\.(env|log|config|json|lock|md|git|gitignore|htaccess|htpasswd)$">
  Require all denied
</FilesMatch>

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
HTACCESS

    # Inject the prerender token (can't use single-quote heredoc with variables)
    cat >> "$APP_FOLDER/.htaccess" <<HTACCESS
# -----------------------------------------------------------------------------
# 2) PRERENDER — serve full HTML to bots (SEO). Uses %{HTTP_HOST} dynamically:
# on production this is sofiaco.fr (allowlisted on the Prerender.io account);
# on dev/recette it'll just be rejected by Prerender.io as an unknown domain,
# which is fine — those hosts are already noindexed above and don't need
# prerendering anyway.
# DISABLED as of 2026-07-31: Prerender.io's paid plan expired (2026-07-24),
# so this proxy was returning errors on every bot request — confirmed as the
# cause of the "Server error (5xx)" indexing failures Google Search Console
# reported for ohanoot.fr, and the same account is shared here. Re-enable
# once the account is reactivated, or once the self-hosted replacement is
# working (see ~/prerender-service on apiweb).
# RewriteCond %{HTTP_USER_AGENT} googlebot|bingbot|yandex|baiduspider|duckduckbot|slurp|facebookexternalhit|twitterbot|linkedinbot|embedly|pinterest|slackbot|whatsapp|telegrambot|applebot|discordbot|google-inspectiontool|gptbot|oai-searchbot|chatgpt-user|perplexitybot|claudebot|anthropic-ai|bytespider [NC,OR]
# RewriteCond %{QUERY_STRING} _escaped_fragment_
# RewriteCond %{REQUEST_URI} !\.(js|css|xml|less|png|jpg|jpeg|gif|pdf|doc|txt|ico|rss|zip|mp3|rar|exe|wmv|avi|ppt|mpg|mpeg|tif|wav|mov|psd|ai|xls|mp4|m4a|swf|dat|dmg|iso|flv|m4v|torrent|ttf|woff|woff2|svg|webp|avif|eot)$ [NC]
# RequestHeader set X-Prerender-Token "$PRERENDER_TOKEN"
# RewriteRule ^(?!.*?_escaped_fragment_)(.*)$ https://service.prerender.io/https://%{HTTP_HOST}/\$1 [P,L]

# SPA fallback: anything that isn't a real file -> index.html
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ index.html [L]
HTACCESS

    cat >> "$APP_FOLDER/.htaccess" <<'HTACCESS'
# -----------------------------------------------------------------------------
# Security headers, including a CSP built from SofiaCo's actual third-party
# script/style domains (Stripe, Mapbox, Colissimo, MondialRelay, unpkg/Leaflet,
# PayPal, OpenWidget, GTM, Google APIs, Facebook Connect — confirmed present
# in source by a live audit, same domain set Albouraq needs since both sites
# use PayPal/OpenWidget, unlike Hanout).
# -----------------------------------------------------------------------------
<IfModule mod_headers.c>
  Header always set X-Frame-Options "SAMEORIGIN"
  Header always set X-Content-Type-Options "nosniff"
  Header always set X-XSS-Protection "1; mode=block"
  Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
  Header always set Referrer-Policy "strict-origin-when-cross-origin"
  Header always set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com https://connect.facebook.net https://checkout.paypal.com https://www.paypal.com https://www.paypalobjects.com https://www.stripe.com https://js.stripe.com https://ajax.googleapis.com https://api.mapbox.com https://cdn.jsdelivr.net https://cdn.openwidget.com https://api.openwidget.com https://widget.mondialrelay.com https://www.googletagmanager.com https://ws.colissimo.fr https://unpkg.com; style-src 'self' 'unsafe-inline' https://api.mapbox.com https://fonts.googleapis.com https://widget.mondialrelay.com https://ws.colissimo.fr https://unpkg.com https://www.paypalobjects.com; img-src 'self' data: https:; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https:; frame-src 'self' https://checkout.paypal.com https://www.paypal.com https://js.stripe.com https://www.google.com https://www.facebook.com https://widget.mondialrelay.com"
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
HTACCESS
    echo "Completed processing for client: $client"
done

echo "All clients processed successfully."
echo "Deployment completed successfully."
