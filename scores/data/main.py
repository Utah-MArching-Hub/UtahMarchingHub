import sys

sys.path.insert(0, 'python/')
import getscorelist as scorelist
import getscores
# this is to load the modules in a different directory. Ignore what vscode says, they do load.

scoresObj = scorelist.getComps(url='https://www-umea-us.filesusr.com/html/4a996b_94944928dddae9e892d2136a828f4bc9.html')
print(scoresObj)

events = scoresObj.loadSeason()
events.reverse()

for event in range(len(events)):
    for clas in range(len(events[event]['performances']['classes'])):
        data = events[event]['performances']['classes'][clas]
        scores, eventjson = getscores.getBandScores(data['fullRecapUrl'], data['class'], name=events[event]['name'])
        
        print(events[event]['name'], '\n')
        print(scores)
        print("---")
        print(eventjson)

        getscores.write_json(scores, filename='scores.json')
        getscores.addEvent(eventjson, filename='events.json')




print(events[0]['performances']['classes'][0]['fullRecapUrl'])
