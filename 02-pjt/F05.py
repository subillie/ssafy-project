"""F05
데이터 시각화 (월별 최고/최저/종가 시각화)
: 2022년 이후 데이터를 바탕으로 3가지 지표를 하나의 그래프에 시각화
"""

import pandas as pd
import matplotlib.pyplot as plt
from F01 import get_netflix_csv

# 데이터 불러오기 및 전처리
df = get_netflix_csv()
df['Date'] = pd.to_datetime(df['Date'])
df_2022 = df[df['Date'] >= '2022-01-01'].copy()

# 그래프 그리기
plt.figure(figsize=(10, 6))
plt.plot(df_2022['Date'], df_2022['High'], label='High', color='blue', linewidth=1)
plt.plot(df_2022['Date'], df_2022['Low'], label='Low', color='orange', linewidth=1)
plt.plot(df_2022['Date'], df_2022['Close'], label='Close', color='green', linewidth=1)

plt.title('Daily High, Low, and Close Prices since January 2022')
plt.xlabel('Date')
plt.ylabel('Price')

# X축 눈금: 1월 5일부터 4일 간격으로만 표시
start_tick = pd.to_datetime('2022-01-05')
end_tick = df_2022['Date'].max()
xticks = pd.date_range(start=start_tick, end=end_tick, freq='4D')

# 눈금 위치와 포맷 지정
plt.xticks(ticks=xticks, labels=[d.strftime('%Y-%m-%d') for d in xticks], rotation=45)

plt.legend()
plt.tight_layout()
plt.show()