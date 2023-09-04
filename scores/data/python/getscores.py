import os
import bs4
from bs4 import BeautifulSoup
import requests
import json
from datetime import datetime

def backup(path):
    filename = os.path.basename(path)
    with open(path, mode='r') as file:
        contents = file.read()

    try:
        os.mkdir('backup')
    except:
        pass

    with open('backup/' + filename + '.bak', mode='w') as file:
        file.write(contents)

def clasName(clas):
    classes = {
        '5ao': '5A Open',
        '5as': '5A Scholastic',
        '6ao': '6A Open',
        '6as': '6A Scholastic',
        
        '5a open': '5A Open',
        '5a scholastic': '5A Scholastic',
        '6a open': '6A Open',
        '6a scholastic': '6A Scholastic',
    }

    try:
        return classes[clas.lower()]
    except:
        return clas.upper()

def clasId(clas):
    classes = {
        '5a open': '5ao',
        '5ao': '5ao',
        '5a': '5ao',
        '5a scholastic': '5as',
        '5as': '5as',

        '6a open': '6ao',
        '6ao': '6ao',
        '6a': '6ao',
        '6a scholastic': '6as',
        '6as': '6as',
    }

    try:
        return classes[clas.lower()]
    except:
        return clas.lower()

def getBandScores(eventURL, clas, id=None, name=None):
    #keys for finding scores
    scoreKeys = {
            "MEnsemble": 2,
            "MEffect": 5,
            "MScore": 6,
            "VEnsemble": 9,
            "VEffect": 12,
            "VScore": 13,
            "Percussion": 17,
            "Guard": 21,
            "score": 22
    }
    #empty output dictionary
    scores = []
    #BeautifulSoup document setup
    webpage_response = requests.get(eventURL)
    webpage = webpage_response.content
    soup = BeautifulSoup(webpage, 'html.parser')

    #finding event, date, year,
    #defining events
    events =["nebo","oquirrh","bridgerland","wasatch","davis","timp","state"]
            
    if id:
        event = id
    else:
        eventfull = soup.find("div", style="text-align: center; font-weight: bold; font-size: 18px; max-width: 750px; white-space: normal").text
        print(eventfull)
        # time.sleep(2)
        for ev in events:
            if eventfull.lower().find(ev) != -1:
                event = ev

    if not name:
        name = eventfull

    #finding date and year
    datefull = soup.find_all("div", style="text-align: center; font-style: italic; font-size: 12px; margin-top: 5px;")[1].text
    dateT = datetime.strptime(datefull, '%A, %B %d, %Y')
    date = dateT.strftime("%m/%d/%Y")
    year = dateT.strftime("%Y")


    eventjson = {
        'id': event,
        'name': name,
        'year': str(year),
        'classes': [
            {
                'id': clasId(clas),
                'name': clasName(clas),
                'url': eventURL,
            }
        ]
    }
    clas = clasId(clas)
    
    #----------
    yy=0
    #Parser, finds table
    for bandRaw in list(soup.find("table", style="background-color: #FFFFFF;")):
        #skips non-needed rows (rows without scores)
        if (isinstance(bandRaw, bs4.element.Comment)):
            continue
        if len(bandRaw) == 1:
            continue
        if yy < 4:
            yy += 1
            continue
        yy += 1
        #once score row is found create blank score list
        bandscores = []
        i=1
        ii = 1
        #loop through every colum in the row
        for td in bandRaw.find_all("td"):
            #1st row has school name, set to shcool variable
            if i == 1:
                school = td.text
            if i > 2:
                #get every score number (loops through the 3 numpers in the <td>, "score+rank", "score", "rank", grabs only the score)
                if ii % 3 == 2:
                    bandscores.append(td.text)
                ii+=1
            i+=1
        i=0
        ii=0
        #creates scores dictionary for storage
        scoreT = {"year":year,"class":clas,"school":school,"event":event,"date":date,"scores": {}}
        #loops through each score in #
        for num in bandscores:
            #skip the rest of the scores after the 9th item has been found 
            if ii == 9:
                continue
            #gets key numeumber based off of ii, then gets key value and checks it against i. then if it matches it, add to scores dictionary key and the score
            if scoreKeys[list(scoreKeys.keys())[ii]] == i:
                scoreT["scores"].update({list(scoreKeys.keys())[ii]:float(num)})
                ii+=1
            i +=1 
        scores.append(scoreT)
    return([scores, eventjson])

def write_json(new_data, filename='scores.json'):
    backup(filename)
    

    with open(filename,'r') as file:
        contents = file.read()
        
        try:
            # First we load existing data into a dict.
            file_data = json.loads(contents)
            # Join new_data with file_data inside emp_details
            for data in new_data:
                dupe = False
                # print(data)
                for old in file_data["Scores"]:
                    if old["year"] == data["year"] and old["event"] == data["event"] and old["school"] == data["school"] :
                        # print("!!!!!!!!!!DUPLICATE!!!!!!!!!!")
                        # print(f"old:{old['year']},{old['event']},{old['school']}.NEW:{data['year']},{data['event']},{data['school']}.")
                        dupe = True
                if not dupe:
                    file_data["Scores"].append(data)
        except:
            file_data = {'Scores': new_data}
                
        # Sets file's current position at offset.
    
    with open(filename, 'w') as file:
        # convert back to json.
        json.dump(file_data, file, indent = 4)

def getNewScoresData(new_data, filename='scores.json'):
    not_dup = []
    
    with open(filename, 'r') as file:
        file_data = json.load(file)
        
        try:
            # Join new_data with file_data inside emp_details
            for data in new_data:
                dupe = False
                # print(data)
                for old in file_data["Scores"]:
                    if old["year"] == data["year"] and old["event"] == data["event"] and old["school"] == data["school"] :
                        # print("!!!!!!!!!!DUPLICATE!!!!!!!!!!")
                        # print(f"old:{old['year']},{old['event']},{old['school']}.NEW:{data['year']},{data['event']},{data['school']}.")
                        dupe = True
                if not dupe:
                    print('not dupclicate')
                    not_dup.append(data)
        except:
            file_data = {'Scores': new_data}
    
    return not_dup
        

def addEvent(event, filename='events.json', classes=None, replaceall=False):
    backup(filename)
    def findindex(array: list, condition):
        for x in range(len(array)):
            if condition(array[x]):
                return x
        return None

    if not classes:
        classes = event['classes']

    elif type(classes) == list:
        if type(classes[0]) == str:
            for c in range(len(classes)):
                classes[c] = [classes[c], clasName(classes[c])]
                
    elif classes.lower() == 'all':
        classes = [classes.lower()]

    print('adding event')

    with open(filename, 'r+') as file:
        contents = file.read()

        id = -1
        # print(event)
        try:
            events = json.loads(contents)
            for e in range(len(events)):
                print(events[e])
                print(f"{events[e]['id'] = }\n{event['id'] = }\n{events[e]['year'] = }\n{event['year'] = }")
                # input('')
                if events[e]['id'] == event['id'] and events[e]['year'] == event['year']:
                    id = e
                    break
        except:
            events = []
        
        print(id)

        if id >= 0:
            if events[id]['classes'][0] == 'all':
                print('all')
                if replaceall:
                    events[id]['classes'] = classes
            elif classes[0] == 'all':
                print('event all')
                events[id]['classes'] = ['all']
            else:
                for cl in classes:
                    val = findindex(events[id]['classes'], lambda c: c['id'] == cl['id'])
                    # print(f'{val = }')
                    if not val == None:
                        events[id]['classes'][val]['name'] = cl['name']
                    else:
                        events[id]['classes'].append(cl)
            events[id]['classes'] = sorted(events[id]['classes'], key=lambda d: d['id'])
            print(events[id]['classes'])

        else:
            event['classes'] = classes
            event['classes'] = sorted(event['classes'], key=lambda d: d['id'])
            events.append(event)

    with open(filename, mode='w') as file:
        json.dump(events, file, indent=4)

if __name__ == '__main__':
    with open(os.path.abspath('../scores.json'), mode='r') as file:
        contents = file.read()

    try:
        os.mkdir('backup')
    except:
        pass

    with open('backup/scores.bak.json', mode='w') as file:
        file.write(contents)

    link = "https://recaps.competitionsuite.com/f13ca6c1-5873-4b6c-823f-83c3087a9a07.htm"
    scores, eventjson = getBandScores(link,"5ao", name='Nebo Invitational')
    print(scores)
    print("---")
    print(eventjson)

    write_json(scores, filename=os.path.abspath('../scores.json'))

    addEvent(eventjson, classes=['3a','5ao','5as','6ao','6as'], filename=os.path.abspath('../events.json'))
