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


class r_handler(object):
    def __init__ (self):
        super(r_handler, self)
    
    def r_get (self, name, arg):
        return "%s|%s" % (name, eval('self.%s(%s)' % (name, arg)))
    
    # Arg is the encrypted creds that will be sent to 8001
    def check_login (self, arg):
        if (os.path.exists("passwd.cache")):
            tcpsoc = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            tcpsoc.bind(('localhost', 8002))
            tcpsoc.send('PASS IR HTTP/1.1\n')
            data = (tcpsoc.recv(1000000))
            if data != "HTTP/1.0 200 OK":
                return json.JSONEncoder().encode(False)
            else:
                return json.JSONEncoder().encode(True)
        else:
            return json.JSONEncoder().encode(False)
    def login(self, creds):
        ret = gmusic.login (creds[0], creds[1])
        return json.JSONEncoder().encode(ret)
    
    def library(self, arg):
        with open('data/library.json', 'w+') as lib:
            lib.write(json.JSONEncoder().encode(gmusic.refresh()))
            lib.close()
        return json.JSONEncoder().encode(True)
    
    def now(self, arg):
        with open('data/now.json', 'w+') as now:
            now.write(json.JSONEncoder().encode(gmusic.get_now()))
            now.close()
        return json.JSONEncoder().encode(True)

MainRHandler = r_handler ()
