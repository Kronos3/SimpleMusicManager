#!/usr/bin/env python
# -*- coding: utf-8 -*-
#
#  cache.py
#  
#  Copyright 2017 atuser <atuser@Kronos>
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

import os

class MusicCache:
  """ 
  This class is made to hold the
  needed cache for google music's
  metadata. All text will be stored
  in JSON files, and all images will be
  stored in the .cache folder
  """
  
  def __init__ ( self, reset=False ):
    # Check if .cache exists
    if not os.path.isdir ('.cache'):
      os.mkdir ('.cache')
    if reset:
      for x in [f for f in os.path.listdir('.cache') if os.path.isfile(os.path.join('.cache', f))]:
        os.remove (x)
  
  def _gen_cache ( self, 
