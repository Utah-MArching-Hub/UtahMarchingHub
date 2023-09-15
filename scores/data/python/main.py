import typing

import schedule
from loadScores import *

def main(
    intervalInMinutes = 5,
    season = None,
    year = None,
    scoresFilename = '../scores.json',
    eventsFilename = '../events.json',
    callback : typing.Callable = None
):
    args = {
        'season': season,
        'year': year,
        'scoresFilename': scoresFilename,
        'eventsFilename': eventsFilename,
        'callback': callback
    }

    loadScores(**args)

    try:

        schedule.every(intervalInMinutes).minutes.do(loadScores, **args)

        print('press CTRL + C to stop')

        while True:
            schedule.run_pending()

    except:
        pass

    finally:
        print('stopped')

if __name__ == "__main__":
    import sys
    help = """Usage:
	main.py [options]

Options:
	--help, -h		Show this help message.
	--scores, -sc	Scores json path: defaults to '../scores.json'
	--events, -ev	Events json path: default to '../events.json'
	--year, -y		Season year. Will automatically find season id if this is specified.
	--season, -s	Season id. If none specified, will use current season
	--interval, -i	Interval in minutes for each check: Defaults to 5
"""
    helpargs = ['--help', '-h', '?', '/?', '/h', '/help']

    season = None
    year = None
    scoresFilename = '../scores.json'
    eventsFilename = '../events.json'
    interval = 5

    if len(sys.argv) <= 1 or sys.argv[1] in helpargs:
        print(help)

        if len(sys.argv) <= 1:
            print('running')
        else:
            exit()
    else:
        args = sys.argv[1::]

        if len(args) > 0:
            for a in range(len(args)):
                arg = args[a]
                if not arg.startswith('-'):
                    continue

                if arg in ['--scores', '-sc']:
                    scoresFilename = args[a + 1]
                elif arg in ['--events', '-ev']:
                    eventsFilename = args[a + 1]
                elif arg in ['--year', '-y']:
                    year = args[a + 1]
                elif arg in ['--season', '-s']:
                    season = args[a + 1]
                elif arg in ['--interval', '-i']:
                    interval = float(args[a + 1])

    main(intervalInMinutes = interval, season = season, year = year, scoresFilename = scoresFilename, eventsFilename = eventsFilename)
