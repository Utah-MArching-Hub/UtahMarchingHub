import typing
from typing import Literal

from competitionSuite import CompetitionSuite
import json
import os
import pathlib
import re
from copy import copy, deepcopy

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
                json.dump(self.scores, file, indent = 2)

    def save_scores(self):
        with open(self.filename, 'w') as file:
            json.dump(self.scores, file, indent = 2)

    def get_season_data(
        self,
        season_guid: str | None = None,
        year: int | None = None,
        include_practice: bool | None = None,
        fix_results: bool = True,
    ):
        return self.cs.get_season(
            season_guid = season_guid,
            year = year,
            include_practice = include_practice,
            fix_results = fix_results,
        )

    def get_season_scores(
        self,
        year: int | None = None,
        season_guid: str | None = None,
        include_practice: bool | None = None,
    ):
        if year == None:
            year = self.year

        season_data = self.get_season_data(
            season_guid = season_guid,
            year = year,
            include_practice = include_practice,
        )

        try:
            new_year = int(re.search(r'(\d+)', season_data['name']).group())
        except:
            new_year = year

        if new_year != None and new_year != year:
            year = new_year

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
            competition_data = self.get_competition(comp)
            season['competitions'][competition_data['competition_guid']] = competition_data

        self.scores["seasons"][season['season_guid']] = season

        return season

    def get_competition(self, competition_data : dict):
        """Get the competition scores from the data.

        Args:
            competition_data (dict): The competition data from `self.get_season_data()['competitions'][n]`.
        """
        competition = {
            "name": competition_data['name'],
            "date": competition_data['competitionDate'],
            "location": competition_data['location'],
            "recap_url": competition_data['recapUrl'],
            "competition_guid": competition_data['competitionGuid'],
            "classes": {},
        }

        print(f"getting competition: {competition['name']}")

        classes = self.get_competition_scores(competition['competition_guid'])

        competition['classes'] = classes

        return competition

    def get_competition_scores(self, competition_guid : str):
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

    def get_new_competitions(
        self,
        season_guid: str | None = None,
        year: int | None = None,
        include_practice: bool | None = None,
        fix_results: bool = True,
    ):
        season_data = self.get_season_data(
            season_guid = season_guid,
            year = year,
            include_practice = include_practice,
            fix_results = fix_results,
        )

        new_competitions = []

        print(season_data)
        season_guid = season_data['seasonGuid']

        if season_guid not in self.scores['seasons']:
            new_competitions = self.get_season_scores(season_guid = season_guid)['competitions']
        else:
            season_scores = self.scores['seasons'][season_guid]['competitions']
            for competition in season_data['competitions']:
                if competition['competitionGuid'] in season_scores:
                    print(f"competition {competition['name']} ({competition['competitionGuid']}) already exists")
                    continue

                print(f"getting competition: {competition['name']} ({competition['competitionGuid']})")

                new_scores = self.get_competition(competition)

                season_scores[competition['competitionGuid']] = new_scores

                new_competitions.append(deepcopy(new_scores))

        return new_competitions

    def get_new_scores(
        self,
        competition_guid : str,
    ):
        competition = None

        for season_guid in self.scores['seasons']:
            season = self.scores['seasons'][season_guid]

            if competition_guid in season['competitions']:
                print('exists')
                competition = season['competitions'][competition_guid]
                break

        if competition == None:
            print('does not exist')
            return []

        new_scores = []

        comp_scores = self.get_competition_scores(competition_guid = competition_guid)

        for class_name in comp_scores:
            if class_name not in competition['classes']:
                competition['classes'][class_name] = comp_scores[class_name]
                new_scores.append(deepcopy(comp_scores[class_name]))
                print(f'new class: {class_name}')
            else:
                new_class = deepcopy(comp_scores[class_name])
                new_class['performances'] = {}
                for performance_guid in comp_scores[class_name]['performances']:
                    if performance_guid not in competition['classes'][class_name]['performances']:
                        competition['classes'][class_name]['performances'][performance_guid] = comp_scores[class_name]['performances'][performance_guid]
                        new_class['performances'][performance_guid] = deepcopy(comp_scores[class_name]['performances'][performance_guid])
                        print(f'new performance: {performance_guid}')

                if new_class['performances'] != {}:
                    new_scores.append(new_class)

        return new_scores
