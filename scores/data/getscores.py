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


links = [
	'http://recaps.competitionsuite.com/fb7c1bb3-640b-4044-a309-6b64fc65da26.htm',
	'http://recaps.competitionsuite.com/cb722abf-5e9a-4d81-bb87-ca61481715a1.htm',
	'http://recaps.competitionsuite.com/0f523a88-9a42-4449-be1e-a3a65f5a42d2.htm',
	'http://recaps.competitionsuite.com/9edcaece-21be-40e8-bb7d-03c4b0aa8d6a.htm',
	'http://recaps.competitionsuite.com/21cd94e1-edc0-4f19-a148-9ebe12c070f1.htm',
	'http://recaps.competitionsuite.com/f928384e-71c2-4f28-b181-7a7cd14d22f8.htm',
	'http://recaps.competitionsuite.com/9cea6f47-f920-4eb6-8b95-c038da495985.htm',
	'http://recaps.competitionsuite.com/632d6f48-7bde-46b5-89d2-47e19bdb2fcb.htm',
	'http://recaps.competitionsuite.com/29912600-e061-4c40-a988-d073421f7612.htm',
	'http://recaps.competitionsuite.com/3df24150-61cb-44ef-a917-c64809a881a3.htm',
	'http://recaps.competitionsuite.com/6521ff7c-12ed-47d1-8b05-d21e8346992f.htm',
	'http://recaps.competitionsuite.com/d552c5e9-23ff-46a9-b01d-f4919ac0ab20.htm',
	'http://recaps.competitionsuite.com/1147aa9a-4087-4890-986e-88be699ba30e.htm',
	'http://recaps.competitionsuite.com/6bd2e0b3-40b6-41db-b199-01fcb3211919.htm',
	'http://recaps.competitionsuite.com/709ae2c2-18ff-4700-b70b-6c91cbe8caaf.htm',
	'http://recaps.competitionsuite.com/fb2f5ca1-1c8d-4352-bbc8-9f50aa6ce1e1.htm',
	'http://recaps.competitionsuite.com/2bad6e25-0851-41a1-87f0-f9dca85b3cec.htm',
	'http://recaps.competitionsuite.com/719a32c3-517f-464a-b50e-06a732c6398e.htm',
	'http://recaps.competitionsuite.com/b0c1dade-dd85-4fbb-a600-afa2fccb8730.htm',
	'http://recaps.competitionsuite.com/de998924-25fd-4766-a0c9-10de9b092865.htm',
	'http://recaps.competitionsuite.com/d6d22366-3afa-44bf-9790-dd2621454c50.htm',
	'http://recaps.competitionsuite.com/595dd5cf-a61d-404d-b9fa-103f567b45a8.htm',
	'http://recaps.competitionsuite.com/28f35e54-a710-46de-8349-c09b92a8c584.htm',
	'http://recaps.competitionsuite.com/a3181b38-78f2-4d08-8f02-eb28ba8a40ed.htm',
	'http://recaps.competitionsuite.com/e00c7273-9da3-4547-99b2-9681f87bf248.htm',
	'http://recaps.competitionsuite.com/b5fc2448-cb45-4e34-8890-d15e968409c8.htm',
	'http://recaps.competitionsuite.com/08935825-bc85-4535-9cb6-8d69a6aeb5b2.htm',
	'http://recaps.competitionsuite.com/d6d22366-3afa-44bf-9790-dd2621454c50.htm',
	'http://recaps.competitionsuite.com/26f20362-74ef-49b4-905d-4193313c73d4.htm',
	'http://recaps.competitionsuite.com/48bca846-be47-4b66-8718-3117c3fe5b3a.htm',
	'http://recaps.competitionsuite.com/5f9e42ff-c471-439f-99db-669a3bd10fcc.htm',
	'http://recaps.competitionsuite.com/1d2a4201-27be-4bf1-8180-92f23bffc204.htm',
	'http://recaps.competitionsuite.com/fd97ce51-705f-4cc7-81d5-4205fb1022a1.htm',
	'http://recaps.competitionsuite.com/d9e24c6f-8e47-46fd-b9d1-fa5c443d22de.htm',
	'http://recaps.competitionsuite.com/5865219c-3c79-4d31-ac84-d66f10140f49.htm',
	'http://recaps.competitionsuite.com/5e57482a-8c8b-45eb-bfbe-d4af1964d948.htm',
	'http://recaps.competitionsuite.com/cc8d2d3b-8fb9-4578-ab85-dc08cb3d55c7.htm',
	'http://recaps.competitionsuite.com/7efafb47-87b1-451b-91c6-e0423657895a.htm',
	'http://recaps.competitionsuite.com/2802ace4-634e-4969-b0a8-ae86b6659c11.htm',
	'http://recaps.competitionsuite.com/5a7094e2-9600-4607-95f3-3965f221b92d.htm',
	'http://recaps.competitionsuite.com/87ca61c4-7dbb-48b6-969f-05ba9bc875b4.htm',
	'http://recaps.competitionsuite.com/5865219c-3c79-4d31-ac84-d66f10140f49.htm'
]
i = 0
classs = [
	"3a",
	"4a",
	"5as",
	"5ao",
	"6as",
	"6ao"
]
ii = 0
for link in links :
	if i == 6:
		i == 0
		ii += 1
	else:
		i += 1
	scores = getBandScores(link,classs[ii])
	print(scores)
	print("---")
	def write_json(new_data, filename='data/scores.json'):
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