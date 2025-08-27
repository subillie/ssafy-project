// window.addEventListener("load", () => {})
window.onload = function () { //HTML 모두 읽은 다음 실행할 메서드 등록
    // 이전에 로컬스토리지에 찜리스트 저장한 내용있으면, 찜리스트에 보여줘
    let movies = localStorage.getItem("movies");
    const likeMovieEmpty = document.querySelector("#like-moive-empty");
    const likeMovieUl = document.querySelector("#like-moive-list");
    if(movies === null) { // 찜한 영화 없으면, 문구 보여줘
        likeMovieEmpty.setAttribute("style", "display:block");
    } else { // 찜한 영화 있으면 문구 가려, 찜한 영화 목록 보여줘
        likeMovieEmpty.setAttribute("style", "display:none");

        movies = JSON.parse(movies);
        let likeMovieList = "";
        for (let i = 0; i < movies.length; i++){
            likeMovieList += `<li> ${movies[i].title} </li>`
        }

        likeMovieUl.innerHTML = "";
    }

    // json에서 읽은 영화 목록을 HTML에 그려주기
    // json 에서 읽기 비동기로 읽어오기
    const xhr = new XMLHttpRequest();

    xhr.open("GET", "data/movie.json"); // 요청을 초기화
    xhr.onreadystatechange = function () { // 작업 완료 시 할일
       if(xhr.readyState == xhr.DONE) {
        if(xhr.status === 200) {
            // console.log(xhr.responseText); // 문자열
            const resJson = JSON.parse(xhr.responseText);
            // console.log(resJson); // json 객체
            const movieData = resJson.movies;
            // console.log(movieData); // 무비 배열
            let movieList = document.querySelector(".content-movie-list-ul");
            for (let i = 0; i < movieData.length; i++) {
                // console.log(movieData[i]); // 하나하나 요소
                let movieItem = 
                `<li>
                    <div>
                        <img src="${movieData[i]["img"]}"/>
                    </div>
                    <div>
                        <div>
                            <div>
                                "${movieData[i].title}"
                            </div>
                            <div>
                                "${movieData[i].director}"
                            </div>
                        </div>
                        <button class="like-btn">찜</button>
                    </div>
                </li>`
                    
                movieList.innerHTML += movieItem;
            }
            // 영화 정보를 HTML에 넣기 innerHTML 

        }
       }
    }
    xhr.send(); // 요청 보내기

    // 버튼을 누르면, 찜리스트에 추가 (로컬스토리지 저장)
    const contentMovieList = document.querySelector(".content-movie-list-ul");
    contentMovieList.addEventListener("click", function(e){
        // console.log("클릭됨")
        // console.log(e.target)
        if(e.target.className !== "like-btn") return;
        console.log(e.target.parentElement);
        console.log(e.target.parentElement.innerText);
        const data = e.target.parentElement.innerText.split("\n");
        const movie = {
            title : data[0],
            director : data[1],
        }
        // 로컬스토리지에 저장된 목록을 얻어다가 지금 찜한 영화를 추가하자
        let localMovies = localStorage.getItem("movies");
        if (localMovies === null) { // 저장된 찜리스트가 없으면
            localMovies = [movie]
        } else { // 저장된 리스트가 있으면 끝에 추가
            JSON.parse(localMovies).push(movie);
        }
        localStorage.setItem("movies", JSON.stringify(localMovies));
    })
}  