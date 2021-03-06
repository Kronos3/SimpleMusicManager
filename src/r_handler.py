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

from . import gmusic, auth, yt
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

class MainRHandler:
    is_logged_in = False
    
    ytdl = yt.YTDL ()
    gmusic = gmusic
    
    @staticmethod
    def r_get (path, data):
        if data == None:
            return ret(eval('MainRHandler.%s()' % path[1:]), path)
        return ret(eval('MainRHandler.%s(%s)' % (path[1:], data)), path)
    
    @staticmethod
    def login(creds):
        return gmusic.login (creds['login'], creds['passwd'], creds['save'])
    
    @staticmethod
    def check_login ():
        if not os.path.isfile('.token'):
            return False
        if gmusic.gm_api_mob.is_authenticated:
            return True
        with open ('.token', 'r') as f:
            ret = gmusic.load_login (*eval(f.read()))
            f.close()
        return ret
    
    @staticmethod
    def _ytdl (url):
        ytdl.download ([url])
        return 200
    
    @staticmethod
    def library():
        if not gmusic.loaded:
            gmusic.write_data ()
        return gmusic.loaded
