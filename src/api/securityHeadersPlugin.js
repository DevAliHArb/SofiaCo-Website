// Vite plugin to add security headers in development mode
export default function securityHeadersPlugin() {
  return {
    name: 'security-headers',
    configureServer(server) {
      return () => {
        server.middlewares.use((req, res, next) => {
          // X-Frame-Options: Prevent clickjacking
          res.setHeader('X-Frame-Options', 'SAMEORIGIN');
          
          // X-Content-Type-Options: Prevent MIME sniffing
          res.setHeader('X-Content-Type-Options', 'nosniff');
          
          // X-XSS-Protection: Enable browser XSS protection
          res.setHeader('X-XSS-Protection', '1; mode=block');
          
          // Strict-Transport-Security: Enforce HTTPS
          res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
          
          // Referrer-Policy: Control referrer information
          res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
          
          // Content-Security-Policy: Prevent injection attacks.
          // Kept in sync with the production CSP baked into
          // deploy-sofiaco-UPDATED.sh — same third-party domains SofiaCo
          // actually loads (Stripe, Mapbox, Colissimo, MondialRelay,
          // unpkg/Leaflet, PayPal, OpenWidget, GTM), so `npm run dev`
          // doesn't show CSP violations that don't happen in prod.
          res.setHeader(
            'Content-Security-Policy',
            "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com https://connect.facebook.net https://checkout.paypal.com https://www.paypal.com https://www.paypalobjects.com https://www.stripe.com https://js.stripe.com https://ajax.googleapis.com https://api.mapbox.com https://cdn.jsdelivr.net https://cdn.openwidget.com https://api.openwidget.com https://widget.mondialrelay.com https://www.googletagmanager.com https://ws.colissimo.fr https://unpkg.com; style-src 'self' 'unsafe-inline' https://api.mapbox.com https://fonts.googleapis.com https://widget.mondialrelay.com https://ws.colissimo.fr https://unpkg.com https://www.paypalobjects.com; img-src 'self' data: https:; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https:; frame-src 'self' https://checkout.paypal.com https://www.paypal.com https://js.stripe.com https://www.google.com https://www.facebook.com https://widget.mondialrelay.com"
          );
          
          // Permissions-Policy: Restrict access to sensitive features
          res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
          
          next();
        });
      };
    },
  };
}
