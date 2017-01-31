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
    
    def do_GET(self):
        
        if self.path[0:7] == "/?code=":
            try:
                self.__OAUTHLOGIN (self.path[7:])
            except:
                pass
            self.send_response(301)
            self.send_header('Location','http://localhost:8000')
            self.end_headers()
            return
        
        f = self.send_head()
        if f:
            try:
                self.copyfile(f, self.wfile)
            finally:
                f.close()

    
    #def do_PLAY (self): # Song played
    #    
    
    def do_CHECKOAUTH (self):
        if MainRHandler.is_logged_in:
            self.send_response(200)
        else:
            self.send_response(401)
        self.end_headers()
    
    def do_ADDTPL (self): # Add song to playlist
        index, playlist = self.path[1:].split ('/')
        MainRHandler.gmusic.gm_library.add_song_to_playlist (index, playlist)
        MainRHandler.gmusic.refresh()
        MainRHandler.gmusic.write_data ()
        self.send_response(200)
        self.end_headers()
    
    def do_RMFPL (self): # Remove plid from playlist
        plid = self.path[1:]
        MainRHandler.gmusic.gm_library.rm_song_from_playlist (plid)
        MainRHandler.gmusic.refresh()
        MainRHandler.gmusic.write_data ()
        self.send_response(200)
        self.end_headers()
    
    def do_STREAM (self):
        i = int(self.path[1:])
        out = str.encode(MainRHandler.gmusic.gm_library.get_stream(i))
        self.send_response(200)
        self.end_headers()
        self.wfile.write (out)
    
    def do_GETOAUTHURL (self):
        self.send_response(200)
        self.end_headers()
        self.wfile.write (MainRHandler.gmusic.gm_api_man.get_login_url().encode ())
    
    def __OAUTHLOGIN (self, code):
        s = MainRHandler.gmusic.gm_api_man.get_auth_token(code)
        status = MainRHandler.gmusic.gm_api_man.login(s)
        MainRHandler.is_logged_in = status
    
    def do_POST (self):
        self.data_string = self.rfile.read(int(self.headers['Content-Length']))

        data = self.parse_post(self.data_string.decode("utf-8"))
        res = MainRHandler.r_get (self.path, data)
        self.send_response(res)
        self.end_headers()
