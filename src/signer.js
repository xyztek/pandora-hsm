import { Crypto } from 'node-webcrypto-p11'

async function sign (alg, keys, data) {
  const crypto = new Crypto({
    library: '/usr/local/lib/libdirakp11-64.so',
    name: 'TÜBİTAK NHSM',
    slot: 0,
    pin: '123456',
    readWrite: true
  })

  const signature = await crypto.subtle.sign(alg, keys.privateKey, Buffer.from(data))
  await crypto.subtle.verify(alg, keys.publicKey, signature, Buffer.from(data))
  return signature
}

export { sign }
