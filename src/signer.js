import { Crypto } from 'node-webcrypto-p11'
import * as dotenv from 'dotenv'
dotenv.config()

async function sign (algorithm, keys, data) {

  /**
  * Initializes the Crypto provider.
  * @constructor
  * @param {string} library - The path of the library.
  * @param {string} name - The name of the library.
  * @param {number} slot - The slot number in NHSM.
  * @param {string} pin - The pin of the slot.
  * @param {boolean} readWrite - The access type of the slot.
  */
  const crypto = new Crypto({
    library: process.env.PKCS11_LIBRARY_PATH,
    name: process.env.PROVIDER_NAME,
    slot: process.env.SLOT,
    pin: process.env.SLOT_PIN,
    readWrite: true
  })

  /**
  * Signs the data with provided private key and algorithm.
  * @constructor
  * @param {object} algorithm - The algorithm for signing. 
  * @param {CryptoKey} key - The private key for siging.
  * @param {any} data - Data to be signed.
  */
  const signature = await crypto.subtle.sign(algorithm, keys.privateKey, Buffer.from(data))
  console.log(`Signature: ${signature}`)

  /**
  * Verifies the signature.
  * @constructor
  * @param {object} algorithm - The algorithm for signing. 
  * @param {CryptoKey} key - The public key for verifying.
  * @param {ArrayBuffer} signature - The signature.
  * @param {any} data - Signed data.
  */
  const ok = await crypto.subtle.verify(algorithm, keys.publicKey, signature, Buffer.from(data))
  console.log(`Verification: ${ok}`)
}

export { sign }
