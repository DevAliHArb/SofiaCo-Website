// ErrorPage.js
import React from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

const ErrorPage = () => {
    const language = useSelector((state) => state.products.selectedLanguage[0].Language);
    const navigate = useNavigate();

  return (
    <div style={{ position:'relative',textAlign: 'center', margin: '3em auto 5em auto' ,fontFamily:"var(--font-family)"}}>
      <h1 style={{fontSize:'calc(6rem + 2vw)',margin:"0 auto"}}>{language === 'fr' ? "404" : "404"}</h1>
      <h1 style={{fontSize:'calc(2rem + .5vw)',margin:"0 auto"}}>Oops!</h1>
      <h1 style={{fontSize:'calc(1.3rem + .4vw)'}}>{language === 'fr' ? "Error 404 - Page non trouvée" : "Error 404 - Page Not Found"}</h1>
      <p style={{fontSize:'calc(.9rem + .3vw)'}}>{language === 'fr' ? "Désolé, la page que vous recherchez n'existe pas." : "Sorry, the page you are looking for does not exist."}</p>
      <button style={{background:'var(--primary-color)', border:'none',cursor:"pointer", padding:'1em 3em',color:"#fff", borderRadius:".7em",margin:'2em auto'}} onClick={()=>navigate("/")}>
        {language === 'fr' ? "Retour à l'accueil" : "Go back to Home"}
      </button>
    </div>  
  );
};

export default ErrorPage;
