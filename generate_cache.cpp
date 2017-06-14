/*
 * generate_cache.cpp
 * 
 * Copyright 2017 Unknown <atuser@Kronos>
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


#include <iostream>
#include <fstream>
#include <sstream>
#include <string>
#include <string.h>
#include <stdarg.h>  // For va_start, etc.
#include <memory>    // For std::unique_ptr

using namespace std;

std::string string_format(const std::string fmt_str, ...) {
    int final_n, n = ((int)fmt_str.size()) * 2; /* Reserve two times as much as the length of the fmt_str */
    std::string str;
    std::unique_ptr<char[]> formatted;
    va_list ap;
    while(1) {
        formatted.reset(new char[n]); /* Wrap the plain char array into the unique_ptr */
        strcpy(&formatted[0], fmt_str.c_str());
        va_start(ap, fmt_str);
        final_n = vsnprintf(&formatted[0], n, fmt_str.c_str(), ap);
        va_end(ap);
        if (final_n < 0 || final_n >= n)
            n += abs(final_n - n + 1);
        else
            break;
    }
    return std::string(formatted.get());
}

void generate_cache (char* filename) {
    ifstream infile(filename);
    string url;
    while (getline(infile, url))
    {
        std::istringstream iss(url);
        string s;
        if (string(url).find("https://") != string::npos) {
            s = string_format (".cache/%s", url.substr (string("https://").length()).c_str());
        }
        else {
            s = string_format (".cache/%s", url.substr (string("http://").length()).c_str());
        }
        string command;
        command = string_format ("./download %s %s", url.c_str(), s.c_str());
        system (command.c_str());
    }
}

int main(int argc, char **argv)
{
    generate_cache (argv[1]);
    return 0;
}

