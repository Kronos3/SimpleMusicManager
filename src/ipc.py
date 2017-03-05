#!/usr/bin/env python3
# -*- coding: utf-8 -*-
#
#  ipc.py
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

import socket
import os
from sys import platform as _platform
from thread import *

class IPC:
    def __init__ (self, handler, control, filename="current.sock"):
        self.filename = filename
        try:
            os.remove (self.filename)
        except OSError:
            pass
        self.sock = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
        self.sock.bind (self.filename)
        self.shutdown = False
        self.handler = handler
        self.control = control
        self.connections = []

    def res_fork (self):
        if _platform in ("linux", "linux2", "darwin"): # Unix uses fork()
            if (os.fork()):
                self.handler (self.conn, self.control)
            else:
                return
        elif _platform == "win32": # DOS uses thread
            start_new_thread(self.handler ,(self.conn, self.control))
    def serve (self):
        self.sock.listen (0)
        while not self.shutdown:
            self.conn, self.addr = self.sock.accept()
            self.connections.append (self.addr)
            self.res_fork ()

    def server_shutdown (self):
        self.shutdown = True

class IPCHandler:
    def __init__ (self, conn, control):
        self.conn = conn
        self.control = control

        while True:
            self.data = conn.recv (1024)
            if not self.data:
                break

            self.reply = ''
            self.process_data()
            self.exec_command()
            conn.sendall (self.res)

        conn.close ()

    def process_data (self):
        """
        Command syntax
        FUNCTION_NAME (ARGS)
        """
        self.name, args = self.data.split (' ', 1)
        self.args = eval (args)

    def exec_command (self):
        self.res = eval('self.control.%s (*%s)' % (self.name, self.args))

def ask_ipc (host, command, args):
    sock = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
    sock.connect (host)
    if not isinstance(args, (list, tuple)):
        args = (args,)
    sock.send ("%s %s" % (command, str(args)))
    res = sock.recv(1024)
    sock.close ()
    return res

def main ():
    class test_Control ():
        def __init__ (self):
            pass
        def d (self, f):
            return str(f) + 's'

    tc = test_Control ()
    test = IPC (IPCHandler, tc)
    test.serve()

if __name__ == "__main__":
    main()