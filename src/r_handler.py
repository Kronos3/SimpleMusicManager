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

def ret (ret, path):
    if ret:
        return 200
    if path == "/login":
        return 401
    if path == "/check-login":
        return 511
    if path in ["/library", "/now"]:
        return 502

class r_handler(object):
    def __init__ (self):
        pass
    
    def r_get (self, path, data):
        return ret(eval('self.%s(%s)' % (path[1:], data)), path)
    
    def login(self, creds):
        return gmusic.login (creds['login'], creds['passwd'])
    
    def library(self, arg):
        with open('data/library.json', 'w+') as lib:
            lib.write(json.JSONEncoder().encode(gmusic.refresh()._in))
            lib.close()
        return True
    
    def now(self, arg):
        with open('data/now.json', 'w+') as now:
            now.write(json.JSONEncoder().encode(gmusic.get_now()))
            now.close()
        return True

MainRHandler = r_handler ()
