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
from . import gmusic
import os.path

false = False
true = True

class Library:
    
    artists = {}
    songs = []
    albums = {}
    p_albums = []
    playlists = []
    _in = None
    inited = False
    
    def __init__(self, _p_dict, _play_lists=None):
        self._in = _p_dict
        self._pin = _play_lists
        self.playlists = []
        self.songs = []
        self.artists = {}
        self.albums = {}
        self.p_albums = []
        for i, song in enumerate(self._in):
            self.songs.append (Song (song))
            self.songs[-1].songnum = i
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
        if self._pin != None:
            for _list in self._pin:
                self.playlists.append(PlayList(_list).get_json())
    
    def get_stream (self, i):
        for x in self.songs:
            if x.id == i:
                return x.get_stream ()
        raise IndexError ()
    
    def get_albums (self):
        ret = []
        for i, album in enumerate(sorted(self.albums.keys())):
            b_album = {}
            b_album['name'] = album
            if album == '':
                b_album['name'] = 'Unknown Album'
            b_album['img'] = self.songs[self.albums[album][0]].albumArtRef[0]['url']
            if self.songs[self.albums[album][0]].artistArtRef != 'http://localhost:8000/img/noart.png':
                b_album['artimg'] = self.songs[self.albums[album][0]].artistArtRef[0]['url'] + "=s1920-e100"
                gmusic.img_gen_cache_http (b_album['artimg'].replace ("http://localhost:8000/.cache/", ""))
            else:
                b_album['artimg'] = 'http://localhost:8000/img/noart.png'
            b_album['artist'] = self.songs[self.albums[album][0]].albumArtist
            b_album['year'] = self.songs[self.albums[album][0]].year
            if b_album['year'] in [0, '0']:
                b_album['year'] = '-'
            b_album['genre'] = self.songs[self.albums[album][0]].genre
            d = 0
            for s in self.albums[album]:
                d += int(self.songs[s].durationMillis)
            b_album['totaltime'] = str(datetime.timedelta(seconds=(int(d)/1000)))[0:str(datetime.timedelta(seconds=(int(d)/1000))).find ('.')]
            b_album['snum'] = len(self.albums[album])
            b_album['songs'] = []
            b_album['index'] = i
            b_album['id'] = "{:08x}".format(i)
            for song in self.albums[album]:
                b_album['songs'].append(self.songs[song].get_json())
            ret.append (b_album)
        res = {}
        res['albums'] = ret
        return res
    
    def get_salbums (self, song_list): # Generate albums from song list
        ret = []
        alb = {}
        for song in song_list:
            try:
                alb[song.album]
            except:
                alb[song.album] = []
            alb[song.album].append (song)
        for i, album in enumerate(sorted(alb.keys())):
            b_album = {}
            b_album['name'] = album
            if album == '':
                b_album['name'] = 'Unknown Album'
            b_album['img'] = self.songs[self.albums[album][0]].albumArtRef[0]['url']
            if self.songs[self.albums[album][0]].artistArtRef != 'http://localhost:8000/img/noart.png':
                b_album['artimg'] = self.songs[self.albums[album][0]].artistArtRef[0]['url'] + "=s1920-e100"
                gmusic.img_gen_cache_http (b_album['artimg'].replace ("http://localhost:8000/.cache/", ""))
            else:
                b_album['artimg'] = 'http://localhost:8000/img/noart.png'
            b_album['artist'] = self.songs[self.albums[album][0]].albumArtist
            b_album['year'] = self.songs[self.albums[album][0]].year
            b_album['genre'] = self.songs[self.albums[album][0]].genre
            if b_album['year'] == 0:
                b_album['year'] = '-'
            d = 0
            for s in self.albums[album]:
                d += int(self.songs[s].durationMillis)
            b_album['totaltime'] = str(datetime.timedelta(seconds=(int(d)/1000)))[0:str(datetime.timedelta(seconds=(int(d)/1000))).find ('.')]
            b_album['snum'] = len(self.albums[album])
            b_album['songs'] = []
            b_album['index'] = i
            b_album['id'] = "{:08x}".format(i)
            for song in alb[album]:
                b_album['songs'].append(song.get_json())
            ret.append (b_album)
        res = {}
        res['albums'] = ret
        return res
    
    def get_ssongs (self, l): # Generate a list of songs from index lists
        ret = []
        for x in l:
            ret.append (self.songs[x])
        return ret
    
    def get_artists (self):
        ret = []
        for i, artist in enumerate(sorted(self.artists.keys())):
            b_artist = {}
            b_artist['name'] = artist
            if artist == '':
                b_artist['name'] = 'Unknown artist'
            if self.songs[self.artists[artist][0]].artistArtRef != 'http://localhost:8000/img/noart.png':
                b_artist['img'] = self.songs[self.artists[artist][0]].artistArtRef[0]['url'] + "=w250-h250-p-e100"
                b_artist['artimg'] = self.songs[self.artists[artist][0]].artistArtRef[0]['url'] + "=s1920-e100"
                gmusic.img_gen_cache_http (b_artist['img'].replace ("http://localhost:8000/.cache/", ""))
                b_artist['letter'] = ''
            else:
                b_artist['img'] = 'http://localhost:8000/img/noart.png'
                b_artist['letter'] = b_artist['name'][0]
            b_artist['albums'] = self.get_salbums (self.get_ssongs(self.artists[artist]))['albums']
            b_artist['index'] = i
            b_artist['id'] = "{:08x}".format(i)
            ret.append (b_artist)
        res = {}
        res['artists'] = ret
        return res

    def get_song (self, _id):
        for i, song in enumerate(self.songs):
            if song.id == _id:
                return i
    
    def get_playlists (self):
        ret = []
        for i, playlist in enumerate(self.playlists):
            b_list = playlist
            b_list['songs'] = list(self.songs[y].get_json() for y in [self.get_song(x['trackId']) for x in b_list['tracks'] if not x is None])
            for k, s in enumerate(b_list['songs']):
                b_list['songs'][k]['plid'] = b_list['tracks'][k]['id']
            b_list['index'] = i
            b_list['id'] = "{:08x}".format(i)
            ret.append (b_list)
        res = {}
        res['playlists'] = ret
        return res
    
    def get_songs (self):
        ret = []
        for song in self.songs:
            ret.append (song.get_json())
        res = {}
        res['songs'] = ret
        return res
    
    def add_song_to_playlist (self, index, playlist):
        gmusic.gm_api_mob.add_songs_to_playlist (playlist, index)
        
    def rm_song_from_playlist (self, plid):
        gmusic.gm_api_mob.remove_entries_from_playlist (plid)
    
    def increment_song (self, _id):
        gmusic.gm_api_mob.increment_song_playcount (_id)
    
    def rm_song (self, _id):
        gmusic.gm_api_mob.delete_songs(_id)

class PlayList:
    def __init__ (self, _p_play_list):
        self._in = _p_play_list
        self.description = '-'
        for k in _p_play_list:
            exec ("self.%s = _p_play_list['%s']" % (k, k))
    
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
    
class Song:
    def __init__ (self, _p_song):
        self._in = _p_song
        self.albumArtRef = [{'url':'http://localhost:8000/img/default_album.svg'}]
        self.albumArtist = 'Unknown Artist'
        self.year = '-'
        self.genre = '-'
        self.artistArtRef = 'http://localhost:8000/img/noart.png'
        for k in _p_song:
            exec ("self.%s = _p_song['%s']" % (k, k))
        if not self.albumArtist:
            self.albumArtist = 'Unknown Artist'
        timeb = str(datetime.timedelta(seconds=(int(self.durationMillis)/1000)))
        self.minutes = timeb[timeb.find(':')+1:timeb.find ('.')]
        self.image = self.albumArtRef[0]['url']
        self.songnum = None
        
        try:
            self.trackNumber
        except:
            self.trackNumber = 0
        
        try:
            self.playCount
        except:
            self.playCount = 0
        
        if self.trackNumber == 0:
            self.trackNumber = ''
        
        if self.artist.find('&') != -1:
            self.artist = self.artist[0:self.artist.find('&')].strip()
    
    def get_stream (self):
        return gmusic.gm_api_mob.get_stream_url (self.id)
    
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

class SongLib:
    def __init__ (self, metasong):
        self.metasong = metasong
        self.artist = self.metasong.albumArtist
        self.id = self.metasong.id
        self.is_cached = False
    
    def create_cache (self):
        raw_audio = gmusic.download_song(self.id)[1]
        with open ('../library/' + self.id, 'wb') as f:
            f.write (raw_audio)
    
    def get_cached (self):
        if (os.path.isfile('../library/' + self.id)):
            return True
        else:
            return False

class Lib:
    def __init__ (self, metalib):
        self.metalib = metalib
        self.songs = []
        self.ids = {}
        for i, song in enumerate(self.metalib.songs):
            self.songs.append (SongLib(song))
            self.ids[self.metalib.songs[i].id] = i
    
    def dl_lib (self, index, isId=False): # If isId is false then the song index will be cached
        _id = None
        if (not isId):
            _id = self.metalib.songs[index].id
        else:
            _id = index
        if (not self.ids[_id].get_cached()):
            self.ids[_id].create_cache()
