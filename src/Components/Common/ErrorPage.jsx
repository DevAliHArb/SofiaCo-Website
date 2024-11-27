// ErrorPage.js
import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const ErrorPage = () => {
    const language = useSelector((state) => state.products.selectedLanguage[0].Language);

  return (
    <div style={{ position:'relative',textAlign: 'center', margin: '3em auto 5em auto' ,fontFamily:"var(--font-family)"}}>
      <h1 style={{fontSize:'calc(6rem + 2vw)',margin:"0 auto"}}>{language === 'fr' ? "404" : "404"}</h1>
      <h1 style={{fontSize:'calc(2rem + .5vw)',margin:"0 auto"}}>Oops!</h1>
      <h1 style={{fontSize:'calc(1.3rem + .4vw)'}}>{language === 'fr' ? "Error 404 - Page non trouvée" : "Error 404 - Page Not Found"}</h1>
      <p style={{fontSize:'calc(.9rem + .3vw)'}}>{language === 'fr' ? "Désolé, la page que vous recherchez n'existe pas." : "Sorry, the page you are looking for does not exist."}</p>
      <Link to="/">{language === 'fr' ? "Retour à l'accueil" : "Go back to Home"}</Link>
    </div>  
  );
};

export default ErrorPage;
