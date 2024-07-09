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


const render = () => {
  const newsHTML = newsList.map(
      (news) => `<div class="row news">
        <div class="col-lg-4">
          <img class="news-img-size" 
            src=${news.urlToImage} alt="" />
        </div>
        <div class="col-lg-8">
          <h2>${news.title}</h2>
          <p>
            ${news.description}
          </p>
          <div>
            ${news.source.name} * ${news.publishedAt}
          </div>
        </div>
      </div>`
    ).join('');

  document.getElementById("news-board").innerHTML = newsHTML;
}


getLatesNews();
