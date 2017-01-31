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
import json, traceback, sys, os, platform
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


def run(server_class=HTTPServer, handler_class=handler.postHandler, serve=True, gui=False):
    server_address = (cfg.ip, cfg.port)
    httpd = server_class(server_address, handler_class)
    if os.path.isfile('.token'):
        with open ('.token', 'r') as f:
            ret = gmusic.load_login (*eval(f.read()))
            f.close()
        if ret:
            gmusic.write_data ()
        handler.MainRHandler.is_logged_in = gmusic.load_oauth_login ()
    print ("Started server on %s at port %s" % (cfg.ip, cfg.port))
    if gui:
        if sys.platform == "linux" or sys.platform == "linux2":
            if platform.architecture()[0] == '64bit':
                os.system ("./linux64-bin/electron . &")
            if platform.architecture()[0] == '32bit':
                os.system ("./linux32-bin/electron . &")
        elif platform == "darwin":
            os.system ("open ./darwin-bin/Electron.app . &")
        elif platform == "win32":
            if platform.architecture()[0] == '64bit':
                os.spawnl(os.P_DETACH, './win64-bin/electron.exe .')
            if platform.architecture()[0] == '32bit':
                os.spawnl(os.P_DETACH, './win32-bin/electron.exe .')
    if serve:
        httpd.serve_forever()

def main (argv):
    os.chdir(cfg.root)
    s = True
    g = False
    if '--test' in argv:
        s = False
    if '--gui' in argv:
        g = True
    run (serve=s, gui=g)

if __name__ == "__main__":
    try:
        main(sys.argv)
        exit(0)
    except SystemExit:
        exit(0)
    except:
        traceback.print_exc(file=sys.stdout)
