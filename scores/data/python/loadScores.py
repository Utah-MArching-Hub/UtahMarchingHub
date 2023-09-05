import typing
import json
# import sys

# sys.path.insert(0, 'python/')
import getscorelist as scorelist
import old_getscores
# this is to load the modules in a different directory. Ignore what vscode says, they do load.

scoresObj = scorelist.getComps(url='https://www-umea-us.filesusr.com/html/4a996b_94944928dddae9e892d2136a828f4bc9.html')
# print(scoresObj)

def loadScores(
    season = None,
    year = None,
    scoresFilename = '../scores.json',
    eventsFilename = '../events.json',
    existCallback : typing.Callable[[list[dict]], typing.Any] = None,
    noBackup = False,
):
    if season == None and year != None:
        print(f'year: {year}')
        seasons = scoresObj.getSeasons(fullData = False)
        
        for s in seasons:
            if year in s['name']:
                season = s['seasonGuid']
                print(f'season: {season}')
                break
    
    events = scoresObj.loadSeason(season)
    try:
        with open('last-scores.json', 'r', encoding='utf-8') as file:
            lastScores = json.load(file)
    except:
        lastScores = None

    print(lastScores == events)
    if not noBackup and lastScores == events:
        print('already on current scores')
    else:
        with open('last-scores.json', 'w', encoding='utf-8') as file:
            json.dump(events, file)

        events.reverse()

        for event in range(len(events)):
            for clas in range(len(events[event]['performances']['classes'])):
                data = events[event]['performances']['classes'][clas]
                scores, eventjson = old_getscores.getBandScores(data['fullRecapUrl'], data['class'], name=events[event]['name'])
                
                newScores = old_getscores.getNewScoresData(scores, filename=scoresFilename)
                
                if len(newScores) == 0:
                    print('scores already exist')
                    # If there are no new scores
                    # Otherwise all the new scores are in the newScores list (does not include already existing scores)
                    continue

                print(events[event]['name'], '\n')
                print(newScores)
                print("---")
                print(eventjson)
                
                if callable(existCallback):
                    existCallback(newScores)
                
                # You can either put the discord bot code here,
                # or pass the function into the `existCallback` parameter (check `main.py`)

                old_getscores.write_json(newScores, filename=scoresFilename)
                old_getscores.addEvent(eventjson, filename=eventsFilename)

        print(events)

if __name__ == "__main__":
    import win32api
    from flask import Flask, render_template
    
    app = Flask(__name__)
    
    
    #Using the below, the popup message appears on the page load of index.html
    #0x00001000 - This makes the popup appear over the browser window
    @app.route('/')
    def index():
        win32api.MessageBox(0, 'You have just run a python script on the page load!', 'Running a Python Script via Javascript', 0x00001000)
        return render_template('index.html')
    
    #Using the below, the popup message appears when the button is clicked on the webpage.
    #0x00001000 - This makes the popup appear over the browser window
    @app.route('/test')
    def test():
        win32api.MessageBox(0, 'You have just run a python script on the button press!', 'Running a Python Script via Javascript', 0x00001000)
        return render_template('index.html')
    
    if __name__ == "__main__":
        app.run(debug=True)


    # current year
    loadScores()
    # 2021
    # loadScores(season='871de29c-53ea-4b45-b69a-cbb245861811')
