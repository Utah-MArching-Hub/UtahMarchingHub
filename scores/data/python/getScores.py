import typing
from typing import Literal

from competitionSuite import CompetitionSuite
import json
import os
import pathlib
import re

class Scores():
    def __init__(self, output : str = 'scores.json', org_guid = None, year = None, org_url = 'https://www-umea-us.filesusr.com/html/4a996b_94944928dddae9e892d2136a828f4bc9.html') -> None:
        self.version = 2
        
        self.year = year
        
        self.org_guid = org_guid
        self.org_url = org_url
        
        self.cs = CompetitionSuite(org_guid = self.org_guid, org_url = self.org_url)
        
        self.org_guid = self.cs.org_guid
        
        self.filename = output
        self.scores : dict[Literal[
                'version',
                'org',
                'org_guid',
                'seasons',
                ], int | str | dict[str, dict[Literal[
                    "season",
                    "year",
                    "season_guid",
                    "competitions",
                    ], str | int | dict[str, dict[Literal[
                        "name",
                        "date",
                        "location",
                        "recap_url",
                        "competition_guid",
                        "performances",
                        ], str | int | dict[str, dict[Literal[
                            "division_name",
                            "division_initials",
                            "round",
                            "round_name",
                            "school",
                            "total_score",
                            "rank",
                            "subtotal_score",
                            "subtotal_rank",
                            "categories",
                            ], str | int | float | dict[str, dict[Literal[
                                "name",
                                "score",
                                "rank",
                                "captions",
                                ], str | int | float | dict[str, dict[Literal[
                                    "judge_first_name",
                                    "judge_last_name",
                                    "judge",
                                    "name",
                                    "initials",
                                    "score",
                                    "rank",
                                    "subcaptions",
                                    ], str | int | float | dict[str, dict[Literal[
                                        "name",
                                        "initials",
                                        "score",
                                        "rank",
                                        ], str | float | int
                                    ]]
                                ]]
                            ]]
                        ]]
                    ]]
                ]]
            ] = {
            "version": self.version,
            "org": 'UMEA',
            "org_guid": self.org_guid,
            "seasons": {}
        }
        
        self.load_scores()
            
    
    def load_scores(self):
        if os.path.exists(self.filename):
            with open(self.filename, 'r') as file:
                self.scores = json.load(file)
        
        else:
            with open(self.filename, 'w') as file:
                json.dump(self.scores, file)
    
    def save_scores(self):
        with open(self.filename, 'w') as file:
            json.dump(self.scores, file, indent = 2)
        
    def get_scores(self, year = None):
        if year == None:
            year = self.year
            
        season_data = self.cs.get_season(year = year)
        
        try:
            new_year = re.search(r'(\d+)', season_data['name']).group()
        except:
            new_year = year
        
        self.scores['org'] = season_data['organizationInitials']
        
        season : dict[Literal[
            "season",
            "year",
            "season_guid",
            "competitions",
        ], str | int | list] = {
            "season": season_data['name'],
            "year": year or new_year,
            "season_guid": season_data['seasonGuid'],
            "competitions": {},
        }
        
        for comp in season_data['competitions']:            
            competition_data = {
                "name": comp['name'],
                "date": comp['competitionDate'],
                "location": comp['location'],
                "recap_url": comp['recapUrl'],
                "competition_guid": comp['competitionGuid'],
                "classes": {},
            }
            
            classes = self.get_performances(competition_data['competition_guid'])
            
            competition_data['classes'] = classes
            
            # for performance in performances:
                
            #     if performance['division_name'] in competition_data['classes']:
            #         class_ = competition_data['classes'][performance['division_name']]
            #     else:
            #         class_ = {
            #             'division_guid': class_data['divisionGuid'] if class_data != None else '',
            #             'name': class_data['name'] if class_data != None else performance['division_name'],
            #             'recap_url': class_data['fullRecapUrl'] if class_data != None else '',
            #             'performances': {}
            #         }
                    
            #         competition_data['classes'][class_['name']] = class_
                
            #     performance_info = find_performance(performance['school'], class_data)
                
            #     performance['performance_guid'] = performance_info['performanceGuid']
                
            #     class_['performances'][performance['performance_guid']] = performance

            season['competitions'][competition_data['competition_guid']] = competition_data
        
        
        self.scores["seasons"][season['season_guid']] = season
        
        return season
            
    def get_performances(self, competition_guid : str):
        def find_class(class_, competition_info):
            for round in competition_info['rounds']:
                if round['name'] == class_:
                    return round
            return None
        
        def find_performance(performance_name, class_info):
            for performance in class_info['performances']:
                if performance['name'] == performance_name:
                    return performance
            return None
        
        competition_info = self.cs.get_competition_info(competition_guid)
        
        if competition_guid == None:
            competition_guid = competition_info['competitionGuid']
            competition_info = self.cs.get_competition_info(competition_guid)
            
        classes = {}
        
        performances_data = self.cs.get_performances(competition_guid = competition_guid)
        
        for performance in performances_data:
            performance_data = {
                "performance_guid": '',
                "division_name": performance['DivisionName'],
                "division_initials": performance['DivisionInitials'],
                "round": performance['Round'],
                "round_name": performance['RoundName'],
                "school": performance['GroupName'],
                "total_score": performance['TotalScore'],
                "rank": performance['Rank'],
                "subtotal_score": performance['SubtotalScore'],
                "subtotal_rank": performance['SubtotalRank'],
                "categories": {},
            }
            
            class_data = find_class(performance_data['division_name'], competition_info = competition_info)
            if performance_data['division_name'] in classes:
                class_ = classes[performance_data['division_name']]
            else:
                class_ = {
                    'division_guid': class_data['divisionGuid'] if class_data != None else '',
                    'name': class_data['name'] if class_data != None else performance_data['division_name'],
                    'recap_url': class_data['fullRecapUrl'] if class_data != None else '',
                    'performances': {}
                }
                
                classes[class_['name']] = class_
            
            
            performance_info = find_performance(performance_data['school'], class_data)
            performance_data['performance_guid'] = performance_info['performanceGuid']
            class_['performances'][performance_data['performance_guid']] = performance_data
            
            print(f'getting: {performance_info["name"]}: {class_["name"]}')
            
            for category in performance['Categories']:
                category_data = {
                    "name": category['Name'],
                    "score": category['Score'],
                    "rank": category['Rank'],
                    "captions": {},
                }
                
                for caption in category['Captions']:
                    caption_data = {
                        "judge_first_name": caption['JudgeFirstName'],
                        "judge_last_name": caption['JudgeLastName'],
                        "judge": caption['Judge'],
                        "name": caption['Name'],
                        "initials": caption['Initials'],
                        "score": caption['Score'],
                        "rank": caption['Rank'],
                        "subcaptions": {},
                    }
                    
                    for subcaption in caption['Subcaptions']:
                        subcaption_data = {
                            "name": subcaption['Name'],
                            "initials": subcaption['Initials'],
                            "score": subcaption['Score'],
                            "rank": subcaption['Rank'],
                        }
                        
                        caption_data['subcaptions'][subcaption_data['initials']] = subcaption_data
                    
                    category_data['captions'][caption_data['initials']] = caption_data
                
                performance_data['categories'][category_data['name']] = category_data
            
            # classes[performance_data['division_name']] = performance_data
        
        return classes
