function changeLanguageAndReload(lang) {
    localStorage.setItem('lang', lang);
    const url = new URL(window.location.href);
    url.searchParams.set('lang', lang);

    // Reload the window with the updated URL
    window.location.href = url.toString();
}

document.addEventListener('DOMContentLoaded', async function () {
    const urlParams = new URLSearchParams(window.location.search);
    let lang = urlParams.get('lang');

    if (!lang) {
        lang = urlParams.get('lang') || localStorage.getItem('lang') || document.documentElement.lang || 'fr';


        const url = new URL(window.location.href);
        url.searchParams.set('lang', lang);
        window.location.href = url.toString();
    } else {
        const translations = await fetchTranslations();
        if (translations) {
            initializePage(translations);
        } else {
            console.error('Failed to load translations');
        }
    }
});

async function fetchTranslations() {
    try {
        const response = await fetch('../Language/translations.json');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching translations:', error);
        return null;
    }
}

function initializePage(translations) {
    const urlParams = new URLSearchParams(window.location.search);
    let lang = urlParams.get('lang') || localStorage.getItem('lang') || document.documentElement.lang || 'fr';

    document.documentElement.lang = lang;

    changeLanguage(translations, lang);
    setupFlags(lang);
}

function setupFlags(lang) {
    const flagContainer1 = document.getElementById("flag1");
    const flagContainer2 = document.getElementById("flag2");
    const flagContainer3 = document.getElementById("flag3");

    // Remove existing event listeners
    flagContainer1.removeEventListener('click', changeLanguageAndReload);
    flagContainer2.removeEventListener('click', changeLanguageAndReload);
    flagContainer3.removeEventListener('click', changeLanguageAndReload);

    // Set up flags based on selected language
    if (lang === 'fr') {
        flagContainer1.innerHTML = '<img src="../Assets/frflag.svg" alt="Flag 1">';
        flagContainer2.innerHTML = '<img src="../Assets/ukflag.svg" alt="Flag 2">';
        flagContainer3.innerHTML = '<img src="../Assets/cnkoflag.svg" alt="Flag 3">';
        flagContainer2.addEventListener('click', () => {
            changeLanguageAndReload('en');
        });
        flagContainer3.addEventListener('click', () => {
            changeLanguageAndReload('cnko');
        });
    } else if (lang === 'en') {
        flagContainer1.innerHTML = '<img src="../Assets/ukflag.svg" alt="Flag 1">';
        flagContainer2.innerHTML = '<img src="../Assets/cnkoflag.svg" alt="Flag 2">';
        flagContainer3.innerHTML = '<img src="../Assets/frflag.svg" alt="Flag 3">';
        flagContainer2.addEventListener('click', () => {
            changeLanguageAndReload('cnko');
        });
        flagContainer3.addEventListener('click', () => {
            changeLanguageAndReload('fr');
        });
    } else if (lang === 'cnko') {
        flagContainer1.innerHTML = '<img src="../Assets/cnkoflag.svg" alt="Flag 1">';
        flagContainer2.innerHTML = '<img src="../Assets/frflag.svg" alt="Flag 2">';
        flagContainer3.innerHTML = '<img src="../Assets/ukflag.svg" alt="Flag 3">';
        flagContainer2.addEventListener('click', () => {
            changeLanguageAndReload('fr');
        });
        flagContainer3.addEventListener('click', () => {
            changeLanguageAndReload('en');
        });
    }
}

function changeLanguage(translations, lang) {
    const langTranslations = translations[lang];
    const translatableElements = document.querySelectorAll('.translatable');

    translatableElements.forEach(element => {
        const key = element.dataset.translationKey;
        if (element.tagName === 'INPUT') {
            if (element.type === 'file') {
                element.title = langTranslations[key];
            } else {
                element.placeholder = langTranslations[key];
                if (element.type === 'submit') {
                    element.value = langTranslations[key];
                }
            }
        } else {
            element.textContent = langTranslations[key];
        }
    });
}
