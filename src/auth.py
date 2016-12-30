#!/usr/bin/env python2
# -*- coding: utf-8 -*-
#
#  auth.py
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


from oauth2client import client
import os

class OAuthGM:
    def __init__(self, secret_file="creds.json"):
        self.flow = client.flow_from_clientsecrets(
                    secret_file,
                    scope=['https://www.googleapis.com/auth/musicmanager', 'profile', 'email',  'https://android.clients.google.com/auth'],
                    redirect_uri='urn:ietf:wg:oauth:2.0:oob')
    def get_url (self):
        return self.flow.step1_get_authorize_url()
    def get_access_token (self, auth_code):
        self.credentials = self.flow.step2_exchange(auth_code)
        return self.credentials

MainAuth = OAuthGM(os.path.dirname(os.path.abspath(__file__)) + '/creds.json')
