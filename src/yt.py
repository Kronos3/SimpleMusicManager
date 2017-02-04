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


from html.parser import HTMLParser

class YTSearchParser(HTMLParser):
    search_finds = []
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
