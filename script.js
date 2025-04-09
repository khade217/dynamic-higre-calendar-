document.addEventListener('DOMContentLoaded', function() {
    const calendarContainer = document.getElementById('calendar-container');
    const langBtn = document.getElementById('langBtn');
    const title = document.getElementById('calendar-title');
    const darkToggle = document.getElementById('darkToggle');
    const body = document.body;

    const hijriMonths = [
        { name: "Muharram", days: 30 },
        { name: "Safar", days: 29 },
        { name: "Rabi' al-Awwal", days: 30 },
        { name: "Rabi' al-Thani", days: 29 },
        { name: "Jumada al-Awwal", days: 30 },
        { name: "Jumada al-Thani", days: 29 },
        { name: "Rajab", days: 30 },
        { name: "Sha'ban", days: 29 },
        { name: "Ramadan", days: 30 },
        { name: "Shawwal", days: 29 },
        { name: "Dhu al-Qi'dah", days: 30 },
        { name: "Dhu al-Hijjah", days: 29 },
    ];

    const hijriMonthNamesArabic = [
        "محرم", "صفر", "ربيع الأول", "ربيع الآخر", "جمادى الأولى", "جمادى الآخرة",
        "رجب", "شعبان", "رمضان", "شوال", "ذو القعدة", "ذو الحجة"
    ];

    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const weekdaysArabic = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];

    const events = [
        { month: 8, day: 1, name: "Eid al-Fitr", nameAr: "عيد الفطر" },
        { month: 9, day: 9, name: "Arafat Day", nameAr: "يوم عرفة" },
        { month: 9, day: 10, name: "Eid al-Adha", nameAr: "عيد الأضحى" },
    ];

    let isArabic = false;
    let isDarkMode = false;

    function isLeapYear(year) {
        const leapYears = [2, 5, 7, 10, 13, 16, 18, 21, 24, 26, 29];
        return leapYears.includes(year % 30);
    }

    function getArabicNumber(num) {
        const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
        return num.toString().split('').map(digit => arabicNumbers[parseInt(digit)]).join('');
    }

    function getTodayHijri() {
        const today = new Date();
        const hijriDate = new Intl.DateTimeFormat('en-u-ca-islamic', {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric'
        }).format(today);
        
        const [month, day, year] = hijriDate.split('/').map(Number);
        return { month: month - 1, day, year };
    }

    function yearToGregorian(year, month, day) {
        const hijriBaseDate = new Date(622, 6, 16);
        const daysSinceHijriEpoch = calculateDaysSinceHijriEpoch(year, month, day);
        const gregorianDate = new Date(hijriBaseDate.getTime() + daysSinceHijriEpoch * 24 * 60 * 60 * 1000);
        return gregorianDate;
    }

    function calculateDaysSinceHijriEpoch(year, month, day) {
        let days = 0;
        for (let y = 1; y < year; y++) {
            days += (isLeapYear(y) ? 355 : 354);
        }
        for (let m = 0; m < month; m++) {
            days += hijriMonths[m].days;
        }
        days += day - 1;
        return days;
    }

    function renderCalendar() {
        calendarContainer.innerHTML = '';
        const year = 1446;
        hijriMonths[11].days = isLeapYear(year) ? 30 : 29;
        
        const todayHijri = getTodayHijri();

        hijriMonths.forEach((monthData, monthIndex) => {
            const monthName = isArabic ? hijriMonthNamesArabic[monthIndex] : monthData.name;

            const monthDiv = document.createElement('div');
            monthDiv.className = 'calendar-month mb-4';

            monthDiv.innerHTML += `<h3 class="month-title">${monthName} ${isArabic ? getArabicNumber(year) : year}</h3>`;

            const weekdaysDiv = document.createElement('div');
            weekdaysDiv.className = 'row weekdays';
            const dayNames = isArabic ? weekdaysArabic : weekdays;
            dayNames.forEach(dayName => {
                weekdaysDiv.innerHTML += `<div class="col">${dayName}</div>`;
            });
            monthDiv.appendChild(weekdaysDiv);

            let dayCount = 1;
            const firstDayOfMonth = new Date(yearToGregorian(year, monthIndex, 1)).getDay();
            const totalDays = monthData.days;

            for (let i = 0; i < 6; i++) {
                const row = document.createElement('div');
                row.className = 'row';
                for (let j = 0; j < 7; j++) {
                    const col = document.createElement('div');
                    col.className = 'col day';
                    
                    if ((i === 0 && j < firstDayOfMonth) || dayCount > totalDays) {
                        col.innerHTML = '';
                    } else {
                        col.innerText = isArabic ? getArabicNumber(dayCount) : dayCount;
                        
                        // Highlight today's date
                        if (todayHijri.year === year && todayHijri.month === monthIndex && todayHijri.day === dayCount) {
                            col.classList.add('today');
                        }
                        
                        // Add events
                        const event = events.find(e => e.month === monthIndex && e.day === dayCount);
                        if (event) {
                            col.classList.add('event', 'event-day');
                            col.title = isArabic ? event.nameAr : event.name;
                            col.setAttribute('aria-label', isArabic ? event.nameAr : event.name);
                        }
                        
                        dayCount++;
                    }
                    row.appendChild(col);
                }
                monthDiv.appendChild(row);
            }
            calendarContainer.appendChild(monthDiv);
        });
        
        title.textContent = isArabic ? `التقويم الهجري لعام ${getArabicNumber(year)}` : `Hijri Calendar ${year}`;
    }

    function toggleDarkMode() {
        isDarkMode = !isDarkMode;
        body.classList.toggle('dark-mode');
        darkToggle.querySelector('i').className = isDarkMode ? 'bi bi-sun' : 'bi bi-moon-stars';
        darkToggle.querySelector('span').textContent = isDarkMode ? 'Light Mode' : 'Dark Mode';
    }

    function toggleLanguage() {
        isArabic = !isArabic;
        langBtn.textContent = isArabic ? 'English' : 'عربي';
        renderCalendar();
    }

    // Initialize
    renderCalendar();
    
    // Event Listeners
    langBtn.addEventListener('click', toggleLanguage);
    darkToggle.addEventListener('click', toggleDarkMode);
});
