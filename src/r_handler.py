#!/usr/bin/env python2
# -*- coding: utf-8 -*-
#
#  r_handler.py
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

from . import gmusic, auth
import json, os

def ret (ret, path):
    if ret:
        return 200
    if path == "/login":
        return 401
    if path == "/check_login":
        return 511
    if path in ["/library", "/now"]:
        return 502

class r_handler(object):
    def __init__ (self):
        pass
    
    def r_get (self, path, data):
        if data == None:
            return ret(eval('self.%s()' % path[1:]), path)
        return ret(eval('self.%s(%s)' % (path[1:], data)), path)
    
    def login(self, creds):
        return gmusic.login (creds['login'], creds['passwd'], creds['save'])
    
    def check_login (self):
        if not os.path.isfile('.token'):
            return False
        with open ('.token', 'r') as f:
            ret = gmusic.load_login (*eval(f.read()))
            f.close()
        return ret
    
    def library(self):
        lib_b = gmusic.refresh()
        if lib_b != '':
            with open('data/library.json', 'w+') as lib:
                lib.write(json.JSONEncoder().encode(lib_b._in))
                lib.close()
            with open('data/albums.json', 'w+') as ablms:
                ablms.write (json.dumps(lib_b.get_albums()))
                ablms.close()
        else:
            return False
        return True
    
    def now(self, arg):
        with open('data/now.json', 'w+') as now:
            now.write(json.JSONEncoder().encode(gmusic.get_now()))
            now.close()
        return True

MainRHandler = r_handler ()
