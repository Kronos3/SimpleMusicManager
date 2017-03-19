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
import json, os
from shutil import rmtree
from .r_handler import MainRHandler
from .yt import YTSearchParser
import urllib.request

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
        if self.path.find('.cache/') != -1:
            if (not os.path.isfile(self.path[1:])):
                self.send_response(301)
                self.send_header('Location','http://' + self.path[self.path.find('.cache/') + len('.cache/'):])
                self.end_headers()
                return
            
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
            self.send_response(403)
        self.end_headers()
    
    def do_INC (self): # Increment song playcount
        MainRHandler.gmusic.gm_library.increment_song (self.path[1:])
        MainRHandler.gmusic.write_data ()
        self.send_response(200)
        self.end_headers()
    
    def do_DELETE (self):
        _id = self.path[1:]
        MainRHandler.gmusic.gm_library.rm_song (_id)
        MainRHandler.gmusic.refresh()
        MainRHandler.gmusic.write_data ()
        self.send_response(200)
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
        i = self.path[1:]
        try:
            out = str.encode(MainRHandler.gmusic.gm_library.get_stream(i))
        except:
            self.send_response (502)
            self.end_headers()
            return
        else:
            self.send_response(200)
        self.end_headers()
        self.wfile.write (out)
    
    def do_GETOAUTHURL (self):
        self.send_response(200)
        self.end_headers()
        self.wfile.write (MainRHandler.gmusic.gm_api_man.get_login_url().encode ())
    
    def __OAUTHLOGIN (self, code):
        sys.stdout.flush()
        s = MainRHandler.gmusic.gm_api_man.get_auth_token(code)
        status = MainRHandler.gmusic.gm_api_man.login(s)
        MainRHandler.is_logged_in = status
    
    def do_POST (self):
        self.data_string = self.rfile.read(int(self.headers['Content-Length']))

        data = self.parse_post(self.data_string.decode("utf-8"))
        res = MainRHandler.r_get (self.path, data)
        self.send_response(res)
        self.end_headers()
    
    def do_RELOAD (self):
        MainRHandler.gmusic.write_data ()
        self.send_response(200)
        self.end_headers()
    
    def do_UPLOAD (self):
        stat = MainRHandler.gmusic.gm_api_man.upload (self.path, enable_matching=True)
        MainRHandler.gmusic.write_data ()
        if stat:
            self.send_response (200)
        else:
            self.send_response (504)
        self.end_headers
    
    def do_SEARCHYT (self):
        buf = YTSearchParser ()
        if self.path[0] == '/':
            self.path = self.path[1:]
        buf.feed (urllib.request.urlopen ("https://www.youtube.com/results?search_query=" + self.path).read().decode("utf-8"))
        bufs = buf.search_finds
        buf.search_finds = []
        self.send_response(200)
        self.end_headers()
        for u in bufs:
            self.wfile.write ((u + '\n').encode())
    
    def do_UPLOADALL (self): #Uploads all songs in .temp then deletes them
        stat = MainRHandler.gmusic.gm_api_man.upload (prepend_to_items(os.listdir('.temp'), '.temp/'), enable_matching=True)
        rmtree ('.temp')
        MainRHandler.gmusic.write_data ()
        self.send_response (200)
        self.end_headers()
    
    def do_YTDL (self):
        self.send_response (MainRHandler._ytdl ('http://www.youtube.com/watch?v=' + self.path[1:]))
        self.end_headers()
    
    def do_SHUTDOWN (self):
        self.send_response(200)
        self.end_headers()
        exit(0)

def prepend_to_items (arr, prepend):
    ret = []
    for i in arr:
        ret.append (prepend + i)
    return ret

class postHandlerDebug (postHandler):
    def do_DEBUG (self):
        try:
            exec ('t = ' + self.path)
        except:
            self.send_response(400)
            self.end_headers()
            return
        else:
            self.send_response(200)
        
        t = eval(self.path)
        self.wfile.write (str(t).encode())
