import News from "../components/News/classes/News.js";
import "../components/News/css/style.css";


document.addEventListener("DOMContentLoaded", () => {
  const parentNode = document.querySelector('.Frontend');
  
  const news = new News(parentNode);
});
