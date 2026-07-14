const lang = localStorage.getItem('userLang') || 
                 (navigator.language || 'en').split('-')[0] || 'en';
    const langs = ['en', 'it', 'de', 'fr', 'es'];
    const redirectLang = langs.includes(lang) ? lang : 'en';
    
    if (window.location.pathname === '/') {
        window.location.replace(`/${redirectLang}/`);
    }