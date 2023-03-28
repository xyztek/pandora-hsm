import * as x509 from '@peculiar/x509'
import { Crypto } from 'node-webcrypto-p11'

async function generateCSR (alg, keys) {
  // Generate CSR
  try {
    const crypto = new Crypto({
      library: '/usr/local/lib/libdirakp11-64.so',
      name: 'TÜBİTAK NHSM',
      slot: 0,
      pin: '123456',
      readWrite: true
    })

    const csr = await x509.Pkcs10CertificateRequestGenerator.create({
      name: 'CN=xyzteknoloji.com, C=TR, ST=Istanbul, L=Kozyatagi',
      keys,
      signingAlgorithm: alg,
      attributes: [
        new x509.ChallengePasswordAttribute('123456')
      ]
    }, crypto)

    console.log(csr.toString('pem'))
  } catch (error) {
    console.error('error here', error)
  }
}

export { generateCSR }
