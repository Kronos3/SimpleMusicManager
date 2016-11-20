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


"""
A request is sent from NodeJS to Python via the socket
The request will have a name, and user params
The name will translate to a 'r_%s' % name, python function
The user params will act as an array of args passed to the function.
The return value will be sent back to NodeJS

 ----------        -------------                ----------
|          |      |             |   r_params   |          |
|  NodeJS  | ---> |  r_handler  |  --------->  |  r_name  |
|          |      |             |              |          |
 ----------        -------------                ----------
     ^                                               |
     |-----------------------------------------------|
                        return value

"""

from blinker import signal
import gmusic
import auth
import zerorpc

class r_handler(object):
    def __init__ (self):
        super(r_handler, self).__init__()
    
    def login (self, i_list):
        return gmusic.login(i_list)
    def get_access (self, arg):
        print("test")
        return auth.MainAuth.get_url()

__handler = zerorpc.Server(r_handler())
__handler.bind('tcp://0.0.0.0:4242')
__handler.run()
