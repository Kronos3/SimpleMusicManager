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

import sys
sys.path.append ("/usr/lib/python3.5/")
sys.path.append ("/usr/lib/python3.5/site-packages")

import time
start_time = time.time()

import socketserver, sys, traceback
from src.r_handler import MainRHandler
import multiprocessing
import os
import time

def sleep (_time):
    for x in reversed(range (_time)):
        sys.stdout.write ("\rWaiting for %s" % int(x+1))
        time.sleep(1)
    sys.stdout.write ("\r")

class MyTCPHandler(socketserver.BaseRequestHandler):
    """
    The RequestHandler class for our server.

    It is instantiated once per connection to the server, and must
    override the handle() method to implement communication to the
    client.
    """

    def handle(self):
        # self.request is the TCP socket connected to the client
        self.data = self.request.recv(1024).strip()
        request = str(self.data.decode('UTF-8')).split ('|')
        log ('got request %s' % request[0])
        if (request[0].startswith('r_')):
            return_val = MainRHandler.r_get (request[0][2:], request[1:])
            print (return_val)
            self.request.sendall(str.encode(return_val))
        elif (request[0].startswith('d_')):
            exec ('%s(%s)' % (request[0][2:], request[1]))
        else:
            self.request.sendall(b'HTTP/1.0 400 Bad Request\n')

log_num = 0

def log (string, newl=True):
    global log_num
    log_num += 1
    if (newl):
        print ('\n--- %s --- [%s] %s' % (round(time.time()-start_time, 3), log_num, string))
    else:
        print ('--- %s --- [%s] %s' % (round(time.time()-start_time, 3), log_num, string))

def main():
    global HOST
    global PORT
    HOST, PORT = "localhost", 8000
    
    server = socketserver.TCPServer((HOST, PORT), MyTCPHandler)
    newpid = os.fork()
    if newpid == 0:
        os.system('npm start -enable-transparent-visuals --disable-gpu')
    server.serve_forever()

if __name__ == "__main__":
    try:
        main()
    except SystemExit:
        exit(0)
    except:
        traceback.print_exc(file=sys.stdout)
