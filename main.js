// 테스트용 API 키
const API_KEY = `0b4d6097f98643fd96713fd37337e51a`
// https://newsapi.org/v2/top-headlines?apiKey=${API_KEY}

// 누나 뉴스 API
//https://ziitteo-times.netlify.app/top-headlines?


const mobileMenu = document.querySelector('.fa-bars');
const menuBox = document.querySelector('.menu-wrap');
const closeBtn = document.querySelector('.close-btn');

// 뉴스 데이터를 저장할 newsList 배열 선언
let newsList = [];

// 뉴스를 렌더링할 news-board 요소 선택
const newsBoard = document.getElementById("news-board");

// 대체 이미지 url
const noImage = 'https://upload.wikimedia.org/wikipedia/commons/d/d1/Image_not_available.png';

// 모든 버튼을 선택
const menus = document.querySelectorAll('.menus button');

// 각 메뉴 버튼에 클릭 이벤트 리스너를 추가
// 클릭 이벤트가 발생하면 getCategoryNews 함수를 호출
menus.forEach((menu) => menu.addEventListener('click', (event) => {
  if (window.innerWidth <= 1000) {
    getCategoryNews(event);
    menuBox.classList.remove('show');
  } else {
    getCategoryNews(event);
  }
}));

// 검색 아이콘 선택
const searchIcon = document.querySelector('.fa-search');
// 검색 아이콘에 클릭 이벤트 리스너 추가
// 클릭 이벤트가 발생하면 search-wrap 클래스를 가진 요소에 hide 클래스를 추가/제거
searchIcon.addEventListener('click', () => {
  const searchBox = document.querySelector('.search-wrap');
  searchBox.classList.toggle('hide');
})

const userInput = document.getElementById('search-input');
const searchBtn = document.querySelector('.search-button');

let totalResults = 0;
let page = 1;
const pageSize = 10;
const groupSize = 5;

// 현재 카테고리를 저장할 변수 선언
let category = '';
// 현재 검색어를 저장할 변수 선언
let keyWord = '';


// 브라우저 사이즈 1000px 이하 인 경우 showMobileMenu 함수 호출
const checkWindowSize = () => {
  if (window.innerWidth <= 1000) {
    // 화면 크기가 작으면 햄버거 메뉴 버튼 보이기
    mobileMenu.classList.remove('hide');
    // 화면 크기가 작으면 닫기 버튼 보이기
    closeBtn.classList.remove('hide');
  } else {
    // 화면 크기가 커지면 햄버거 메뉴 버튼 숨김
    mobileMenu.classList.add('hide');
    // 화면 크기가 커지면 메뉴를 자동으로 닫기
    menuBox.classList.remove('show');
    // 화면 크기가 커지면 닫기 버튼 숨김
    closeBtn.classList.add('hide');
  }
}

// 페이지 로드 시 사이즈 체크
window.addEventListener('load', () => {
  checkWindowSize();
});

// 창 크기 조절 시 사이즈 체크
window.addEventListener('resize', () => {
  checkWindowSize();
});

mobileMenu.addEventListener('click', () => {
  menuBox.classList.add('show');
  closeBtn.classList.remove('hide');
  closeBtn.classList.add('show');
});

closeBtn.addEventListener('click', () => {
  menuBox.classList.remove('show');
});


// API 호출을 위한 URL 객체 생성 함수
const createURL = (params = {}, params2 = {}, params3 = {}) => {
    // 파라미터를 하나의 객체로 병합
    const mergedParams = { ...params, ...params2, ...params3 };

    // API 호출을 위한 URL 객체 생성
    const url = new URL(
      `https://ziitteo-times.netlify.app/top-headlines?` + new URLSearchParams(mergedParams).toString()
    );
  // fetchNews 함수 호출
  fetchNews(url);
}

// API 호출 및 응답 데이터 처리 후 화면에 뉴스를 렌더링하는 함수
const fetchNews = async (url) => {
  try {
    // API 호출 및 응답 데이터 처리
    const response = await fetch(url);
    const data = await response.json();

    if (response.status === 200) {
      // 검색 결과가 없는 경우 에러 메시지 출력
      if (data.articles.length === 0) {
        throw new Error('No results for this keyword. Please try another keyword.');
      }
      // 중복 뉴스 제거 후 뉴스 리스트에 저장
      newsList = removeDuplicates(data.articles);
      totalResults = data.totalResults;
      render();
      paginationRender();
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    errorRender(error.message);
  }
};

// 최신 뉴스를 가져오는 비동기 함수
const getLatesNews = async () => {
  //URL 객체 생성 함수 호출
  createURL();
}

// 카테고리별 뉴스를 가져오는 비동기 함수
const getCategoryNews = async (event) => {
  // 카테고리 텍스트를 소문자로 변환하여 변수에 저장
  category = event.target.textContent.toLowerCase();
  // 카테고리 선택하면 검색어 초기화
  keyWord = '';
  // 페이지 초기화
  page = 1;
  //URL 객체 생성 함수 호출
  createURL({ category });
}

// 키워드로 뉴스를 검색하는 비동기 함수
const getKeywordNews = async () => {
  // 사용자 입력값을 변수에 저장
  keyWord = userInput.value;
  // 입력 필드 초기화
  userInput.value = '';
  // 키워드로 검색하면 카테고리 초기화
  category = '';
  // 페이지 초기화
  page = 1;
  //URL 객체 생성 함수 호출
  createURL({ q: keyWord });
}

// 중복된 뉴스를 제거하는 함수
const removeDuplicates = (articles) => {
  // 중복되지 않은 뉴스 기사를 저장할 배열과 제목을 저장할 집합 생성
  const uniqueArticles = [];
  const seenTitles = new Set();

  // 각 기사에 대해 중복 여부 확인 및 처리
  for (const article of articles) {
    // 제목이 이미 본 적 없는 경우
    if (!seenTitles.has(article.title)) {
      // 제목을 집합에 추가하고, 기사 배열에 추가
      seenTitles.add(article.title);
      uniqueArticles.push(article);
    }
  }

  // 중복되지 않은 기사 배열 반환
  return uniqueArticles;
}


// news.urlToImage 이미지가 없는 경우 대체 이미지로 교체
// onerror는 이미지 로딩이 실패했을 때 발생하는 이벤트로, 이미지 로딩에 실패하면 대체 이미지로 교체
// 뉴스 데이터를 화면에 렌더링하는 함수
const render = () => {
  // 뉴스 리스트를 HTML 문자열로 변환
  const newsHTML = newsList.map(
      (news) => `<div class="row news">
        <div class="col-lg-4">
          <img class="news-img-size" 
           src="${news.urlToImage || noImage}" alt="" 
           onerror="this.onerror=null;this.src=noImage;" /> 
        </div>
        <div class="col-lg-8">
          <h2><a href=${news.url} target="_blank">${news.title}</a></h2>
          <p>
           ${
            // 삼항 연산자를 사용하여 description이 존재하는지 확인
            news.description 
            // description이 200자를 초과하는지 확인
            ? (news.description.length > 200 
            // 200자를 넘으면 200자까지만 반환
            ? news.description.substring(0, 200) + "..." 
            // 200자를 넘지 않으면 그대로 반환
            : news.description) 
            // description이 없으면 내용없음 반환
            : "내용없음"}
          </p>
          <div>
            ${news.source.name || "no source"} * ${moment(news.publishedAt).fromNow()}
          </div>
        </div>
      </div>`
    ).join('');

  // 변환된 HTML 문자열을 news-board 요소에 삽입
  newsBoard.innerHTML = newsHTML;
}

const errorRender = (errorMessage) => {
  const errorHTML = 
    `<div class="alert alert-danger alert-box" role="alert">
      ${errorMessage}
    </div>`;
  // 변환된 HTML 문자열을 news-board 요소에 삽입
  newsBoard.innerHTML = errorHTML;
}

// 검색 버튼 클릭 시 getKeywordNews 함수 호출
searchBtn.addEventListener('click', getKeywordNews);

// input 창에서 엔터키를 누르면 getKeywordNews 함수 호출
userInput.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    getKeywordNews();
  }
})

// 페이지네이션 렌더링 함수
const paginationRender = () => {
  // totalResult 전체 뉴스 개수
  // page 현재 페이지
  // pageSize 한 페이지에 보여줄 뉴스 개수
  // groupSize 페이지 그룹 개수

  // pageGroup 현재 페이지 그룹
  const pageGroup = Math.ceil( page / groupSize);
  // totalPage 전체 페이지 개수
  const totalPages = Math.ceil(totalResults / pageSize);
  // lastPage 마지막 페이지
  let lastPage = pageGroup * groupSize;
  // 마지막 페이지그룹이 그룹사이즈보다 작은 경우 lastPage를 totalPage로 설정
  if ( lastPage > totalPages) {
    lastPage = totalPages;
  }

  // firstPage 첫 페이지
  const firstPage = lastPage - (groupSize - 1) <= 0 ? 1 : lastPage - (groupSize - 1);
 
  let paginationHTML = ``;

  if (page > 1) { 
    paginationHTML += ` 
      <li class="my-page-item center" onClick="moveToPage(${1})">
        <a class="page-link center" href="#" aria-label="Previous">
          <span aria-hidden="true"><i class="fas fa-solid fa-angles-left"></i></span>
        </a>
      </li>
 
      <li class="page-item center" onClick="moveToPage(${page - 1})">
        <a class="page-link center" href="#" aria-label="Previous">
          <span aria-hidden="true"><i class="fas fa-solid fa-chevron-left"></i></span>
        </a>
      </li>
    `
  }

  for(let i = firstPage; i <= lastPage; i++) {
    paginationHTML += ` 
    <li class="page-item ${i === page ? "active" : ""} center" onClick="moveToPage(${i})" >
      <a href="#" class="page-link center" >${i}</a>
    </li>`;
  }

  if (page < totalPages) {
    paginationHTML += ` 
      <li class="page-item center" onClick="moveToPage(${page + 1})">
        <a class="page-link center" href="#" aria-label="Next">
          <span aria-hidden="true"><i class="fas fa-solid fa-chevron-right"></i></span>
        </a>
      </li>
      <li class="page-item center" onClick="moveToPage(${totalPages})">
        <a class="page-link center" href="#" aria-label="Last">
          <span aria-hidden="true"><i class="fa-solid fa-angles-right"></i></span>
        </a>
      </li>
     `
    }

    document.querySelector('.pagination').innerHTML = paginationHTML;
  }


  const moveToPage = (pageNum) => {
    console.log(pageNum);
    page = pageNum;
    
    if (category) {
      createURL({ category, page, pageSize });
    } else if (keyWord) {
      createURL({ q: keyWord, page, pageSize });
    } else {
      createURL({ page, pageSize });
    }
  }


// 초기 뉴스 로드
getLatesNews();
