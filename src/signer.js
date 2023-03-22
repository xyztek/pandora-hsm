import pkcs11js from "pkcs11js";
import * as dotenv from "dotenv";
import { execSync } from "child_process";

dotenv.config();

const pkcs11 = new pkcs11js.PKCS11();

pkcs11.load("/usr/local/lib/libdirakp11-64.so");
pkcs11.C_Initialize();

function verifyCSR(csr) {
  return execSync("openssl req -text -noout -verify -in pandora.csr");
}

function sign(generator, data) {
  try {
    pkcs11.C_SignInit(
      generator.session,
      { mechanism: pkcs11js.CKM_SHA256_RSA_PKCS },
      generator.keys.privateKey
    );
    pkcs11.C_SignUpdate(generator.session, Buffer.from(data));
    const signature = pkcs11.C_SignFinal(
      generator.session,
      Buffer.from(new ArrayBuffer(512))
    );
    console.warn("signature:", signature);

    try {
      const verified = verifyCSR(generator.csr);
      console.log("CSR verified with result: %s", verified);
    } catch (error) {
      console.error(error);
    }

    pkcs11.C_Logout(generator.session);
    pkcs11.C_CloseSession(generator.session);
  } catch (e) {
    console.error(e);
  } finally {
    pkcs11.C_Finalize();
  }
}

export { sign };
