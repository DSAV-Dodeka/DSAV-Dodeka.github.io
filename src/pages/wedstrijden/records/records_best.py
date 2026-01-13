from typing import TypedDict
import pandas as pd

onderdelen = {
    'man': {'outdoor': ['100m', '200m', '400m', '800m', '1500m', '5000m', '110mh', '400mh', '3000m steeple', '4x100m', '4x400m', 'kogelstoten', 'speerwerpen', 'discuswerpen', 'kogelslingeren', 'hoogspringen', 'hinkstapspringen', 'polsstokspringen', 'verspringen', 'dekathlon', 'dodekathlon', 'biermijl'], 'indoor': ['60m', '200m', '400m', '800m', '3000m', '60mh', 'kogelstoten', 'hoogspringen', 'hinkstapspringen', 'polsstokspringen', 'verspringen']},
    'vrouw': {'outdoor': ['100m', '200m', '400m', '800m', '1500m', '3000m', '100mh', '400mh', '3000m steeple', '4x100m', '4x400m', 'kogelstoten', 'speerwerpen', 'discuswerpen', 'kogelslingeren', 'hoogspringen', 'hinkstapspringen', 'polsstokspringen', 'verspringen', 'heptathlon', 'dodekathlon', 'biermijl'], 'indoor': ['60m', '200m', '400m', '800m', '3000m', '60mh', 'kogelstoten', 'hoogspringen', 'hinkstapspringen', 'polsstokspringen', 'verspringen']}
}

output = {
    'man': {'outdoor': [], 'indoor': []},
    'vrouw': {'outdoor': [], 'indoor': []}
}


def convert_dict(best_dict: dict):
    return [{
                'naam': v['Naam'],
                'datum': v['Datum'].date().isoformat(),
                'plaats': v['Locatie'],
                'prestatie': v['Prestatie']
             } for v in best_dict.values()]

def change_event_name(a):
    if a == 'polsstokhoogspringen':
        return 'polsstokspringen'
    else:
        return a

with open("records_out.xlsx", "rb") as f:
    xls = pd.ExcelFile(f)

    for gesl in onderdelen:
        for cat in onderdelen[gesl]:
            cat_name = f"{cat}_{gesl}"

            df = pd.read_excel(xls, cat_name)
            df['Onderdeel'] = df['Onderdeel'].apply(str.lower).apply(change_event_name)

            for event in onderdelen[gesl][cat]:
                # print(df['Datum'])
                event_rows = df[df['Onderdeel'] == event].sort_values(by='Datum')

                # alle afstanden of de biermijl wil je zo laag mogelijk
                lower_better = '0m' in event or event == 'biermijl'
                # zorg ervoor dat iedereen alleen zijn beste prestatie in het lijstje komt
                grouped = event_rows.groupby(['Naam'])[['Naam', 'Score']]
                if lower_better:
                    best_scores = grouped.transform(min)
                else:
                    best_scores = grouped.transform(max)

                best_idx = event_rows[['Naam', 'Score']] == best_scores
                best_records = event_rows[best_idx.all(axis=1)].drop_duplicates(subset='Naam')
                best = best_records.sort_values(by='Score', ascending=lower_better)[:5]
                best_dict = best.to_dict(orient='index')
                
                output[gesl][cat].append({'onderdeel': event, 'prestaties': convert_dict(best_dict)})
                    

print(output)



