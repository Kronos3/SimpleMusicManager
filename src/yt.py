#!/usr/bin/env python
# -*- coding: utf-8 -*-
#
#  yt.py
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

from __future__ import unicode_literals
from html.parser import HTMLParser
#from .youtube_dl import YoutubeDL
import os

try:
    # For Python 3+
    from urllib.request import urlopen
except ImportError:
    # For Python 2
    from urllib2 import urlopen

import json

def get_jsonparsed_data(url):
    response = urlopen(url)
    data = str(response.read())
    return json.loads(data)


class YTSearchParser(HTMLParser):
    search_finds = []
    json_dumped = []
    def handle_starttag(self, tag, attrs):
        for attr in attrs:
            if (attr[0] == 'class' and attr[1].find('yt-uix-tile-link') != -1):
                buf = attrs[list(zip(*attrs))[0].index('href')][1]
                if buf[1] == 'w': # Videos only
                    if buf.find('&') != -1:
                        a = buf[9:buf.find('&')]
                    else:
                        a = buf[9:]
                    if a not in self.search_finds:
                        self.search_finds.append(a)

    def parse_searches (self):
        for x in self.search_finds:
            buf = {}
            b = get_jsonparsed_data ('https://www.googleapis.com/youtube/v3/videos?id=' + x + '&key=AIzaSyAofmivOMlh5VmMl0_AoTeDgOm8FOwCBOc&fields=items(id,snippet(title,channelTitle,thumbnails(default)))&part=snippet')
            #buf['img'] = 

class YTDL ():
    pass
    ydl_opts = {
        'format': 'bestaudio/best',
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
        }],
    }
    def __init__ (self):
        #super (YTDL, self).__init__(self.ydl_opts)
        pass
    
    def download (self, urls):
        """
        b = os.getcwd()
        if (not os.path.isdir ('.temp')):
            os.makedirs('.temp')
        os.chdir ('.temp')
        super (YTDL, self).download (urls)
        os.chdir (b)
        """
        pass
