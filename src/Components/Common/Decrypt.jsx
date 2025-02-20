export async function decryptAES128CTR(encryptedData) {
    const passphrase = import.meta.env.VITE_DECRYPT_PASSPHRASE; // Get passphrase from environment
    const iv = import.meta.env.VITE_DECRYPT_IV; // Get IV from environment

    if (!encryptedData || !passphrase || !iv) {
        // console.error("Missing encrypted data, passphrase, or IV.");
        return null;
    }

    try {
        // Convert passphrase into a 16-byte key (128 bits)
        const keyMaterial = await getKeyMaterial(passphrase);

        // Import the key for AES-128-CTR decryption
        const key = await window.crypto.subtle.importKey(
            "raw",
            keyMaterial,
            { name: "AES-CTR" },
            false,
            ["decrypt"]
        );

        // Ensure the IV is 16 bytes (128 bits) long, pad it if necessary
        const ivBuffer = ensure16BytesIV(iv); // Ensure the IV is 16 bytes long
        if (ivBuffer.length !== 16) {
            // console.error("IV must be 16 bytes (128 bits) long.");
            return null;
        }

        // Decrypt the data
        const decrypted = await window.crypto.subtle.decrypt(
            {
                name: "AES-CTR",
                counter: ivBuffer, // Use 16-byte IV as the counter
                length: 128, // AES-128 requires a 128-bit key (16 bytes)
            },
            key,
            base64ToArrayBuffer(encryptedData) // Convert encrypted base64 to ArrayBuffer
        );

        // Return the decrypted result as a string
        return new TextDecoder().decode(decrypted);
    } catch (error) {
        // console.error("Decryption error:", error);
        return null;
    }
}

// Helper function to generate key material from passphrase (16 bytes key)
async function getKeyMaterial(passphrase) {
    const encoder = new TextEncoder();
    const encodedPassphrase = encoder.encode(passphrase);

    // Ensure the key length is exactly 16 bytes (128 bits) for AES-128
    return encodedPassphrase.slice(0, 16); 
}

// Convert base64 to ArrayBuffer
function base64ToArrayBuffer(base64) {
    const binaryString = window.atob(base64); // Decode base64 string
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i); // Convert each character to byte
    }
    return bytes.buffer;
}

// Ensure IV is 16 bytes by padding if necessary
function ensure16BytesIV(iv) {
    const ivBuffer = new TextEncoder().encode(iv); // Convert IV string to bytes
    const ivLength = ivBuffer.length;

    // Pad the IV if it is shorter than 16 bytes
    if (ivLength < 16) {
        const paddedIv = new Uint8Array(16);
        paddedIv.set(ivBuffer); // Copy the original IV into the padded array
        return paddedIv; // Return the padded IV
    } else if (ivLength > 16) {
        // If IV is longer than 16 bytes, truncate it
        return ivBuffer.slice(0, 16);
    }

    return ivBuffer; // Return original IV if it's already 16 bytes
}

// New function that accepts props and returns the decrypted value
export const getDecryptedValue = async (encryptedData) => {
    const decryptedData = await decryptAES128CTR(encryptedData);
    return decryptedData;  // Return decrypted data directly
};
