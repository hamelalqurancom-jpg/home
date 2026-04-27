document.addEventListener('DOMContentLoaded', async () => {
    const propertiesList = document.getElementById('propertiesList');
    const searchBtn = document.getElementById('searchBtn');
    let allProperties = [];

    // Display properties
    function displayProperties(properties) {
        if (!propertiesList) return;

        propertiesList.innerHTML = '';

        if (properties.length === 0) {
            propertiesList.innerHTML = '<div class="alert alert-error w-100" style="grid-column: 1 / -1; text-align: center; padding: 40px; background: #fff; border-radius: 12px; box-shadow: var(--shadow-sm);">عفواً، لا توجد عقارات مضافة حالياً.</div>';
            return;
        }

        properties.forEach(prop => {
            const card = document.createElement('div');
            card.className = 'property-card';

            const formatter = new Intl.NumberFormat('ar-EG', {
                style: 'currency',
                currency: 'EGP',
                maximumFractionDigits: 0
            });

            // Map types to Arabic labels if known, else use the raw value
            const typesMap = {
                'apartment': 'شقة',
                'house': 'منزل',
                'villa': 'فيلا',
                'land': 'أرض',
                'shop': 'محل تجاري'
            };
            let typeName = typesMap[prop.type] || prop.type || 'عقار';

            // Map areas to Arabic labels if known, else use raw value
            const areasMap = {
                'center': 'وسط البلد',
                'north': 'شمال مسير',
                'south': 'جنوب مسير'
            };
            let areaName = areasMap[prop.area] || prop.area || 'غير محدد';

            card.innerHTML = `
                <img src="${prop.imageUrl || 'https://placehold.co/600x400?text=بدون+صورة'}" alt="${prop.title}" class="property-img">
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
            if (typeof db !== 'undefined' && db) {
                const snapshot = await db.collection('properties').orderBy('createdAt', 'desc').get();
                allProperties = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                displayProperties(allProperties);
            } else {
                throw new Error("لم يتم تهيئة قاعدة البيانات بشكل صحيح.");
            }
        } catch (error) {
            console.error("Error fetching properties:", error);
            propertiesList.innerHTML = `<div class="alert alert-error" style="grid-column: 1 / -1; text-align: center; padding: 20px;">
                <i class="fa-solid fa-triangle-exclamation"></i> حدث خطأ أثناء تحميل البيانات: ${error.message || "تأكد من إعدادات Firebase"}
            </div>`;
        }
    }

    // Initial load
    loadProperties();

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
