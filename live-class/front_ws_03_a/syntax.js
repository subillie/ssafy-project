/*
    변수 선언 연습하기

    Javascript는 Java와 달리 변수의 타입을 지정하여 사용하지 않습니다.
    (변수의 타입이 없는 것은 아닙니다.)
*/


/*
    Q. 아직 선언 및 초기화 하지 않은 이름이 num1인 변수를 출력해 봅시다.
    아래 var num1이 선언되어있어 undefined가 출력됨을 확인합니다.
*/

console.log(num1); // var num1이 Hoisting으로 인해 최상단에 선언된 것과 동일한 효과를 가집니다.



/*
    Q. var 키워드를 이용하여 변수 이름은 num1, 값은 1로 초기화 해봅시다.
*/

var num1 = 1;

if(num1 === 1) {

    /*
        Q. var 키워드를 이용하여 변수 이름은 num1, 값은 2로 초기화 해봅시다.
    */
    let num1 = 2; // 재선언이 가능함을 확인합니다.


    console.log("num1 예상 출력 결과: 2 " + "결과: " + num1);
}

console.log("num1 예상 출력 결과: 1 " + "결과: " + num1);




/*
    Q. 아직 선언 및 초기화 하지 않은 이름이 num2인 변수를 출력해 봅시다.
*/
// console.log(num2); // ReferenceError가 발생함을 확인합니다. 이후, 주석처리합니다.



/*
    Q. let 키워드를 이용하여 변수 이름은 num2, 값은 1로 초기화 해봅시다.
*/
let num2 = 1;

if(num2 === 1) {

    /*
        Q. let 키워드를 이용하여 변수 이름은 num2, 값은 2로 초기화 해봅시다.
    */
    let num2 = 2;


    console.log("num2 예상 출력 결과: 2 " + "결과: " + num2);
}

console.log("num2 예상 출력 결과: 1 " + "결과: " + num2);

/*
    Q. let 키워드를 이용하여 변수 이름은 num2, 값은 3로 초기화 해봅시다.
*/
//let num2 = 3; // 재선언이 불가능함을 확인합니다. 이후, 주석처리합니다.


/*
    Q. const 키워드를 이용하여 변수 이름은 PI, 값은 3.14로 초기화 해봅시다.
*/
const PI = 3.14;

try {

    /*
        Q. PI 변수에 값은 3.141592로 초기화 해봅시다.
    */
    PI = 3.141592;

} catch (err) {
    console.log(err);
}

console.log("PI 예상 출력 결과: 3.141592 " + "결과: " + PI);


///////////////////////////////////////////////////////////////////


/*
    조건문 연습하기

    Javascript는 변수를 비교할 때 유의해야하는 것이 있습니다.
    값만 동일한 것인지, 타입까지 동일한 것인지 비교해야합니다.
    그 외, 조건식은 Java와 동일합니다.
*/


/*
    Q. num3와 num4가 값만 같은지 비교해 봅시다.
*/
let num3 = 5;
let num4 = "5";

if(num3 == num4) {
    console.log("num3와 num4는 값이 동일합니다.");
}


/*
    Q. num3와 num4가 값과 타입까지 동일한지 비교해 봅시다.
*/

if(num3 === num4) {

    console.log("num3와 num4는 값과 타입까지 동일합니다.");

} else {

    console.log("num3와 num4는 값과 타입이 다릅니다.");
}


///////////////////////////////////////////////////////////////////


/*
    반복문 연습하기

    Java와 동일하게 for문을 사용할 수 있습니다.
    다른 방식으로는 for ~ in 과 for ~ of가 있습니다.
*/


/*
    Q. 1 부터 10까지 출력하는 반복문을 작성해 봅시다.
*/

for(let num = 1; num < 11; num++) {
    console.log(num + "\n");
}


let something = ["a",2,"d"];
something.name = "kim";


/*
    Q. 반복 가능한(Iterable) 객체를 출력하는 반복문을 작성해 봅시다.
        value에는 값이 들어가는 것을 확인합니다.
*/

console.log("for ~ of 출력");
for(let value of something) {
    console.log(value);
}


console.log("####################################")

/*
    Q. 열거 가능한(Enumerable) 객체를 출력하는 반복문을 작성해 봅시다.
        value에는 인덱스가 들어가는 것을 확인합니다.
*/
console.log("for ~ in 출력");
for(let value in something) {
    console.log(value, something[value]);
}
