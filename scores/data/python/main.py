import schedule
from loadScores import *

loadScores()

try:

    schedule.every(5).minutes.do(loadScores)

    print('press CTRL + C to stop')

    while True:
        schedule.run_pending()

except:
    pass

finally:
    print('stopped')
