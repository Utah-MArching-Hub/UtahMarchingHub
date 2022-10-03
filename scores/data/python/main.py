import json
# import sys

# sys.path.insert(0, 'python/')
import getscorelist as scorelist
import getscores
import time
# this is to load the modules in a different directory. Ignore what vscode says, they do load.

scoresObj = scorelist.getComps(url='https://www-umea-us.filesusr.com/html/4a996b_94944928dddae9e892d2136a828f4bc9.html')
# print(scoresObj)

def loadScores(season=None):
    events = scoresObj.loadSeason(season)
    try:
        with open('last-scores.json', 'r', encoding='utf-8') as file:
            lastScores = json.load(file)
    except:
        lastScores = None

    print(lastScores == events)
    if lastScores == events:
        print('already on current scores')
    else:
        with open('last-scores.json', 'w', encoding='utf-8') as file:
            json.dump(events, file)

        events.reverse()

        for event in range(len(events)):
            for clas in range(len(events[event]['performances']['classes'])):
                data = events[event]['performances']['classes'][clas]
                scores, eventjson = getscores.getBandScores(data['fullRecapUrl'], data['class'], name=events[event]['name'])

                # put discord bot code here
                
                print(events[event]['name'], '\n')
                print(scores)
                print("---")
                print(eventjson)

                getscores.write_json(scores, filename='../scores.json')
                getscores.addEvent(eventjson, filename='../events.json')

        print(events[0]['performances']['classes'][0]['fullRecapUrl'])

loadScores()
