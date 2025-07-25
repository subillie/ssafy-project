# Project 01

첫번째 관통프로젝트입니다.

## Team
<table>
  <tbody>
    <tr>
      <td align="center"><a href="https://github.com/RoySong12"><img src="https://avatars.githubusercontent.com/u/221042263?v=4" width="100px;" alt=""/><br /><sub><b>송진현</b></sub></a><br /></td>
      <td align="center"><a href="https://github.com/subillie"><img src="https://avatars.githubusercontent.com/u/112736264?v=4" width="100px;" alt=""/><br /><sub><b>이수빈</b></sub></a><br /></td>
    </tr>
  </tbody>
</table> 

## Run
Before run
```bash
$ pip install requests
```
Execute F01-F05
```bash
$ python open_weather.py
```
Execute F06-F10
```bash
$ python fin_life.py
``` 

## 구현
[**open_weather.py**](./open_weather.py)
  - [OpenWeatherMap API](https://openweathermap.org/current)를 호출하여 도시별 현재 날씨 데이터를 가져오고, 필요한 키 값을 JSON 형태로 파싱합니다.
  - 응답 데이터를 한글 키로 변환하고, 온도 값을 켈빈에서 섭씨로 변환해 추가합니다.
  - 처리된 데이터를 확인하고, 외부 프롬프트 파일(`f05.txt`)과 연계하여 생성형 AI 실험을 할 수 있도록 구성했습니다.

[**fin_life.py**](./fin_life.py)
  - [금융감독원 오픈 API](https://finlife.fss.or.kr/finlife/api/fdrmDpstApi/list.do?menuNo=700052)에서 전체 정기예금 상품 데이터를 요청하여 JSON으로 파싱합니다.
  - 정기예금 상품 리스트와 옵션 정보를 조건에 맞게 추출하고, 영어 키를 한글로 변환해 가공합니다.
  - 상품 정보와 옵션 정보를 하나의 딕셔너리로 통합하여 출력하며, 외부 프롬프트 파일(`f10.txt`)을 통해 생성형 AI와 연계할 수 있도록 작성했습니다.


## 학습 내용
OpenWeatherMap API와 금감원 정기예금 API를 연동 및 활용 하며 현행 날씨를 조회하고, 금융 상품 조회를 해보았습니다. requests 라이브러리로 GET 요청 및 예외 처리를 하고 json, pprint로 가독성 있는 데이터 출력과 함수 단위 모듈화로 재사용성을 확보하는 시간을 가져보았습니다.
생성형 AI에 API 설명, 아이디어를 요청하는 프롬프트도 작성하는 시간을 가졌습니다.

## 느낀 점
API 호출의 구조화 과정을 반복하면서, 백엔드와의 통신 흐름을 체계적으로 익힐 수 있었습니다.
데이터 전처리(respond → filter → map → sort) 단계별로 나누어 보니 실제 서비스 로직 설계에 큰 도움이 되었습니다. 또한, 함수 단위 모듈화를 경험하며, 코드 재사용성과 가독성의 중요성을 실감했습니다.
마지막으로, 생성형 AI 연동을 통해 단순 설명을 넘어, 번역·아이디어 제시까지 확장하는 재미를 느꼈습니다.
앞으로는 이러한 경험을 바탕으로 실시간 알림, 시각화 대시보드 같은 고도화된 기능에도 도전해 보고 싶습니다!
배운 것을 직접 손으로 구현해 보는 것만큼 빨리 체득되는 방법은 없다는 걸 다시 한번 느꼈습니다. 싸피에서의 짧은 시간이지만, 이 과정을 통해 ‘설계부터 구현, 그리고 재사용 가능하도록 모듈화’까지 경험할 수 있어 정말 값진 시간이었습니다!