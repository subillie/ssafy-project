# OpenWeather
# API Specification: https://openweathermap.org/current

import requests, env
from pprint import pprint

keys_kor = {
    "pressure": "기압",
    "humidity": "습도",
    "temp": "온도",
    "feels_like": "체감온도",
    "temp_max": "최고온도",
    "temp_min": "최저온도",
    "id": "식별자",
    "icon": "아이콘",
    "description": "요약",
    "main": "핵심",
}

# [F01] 날씨 데이터의 응답을 JSON 형태로 변환 후 Key 값만 출력하도록 구성
city_name = "Seoul,KR"  # "Tokyo,JP", "New Yorks,US" 등
url = f"https://api.openweathermap.org/data/2.5/weather?q={city_name}&appid={env.OPEN_WEATHER_API_KEY}"
response = requests.get(url).json()
# pprint(response)
print(f"\n{env.YELLOW}[F01] {env.CYAN}Key 값 출력{env.DEFAULT}")
print(response.keys())

# [F02] main, weather 키 값을 딕셔너리로 추출
print(f"\n{env.YELLOW}[F02] {env.CYAN}원하는 값 추출{env.DEFAULT}")
parsed_dict = dict()
parsed_dict["main"] = response["main"]
parsed_dict["weather"] = response["weather"]
pprint(parsed_dict)

# [F03] 추출한 키 값을 한글 키로 변환한 새로운 딕셔너리 생성
print(f"\n{env.YELLOW}[F03] {env.CYAN}Key 한글화{env.DEFAULT}")
translation ={
    "main": "기본",
    "weather": "날씨",
}
translated_dict = {translation[k]: v for k, v in parsed_dict.items()}
pprint(translated_dict)

# [F04] F03의 결과 딕셔너리에 온도 관련 값을 이용해 섭씨 데이터 필드 추가
print(f"\n{env.YELLOW}[F04] {env.CYAN}섭씨 온도 추가{env.DEFAULT}")

def add_celsius(key: str, kelvin: float) -> None:
    """
    섭씨 온도 필드를 추가하는 함수
    """
    celsius = round(kelvin - 273.15, 2)
    translated_dict["기본"][key + "(섭씨)"] = celsius  # 섭씨 필드 추가

## "기본" 필드의 key값 한글로 번역
keys = list(translated_dict["기본"].keys())
for key in keys:
    value = translated_dict["기본"].pop(key)
    try:
        key_kor = keys_kor[key]
        translated_dict["기본"][key_kor] = value
        if "온도" in key_kor:
            add_celsius(key_kor, value)
    except:
        pass
## "날씨" 필드의 key값 한글로 번역
keys = list(translated_dict["날씨"][0].keys())
for key in keys:
    translated_dict["날씨"][0][keys_kor[key]] = translated_dict["날씨"][0].pop(key)

pprint(translated_dict)

# [F05] OpenWeatherMap API에 대한 프롬프트 구성 및 실험
print(f"\n{env.YELLOW}[F05] {env.CYAN}날씨: 생성형 AI 활용{env.DEFAULT}")
f = open("f05.txt", "r", encoding="utf-8")
for line in f:
    print(line, end="")
f.close()
