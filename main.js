const API_KEY = `0b4d6097f98643fd96713fd37337e51a`

const getLatesNews = async () => {
  const url = new URL(
    `https://ziitteo-times.netlify.app/top-headlines`
  );
  
  const response = await fetch(url); 
  const data = response.json();
  let news = data.articles;
  console.log(news);
}

getLatesNews();
