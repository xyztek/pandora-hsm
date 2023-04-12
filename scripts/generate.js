import { generateKeyPair } from "../src/generator.js";
import { generateCSR } from "../src/csr.js";

import * as dotenv from "dotenv";

dotenv.config();

/**
 * Configures and runs the key pair generation and CSR creation process.
 * @async
 */
async function main() {
  // Define the signing algorithm
  const algorithm = {
    name: "RSASSA-PKCS1-v1_5",
    hash: "SHA-256",
    publicExponent: new Uint8Array([1, 0, 1]),
    modulusLength: 2048,
    token: true,
    sensitive: true,
  };

  // Generate key pair
  const { keys } = await generateKeyPair(algorithm);

  // Generate and save CSR
  await generateCSR(algorithm, keys, process.env.SIGNER_NAME, [
    new x509.ChallengePasswordAttribute(process.env.SIGNER_CHALLENGE_PASSWORD),
  ]);
}

main().catch((error) => {
  console.error("An error occurred:", error);
});
