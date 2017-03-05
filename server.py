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
import json, traceback, sys, os, platform, socketserver, socket
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

if sys.platform == "win32":
    class HTTPMain (socketserver.ThreadingTCPServer):
        allow_reuse_address = 1
        def server_bind(self):
            socketserver.TCPServer.server_bind(self)
            host, port = self.server_address[:2]
            self.server_name = socket.getfqdn(host)
            self.server_port = port
else:
    class HTTPMain (socketserver.ForkingTCPServer):
        allow_reuse_address = 1
        def server_bind(self):
            socketserver.TCPServer.server_bind(self)
            host, port = self.server_address[:2]
            self.server_name = socket.getfqdn(host)
            self.server_port = port

def run(server_class=HTTPMain, handler_class=handler.postHandler, serve=True, gui=False, debug=False):
    server_address = (cfg.ip, cfg.port)
    if debug:
        print ("\nEntered debug\nNote: Debug is insecure\nUSE AT YOUR OWN RISK\n\n")
        handler_class = handler.postHandlerDebug
    httpd = server_class(server_address, handler_class)
    if os.path.isfile('.token'):
        with open ('.token', 'r') as f:
            ret = gmusic.load_login (*eval(f.read()))
            f.close()
        if ret:
            gmusic.write_data ()
        handler.MainRHandler.is_logged_in = gmusic.load_oauth_login ()
    if (not os.path.exists ('data')):
        os.mkdir ('data')
    if gui:
        if sys.platform == "linux" or sys.platform == "linux2":
            if platform.architecture()[0] == '64bit':
                os.system ("./bin-lin64/electron . &")
            elif platform.architecture()[0] == '32bit':
                #os.system ("./linux32-bin/electron . &")
                raise OSError('32-bit operating systems are not supported yet')
        elif sys.platform == "darwin":
            os.system ("open ./bin-mac64/Electron.app . &")
        elif sys.platform == "win32":
            if platform.architecture()[0] == '64bit':
                os.system ("START /B .\\bin-win64\\electron.exe .")
            elif platform.architecture()[0] == '32bit':
                raise OSError('32-bit operating systems are not supported yet')
    
    if serve:
        print ("Started server on %s at port %s" % (cfg.ip, cfg.port))
        httpd.serve_forever()

def main (argv):
    os.chdir(cfg.root)
    s = True
    g = False
    d = False
    if '--test' in argv:
        s = False
    if '--gui' in argv:
        g = True
        s = False
    if '--debug' in argv:
        d = True
    run (serve=s, gui=g, debug=d)

if __name__ == "__main__":
    try:
        main(sys.argv)
        exit(0)
    except SystemExit:
        exit(0)
    except:
        traceback.print_exc(file=sys.stdout)
