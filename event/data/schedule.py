from bs4 import BeautifulSoup
import requests

link = "https://schedules.competitionsuite.com/3b149010-9c3e-4ec0-b31b-6a12ac51a839_standard.htm"

webpage_response = requests.get(link)
webpage = webpage_response.content
soup = BeautifulSoup(webpage, 'html.parser')

list = soup.find('div', {"class": "schedule-area"})

dict = {}

keys = ["name", "location", "class", "time"]

print(list)
custom = 1
for item in list:
		# print(item)
		# print(item.text)
		itemT = item.text
		sub = itemT.split('\n')
		i = 1
		print(itemT)
		print(sub)
		if len(sub) == 4:
				dictA = {
						"location": sub[1],
						"class": sub[2],
						"time": sub[3],
				}
				dict[sub[0]] = dictA
		if len(sub) == 1:
				dictA = {
					"txt":item.find_all('div')[0].text,
					"2time":item.find_all('div')[1].text
				}
				dict[f"custom{custom}"] = dictA
				custom+=1
		print(dictA)
		print("-")
		print(dict)
		print("---")
