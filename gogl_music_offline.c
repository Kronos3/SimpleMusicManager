/*
 * gogl_music_offline.c
 * 
 * Copyright 2017 atuser <atuser@Kronos>
 * 
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
 * MA 02110-1301, USA.
 * 
 * 
 */


#ifdef _WIN32

#include <windows.h>
#include <stdio.h>
#include <stdlib.h>
#include <tchar.h>

#endif
#ifdef linux

#include <stdio.h>
#include <stdlib.h>

#endif

int main(int argc, char **argv)
{
#ifdef _WIN32
  printf ("In windows\n");
  FILE * fstream;
  char fbuffer [128];
  if ( ( fstream = _popen ( "Python36\\python.exe server.py", "rt" ) ) == NULL)
    fprintf ( stderr, "Failed to execute command" );
  while( !feof( fstream ) )
  {
    if( fgets( fbuffer, 128, fstream ) != NULL )
    printf( fbuffer );
  }
  system ("pause");
#endif
#ifdef linux
  int lexit;
  if ( ( lexit = system ( "python3 serverpy" ) ) != 0 )
    fprintf ( STDERR, "Exited with code %d", lexit );
#endif
  return 0;
}

