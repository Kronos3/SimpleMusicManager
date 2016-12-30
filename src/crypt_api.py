#!/usr/bin/env python2
# -*- coding: utf-8 -*-
#
#  crypt_api.py
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


import encrypt
import os

# Not the real salt to keep user security
# This file will be compiled and a different salt will be used
# When this program is compiled
PASSWORD_SALT="NOT_THE_REAL_SALT"

def encrypt_credentials (email, password):
    # Create an temp in file
    in_file = """email=%s,password=%s""" % (email, password)
    del email
    del password
    in_file = open ('temp.key', 'wb')
    in_file.write(in_file)
    in_file.close()
    del in_file
    with open('temp.key', 'rb') as in_file, open('cache.key', 'wb+') as out_file:
        encrypt(in_file, out_file, PASSWORD_SALT)
    os.remove('temp.key')

def decrypt_credentials ():
    with open('cache.key', 'rb') as in_file, open('temp.key', 'wb') as out_file:
        decrypt(in_file, out_file, PASSWORD_SALT)
    creds = out_file.read().split(',')
    os.remove('temp.key')
    return creds
