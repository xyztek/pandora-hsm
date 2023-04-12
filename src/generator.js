import { Crypto } from "node-webcrypto-p11";

import * as dotenv from "dotenv";

dotenv.config();

/**
 * Initializes the Crypto provider.
 * @returns {Crypto} The Crypto provider instance.
 */
function createCryptoProvider() {
  return new Crypto({
    library: process.env.PKCS11_LIBRARY_PATH,
    name: process.env.PROVIDER_NAME,
    slot: parseInt(process.env.SLOT),
    pin: process.env.SLOT_PIN,
    readWrite: true,
  });
}

/**
 * Generates a key pair using the specified algorithm.
 * @param {object} algorithm - The key generation algorithm.
 * @param {Crypto} crypto - The Crypto provider instance.
 * @returns {Promise<CryptoKeyPair>} The generated key pair.
 */
async function generateKeys(algorithm, crypto) {
  return await crypto.subtle.generateKey(algorithm, false, ["sign", "verify"]);
}

/**
 * Generates a key pair using the specified algorithm.
 * @param {object} algorithm - The key generation algorithm.
 * @returns {Promise<CryptoKeyPair>} The generated key pair.
 */
async function generateKeyPair(algorithm) {
  try {
    const crypto = createCryptoProvider();
    const keys = await generateKeys(algorithm, crypto);
    return { keys };
  } catch (error) {
    console.error(error);
  }
}

export { generateKeyPair };
