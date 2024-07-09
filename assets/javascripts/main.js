const API_KEY = `0b4d6097f98643fd96713fd37337e51a`

const getLatesNews = async () => {
  const url = new URL(`https://newsapi.org/v2/top-headlines?country=kr&apiKey=${API_KEY}`);
  
  const response = await fetch(url); 
  const data = response.json();
  let news = data.articles;
  console.log(news);
}

getLatesNews();
