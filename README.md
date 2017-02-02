# Build Status [![Build Status](https://travis-ci.org/Kronos3/SimpleMusicManager.svg?branch=master)](https://travis-ci.org/Kronos3/SimpleMusicManager)
# Google Music Offline (SimpleMusicManager)
A python gui built to replace iTunes and run on every OS

# Building and Testing
## Dependencies
 - Nodejs 4.x (if you want the desktop app)
 - Electron (if you want the desktop app)
 - python >=3.5
 - pip
~~~~
pip -r requirements.txt
~~~~

### Perform a dryrun of system (don't run the socket server)

~~~~
python3 server.py --test
~~~~

# Building
Building the nodejs deps **only if you want the desktop app**
Arch is the OS, and PLATFORM is x86 or x86_64
```
npm install -g
electron-packager . 'Google Music Online' --arch=[ARCH] --platform=[PLATFORM] --icon=./img/icon.png
```

# Running
To run in browser mode, execute the python file called `server.py` and head to `http://localhost:8000` in your browser
To run in desktop mode, simply run the executable that you packaged in the previous step and the GUI should launch
