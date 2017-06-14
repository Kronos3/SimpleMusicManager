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

from __future__ import print_function, division, absolute_import, unicode_literals
import sys
from gmusicapi import *
from colorthief import ColorThief
import pickle
from . import library

from past.builtins import basestring
from builtins import *  # noqa
from collections import defaultdict
import datetime
from operator import itemgetter
import re
from uuid import getnode as getmac

from gmusicapi import session
from gmusicapi.clients.shared import _Base
from gmusicapi.exceptions import CallFailure, NotSubscribed
from gmusicapi.protocol import mobileclient
from gmusicapi.utils import utils
import traceback

if sys.version_info < (3, 0):
    from urllib2 import urlopen
else:
    from urllib.request import urlopen

import urllib

import io, os, json

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

loaded = False

false = False
true = True

def write_data ():
    global loaded
    lib_b = refresh()
    if lib_b != '':
        with open('data/library.json', 'w+') as lib:
            lib.write(json.dumps(lib_b.get_songs(), indent=4))
            lib.close()
        with open('data/albums.json', 'w+') as ablms:
            ablms.write (json.dumps(lib_b.get_albums(), indent=4))
            ablms.close()
        with open('data/artists.json', 'w+') as arts:
            arts.write (json.dumps(lib_b.get_artists(), indent=4))
            arts.close()
        with open('data/playlists.json', 'w+') as play:
            play.write (json.dumps(lib_b.get_playlists(), indent=4))
            play.close()
    else:
        loaded = False
        return
    loaded = True

def load_oauth_login ():
    return gm_api_man.login ()

def load_login (_auth, _master):
    try:
        locale='en_US'
        android_id = gm_api_mob.FROM_MAC_ADDRESS
        is_mac = android_id is gm_api_mob.FROM_MAC_ADDRESS
        if is_mac:
            mac_int = getmac()
            if (mac_int >> 40) % 2:
                raise OSError("a valid MAC could not be determined."
                              " Provide an android_id (and be"
                              " sure to provide the same one on future runs).")

            device_id = utils.create_mac_string(mac_int)
            device_id = device_id.replace(':', '')
        else:
            device_id = android_id

        gm_api_mob.session._master_token = _master
        gm_api_mob.session._authtoken = _auth
        gm_api_mob.session.is_authenticated = True

        gm_api_mob.android_id = gm_api_mob._validate_device_id(device_id, is_mac=is_mac)
        gm_api_mob.logger.info("authenticated")

        gm_api_mob.locale = locale

        if gm_api_mob.is_subscribed:
            gm_api_mob.logger.info("subscribed")

        return True
    except:
        traceback.print_exc(file=sys.stdout)
        return False

def dump_login ():
    return gm_api_mob.session._authtoken, gm_api_mob.session._master_token

def default_login():
    load_login (*eval(open('.token', 'r').read()))

def login (username, password, save):
    ret = False
    try:
        ret = gm_api_mob.login(username, password, gm_api_mob.FROM_MAC_ADDRESS)
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

def img_gen_cache_https (url):
    try:
        if os.path.getsize ('.cache/' + url) == 0:
            os.remove ('.cache/' + url)
        if not os.path.isfile('.cache/'+url):
            with safe_open_w('.cache/'+url) as f:
                url_buff = urllib.request.urlopen('https://'+url)
                f.write(url_buff.read())
                f.close()
    except FileNotFoundError:
        if not os.path.isfile('.cache/'+url):
            try:
                with safe_open_w('.cache/'+url) as f:
                    url_buff = urllib.request.urlopen('https://'+url)
                    f.write(url_buff.read())
                    f.close()
            except OSError: # Who know why this happens (fuckin Windows is shit)
                # Network unreachable for some reason
                # 301 still works
                # Just leave it to redirect
                os.remove ('.cache/' + url)

def img_gen_cache_http (url):
    try:
        if os.path.getsize ('.cache/' + url) == 0:
            os.remove ('.cache/' + url)
        if not os.path.isfile('.cache/'+url):
            with safe_open_w('.cache/'+url) as f:
                url_buff = urllib.request.urlopen('http://'+url)
                f.write(url_buff.read())
                f.close()
    except FileNotFoundError:
        if not os.path.isfile('.cache/'+url):
            try:
                with safe_open_w('.cache/'+url) as f:
                    url_buff = urllib.request.urlopen('http://'+url)
                    f.write(url_buff.read())
                    f.close()
            except OSError: # Who know why this happens (fuckin Windows is shit)
                # Network unreachable for some reason
                # 301 still works
                # Just leave it to redirect
                os.remove ('.cache/' + url)

def img_cache_back (_in):
    for x in list(find_all(_in, "https://")):
        cache_buff = _in[x+len("https://"):_in.find ("\"", x)]
        while (cache_buff.find ("\'")) != -1:
            cache_buff = cache_buff[0:cache_buff.find ("\'")]
        img_gen_cache_https (cache_buff)
    for x in list(find_all(_in, "http://")):
        cache_buff = _in[x+len("http://"):_in.find ("\"", x)]
        while (cache_buff.find ("\'")) != -1:
            cache_buff = cache_buff[0:cache_buff.find ("\'")]
        img_gen_cache_http (cache_buff)

def write_img_cache (_in):
    
    if str(sys.platform).find ('win') != -1:
        t = threading.Thread(name='Image caching', target=img_cache_back, args=(_in,))
        t.start()
    else:
        if os.fork () == 0:
            img_cache_back (_in)
            

def refresh():
    out_s = ""
    out_p = ""
    try:
        out_s = gm_api_mob.get_all_songs ()
        if os.fork () == 0:
            write_img_cache (str(out_s))
        out_s = eval(str(out_s).replace ("http://", "http://localhost:8001/.cache/").replace ("https://", "http://localhost:8001/.cache/"))
        out_p = gm_api_mob.get_all_user_playlist_contents ()
        if os.fork () == 0:
            write_img_cache (str(out_p))
        out_p = eval(str(out_p).replace ("http://", "http://localhost:8001/.cache/").replace ("https://", "http://localhost:8001/.cache/"))
    except:
        pass
    global gm_library
    gm_library = library.Library(out_s, out_p)
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
