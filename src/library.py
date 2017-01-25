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
import datetime

false = False
true = True

class Library:
    
    artists = {}
    songs = []
    albums = {}
    p_albums = []
    _in = None
    
    def __init__(self, _p_dict):
        self._in = _p_dict
        self.songs = []
        self.artists = {}
        self.albums = {}
        self.p_albums = []
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
    
    def get_albums (self):
        ret = []
        for i, album in enumerate(self.albums):
            b_album = {}
            b_album['name'] = album
            if album == '':
                b_album['name'] = 'Unknown Album'
            b_album['img'] = self.songs[self.albums[album][0]].albumArtRef[0]['url']
            if self.songs[self.albums[album][0]].artistArtRef != '':
                b_album['artimg'] = self.songs[self.albums[album][0]].artistArtRef[0]['url'] + "=s1920-e100?version=1"
            b_album['artist'] = self.songs[self.albums[album][0]].albumArtist
            b_album['year'] = self.songs[self.albums[album][0]].year
            b_album['genre'] = self.songs[self.albums[album][0]].genre
            d = 0
            for s in self.albums[album]:
                d += int(self.songs[s].durationMillis)
            b_album['totaltime'] = str(datetime.timedelta(seconds=(int(d)/1000)))[0:str(datetime.timedelta(seconds=(int(d)/1000))).find ('.')]
            b_album['snum'] = len(self.albums[album])
            b_album['songs'] = []
            b_album['index'] = i
            for song in self.albums[album]:
                b_album['songs'].append(self.songs[song].get_json())
            ret.append (b_album)
        res = {}
        res['albums'] = ret
        return res

class Song:
    def __init__ (self, _p_song):
        self._in = _p_song
        self.albumArtRef = [{'url':'https://play-music.gstatic.com/fe/a7ec6b93867145af72bd1eeabd737a62/default_album.svg'}]
        self.albumArtist = 'Unknown Artist'
        self.artistArtRef = ''
        for k in _p_song:
            exec ("self.%s = _p_song['%s']" % (k, k))
        if not self.albumArtist:
            self.albumArtist = 'Unknown Artist'
        timeb = str(datetime.timedelta(seconds=(int(self.durationMillis)/1000)))
        self.minutes = timeb[timeb.find(':')+1:timeb.find ('.')]
    
    def get_json (self):
        r = '{'
        for x in self.__dict__:
            if x == '_in':
                continue
            if type(eval("self.%s" % x)).__name__ == 'str':
                r += "\"%s\": \"\"\"%s\"\"\"," % (x, eval("self.%s" % x))
                continue
            r += "\"%s\": %s," % (x, eval("self.%s" % x))
        r += '}'
        return eval(r)
