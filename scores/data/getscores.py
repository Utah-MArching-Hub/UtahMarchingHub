from bs4 import BeautifulSoup
import requests
import json
from datetime import datetime

def clasName(clas):
	classes = {
		'5ao': '5A Open',
		'5as': '5A Scholastic',
		'6ao': '6A Open',
		'6as': '6A Scholastic'
	}

	try:
		classes[clas]
		if classes[clas]:
			return classes[clas]
	except:
		return clas.upper()

def getBandScores(eventURL,clas, id=None, name=None):
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
			[clas, clasName(clas)]
		]
	}

	
	#----------
	yy=0
	#Parser, finds table
	for bandRaw in list(soup.find("table", style="background-color: #FFFFFF;")):
		#skips non-needed rows (rows without scores)
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
	with open(filename,'+r') as file:
		# First we load existing data into a dict.
		file_data = json.load(file)
		# Join new_data with file_data inside emp_details
		for data in new_data:
			dupe = False
			print(data)
			for old in file_data["Scores"]:
				if old["year"] == data["year"] and old["event"] == data["event"] and old["school"] == data["school"] :
					# print("!!!!!!!!!!DUPLICATE!!!!!!!!!!")
					# print(f"old:{old['year']},{old['event']},{old['school']}.NEW:{data['year']},{data['event']},{data['school']}.")
					dupe = True
			if not dupe:
				file_data["Scores"].append(data)
				
		# Sets file's current position at offset.
		file.seek(0)
		# convert back to json.
		json.dump(file_data, file, indent = 4)

def addEvent(event, filename='events.json', classes=None, replaceall=False):
	def findindex(list: list, condition):
		for x in range(len(list)):
			if condition(list[x]):
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
		events = json.load(file)
		id = None
		for e in range(len(events)):
			if events[e]['id'] == event['id'] and events[e]['year'] == event['year']:
				id = e
				break
		print(id)

		if id:
			if events[id]['classes'][0] == 'all':
				print('all')
				if replaceall:
					events[id]['classes'] = classes
			elif classes[0] == 'all':
				print('event all')
				events[id]['classes'] = ['all']
			else:
				for cl in classes:
					val = findindex(events[id]['classes'], lambda c: c[0] == cl[0])
					print(val)
					if not val == None:
						events[id]['classes'][val][1] = cl[1]
					else:
						events[id]['classes'].append(cl)
			print(events[id]['classes'])

		else:
			event['classes'] = classes
			events.append(event)

	with open(filename, mode='w') as file:
		json.dump(events, file, indent=4)

with open('scores.json', mode='r') as file:
	contents = file.read()

with open('scores.json.bak', mode='w+') as file:
	file.write(contents)

link = "http://recaps.competitionsuite.com/dab9fff2-113b-4be9-9218-4901b49d1938.htm"
scores = getBandScores(link,"5ao")
print(scores)
print("---")
def write_json(new_data, filename='/data/scores.json'):
		with open(filename,'+r') as file:
			# First we load existing data into a dict.
			file_data = json.load(file)
			# Join new_data with file_data inside emp_details
			for data in new_data:
				dupe = False
				for old in file_data["Scores"]:
					if old["year"] == data["year"] and old["event"] == data["event"] and old["school"] == data["school"] :
						print("!!!!!!!!!!DUPLICATE!!!!!!!!!!")
						print(f"old:{old['year']},{old['event']},{old['school']}.NEW:{data['year']},{data['event']},{data['school']}.")
						dupe = True
				if dupe == False: 
					file_data["Scores"].append(data)
					
			# Sets file's current position at offset.
			file.seek(0)
			# convert back to json.
			json.dump(file_data, file, indent = 4)
write_json(scores)
