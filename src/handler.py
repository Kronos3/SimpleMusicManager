#!/usr/bin/env python2
# -*- coding: utf-8 -*-
#
#  handler.py
#  
#  Copyright 2017 Andrei Tumbar <atuser@Kronos>
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


from http import server
import json
from .r_handler import MainRHandler

class postHandler (server.SimpleHTTPRequestHandler):
    def parse_post (self, _str):
        try:
            itms = _str.split ("&")
            ret = {}
            for x in itms:
                name, val = x.split ('=')
                ret[name] = val
        except:
            return None
        return ret
    
    #def do_PLAY (self): # Song played
    #    
    
    def do_STREAM (self):
        i = int(self.path[1:])
        out = str.encode(MainRHandler.gmusic.gm_library.get_stream(i))
        self.send_response(200)
        self.end_headers()
        self.wfile.write (out)
    
    def do_POST (self):
        self.data_string = self.rfile.read(int(self.headers['Content-Length']))

        data = self.parse_post(self.data_string.decode("utf-8"))
        res = MainRHandler.r_get (self.path, data)
        self.send_response(res)
        self.end_headers()
