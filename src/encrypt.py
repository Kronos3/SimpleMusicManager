#!/usr/bin/env python2
# -*- coding: utf-8 -*-
#
#  encrypt.py
#  
#  Copyright 2016 Andrei Tumbar <atuser@Kronos>
#  
#  This program is free software; you can redistribute it and/or modify
#  it under the terms of the GNU General Public License as published by
#  the Free Software Foundation; either version 2 of the License, or
#  (at your option) any later version.
#  
#  This program is distributed in the hope that it will be useful,
#  but WITHOUT ANY WARRANTY; without even the implied warranty of
#  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#  GNU General Public License for more details.
#  
#  You should have received a copy of the GNU General Public License
#  along with this program; if not, write to the Free Software
#  Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
#  MA 02110-1301, USA.
#  
#  

import OpenSSL
import cryptography
import base64

class RSA_obj:
    key         = None
    public_key  = None
    private_key = None
    
    def __init__ (self, bit_size=2048):
        self.key = OpenSSL.crypto.PKey()
        self.key.generate_key (OpenSSL.crypto.TYPE_RSA, bit_size)
        self.private_key = self.key.to_cryptography_key ()
        self.public_key = self.private_key.public_key()
    
    def encrypt (self, message):
        bits = str.encode (message)
        return base64.b64encode (self.public_key.encrypt(bits, cryptography.hazmat.primitives.asymmetric.padding.PKCS1v15()))
    
    def decrypt (self, encrypted):
        bits = base64.b64decode (encrypted)
        return self.private_key.decrypt (bits)
    
    def get_pub (self):
        self.public_key.public_bytes(cryptography.hazmat.primitives.serialization.Encoding.PEM, cryptography.hazmat.primitives.serialization.PublicFormat.PKCS1)
