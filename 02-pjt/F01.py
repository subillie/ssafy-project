""" F01
데이터 전처리 (CSV 파일 읽기 및 필드 선택)
: Netflix 주가 데이터(NFLX.csv)를 Pandas를 사용해 DataFrame으로 읽어온다.
  이때, 'Date', 'Open', 'High', 'Low', 'Close' 필드만 선택한다.
"""

import pandas as pd

def get_netflix_csv():
    df = pd.read_csv('./archive/NFLX.csv', usecols=['Date', 'Open', 'High', 'Low', 'Close'])
    return df