#!/bin/sh
openvpn3 config-import --config $VPN_CONFIG
openvpn3 session-start --config $VPN_CONFIG
sudo service dirakAuthenticator restart
sudo /etc/bilgemHsm/bin/dirakAuthenticatorApp -i -t srpP -u $VPN_USERNAME -p $VPN_PASSWORD
