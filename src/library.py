#!/usr/bin/env python2
# -*- coding: utf-8 -*-
#
#  library.py
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

import json

false = False
true = True

class Library:
    
    artists = {}
    songs = []
    albums = {}
    _in = None
    
    def __init__(self, _p_dict):
        self._in = _p_dict
        for song in self._in:
            self.songs.append (Song (song))
        for i, song in enumerate (self.songs):
            try:
                self.albums[song.album]
            except:
                self.albums[song.album] = []
            self.albums[song.album].append (i)
        for i, song in enumerate (self.songs):
            try:
                self.artists[song.artist]
            except:
                self.artists[song.artist] = []
            self.artists[song.artist].append (i)

class Song:
    def __init__ (self, _p_song):
        for k in _p_song:
            exec ("self.%s = _p_song['%s']" % (k, k))
