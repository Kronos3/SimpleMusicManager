#!/usr/bin/env python2
# -*- coding: utf-8 -*-
#
#  gmusic.py
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
sys.path.append ('..')
sys.path.append ('../api/')
from api.gmusicapi import *

global gm_api_m
global gm_api_man
global gm_library
global gm_stations
global google_creds
gm_api_m = Mobileclient()
gm_api_man = Musicmanager()
gm_library = None
gm_stations = None

google_creds = []

#class Library:
#    

# info[0] = username
# info[1] = password
def login (info):
    if (not info[0].endswith("@gmail.com")):
        info[0] = info[0] + "@gmail.com"
    return gm_api_m.login(info[0], info[1], Mobileclient.FROM_MAC_ADDRESS)

def refresh():
    gm_library = gm_api_m.get_all_songs ()
    return gm_library

def sort_by (lib, __property):
    return sorted(lib, key=lambda k: k[__property]) 

