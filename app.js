let currentLang = 'en';
let currentData = [];

const translations = {
    en: {
        heroTitle: "Welcome to Heritage Connect",
        heroDesc: "Your gateway to a safe and comfortable stay. We connect you with verified local services.",
        selectLabel: "Select City:",
        whatsappMsg: "Chat on WhatsApp",
        waGreeting: "Hello! I saw your service on Heritage Connect. I need details about "
    },
    ta: {
        heroTitle: "ஹெரிடேஜ் கனெக்ட் உங்களை வரவேற்கிறது",
        heroDesc: "பாதுகாப்பான மற்றும் வசதியான தங்குமிடத்திற்கான உங்கள் நுழைவாயில். சரிபார்க்கப்பட்ட உள்ளூர் சுற்றுலா சேவைகளுடன் உங்களை இணைக்கிறோம்.",
        selectLabel: "நகரத்தைத் தேர்ந்தெடுக்கவும்:",
        whatsappMsg: "வாட்ஸ்அப்பில் தொடர்பு கொள்ள",
        waGreeting: "வணக்கம்! ஹெரிடேஜ் கனெக்ட் மூலம் உங்கள் சேவையை பார்த்தேன். எனக்கு விவரங்கள் தேவை: "
    }
};

function switchLang(lang) {
    currentLang = lang;
    document.getElementById('hero-title').innerText = translations[lang].heroTitle;
    document.getElementById('hero-desc').innerText = translations[lang].heroDesc;
    document.getElementById('select-label').innerText = translations[lang].selectLabel;
    renderCards();
}

function updateMap(city) {
    const mapSection = document.getElementById('map-section');
    const mapIframe = document.getElementById('city-map-iframe');
    
    const mapUrls = {
        'madurai': 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3930.123!2d78.119!3d9.919!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zOcKwNTUnMDguNCJOIDc4wrAwNycwOC40IkU!5e0!3m2!1sen!2sin!4v1620000000000',
        'kanchi':  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3890.1!2d79.7!3d12.8!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDQ4JzAwLjAiTiA3OcKwNDInMDAuMCJF!5e0!3m2!1sen!2sin!4v1620000000001',
        'kumbakonam': 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3910.1!2d79.3!3d10.9!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTDCsDU0JzAwLjAiTiA3OcKwMTgnMDAuMCJF!5e0!3m2!1sen!2sin!4v1620000000002',
        'Thiruvannamalai': 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3897.1!2d79.0!3d12.2!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDEyJzAwLjAiTiA3OcKwMDAnMDAuMCJF!5e0!3m2!1sen!2sin!4v1620000000003' 
    };

    if (city && mapUrls[city]) {
        mapSection.classList.remove('hidden');
        mapIframe.src = mapUrls[city];
    } else {
        mapSection.classList.add('hidden');
        mapIframe.src = ""; 
    }
}

async function loadCityData() {
    const city = document.getElementById('citySelect').value;
    if (!city) {
        currentData = [];
        renderCards();
        updateMap(null);
        return;
    }

    try {
        const response = await fetch(`./data/${city}.json`);
        currentData = await response.json();
        renderCards();
        updateMap(city);
    } catch (error) {
        console.error("Error loading city data:", error);
        document.getElementById('card-container').innerHTML = "<p class='text-center col-span-full'>Data coming soon! / விரைவில் வரும்!</p>";
        updateMap(null);
    }
}

function renderCards() {
    const container = document.getElementById('card-container');
    container.innerHTML = "";

    currentData.forEach(item => {
        const card = document.createElement('div');
        card.className = "bg-white p-6 rounded-xl border-t-4 border-red-900 card-shadow card-hover flex flex-col justify-between transition-transform hover:scale-105";
        
        const name = currentLang === 'en' ? item.name_en : item.name_ta;
        const service = currentLang === 'en' ? item.service_en : item.service_ta;
        const rates = currentLang === 'en' ? item.rates_en : item.rates_ta;

        card.innerHTML = `
            <div>
                <p class="text-xs font-bold text-red-700 uppercase tracking-widest mb-1">${service}</p>
                <h3 class="text-xl font-bold mb-2">${name}</h3>
                <p class="text-gray-600 mb-4">${rates}</p>
            </div>
            <a href="https://wa.me/${item.phone}?text=${encodeURIComponent(translations[currentLang].waGreeting + service)}" 
               target="_blank"
               class="bg-green-600 text-white text-center py-3 rounded-lg font-bold hover:bg-green-700 transition flex items-center justify-center gap-2">
               💬 ${translations[currentLang].whatsappMsg}
            </a>
        `;
        container.appendChild(card);
    });
}

// Item 4: Search/Filter Logic
function filterCards() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const cards = document.querySelectorAll('#card-container > div');

    cards.forEach(card => {
        const text = card.innerText.toLowerCase();
        card.style.display = text.includes(query) ? "flex" : "none";
    });
}

// Contact Form Handler with 91 check and Spinner
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.querySelector('#contact-us form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(contactForm);
            const phone = formData.get('phone');
            const submitBtn = contactForm.querySelector('button');
            const originalBtnText = submitBtn.innerHTML;

            if (!phone.startsWith('91') || phone.length < 12) {
                alert(currentLang === 'en' ? "Please start number with 91" : "தயவுசெய்து 91 இல் தொடங்கவும்");
                return;
            }

            submitBtn.disabled = true;
            submitBtn.innerHTML = `<span class="animate-spin inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></span> Processing...`;

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    contactForm.innerHTML = `<div class="text-center p-10 bg-green-50 rounded-xl border-2 border-green-200"><h3 class="text-xl font-bold text-green-800">✅ Sent Successfully!</h3><button onclick="location.reload()" class="mt-4 underline">Send another</button></div>`;
                } else { throw new Error(); }
            } catch (err) {
                alert("Error sending message.");
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }
});