"""F04
데이터 분석 (월별 평균 증가 계산)
(1) 2021년 이후 데이터를 (2) 월별로 그룹화하여 (3) 평균 종가 계산
(4) 계산 결과를 DataFrame으로 저장하여 그래프로 시각화
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
df_2021['Date'] = pd.to_datetime(df_2021['Date'])  # Date 컬럼을 datetime으로 변환

# Group by 'Month'
df_2021['YearMonth'] = df_2021['Date'].dt.to_period('M')
monthly_avg = df_2021.groupby('YearMonth')['Close'].mean().reset_index()
monthly_avg['Date'] = pd.to_datetime(monthly_avg['YearMonth'].astype(str))

# 그래프로 시각화
plt.figure(figsize=(10, 8))
plt.plot(monthly_avg['Date'], monthly_avg['Close'])
plt.title('Monthly Average Close Price')
plt.xlabel('Date')
plt.ylabel('Average Close Price')
plt.xticks(rotation=45)
plt.tight_layout()
plt.show()
