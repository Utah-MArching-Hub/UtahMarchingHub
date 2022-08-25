from bs4 import BeautifulSoup
import requests
import json


def getBandScores(eventURL):
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
	scores = {
		
	}
	#BeautifulSoup document setup
	webpage_response = requests.get(eventURL)
	webpage = webpage_response.content
	soup = BeautifulSoup(webpage, 'html.parser')
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
		#adds school name to scores dictionary
		scores.update({school: {}})
		#loops through each score in #
		for num in bandscores:
			#skip the rest of the scores after the 9th item has been found 
			if ii == 9:
				continue
			#gets key numeumber based off of ii, then gets key value and checks it against i. then if it matches it, add to scores dictionary key and the score
			if scoreKeys[list(scoreKeys.keys())[ii]] == i:
				scores[school].update({list(scoreKeys.keys())[ii]:num})
				ii+=1
			i +=1 
	
	return(scores)

scores = getBandScores("https://recaps.competitionsuite.com/08935825-bc85-4535-9cb6-8d69a6aeb5b2.htm")

print(scores)


def scoreToJSON(dict,year,clas,date,event):
	data = []
	for name in dict:
		scores = dict[name]
		up={"year":year,"class":clas,"school":name,"event":event,"date":date}
		score = {}
		for type in scores:
			score.update({f"{type}":float(scores[type])})
		up.update({"score":score})
		data.append(up)
	return data

jsonf = scoreToJSON(scores,2021,"5A","10/5/21","State")

def write_json(new_data, filename='scores.json'):
		with open(filename,'r+') as file:
					# First we load existing data into a dict.
				file_data = json.load(file)
				# Join new_data with file_data inside emp_details
				for data in new_data:
					file_data["Scores"].append(data)
				# Sets file's current position at offset.
				file.seek(0)
				# convert back to json.
				json.dump(file_data, file, indent = 4)

write_json(jsonf)