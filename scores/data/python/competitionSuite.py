import typing
from collections import namedtuple
from urllib.parse import urljoin, urlencode, urlparse, urlunparse

from bs4 import BeautifulSoup
import requests
import json

from py_mini_racer import MiniRacer

jsContext = MiniRacer()

def run_javascript(javascript : str):
    while javascript.endswith(';'):
        javascript = javascript[:-1]
    
    # print(f'javascript:\n{javascript}')
    return jsContext.execute(javascript)

# namedtuple to match the internal signature of urlunparse
Components = namedtuple(
    typename = 'Components', 
    field_names = ['scheme', 'netloc', 'url', 'path', 'query', 'fragment']
)

def create_url(
    scheme : str = 'https',
    domain : str = 'example.com',
    url : str = '/',
    fragment : str = '',
    params : dict = {},
    path : str = '',
):
    """Create a url

    Args:
        scheme (str, optional): Part at the beginning of url, usually http or https. Defaults to 'https'.
        domain (str, optional): The url domain or scheme. Defaults to 'example.com'.
        url (str, optional): The path on the url, such as `/test`. Defaults to '/'.
        fragment (str, optional): The url fragment, or the id to scroll to. It's the #part. Defaults to ''.
        params (dict, optional): Url params. These are the `?param=hi`. Defaults to {}.
        path (str, optional): Part after semicolon. I have no clue what this is for. Defaults to ''.

    Returns:
        str: url in this format `{scheme}://{domain}/{url};{path}?{param}={value}#{fragment}`
    """
    
    return urlunparse(
        Components(
            scheme = scheme,
            netloc = domain,
            query = urlencode(params),
            path = path,
            url = url,
            fragment = fragment,
        )
    )

def check_int(value : int | str):
    try:
        return int(value)
    except:
        return None

def check_bool(value : typing.Literal['false', 'true', 0, 1, '0', '1'] | bool | None | typing.Any):
    values = {
        'false': 'false',
        'true': 'true',
        0: 'false',
        1: 'true',
        '0': 'false',
        '1': 'true',
        False: 'false',
        True: 'true',
    }
    
    return None if value not in values else values[value]

class CompetitionSuite():
    def __init__(
        self,
        org_guid : str = None,
        org_url : str = 'https://www-umea-us.filesusr.com/html/4a996b_94944928dddae9e892d2136a828f4bc9.html',
    ) -> None:
        self.old_api_domain = "bridge.competitionsuite.com/"
        self.include_practice : str | bool = 'false'
        self.old_api_version = "1.1.5"
        self.cdn = f"https://cdn.competitionsuite.io/bridge/{self.old_api_version}"
        
        
        self.url_scheme : str = 'https'
        self.api_version : str = '2018-03'
        self.api_domain : str = f'api.competitionsuite.com/{self.api_version}'
        
        self.org_guid : str = org_guid
        
        self.org_url : str = org_url
        
        self.headers : dict[typing.Literal['accept', 'Accepts'], typing.Literal['application/json']] = {
            "accept": "application/json",
            "Accepts": "application/json"
        }
        
        if self.org_url:
            self.get_details_from_page(self.org_url)
    
    def request(
        self,
        url : str = '/', params : dict[str, str | int | float] = {},
    ) -> dict | list:
        url = create_url(
            scheme = self.url_scheme,
            domain = self.api_domain,
            url = url,
            params = params,
        )
        
        response = requests.get(url, headers = self.headers)
        
        result : dict | list = json.loads(response.text)
        
        return result
    
    def get_competitions(
        self,
        year : int | None = None,
        include_practice : bool | None = None,
        fix_results : bool = True,
    ) -> dict | list:
        include_practice = check_bool(include_practice)
        if include_practice == None:
            include_practice = check_bool(self.include_practice)
        
        params = {
            'o': self.org_guid,
        }
        year = check_int(year)
        
        if year != None:
            params['year'] = year
        
        if include_practice != None:
            params['includePractice'] = include_practice
        
        result = self.request(url = 'competitions', params = params)
        if len(result) == 0:
            season = self.get_season(year = year)
            season_guid = season['seasonGuid']
            result = season['competitions'] if 'competitions' in season else []
            
            if fix_results:
                for comp in result:
                    comp['seasonGuid'] = season_guid
                    comp['recapUrl'] = f"https://recaps.competitionsuite.com/{comp['competitionGuid']}.htm"
            
        return result
    
    def get_performances(
        self,
        competition_guid : str,
    ):
        params = {
            'c': competition_guid
        }
        
        return self.request(url = 'performances', params = params)
    
    def get_seasons(self) -> dict | list:
        url = create_url(
                scheme = self.url_scheme,
                domain = self.old_api_domain,
                url = 'api/orgscores/GetSeasons/jsonp',
                params = {
                    'organization': self.org_guid,
                    'version': self.old_api_version,
                    'callback': 'result=',
                }
            )
        result = run_javascript( requests.get(url).text )
        return result
    
    def get_season(
        self,
        season_guid : str | None = None,
        year : int | None = None,
        include_practice : bool | None = None,
        fix_results : bool = True,
    ) -> dict | list:
        include_practice = check_bool(include_practice)
        if include_practice == None:
            include_practice = check_bool(self.include_practice)
        
        year = check_int(year)
        if season_guid == None and year != None:
            year = str(year)
            seasons = self.get_seasons()
            for s in seasons:
                if year in s['name']:
                    season_guid = s['seasonGuid']
                    break
        
        
        print('getting season: ' + (str(season_guid) if season_guid else 'current'))
        
        data = self.get_events(season_guid = season_guid)
        
        if fix_results:
            for comp in data['competitions']:
                comp['seasonGuid'] = season_guid
                comp['recapUrl'] = f"https://recaps.competitionsuite.com/{comp['competitionGuid']}.htm"
        return data

    def get_events(
        self,
        season_guid : str | None = None,
        include_practice : bool | None = None,
    ) -> dict | list:
        include_practice = check_bool(include_practice)
        if include_practice == None:
            include_practice = check_bool(self.include_practice)
        
        if season_guid:
            url = create_url(
                scheme = self.url_scheme,
                domain = self.old_api_domain,
                url = 'api/orgscores/GetCompetitionsBySeason/jsonp',
                params = {
                    'season': season_guid,
                    'showTrainingEvents': include_practice,
                    'version': self.old_api_version,
                    'callback': 'result=',
                }
            )

        else:
            url = create_url(
                scheme = self.url_scheme,
                domain = self.old_api_domain,
                url = 'api/orgscores/GetCompetitionsByOrganization/jsonp',
                params = {
                    'organization': self.org_guid,
                    'showTrainingEvents': include_practice,
                    'version': self.old_api_version,
                    'callback': 'result=',
                }
            )
            
        print(f'url: {url}')
        
        result = run_javascript( requests.get(url).text )
        return result
    
    def get_details_from_page(
        self,
        url : str = 'https://www-umea-us.filesusr.com/html/4a996b_94944928dddae9e892d2136a828f4bc9.html',
    ):

        # webpage = requests.get('https://bridge.competitionsuite.com/orgscores/orgscores.js').text
        webpage = requests.get(url).text
        soup = BeautifulSoup(webpage, 'html.parser')
        
        element = soup.select('[data-compsuite-org]')[0]
        
        self.org_guid = element['data-compsuite-org']

        if "data-compsuite-test" in element and element["data-compsuite-test"] == 'true':
            self.include_practice = 'true'
    
    def get_competition_info(self, competition_guid=None):
        if competition_guid:
            url = create_url(
                domain = self.old_api_domain,
                url = 'api/orgscores/GetCompetition/jsonp',
                params = {
                    'competition': competition_guid,
                    "version": self.old_api_version,
                    "callback": "result=",
                }
            )

        else:
            url = self.old_api_domain + "api/orgscores/GetLatestCompetition/jsonp?competition=" + self.org_guid + "&version=" + self.old_api_version + "&callback=result="
            url = create_url(
                domain = self.old_api_domain,
                url = 'api/orgscores/GetLatestCompetition/jsonp',
                params = {
                    'organization': self.org_guid,
                    "version": self.old_api_version,
                    "callback": "result=",
                }
            )

        result = run_javascript( requests.get(url).text )
        return result
    
CS = CompetitionSuite
