""" F02
데이터 전처리 (날짜 필터링)
: 2021년 이후 데이터 필터링
"""

import pandas as pd
import matplotlib.pyplot as plt
from F01 import get_netflix_csv

def get_df_2021():
    df = get_netflix_csv()
    df['Date'] = pd.to_datetime(df['Date'])
    df_2021 = df[df['Date'] >= '2021-01-01']
    return df_2021

df_2021 = get_df_2021()
plt.figure(figsize=(10, 8))
plt.plot(df_2021['Date'], df_2021['Close'])
plt.title('NFLX Close Price')
plt.xlabel('Date')
plt.ylabel('Close Price')
plt.xticks(rotation=45)
plt.tight_layout()
plt.show()