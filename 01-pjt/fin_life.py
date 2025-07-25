# 금융감독원 오픈API
# 정기예금 API: https://finlife.fss.or.kr/finlife/api/fdrmDpstApi/list.do?menuNo=700052
import requests, env, sys
from pprint import pprint

fin_group_list = [
    "020000",  # 은행
    "030200",  # 여신전문
    "030300",  # 저축은행
    "050000",  # 보험회사
    "060000",  # 금융투자
]

response_vars = {
    "dcls_month": "공시 제출월",
    "fin_co_no": "금융회사 코드",
    "fin_prdt_cd": "금융상품 코드",
    "intr_rate": "저축 금리",
    "intr_rate2": "최고 우대금리",
    "intr_rate_type": "저축 금리 유형",
    "intr_rate_type_nm": "저축 금리 유형명",
    "save_trm": "저축 기간"
  }

# [F06] 전체 정기예금의 응답을 JSON 형태로 변환 후 KEY 값만 출력하도록 구성
print(f"\n{env.YELLOW}[F06] {env.CYAN}Key 값 출력{env.DEFAULT}")
url = f"http://finlife.fss.or.kr/finlifeapi/depositProductsSearch.json?auth={env.FIN_LIFE_API_KEY}&topFinGrpNo=020000&pageNo=1"
response = requests.get(url).json()["result"]
print(response.keys())

# [F07] 전체 응답 중 정기예금상품 리스트 정보만 출력
print(f"\n{env.YELLOW}[F07] {env.CYAN}정기예금상품 리스트 추출{env.DEFAULT}")
deposit_list = []
for prdt in response["baseList"]:
    if "정기예금" in prdt["fin_prdt_nm"]:
        deposit_list.append(prdt)
pprint(deposit_list)

# [F08] 전체 응답 중 정기예금 상품들의 옵션 리스트를 출력
print(f"\n{env.YELLOW}[F08] {env.CYAN}옵션 정보 가공{env.DEFAULT}")
## 정기예금 상품 리스트에서 fin_co_no, fin_prdt_cd만 따로 저장
co_no = []
prdt_cd = []
for deposit in deposit_list:
    co_no.append(deposit["fin_co_no"])
    prdt_cd.append(deposit["fin_prdt_cd"].replace("-", ""))
## 각 상품의 옵션 정보만 따로 추출하여 리스트로 가공
option_list = []
for prdt in response["optionList"]:
    if (prdt["fin_co_no"] in co_no) and (prdt["fin_prdt_cd"] in prdt_cd):
        option_list.append(prdt)
## key 값을 한글로 번역
for option in option_list:
    option_keys = list(option.keys())
    for key_eng in option_keys:
        try:
            if key_eng == "dcls_month" or key_eng == "fin_co_no":
                option.pop(key_eng)
            else:  # 필요한 정보만 추가
                option[response_vars[key_eng]] = option.pop(key_eng)
        except KeyError:
            pass
pprint(option_list)

# [F09] 금융상품 + 옵션 정보 딕셔너리로 가공
print(f"\n{env.YELLOW}[F08] {env.CYAN}상품+옵션 통합{env.DEFAULT}")
deposit_detailed_list = []
for deposit in deposit_list:
    for option in option_list:
        try:
            if deposit["fin_prdt_cd"].replace("-", "") == option["금융상품 코드"]:
                option.pop("금융상품 코드")
                detail = {
                    "금리정보": option,
                    "금융상품명": deposit["fin_prdt_nm"],
                    "금융회사명":deposit["kor_co_nm"],
                }
                deposit_detailed_list.append(detail)
        except KeyError:
            pass
pprint(deposit_detailed_list)

# [f10] 금융 API 기반 프롬프트 작성 및 결과 출력
print(f"\n{env.YELLOW}[F08] {env.CYAN}금융: 생성형 AI 활용{env.DEFAULT}")
f = open("f10.txt", "r", encoding="utf-8")
for line in f:
    print(line, end="")
f.close()
