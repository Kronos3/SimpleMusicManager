#!/usr/bin/env python2
# -*- coding: utf-8 -*-
#
#  server.py
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


import time
start_time = time.time()
import json, traceback, sys, os
from src import handler, gmusic
from http.server import HTTPServer

false = False
true = True

class cfg:
    domain = "localhost"
    log = "srv.log"
    root = "."
    subdomains = {}
    port = 8000
    #ssl = {'cert':'cert.pem', 'key':'key.pem'}
    ssl = False
    redirect = 'False'
    forcewww = 'False'
    ip = "localhost"

#def main():
#    s = server.WebServerSSL ((cfg.ip, cfg.port), s_handler.WebHandler, cfg.ssl)
#    s.configure (cfg)
#    s.serve_forever ()


def run(server_class=HTTPServer, handler_class=handler.postHandler):
    server_address = (cfg.ip, cfg.port)
    httpd = server_class(server_address, handler_class)
    if os.path.isfile('.token'):
        with open ('.token', 'r') as f:
            ret = gmusic.load_login (*eval(f.read()))
            f.close()
        if ret:
            gmusic.write_data ()
    print ("Started server on %s at port %s" % (cfg.ip, cfg.port))
    httpd.serve_forever()

def main ():
    os.chdir(cfg.root)
    run ()

if __name__ == "__main__":
    try:
        main()
    except SystemExit:
        exit(0)
    except:
        traceback.print_exc(file=sys.stdout)
