from bs4 import BeautifulSoup
import requests
import json
from datetime import datetime


def getBandScores(eventURL,clas):
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
			
	eventfull = soup.find("div", style="text-align: center; font-weight: bold; font-size: 18px; max-width: 750px; white-space: normal").text.lower()
	for ev in events:
		if eventfull.find(ev) != -1:
			event = ev
	#finding date and year
	datefull = soup.find_all("div", style="text-align: center; font-style: italic; font-size: 12px; margin-top: 5px;")[1].text
	dateT = datetime.strptime(datefull, '%A, %B %d, %Y')
	date = dateT.strftime("%m/%d/%Y")
	year = dateT.strftime("%Y")

	
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
	return(scores)


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