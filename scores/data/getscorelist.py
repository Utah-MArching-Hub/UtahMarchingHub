from datetime import datetime
from bs4 import BeautifulSoup
import requests

import js2py as js
# I use this because it's the easiest way to get the data.
# Run 
#
#   `pip install js2py`
# or 
#   `pip3 install js2py`
# or 
#   `py -m pip install js2py`
#
# to use it

import json

import pprint

pp = pprint.PrettyPrinter(indent=2)

# decided to use a class because it was getting messy in a function

class getComps():
    def __init__(self, url='https://www-umea-us.filesusr.com/html/4a996b_94944928dddae9e892d2136a828f4bc9.html') -> None:
        self.page = url

        self.domain = "https://bridge.competitionsuite.com/"
        self.version = "1.1.5"

        self.cdn = "https://cdn.competitionsuite.io/bridge/" + self.version

        self.currentOrgGuid = None
        self.currentSeasonGuid = None
        self.currentOrgInitials = None

        self.settingMax = 0
        self.settingTest = False
        self.settingLoad = None
        self.settingFullRecap = True
        self.settingCategoryRecap = True

        # print('\n\n')
        # pp.pprint(result)
        # with open('seasons.json', 'w+', encoding='utf-8') as file:
        #     json.dump(result, file, indent=2)
        # self.getSeasons()

        self.loadData()



    def getSeasons(self):
        url = f'{self.domain}api/orgscores/GetSeasons/jsonp?organization={self.currentOrgGuid}&version={self.version}&callback=result='
        # print(url)
        result = js.eval_js( requests.get(url).text )
        # print(result)
        seasons = self.getSeasonList(result)

        return seasons
        
    def getSeasonList(self, data):
        self.currentOrgInitials = data['organizationInitials']

        seasons = []

        if not data or len(data) < 0:
            pass

        else:
            for i in range(len(data)):
                item = data[i]

                seasons.append({'name': item['name'], 'seasonGuid': item['seasonGuid'], 'events': self.loadSeason(item['seasonGuid'])})

            self.currentSeasonGuid = None
        
        # print(seasons)

        return seasons

    def loadSeason(self, season):
        self.currentSeasonGuid = season
        print('getting season: ' + season)
        return self.getEvents()



    def getEvents(self, season=None):
        if self.currentSeasonGuid:
            # print(f'{self.currentSeasonGuid = }')
            url = self.domain + "api/orgscores/GetCompetitionsBySeason/jsonp?season=" + self.currentSeasonGuid + "&showTrainingEvents=" + str(self.settingTest) + "&version=" + self.version + "&callback=result="
            result = js.eval_js( requests.get(url).text )
            # print(result)
            complist = self.getCompetitionList(result)
            # print(complist)
            return complist

        else:
            url = self.domain + "api/orgscores/GetCompetitionsByOrganization/jsonp?organization=" + self.currentOrgGuid + "&showTrainingEvents=" + str(self.settingTest) + "&version=" + self.version + "&callback=result="
            result = js.eval_js( requests.get(url).text )
            # print(result)
            complist = self.getCompetitionList(result)
            return complist
            

    def getCompetitionList(self, data):
        self.currentOrgInitials = data['organizationInitials']

        # print(data)

        comps = []

        if (not data or len(data['competitions']) < 1):
            pass
        else:
            for i in range(len(data['competitions'])):
                item = data['competitions'][i]

                # print('getting competition: ' + item['name'])

                comps.append({'Organization': self.currentOrgInitials, 'name': item['name'], 'competitionGuid': item['competitionGuid'], 'location': item['location'], 'performances': self.getPerformances(item['competitionGuid'])})

        # print(comps)
        return comps
        
    def getPerformances(self, competition=None):
        if competition:
            url = self.domain + "api/orgscores/GetCompetition/jsonp?competition=" + competition + "&version=" + self.version + "&callback=result="
            result = js.eval_js( requests.get(url).text )
            # print(result)
            performances = self.getPerformanceList(result)
            return performances

        else:
            url = self.domain + "api/orgscores/GetLatestCompetition/jsonp?competition=" + self.currentOrgGuid + "&version=" + self.version + "&callback=result="
            result = js.eval_js( requests.get(url).text )
            # print(result)
            events = self.getEvents()
            return events

    def getPerformanceList(self, data):
        comp = {}

        if not data or len(data['rounds']) < 1:
            pass
        else:
            comp = {'name': data['name'], 'date': data['competitionDate'], 'location': data['location']}
            comp['classes'] = []
            date = datetime.strptime(data['competitionDate'], '%Y-%m-%dT%H:%M:%S')

            print('getting competition: ' + data['name'] + ' ' + str(date.year))

            # print(f"\n{data['rounds'][0] = }")
            for i in range(len(data['rounds'])):
                # print(print(f"\n{data['rounds'][i] = }"))
                roundData = data['rounds'][i]
                round = {'class': roundData['name']}

                try:
                    if self.settingFullRecap:
                        round['fullRecapUrl'] = roundData['fullRecapUrl']
                except:
                    pass

                try:
                    if self.settingCategoryRecap:
                        round['categoryRecapUrl'] = roundData['categoryRecapUrl']
                except:
                    pass

                round['performances'] = []

                for p in range(len(roundData['performances'])):
                    perf = roundData['performances'][p]

                    round['performances'].append({'rank': perf['rank'], 'name': perf['name'], 'score': perf['score']})

                comp['classes'].append(round)

        # print(comp)
        return(comp)
                
                

    def loadData(self):

        # webpage = requests.get('https://bridge.competitionsuite.com/orgscores/orgscores.js').text
        webpage = requests.get(self.page).text
        soup = BeautifulSoup(webpage, 'html.parser')

        # print(soup)
        
        element = soup.select('[data-compsuite-org]')[0]
        # print(element)
        # exit()
        self.currentOrgGuid = element['data-compsuite-org']
        # print(f'{self.currentOrgGuid=}')

        try:
            self.Max = element['data-compsuite-max']
        except:
            pass

        try:
            self.Test = element['data-compsuite-test'] = True
        except:
            pass

        try:
            attrRecap = element['data-compsuite-recap']

            if attrRecap and attrRecap.lower() == 'false':
                attrRecap = False
        except:
            try:
                attrCategoryRecap = element['data-compsuite-recap-category']
                if attrCategoryRecap and attrCategoryRecap.lower() == 'false':
                    self.settingCategoryRecap = False
            except:
                pass

        

        try:
            attrLoad = element['data-compsuite-load']
        except:
            attrLoad = None

        # print(f'{attrLoad = }')

if __name__ == '__manin__':
    compData = getComps()
