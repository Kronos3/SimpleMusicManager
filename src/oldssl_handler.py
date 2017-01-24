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


import socketserver
import os, traceback, sys
from .res import HTTPRes
from . import gmusic
import time
import mimetypes

class WebHandler(socketserver.BaseRequestHandler):
    def __init__ (self, request, client_address, server):
        self.request = request
        self.client_address = client_address
        self.server = server
        self.setup()
        try:
            self.handle()
        finally:
            self.finish()

    def _gen_headers(self, code, version="HTTP/1.1", extra="", mime="text/plain"):
        # determine response code
        h = ''
        h = "%s %s %s\n" % (version, code[0], code[1])
        h += extra
        # write further headers
        h += "Content-Type: %s\n" % mime
        current_date = time.strftime("%a, %d %b %Y %H:%M:%S", time.localtime())
        h += 'Date: ' + current_date +'\n'
        h += 'Server: some shit\n'
        h += 'Connection: close\n\n'  # signal that the conection wil be closed after complting the request

        return h.encode()
    def handle_post (self, parsed):
        ret = HTTPRes.OK
        if parsed['path'] == "/login":
            if (parsed['body'] == ""):
                r = False
            else:
                r = gmusic.login (*eval(parsed['body']))
            if ret != True:
                ret = HTTPRes.UNAUTH
        template = self._gen_headers (ret, version=parsed["version"])
        return template, ret
    
    def handle_get (self, parsed):
        if parsed["path"] == "/":
            parsed["path"] = "/index.html"
        
        subroot = self.server.config.root
        fp = "%s%s" % (subroot, parsed["path"])
        if not os.path.isfile(fp):
            self.server.log ("%s: no such file or directory" % fp)
            return self._gen_headers (HTTPRes.NOTFOUND, parsed["version"]), HTTPRes.NOTFOUND
        mtype = mimetypes.guess_type (fp)[0]
        if not mtype:
            mtype = "text/plain"
        read = open(fp, "rb").read()
        template = self._gen_headers (HTTPRes.OK, version=parsed["version"], mime=mtype)
        template += read
        return template, HTTPRes.OK
    
    def gen_response (self, parsed):
        if (parsed["method"] not in  ["POST", "GET"]):
            return self._gen_headers (HTTPRes.OK, parsed["version"]), HTTPRes.OK
        if (parsed["method"] == "POST"):
            return self.handle_post(parsed)
        elif (parsed["method"] == "GET"):
            return self.handle_get (parsed)
    
    def parse_http (self, request):
        lines = str(request)[2:-1].split ("\\r\\n")
        ret = {}
        req_pars = lines[0].split (" ")
        if len (req_pars) != 3:
            return
        self.server.log (lines[0], "REQUEST")
        ret["method"] = req_pars[0]
        if (req_pars[1].find("?") != -1):
            ret["path"] = req_pars[1][:req_pars[1].find("?")]
        else:
            ret["path"] = req_pars[1]
        ret["version"] = req_pars[2]
        ret["body"] = ""
        for i, line in enumerate (lines[1:]):
            if (line == "\n"):
                ret["body"] = lines[i+1:]
            parsed = line.split (": ")
            if len(parsed) == 2:
                ret[parsed[0]] = parsed[1]
        return ret
    
    def handle(self):
        self.data = self.request.recv(1024).strip()
        status = 0
        print (self.data)
        if self.data == b'':
            t = self._gen_headers (HTTPRes.OK)
            t += open ("%s/index.html" % self.server.config.root, "rb").read()
            self.request.sendall(t)
            return
        try:
            parsed = self.parse_http(self.data)
            if (parsed == None):
                res = self._gen_headers (HTTPRes.BADREQ, version="HTTP/1.1")
                status = HTTPRes.BADREQ
            else:
                res, status = self.gen_response (parsed)
        except:
            traceback.print_exc(file=sys.stdout)
            res = self._gen_headers (HTTPRes.INTERN, version="HTTP/1.1")
            status = HTTPRes.INTERN
        try:
            self.server.log (status, "RESPONSE")
        except UnicodeDecodeError:
            self.server.log ("Cant decode response (but it was sent, image most likely)", "RESPONSE")
        self.request.sendall(res)
