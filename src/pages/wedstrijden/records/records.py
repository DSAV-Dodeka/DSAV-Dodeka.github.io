import pandas as pd

# Sort by person, then by event and achievement
sort_person = False

def min_to_seconds(a):
    a = str(a)
    new_prest = a
    if ":" in a:
        sp = a.split(':')
        if len(sp) >= 3:
            h = int(sp[-3])
        else:
            h = 0

        m = int(sp[-2])
        s = float(sp[-1])
        a = h*60 + m*60 + s
        h_pre = f"{h}:" if h > 0 else ""
        m_pre = f"{m:02}:" if h > 0 or m > 0 else ""
        new_prest = f"{h_pre}{m_pre}{s:02}"

    return float(a), new_prest


def load_records():
    with open("records.xlsx", "rb") as f:
        df = pd.read_excel(f)
    events_col = df.iloc[:, 0]
    # make sure any spaces at the end are removed
    events_col = events_col.apply(lambda s: s.strip())
    df.iloc[:, 0] = events_col
    df['Score'], df['Prestatie'] = zip(*df['Prestatie'].apply(min_to_seconds))

    df = df.drop_duplicates(['Naam', 'Onderdeel', 'Score', 'Datum', 'Locatie'])

    if sort_person:
        df = df.sort_values(by=['Naam', 'Onderdeel', 'Categorie', 'Score'])
        df.to_excel('prs_out.xlsx')
    else:
        df = df.sort_values(by=['Score'], ascending=False)

        events = set(events_col)

        cols = ['Onderdeel', 'Naam', 'Prestatie', 'Datum', 'Locatie', 'Link', 'Score']
        o_m = pd.DataFrame(columns=cols)
        i_m = pd.DataFrame(columns=cols)
        o_v = pd.DataFrame(columns=cols)
        i_v = pd.DataFrame(columns=cols)

        for e in events:
            ppl = df.loc[events_col == e]
            outdoor = ppl.loc[ppl.iloc[:, 5] == 'Outdoor']
            outdoor_man = outdoor[outdoor.iloc[:, 6] == 'Man']
            outdoor_vrouw = outdoor[outdoor.iloc[:, 6] == 'Vrouw']

            indoor = ppl.loc[ppl.iloc[:, 5] == 'Indoor']
            indoor_man = indoor[indoor.iloc[:, 6] == 'Man']
            indoor_vrouw = indoor[indoor.iloc[:, 6] == 'Vrouw']

            o_m = pd.concat([o_m, outdoor_man[cols]])
            i_m = pd.concat([i_m, indoor_man[cols]])
            o_v = pd.concat([o_v, outdoor_vrouw[cols]])
            i_v = pd.concat([i_v, indoor_vrouw[cols]])

        with pd.ExcelWriter('records_out.xlsx', datetime_format="DD/MM/YYYY HH:MM:SS") as xcl:
            # index is none so we dont output the row index
            o_m.to_excel(xcl, sheet_name='outdoor_man', index=None)
            i_m.to_excel(xcl, sheet_name='indoor_man', index=None)
            o_v.to_excel(xcl, sheet_name='outdoor_vrouw', index=None)
            i_v.to_excel(xcl, sheet_name='indoor_vrouw', index=None)
   
load_records()
