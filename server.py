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

import sys

import socketserver, sys, traceback
from src.r_handler import MainRHandler
from src.encrypt import RSA_obj
import os, subprocess, threading
from multiprocessing import Process

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
    
    def _gen_headers(self, code):
        """ Generates HTTP response Headers. Ommits the first line! """

        # determine response code
        h = ''
        if (code == 200):
            h = 'HTTP/1.1 200 OK\n'
        elif(code == 404):
            h = 'HTTP/1.1 404 Not Found\n'
        elif(code == 400):
            h = 'HTTP/1.0 400 Bad Request\n'
        
        # write further headers
        current_date = time.strftime("%a, %d %b %Y %H:%M:%S", time.localtime())
        h += 'Date: ' + current_date +'\n'
        h += 'Server: Simple-Python-HTTP-Server\n'
        h += 'Connection: close\n\n'  # signal that the conection wil be closed after complting the request
        return h
    
    def get_handle (self, request):
        parsed = request.split (' ')
        file_req = parsed[1];
        
        if file_req == 'rsakey':
          return creds.get_pub()
        
        if file_req == '/':
            file_req = '/index.html'
        file_req = 'oauth' + file_req
        try:
            file_buf = open (file_req, 'rb')
            response = file_buf.read ()
            response_head = self._gen_headers(200)
            file_buf.close()
        except Exception as e:
            response_head = self._gen_headers (404)
            response = b''
        
        server_res = response_head.encode()
        server_res += response
        return server_res
        
    
    def handle(self):
        # self.request is the TCP socket connected to the client
        self.data = self.request.recv(1024).strip()
        formatted = self.data.decode ('UTF-8')
        request = str(self.data.decode('UTF-8')).split ('|')
        log ('got request %s' % request[0])
        if (request[0].startswith('r_')):
            return_val = MainRHandler.r_get (request[0][2:], request[1:])
            print (return_val)
            self.request.sendall(str.encode(return_val))
        elif (request[0].startswith('d_')):
            exec ('%s(%s)' % (request[0][2:], request[1]))
        elif (formatted[0:formatted.find(' ')] == 'GET'):
            self.request.sendall(self.get_handle (formatted))
        else:
            self.request.sendall(str.encode(self._gen_headers(400)))

log_num = 0

def log (string, newl=True):
    global log_num
    log_num += 1
    if (newl):
        print ('\n--- %s --- [%s] %s' % (round(time.time()-start_time, 3), log_num, string))
    else:
        print ('--- %s --- [%s] %s' % (round(time.time()-start_time, 3), log_num, string))

def background(f):
    '''
    a threading decorator
    use @background above the function you want to run in the background
    '''
    def bg_f(*a, **kw):
        threading.Thread(target=f, args=a, kwargs=kw).start()
    return bg_f

@background
def start_server (server):
    return server.serve_forever()

def main():
    global HOST
    global PORT
    global creds
    creds = RSA_obj ()
    
    HOST, PORT = "localhost", 8000
    
    server = socketserver.TCPServer((HOST, PORT), MyTCPHandler)
    cmd = os.path.join (os.path.dirname(os.path.realpath('__file__')), "npm\\npm.cmd")
    print (cmd)
    start_server (server)
    os.spawnl (os.P_NOWAIT, cmd, cmd, "start")

if __name__ == "__main__":
    try:
        main()
    except SystemExit:
        exit(0)
    except:
        traceback.print_exc(file=sys.stdout)
