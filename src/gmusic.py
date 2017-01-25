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
from . import library
import traceback

if sys.version_info < (3, 0):
    from urllib2 import urlopen
else:
    from urllib.request import urlopen

import urllib

import io, os

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

def load_login (_auth, _master):
    try:
        gm_api_mob.session.is_authenticated = True
        gm_api_mob.session._authtoken = _auth
        gm_api_mob.session._master_token = _master
    except:
        return False
    return True

def dump_login ():
    return gm_api_mob.session._authtoken, gm_api_mob.session._master_token

def login (username, password, save):
    ret = False
    try:
        ret = gm_api_mob.login(username, password, Mobileclient.FROM_MAC_ADDRESS)
    except exceptions.AlreadyLoggedIn:
        ret = True
    if ret and save == 'on':
        with open ('.token', 'w+') as f:
            f.write(str(dump_login ()))
            f.close()
    return ret

def find_all(a_str, sub):
    start = 0
    while True:
        start = a_str.find(sub, start)
        if start == -1: return
        yield start
        start += len(sub)

def mkdir_p(path):
    try:
        os.makedirs(path)
    except FileExistsError:
        pass

def safe_open_w(path):
    mkdir_p(os.path.dirname(path))
    return open(path, 'wb')

def write_img_cache (_in):
    for x in list(find_all(_in, "https://")):
        cache_buff = _in[x+len("https://"):_in.find ("\"", x)]
        while (cache_buff.find ("\'")) != -1:
            cache_buff = cache_buff[0:cache_buff.find ("\'")]
        if not os.path.isfile('.cache/'+cache_buff):
            with safe_open_w('.cache/'+cache_buff) as f:
                url_buff = urllib.request.urlopen('https://'+cache_buff)
                f.write(url_buff.read())
                f.close()
    return eval(_in.replace ("https://", "http://localhost:8000/.cache/"))

def refresh():
    try:
        out_s = gm_api_mob.get_all_songs ()
        out_s = write_img_cache (str(out_s))
    except:
        traceback.print_exc(file=sys.stdout)
        return ''
    
    gm_library = library.Library(out_s)
    return gm_library

def get_now():
    gm_now = sit_add_colors(gm_api_mob.get_listen_now_situations())
    return gm_now

def sort_by (lib, __property):
    return sorted(lib, key=lambda k: k[__property]) 

def get_text_color(color):
    avg = eval("(%s+%s+%s)/3" % (color[0], color[1], color[2]))
    if ((255-avg) >= 255/2):
        return 'light'
    else:
        return 'dark'

def sit_add_colors(lib):
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
