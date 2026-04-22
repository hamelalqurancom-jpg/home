// Mock Data for demonstration in case Firebase is not configured yet

// Mock Data for demonstration
const mockProperties = [
    {
        id: '1',
        title: 'فيلا فاخرة بتشطيب سوبر لوكس',
        type: 'villa',
        price: 2500000,
        area: 'center',
        description: 'فيلا راقية جداً في وسط مسير، قريبة من جميع الخدمات. تحتوي على حديقة خاصة وجراج.',
        imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        brokerPhone: '01000000000',
        brokerWhatsApp: '201000000000'
    },
    {
        id: '2',
        title: 'شقة سكنية مساحة 150 متر',
        type: 'apartment',
        price: 650000,
        area: 'north',
        description: 'شقة نصف تشطيب، 3 غرف وصالة وحمام ومطبخ. موقع متميز جداً تطل على شارع رئيسي.',
        imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        brokerPhone: '01111111111',
        brokerWhatsApp: '201111111111'
    },
    {
        id: '3',
        title: 'محل تجاري للبيع',
        type: 'shop',
        price: 900000,
        area: 'south',
        description: 'محل تجاري بموقع حيوي مناسب لجميع الأنشطة التجارية والمطاعم.',
        imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        brokerPhone: '01222222222',
        brokerWhatsApp: '201222222222'
    }
];

document.addEventListener('DOMContentLoaded', async () => {
    const propertiesList = document.getElementById('propertiesList');
    const searchBtn = document.getElementById('searchBtn');
    let allProperties = []; // To store fetched properties for filtering

    // Display properties
    function displayProperties(properties) {
        if (!propertiesList) return;

        propertiesList.innerHTML = '';

        if (properties.length === 0) {
            propertiesList.innerHTML = '<div class="alert alert-error w-100" style="grid-column: 1 / -1;">عفواً، لا توجد عقارات مطابقة للبحث.</div>';
            return;
        }

        properties.forEach(prop => {
            const card = document.createElement('div');
            card.className = 'property-card';

            // Format price to currency
            const formatter = new Intl.NumberFormat('ar-EG', {
                style: 'currency',
                currency: 'EGP',
                maximumFractionDigits: 0
            });

            let areaName = prop.area === 'center' ? 'وسط البلد' : (prop.area === 'north' ? 'شمال مسير' : 'جنوب مسير');
            let typeName = prop.type === 'apartment' ? 'شقة' : (prop.type === 'house' ? 'منزل' : (prop.type === 'villa' ? 'فيلا' : (prop.type === 'land' ? 'أرض' : 'محل تجاري')));

            card.innerHTML = `
                <img src="${prop.imageUrl}" alt="${prop.title}" class="property-img">
                <div class="property-content">
                    <div class="property-price">${formatter.format(prop.price)}</div>
                    <h3 class="property-title">${prop.title}</h3>
                    
                    <div class="property-meta">
                        <span><i class="fa-solid fa-building"></i> ${typeName}</span>
                        <span><i class="fa-solid fa-location-dot"></i> ${areaName}</span>
                    </div>
                    
                    <p class="property-desc">${prop.description}</p>
                    
                    <div class="property-actions">
                        <a href="https://wa.me/${prop.brokerWhatsApp}" target="_blank" class="btn-whatsapp">
                            <i class="fa-brands fa-whatsapp"></i> واتساب
                        </a>
                        <a href="tel:${prop.brokerPhone}" class="btn-call">
                            <i class="fa-solid fa-phone"></i> اتصال
                        </a>
                    </div>
                </div>
            `;
            propertiesList.appendChild(card);
        });
    }

    // Fetch properties from Firestore
    async function loadProperties() {
        if (!propertiesList) return;
        
        try {
            if (typeof db !== 'undefined') {
                const snapshot = await db.collection('properties').orderBy('createdAt', 'desc').get();
                if (!snapshot.empty) {
                    allProperties = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                } else {
                    // Fallback to mock data if Firestore is empty
                    allProperties = mockProperties;
                }
            } else {
                allProperties = mockProperties;
            }
            displayProperties(allProperties);
        } catch (error) {
            console.error("Error fetching properties:", error);
            // Fallback to mock data if there's a config error
            allProperties = mockProperties;
            displayProperties(allProperties);
        }
    }

    // Initial load
    await loadProperties();

    // Filter Logic
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            const typeVal = document.getElementById('propertyType').value;
            const maxPriceVal = document.getElementById('maxPrice').value;
            const areaVal = document.getElementById('area').value;

            let filtered = allProperties.filter(prop => {
                let matchType = typeVal === 'all' || prop.type === typeVal;
                let matchArea = areaVal === 'all' || prop.area === areaVal;
                let matchPrice = !maxPriceVal || prop.price <= parseInt(maxPriceVal);

                return matchType && matchArea && matchPrice;
            });

            displayProperties(filtered);
        });
    }
});
