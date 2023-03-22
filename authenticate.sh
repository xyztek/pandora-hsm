#!/bin/sh
openvpn3 config-import --config ma3-kazim.ozyilmaz.ovpn
openvpn3 session-start --config ma3-kazim.ozyilmaz.ovpn
sudo service dirakAuthenticator restart
sudo /etc/bilgemHsm/bin/dirakAuthenticatorApp -i -t srpP -u xyzteknoloji -p 12345678