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
from gmusicapi import *
from colorthief import ColorThief
import pickle

if sys.version_info < (3, 0):
    from urllib2 import urlopen
else:
    from urllib.request import urlopen

import io

global gm_api_mob
global gm_api_web
global gm_api_man
global gm_library
global gm_now
global gm_stations
global google_creds
gm_api_mob = Mobileclient()
gm_api_web = Webclient()
gm_api_man = Musicmanager()
gm_library = None
gm_now = None
gm_stations = None

def login (username, password):
    ret = None
    try:
        ret = str('%s' % gm_api_mob.login(username, password, Mobileclient.FROM_MAC_ADDRESS)).lower()
    except exceptions.AlreadyLoggedIn:
        pass
    return ret

def refresh():
    gm_library = gm_api_mob.get_all_songs ()
    return gm_library

def get_now():
    gm_now = add_colors(gm_api_mob.get_listen_now_situations())
    return gm_now

def sort_by (lib, __property):
    return sorted(lib, key=lambda k: k[__property]) 

def get_text_color(color):
    avg = eval("(%s+%s+%s)/3" % (color[0], color[1], color[2]))
    if ((255-avg) >= 255/2):
        return 'light'
    else:
        return 'dark'

def add_colors(lib):
    out_lib = []
    for item in lib:
        fd = urlopen(item['wideImageUrl'])
        f = io.BytesIO(fd.read())
        color_thief = ColorThief(f)
        item['primary'] = color_thief.get_color(quality=1)
        item['second'] = color_thief.get_palette(quality=1)[1]
        if (item['second'] == item['primary']):
            item['second'] = color_thief.get_palette(quality=1)[2]
        item['color'] = get_text_color(item['primary'])
        if item['color'] == 'dark':
            item['startcolor'] = '255,255,255'
        else:
            item['startcolor'] = '0,0,0'
        out_lib.append(item)
    return out_lib

def dump_data (data):
    with open('data/mobile.pickle', 'wb') as f:
        pickle.dump(data, f, pickle.HIGHEST_PROTOCOL)

def get_data ():
    with open('data/mobile.pickle', 'rb') as f:
        ret = pickle.load(f)
    return ret

