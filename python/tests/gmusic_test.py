#!/usr/bin/env python2
# -*- coding: utf-8 -*-
#
#  gmusic_test.py
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


import sys, getpass, traceback
sys.path.append ("../")
from gmusic.gmusic import * 

def main(args):
    #user = input ("username: ")
    buff = {}
    passwd = getpass.getpass ("password: ")
    if (not r_login (["dovakhiin1359", passwd])):
        print ("Incorrect password!")
        exit(1)
    buff = r_refresh_lib()
        
    cmd = ""
    while (cmd not in ("q", "quit")):
        try:
            exec (cmd)
        except:
            traceback.print_exc(file=sys.stdout)
        cmd = input ("> ")
    
    return 0

if __name__ == '__main__':
    import sys
    sys.exit(main(sys.argv))
