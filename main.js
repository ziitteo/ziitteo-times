const API_KEY = `0b4d6097f98643fd96713fd37337e51a`

let = newsList = [];

const getLatesNews = async () => {
  const url = new URL(
    `https://ziitteo-times.netlify.app/top-headlines`
  );
  
  const response = await fetch(url); 
  const data = await response.json();
  newsList = data.articles;
  render();
  console.log(newsList);
}

// news.urlToImage 이미지가 없는 경우 대체 이미지로 교체
// onerror는 이미지 로딩이 실패했을 때 발생하는 이벤트로, 이미지 로딩에 실패하면 대체 이미지로 교체
const render = () => {
  const newsHTML = newsList.map(
      (news) => `<div class="row news">
        <div class="col-lg-4">
          <img class="news-img-size" 
           src="${news.urlToImage || 'https://upload.wikimedia.org/wikipedia/commons/d/d1/Image_not_available.png'}" alt="" 
           onerror="this.onerror=null;this.src='https://upload.wikimedia.org/wikipedia/commons/d/d1/Image_not_available.png';" /> 
        </div>
        <div class="col-lg-8">
          <h2>${news.title}</h2>
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

  document.getElementById("news-board").innerHTML = newsHTML;
}


getLatesNews();
