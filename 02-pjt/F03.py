""" F03
데이터 분석 (최고/최저 종가 추출)
: 2021년 이후 데이터에서 종가(Close)의 최대/최소 값 추출하기
"""

import pandas as pd
from F01 import get_netflix_csv

def get_df_2021():
    df = get_netflix_csv()
    df['Date'] = pd.to_datetime(df['Date'])
    df_2021 = df[df['Date'] >= '2021-01-01']
    return df_2021

# 2021년에 해당되는 구간 추출
df_2021 = get_df_2021()

# 구간 내 종가 범위의 열 추출
max_close = df_2021['Close'].max()
min_close = df_2021['Close'].min()

print("최고 종가:", max_close)
print("최저 종가:", min_close)