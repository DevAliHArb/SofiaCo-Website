// Reads the profile from a Google ID token (the API verifies the token itself).
export const getGoogleProfile = (idToken) => {
  const payload = idToken.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
  const bytes = Uint8Array.from(atob(payload), (c) => c.charCodeAt(0));
  const claims = JSON.parse(new TextDecoder().decode(bytes));

  return {
    first_name: claims.given_name || "",
    last_name: claims.family_name || "",
    email: claims.email,
    imageUrl: claims.picture,
  };
};
