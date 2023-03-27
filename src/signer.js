import pkcs11js from "pkcs11js";
import * as dotenv from "dotenv";

dotenv.config();

const pkcs11 = new pkcs11js.PKCS11();
pkcs11.load("/usr/local/lib/libdirakp11-64.so");

function sign(keys, data) {
  try {
    pkcs11.C_Initialize();

    const slot = pkcs11.C_GetSlotList(true)[0];

    const session = pkcs11.C_OpenSession(
      slot,
      pkcs11js.CKF_SERIAL_SESSION | pkcs11js.CKF_RW_SESSION
    );

    pkcs11.C_Login(session, 1, process.env.HSM_ADMIN_USER_PASS);

    pkcs11.C_SignInit(
      session,
      { mechanism: pkcs11js.CKM_SHA256_RSA_PKCS },
      keys.privateKey
    );

    pkcs11.C_SignUpdate(session, Buffer.from(data));

    pkcs11.C_SignFinal(session, Buffer.from(new ArrayBuffer(512)));

    pkcs11.C_Logout(session);

    pkcs11.C_CloseSession(session);
  } catch (e) {
    console.error(e);
  } finally {
    pkcs11.C_Finalize();
  }
}

export { sign };
