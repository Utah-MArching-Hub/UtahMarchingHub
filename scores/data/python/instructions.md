# Instructions

- [Instructions](#instructions)
  - [Setup](#setup)
    - [Install python](#install-python)
    - [Setup venv](#setup-venv)
    - [Install dependencies](#install-dependencies)
  - [Run script](#run-script)


## Setup
### Install python
Install python 3.11 from [https://python.org](https://python.org)

If you already have python, check your python version

```cmd
python -V
```

or

```cmd
py -V
```

if you have multiple versions installed, you can test if 3.11 is installed by running this

```cmd
py -3.11 -V
```

When you're running python scripts make sure to run it in python 3.11

```cmd
py -3.11 file.py
```

### Setup venv
I would recommend using a virtual environment (venv) for this, because it does not clutter up you python installation with a bunch of packages.

Enter into the folder you want the venv to be in.

```cmd
cd path/to/folder
```

create venv

```cmd
py -3.11 -m venv .venv
```

Activate the venv

```cmd
.venv/Scripts/activate
```

Now you won't have to use the `-3.11` argument anymore, because `python` and `py` will use python 3.11, or the python version inside the venv.

### Install dependencies
Enter into this directory (the directory with `requirements.txt`).

```cmd
cd scores/data/python
```

install dependencies

```cmd
pip install -r requirements.txt
```

## Run script
Now you can run `main.py` to automatically get the latest scores. This will just check for the scores every 5 minutes (can be changed with the `--interval` option), and if it found new scores, it'll add them to the `scores.json` file, new events will go in `events.json` (well, by default it adds them to `../scores.json`, because the scores are in the parent directory).

```cmd
py main.py
```

You may also be able to just do

```cmd
./main.py
```

**Help text:**
```cmd
Usage:
	main.py [options]

Options:
	--help, -h		Show this help message.
	--scores, -sc	Scores json path: defaults to '../scores.json'
	--events, -ev	Events json path: default to '../events.json'
	--year, -y		Season year. Will automatically find season id if this is specified.
	--season, -s	Season id. If none specified, will use current season
	--interval, -i	Interval in minutes for each check: Defaults to 5
```


[def]: #run-script
[def2]: #run-script