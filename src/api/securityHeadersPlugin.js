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
          
          // Content-Security-Policy: Prevent injection attacks
          res.setHeader(
            'Content-Security-Policy',
            "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com https://connect.facebook.net https://checkout.paypal.com https://www.stripe.com https://js.stripe.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; frame-src 'self' https://checkout.paypal.com https://js.stripe.com https://www.google.com https://www.facebook.com"
          );
          
          // Permissions-Policy: Restrict access to sensitive features
          res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
          
          next();
        });
      };
    },
  };
}
