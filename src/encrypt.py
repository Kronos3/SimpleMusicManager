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


import Crypto
from Crypto.PublicKey import RSA
from Crypto import Random
import ast
import itertools

private_key = """-----BEGIN RSA PRIVATE KEY-----
MIICXAIBAAKBgQDxrHo1+SMguB/UOytsPhjlDx4BIx5611YfxyVqPS46szesaQVB
wNiIaiMU2IceGMxvF8flovrZ+QbTY9Sd365aNMn7VpMkGfPa57Ji6COmA/gCBFy1
HJ6mJs//xgJRpmDSxzm1LBwmO3w1CbZQh/LFDg4c+xREZwG+S0JNwDnUGwIDAQAB
AoGAbozifqwPqJjxXmkOrP4e7zEiHY0OFU1JxVGYyOdhrVJsBj8oO3LW2lgK4i9G
Z7saUTtEosQSEgG7YJmLGgjHPPLL9aceIB6GoQO+GyQtBflUlmC/8pxcKBGK/02V
rolr8kBKMIKbEhuJK2GvLebJmlMhgVdWiCOUxdvOlJDxWrkCQQDz/RHCrK4e2fTZ
LEQkQ1BsnWq7qgbFziuC+/A6/lm3nuzzhbG07UgvCm+lTCxG6U/2DXk2EbK0nsfc
FXhyfba3AkEA/ZI8JvdVH+QC0F+vi/fQ8ETYBIJAYmMamdQJUkn7M8sqa9X1gWqw
DPrjMhig/yBQ8Mqbg23g6kBiGfu0EG6JvQJAcnUNl92Z8S8eBaMWdEx/tfRC1bZ1
ZuXI07GMiKA5RkJvte3J565IZojmxwxs2PcqY6r+abbztnemGkCYOF1xEQJANaoz
TNPfkiZBajQ2BNtnvtHzHdErKydqQ9AaQO4jWezPh476rG8V30lhuAJ6YERInQ1k
KEai6TDDEliw3SFnyQJBAN0REj+2h1j9qPVW0XvGwrDP3s0rYBYUdd47oG3i43vH
zh+EfzHY5/m1Y0IfgVRPJlJSfS2TJMMp/g0k2dzRrBc=
-----END RSA PRIVATE KEY-----"""

key = RSA.importKey(private_key)
publickey = key.publickey()

def to_bin(data):
    ret = ""
    if isinstance(data, tuple):
        for x in data:
            for y in x:
                ret += '{0:#b}'.format(ord(y))
            ret += '{0:#b}'.format(ord('\n'))
    else:
        for x in data:
            if (isinstance(x, int)):
                ret += '{0:#b}'.format(ord(chr(x)))
            else:
                ret += '{0:#b}'.format(ord(x))
    return ret

def to_str(data):
    c = []
    c = list(int(x, 2) for x in data.split('0b')[1:])
    b = ""
    ret = []
    for x in c:
        if x == 1:
            ret.append (b)
            b = []
        b += chr(x)
    ret.append(b)
    if (len(ret) == 1):
        return ret[0]
    return ret

def encrypt(data):
    if (isinstance(data, list) or isinstance(data, tuple) and not isinstance(data, str)):
        ret = []
        for item in data:
            if (isinstance(item, list) or isinstance(item, tuple)):
                raise TypeError ("Encryption object can be at most one layer deep!")
            ret.append (publickey.encrypt(item.encode('utf-8'), 32))
    else:
        return publickey.encrypt(data.encode('utf-8'), 32)[0]
    return ret

def decrypt(data):
    if (isinstance(data, list) or isinstance(data, tuple) and not isinstance(data, str)):
        ret = []
        for item in data:
            if (isinstance(item, list) or isinstance(item, tuple)):
                raise TypeError ("Decryption object can be at most one layer deep!")
            ret.append (key.decrypt(ast.literal_eval(str(item)))).decode('utf-8')
    else:
        ret = key.decrypt(ast.literal_eval(str(data))).decode('utf-8')
    return ret
