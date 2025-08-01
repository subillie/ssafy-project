# Project 02

## Team

<table>
  <tbody>
    <tr>
      <td align="center"><a href="https://github.com/subillie"><img src="https://avatars.githubusercontent.com/u/112736264?v=4" width="100px;" alt=""/><br /><sub><b>이수빈</b></sub></a><br /></td>
      <td align="center"><a href="https://github.com/hyeonseo995"><img src="https://avatars.githubusercontent.com/u/221243849?v=4" width="100px;" alt=""/><br /><sub><b>이현서</b></sub></a><br /></td> 
      <td align="center"><a href="https://github.com/hurgayoung"><img src="https://avatars.githubusercontent.com/u/176463195?v=4" width="100px;" alt=""/><br /><sub><b>허가영</b></sub></a><br /></td>
    </tr>
  </tbody>
</table>

## Run

### Jupyter Notebook (RECOMMENDED!!)

Before Run

```bash
$ pip install notebook
```

To See

#### [NFLX_stock](./NFLX_stock.ipynb)

### Python Files

Before Run

```bash
$ pip install pandas
$ pip install matplotlib
```

To Run

```bash
$ py F01.py
$ py F02.py
$ py F03.py
$ py F04.py
$ py F05.py
```

## 구현

[개요]  
본 프로젝트는 Netflix(NFLX.csv)의 주가 데이터를 기반으로 주요 지표를 전처리하고, Pandas와 Matplotlib을 활용하여 다양한 형태의 시계열 그래프를 시각화하는 데이터 분석 실습입니다.

[구현 기능]

1. 데이터 로딩 및 전처리
   pandas.read_csv()를 사용하여 'Date', 'Open', 'High', 'Low', 'Close' 필드만 추출
   'Date' 컬럼을 datetime 형식으로 변환
   2021년 이후 데이터 필터링 수행

2. 통계 분석
   필터링된 데이터에서 종가(Close)의 최대/최소값 계산

3. 월별 평균 종가 시각화 (F04 요구사항)
   2021년 이후 데이터를 월 단위로 그룹화
   groupby()와 mean()을 활용하여 월별 평균 종가 계산
   matplotlib.pyplot으로 라인 그래프 시각화

4. 월별 고가/저가/종가 복합 시각화 (F05 요구사항)
   2022년 이후 데이터를 필터링하여 월별 최고가(High), 최저가(Low), 평균 종가(Close) 계산
   하나의 그래프에 세 지표를 라인 그래프로 표현하는 복합 시계열 그래프 작성

[사용 기술]  
Python 3.x
Pandas
NumPy (선택적 사용)
Matplotlib

## 학습 내용

이번 Netflix 주가 데이터 분석 프로젝트를 통해 CSV 파일을 Pandas로 효율적으로 불러오는 방법과 날짜 데이터를 datetime 형식으로 처리하는 방법을 익혔으며, 조건에 따른 데이터 필터링, 그룹화(groupby) 및 통계 지표 계산(최대값, 최소값, 평균값 등)을 실습함으로써 시계열 데이터 분석의 기초 개념을 학습할 수 있었습니다.

또한 Matplotlib을 활용한 단일 및 복합 라인 그래프 시각화를 통해 데이터의 흐름과 패턴을 직관적으로 표현하는 기술을 익히며, 실제 데이터를 기반으로 분석-가공-시각화의 전체 데이터 파이프라인 흐름을 체계적으로 이해할 수 있었습니다.

[Jupyter Docs](https://docs.jupyter.org/en/latest/)

Jupyter는 두 가지 버전으로 실행됨

- 명령 모드: `ESC`
  - `m`: 블록을 마크다운으로 변경
  - `y`: 블록을 코드블록으로 변경
  - `a`: 커서 기준 위에 셀 추가
  - `b`: 커서 기준 아래에 셀 추가
  - `dd`: 선택된 셀 제거
- 코드 실행 모드: `Enter`
  - `Shift + Enter`: 해당 셀 실행 후 커서를 다음 셀로 이동
  - `Ctrl + Enter`: 해당 셀 실행 후 커서를 그대로 둠

## 느낀 점

이번 Netflix 주가 데이터 분석 프로젝트를 통해 시계열 데이터를 처리하고 시각화하는 전반적인 흐름을 체계적으로 익힐 수 있었으며, Pandas를 활용한 데이터 필터링, 그룹화, 통계 지표 계산부터 Matplotlib을 활용한 단일 및 복합 그래프 시각화까지의 과정에서 데이터 분석 파이프라인의 기초 역량을 키울 수 있었습니다. 특히 프로젝트를 수행하며 내가 작성한 코드와 팀원들의 코드를 비교하는 과정을 통해, 내가 놓친 부분이나 더 나은 접근 방식을 배우는 기회가 되었고, 동료들과의 상호 피드백을 통해 한층 더 깊은 이해를 얻을 수 있었습니다.

이번 과제를 수행하며, 가장 많은 시간과 고민을 쏟았던 부분은 바로 데이터 전처리였습니다. 과제에 '종가 데이터를 가져오라'는 분명한 지침이 있었음에도 불구하고, 어떤 방식으로 그 데이터를 효과적으로 추출할 수 있을지 고민하는 시간이 길었습니다. 방대한 데이터 속에서 원하는 단 하나의 정보를 정확하게 찾아내는 일이 생각보다 복잡했습니다. 수많은 컬럼들 중에서 종가(Close) 데이터를 선택하고, 이를 분석에 적합한 형태로 가공하는 과정은 단순히 코드를 작성하는 것을 넘어, 데이터의 구조를 이해하고 목표에 맞는 최적의 방법을 찾아가는 과정이었습니다. 이 고민의 시간을 통해 데이터 전처리가 분석의 성패를 좌우하는 중요한 첫걸음이라는 것을 깨달았고, 덕분에 이후의 모든 분석과 시각화 작업에 큰 자신감을 가지고 임할 수 있었습니다.

또한 평소에 접해보지 못했던 파이썬의 시각화 도구를 직접 다뤄볼 수 있어 흥미로웠고, 단순히 결과를 출력하는 수준을 넘어 데이터를 시각적으로 해석하고 전달하는 방법의 중요성을 체감할 수 있었습니다. 과제를 해결하면서는 문제를 한 번에 해결하려 하기보다, 기능을 쪼개어 단계적으로 접근하는 사고 방식이 훨씬 효과적이라는 점을 느꼈고, 이러한 경험은 앞으로의 데이터 분석 또는 프로그래밍 문제 해결에 있어 중요한 전략적 사고로 이어질 것이라 생각합니다.
