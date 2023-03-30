import { Crypto } from 'node-webcrypto-p11'

async function generateKeyPair (algorithm) {
  try {
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
      library: '/usr/local/lib/libdirakp11-64.so',
      name: 'TÜBİTAK NHSM',
      slot: 0,
      pin: '123456',
      readWrite: true
    })

    // Once keys created they stored unless they deleted.
    // They can be cleaned in this way.
    await crypto.keyStorage.clear()

    /**
    * Generates a keypair.
    * @constructor
    * @param {object} algorithm - The algorithm for generating keypair.
    * @param {boolean} extractable - Indicates if keypair is extractable or not.
    * @param {Array} keyUsages - Indicates the reason of the keypair generated for.
    */
    const keys = await crypto.subtle.generateKey(algorithm, false, ['sign', 'verify'])

    const allKeys = await crypto.keyStorage.keys()
    for (const index of allKeys) {
      console.log('all keys', index)
    }

    return { algorithm, keys, crypto }
  } catch (error) {
    console.error(error)
  }
}

export { generateKeyPair }
