#!/usr/bin/env python2
# -*- coding: utf-8 -*-
#
#  backend.py
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


import youtube_dl

class Artist:
  name = ""
  genre = ""
  profile = ""
  background = ""
  albums = []

class Album:
  artist = None
  name = ""
  art = ""
  songs = []

class Song:
  name = ""
  url = ""
  format = ""
  artist = None
  album = None
  quality = ""
  
  options = {}
  
  def __init__ (self, URL, NAME="generic", FORMAT="mp3", QUALITY="bestaudio/best"):
    self.name = NAME
    self.url = URL
    self.format = FORMAT
    self.quality = QUALITY
    
    self.options = {
        'format': QUALITY,          # choice of quality
        'extractaudio' : True,      # only keep the audio
        'audioformat' : FORMAT,     # convert to mp3 
        'outtmpl': NAME,            # name the file the ID of the video
        'noplaylist' : True,        # only download single song, not playlist
    }
    print ("Downloading...")
    youtube_dl.YoutubeDL (self.options).download ([url])
    print ("done")

url = input ("URL: ")
name = input ("NAME: ")

song = Song (url, name)
