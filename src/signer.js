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
 * Signs the data with the provided private key and algorithm.
 * @param {object} algorithm - The signing algorithm.
 * @param {CryptoKey} privateKey - The private key for signing.
 * @param {ArrayBuffer} data - The data to be signed.
 * @param {Crypto} crypto - The Crypto provider instance.
 * @returns {Promise<ArrayBuffer>} The signature.
 */
async function signData(algorithm, privateKey, data, crypto) {
  return await crypto.subtle.sign(algorithm, privateKey, Buffer.from(data));
}

/**
 * Signs the data with the provided private key and algorithm.
 * @param {object} algorithm - The signing algorithm.
 * @param {CryptoKeyPair} keys - The key pair used for signing and verification.
 * @param {ArrayBuffer} data - The data to be signed.
 * @returns {Promise<ArrayBuffer>} The signature.
 */
async function sign(algorithm, keys, data) {
  const crypto = createCryptoProvider();
  const signature = await signData(algorithm, keys.privateKey, data, crypto);

  // Verify the signature
  const isValid = await crypto.subtle.verify(
    algorithm,
    keys.publicKey,
    signature,
    Buffer.from(data)
  );

  if (!isValid) {
    throw new Error("Signature verification failed.");
  }

  return signature;
}

export { sign };
