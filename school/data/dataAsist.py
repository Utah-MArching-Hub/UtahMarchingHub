import json
import csv

def load_csv_to_dict(filename):
    result_dict = {}

    with open(filename, 'r') as csvfile:
        csvreader = csv.DictReader(csvfile)
        headers = csvreader.fieldnames[1:]  # Skip the first column

        for row in csvreader:
            row_title = row[csvreader.fieldnames[0]]
            result_dict[row_title] = {}

            for header in headers:
                result_dict[row_title][header] = row[header]

    return result_dict

data = {}

with open('./school/data/schools.json') as f:
    data = json.load(f)

default = {
    "location":"",
    "mascot":"",
    "district": "",
    "icon":"",
    "url" : "",
    "socials" : [
        ["instagram","springvilleband"],
        ["facebook","Springville-High-School-Bands-100048913274737"]
    ]
    
}

# for n in data:
#     print(n)
#     print(data[n])
#     print(data[n].keys())

sdata = load_csv_to_dict('./school/data/schools.csv')
# print(sdata)
ndata = {}

mainTypes = ['location','disctrict','class','mascot','icon','url']

for n in sdata:
    socials = False
    i = sdata[n]
    ndata[n] = {}
    for nn in i:
        ii = sdata[n][nn]
        if not nn in mainTypes:
            if not socials:
                ndata[n]['socials'] =[]
                socials = True
            ndata[n]['socials'].append([nn,ii])
        else:
            ndata[n][nn]=ii

print(ndata)

with open('./school/data/schools.json','w') as f:
    json.dump(ndata,f)