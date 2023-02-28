var pkcs11js = require("pkcs11js");
require('dotenv').config();
var pkcs11 = new pkcs11js.PKCS11();
pkcs11.load("/usr/local/lib/libdirakp11-64.so");

const a = pkcs11.C_Initialize();
try {
    // Getting info about PKCS11 Module
    var module_info = pkcs11.C_GetInfo();
    console.warn('module_info', module_info)


    // Getting list of slots
    var slots = pkcs11.C_GetSlotList(true);
    console.warn('slots: ', slot_81)
    var slot_81 = slots[0];
    console.warn('slot81: ', slot_81)

    // Getting info about Mechanism
    var mechs = pkcs11.C_GetMechanismList(slot_81);
    var mech_info = pkcs11.C_GetMechanismInfo(slot_81, mechs[0]);
    console.warn('mech_info', mech_info);

    var session = pkcs11.C_OpenSession(slot_81, pkcs11js.CKF_SERIAL_SESSION | pkcs11js.CKF_RW_SESSION);
    console.warn('session', session.toString());

    try {
        const x = pkcs11.C_Login(session, 1, "123456");
        // HSM’de iki tip kullanıcı tanımlıdır bunlar Kullanıcı ve Yönetici ‘dir
        console.warn('**', x)
    } catch (error) {
        console.warn('***', error)
    }

    // Getting info about Session
    var info = pkcs11.C_GetSessionInfo(session);
    console.warn('session_info', info);

    /**
     * Your app code here
     */
    var publicKeyTemplate = [
        { type: pkcs11js.CKA_CLASS, value: pkcs11js.CKO_PUBLIC_KEY },
        { type: pkcs11js.CKA_TOKEN, value: false },
        { type: pkcs11js.CKA_LABEL, value: "My RSA Public Key" },
        { type: pkcs11js.CKA_PUBLIC_EXPONENT, value: Buffer.from([1, 0, 1]) },
        { type: pkcs11js.CKA_MODULUS_BITS, value: 2048 },
        { type: pkcs11js.CKA_VERIFY, value: true }
    ];
    var privateKeyTemplate = [
        { type: pkcs11js.CKA_CLASS, value: pkcs11js.CKO_PRIVATE_KEY },
        { type: pkcs11js.CKA_TOKEN, value: false },
        { type: pkcs11js.CKA_LABEL, value: "My RSA Private Key" },
        { type: pkcs11js.CKA_SIGN, value: true },
    ];
    var keys = pkcs11.C_GenerateKeyPair(session, { mechanism: pkcs11js.CKM_RSA_PKCS_KEY_PAIR_GEN }, publicKeyTemplate, privateKeyTemplate);

    console.warn('keys:', keys);
    pkcs11.C_SignInit(session, { mechanism: pkcs11js.CKM_SHA256_RSA_PKCS }, keys.privateKey);
    pkcs11.C_SignUpdate(session, Buffer.from("Incoming message 1"));

    var signature = pkcs11.C_SignFinal(session, Buffer(256));
    console.warn('signature:', signature)

    pkcs11.C_Logout(session);
    pkcs11.C_CloseSession(session);
}
catch(e){
    console.error(e);
}
finally {
    pkcs11.C_Finalize();
}