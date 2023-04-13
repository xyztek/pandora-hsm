import * as x509 from "@peculiar/x509";
import { Crypto } from "node-webcrypto-p11";

import * as dotenv from "dotenv";
import * as fs from "fs";

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
 * Generates a Certificate Signing Request (CSR).
 * @param {object} alg - The signing algorithm.
 * @param {CryptoKeyPair} keys - The key pair.
 * @param {string} name - The distinguished name for the CSR subject.
 * @param {Array<x509.Attribute>} attributes - The list of attributes for the CSR.
 * @param {Crypto} crypto - The Crypto provider instance.
 * @returns {Promise<x509.Pkcs10CertificateRequest>} The generated CSR.
 */
async function createCSR(algorithm, keys, name, attributes, crypto) {
  return await x509.Pkcs10CertificateRequestGenerator.create(
    {
      name,
      signingAlgorithm: algorithm,
      attributes,
      keys,
    },
    crypto
  );
}

/**
 * Writes the CSR to a file.
 * @param {string} filePath - The file path.
 * @param {x509.Pkcs10CertificateRequest} csr - The CSR.
 */
function writeCSRToFile(filePath, csr) {
  fs.writeFile(filePath, csr.toString("pem"), (error) => {
    if (error) {
      console.error(error);
    }
  });
}

/**
 * Generates a Certificate Signing Request (CSR) and saves it to a file.
 * @param {object} algorithm - The signing algorithm.
 * @param {CryptoKeyPair} keys - The key pair.
 * @param {string} name - The distinguished name for the CSR subject.
 * @param {Array<x509.Attribute>} attributes - The list of attributes for the CSR.
 * @returns {Promise<x509.Pkcs10CertificateRequest>} The generated CSR.
 */
async function generateCSR(algorithm, keys, name, attributes) {
  try {
    const crypto = createCryptoProvider();
    const csr = await createCSR(algorithm, keys, name, attributes, crypto);
    writeCSRToFile("./pandora.csr", csr);
    return csr;
  } catch (error) {
    console.error(error);
  }
}

export { generateCSR };
