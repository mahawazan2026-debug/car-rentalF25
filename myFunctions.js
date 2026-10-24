// هاد الجزء الصغير بس بيستخدم جي كويري مشان إظهار وإخفاء التفاصيل متل طلب الوظيفة
$(document).ready(function() {
    $('.action-toggle-details').click(function() {
        var postCard = $(this).closest('.fb-post-card');
        postCard.find('.fb-post-details').slideToggle(200);
        $(this).toggleClass('activated');
    });

    // كبسة المتابعة مشان تفتح الفورم الجانبي
    $('#fbBtnContinue').click(function() {
        // فحص عدد السيارات المحددة بجافا سكريبت صافية
        var checkBoxes = document.getElementsByClassName('fb-hidden-check');
        var selectedCount = 0;
        for (var i = 0; i < checkBoxes.length; i++) {
            if (checkBoxes[i].checked) {
                selectedCount++;
            }
        }
        
        if (selectedCount === 0) {
            alert('يا غالي، لازم تحدد سيارة وحدة على الأقل من المنشورات قبل ما تتابع!');
        } else {
            // إظهار الفورم بجافا سكريبت صافية بدون جي كويري
            document.getElementById('fbFormSection').style.display = 'block';
        }
    });

    // كبسة تحديد السيارة عند الضغط على الزر الفيس بوكي
    $('.action-select-car').click(function() {
        var checkbox = this.querySelector('.fb-hidden-check');
        if (checkbox.checked) {
            checkbox.checked = false;
            this.classList.remove('activated');
        } else {
            checkbox.checked = true;
            this.classList.add('activated');
        }
    });
});


// ==========================================
// هون شغل الجافا معقدة شوي  
// تبع فحص الفورم والمدخلات والحسابات
// ==========================================
function validateFacebookOrder() {
    // سحب عناصر وعمل جافا سكريبت صافية باستخام DOM
    var nameField = document.getElementById('fullName').value.trim();
    var idField = document.getElementById('nationalId').value.trim();
    var dateStartStr = document.getElementById('startDate').value;
    var dateEndStr = document.getElementById('endDate').value;
    var phoneField = document.getElementById('mobile').value.trim();
    var emailField = document.getElementById('email').value.trim();

    // 1. تدقيق الاسم: حروف عربية وفراغات فقط بالجافا سكريبت
    var filterArabic = /^[\u0600-\u06FF\s]+$/;
    if (nameField !== "" && !filterArabic.test(nameField)) {
        alert('خطأ بالاسم: لازم تكتب اسمك بالحروف العربية وبس.');
        return false;
    }

    // 2. تدقيق الرقم الوطني (إلزامي 11 خانة ومن المحافظات السورية)
    if (idField === "") {
        alert('الرقم الوطني حقل إلزامي، ما بصير تتركه فاضي!');
        return false;
    }
    if (idField.length !== 11 || isNaN(idField)) {
        alert('الرقم الوطني السوري لازم يتألف من 11 رقم تماماً.');
        return false;
    }
    var provinceCode = parseInt(idField.substring(0, 2));
    if (provinceCode < 1 || provinceCode > 14) {
        alert('أول خانتين بالرقم الوطني لازم يطابقوا كود محافظة سورية صحيحة (من 01 لـ 14).');
        return false;
    }

    // 3. تدقيق التواريخ والتسلسل الزمني بجافا سكريبت
    if (dateStartStr === "" || dateEndStr === "") {
        alert('تواريخ بداية ونهاية الإيجار حقول إلزامية لازم تحددها.');
        return false;
    }

    var startObj = new Date(dateStartStr);
    var endObj = new Date(dateEndStr);

    if (endObj <= startObj) {
        alert('تاريخ نهاية التأجير لازم يكون بعد تاريخ البداية، مو قبلو ولا بنفس اليوم.');
        return false;
    }

    // حساب عدد أيام الإيجار (عملية حسابية بحتة بجافا سكريبت)
    var timeDiff = Math.abs(endObj - startObj);
    var totalDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    // 4. تدقيق الموبايل السوري (سيرياتيل أو MTN)
    if (phoneField !== "") {
        var mobileRegex = /^09\d{8}$/;
        if (!mobileRegex.test(phoneField)) {
            alert('رقم الموبايل مو متوافق مع شبكات سوريا، لازم يبلش بـ 09 ويكون طوله 10 أرقام.');
            return false;
        }
    }

    // 5. تدقيق الإيميل بصيغة قياسية
    if (emailField !== "") {
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailField)) {
            alert('صيغة البريد الإلكتروني غير صالحة، يرجى التأكد منها.');
            return false;
        }
    }

    // حساب الفاتورة وتجميع السيارات المختارة بالجافا سكريبت الصافية (حلقات ومصفوفات)
    var selectedCars = [];
    var pricePerDaySum = 0;
    
    // سحب البوستات والتشيك بوكس عن طريق كود جافا سكريبت كلاسيكي
    var allCards = document.getElementsByClassName('fb-post-card');
    for (var i = 0; i < allCards.length; i++) {
        var chk = allCards[i].querySelector('.fb-hidden-check');
        if (chk && chk.checked) {
            // سحب اسم السيارة
            var carName = allCards[i].querySelector('.car-hidden-name').textContent;
            // سحب السعر اليومي
            var priceElement = allCards[i].querySelector('.fb-post-price-tag');
            var carPrice = parseInt(priceElement.getAttribute('data-cost'));
            
            selectedCars.push(carName);
            pricePerDaySum += carPrice;
        }
    }

    // العمليات الحسابية النهائية للفاتورة والخصم 10%
    var rawTotal = pricePerDaySum * totalDays;
    var discountAmount = 0;
    var finalPayable = rawTotal;

    if (totalDays > 7) {
        discountAmount = rawTotal * 0.10;
        finalPayable = rawTotal - discountAmount;
    }

    // طباعة نافذة النتيجة النهائية المحددة بسلم التصحيح
    var report = "👍 تم قبول طلب الحجز ومعالجة البيانات بنجاح (Pure JS) 👍\n\n";
    report += "السيارات المطلوبة: " + selectedCars.join(' - ') + "\n";
    report += "مدة التأجير: " + totalDays + " أيام\n";
    report += "المجموع قبل الخصم: " + rawTotal.toLocaleString() + " ل.س\n";
    if (discountAmount > 0) {
        report += "حسم الـ 10% (لتجاوز 7 أيام): " + discountAmount.toLocaleString() + " ل.س\n";
    }
    report += "المبلغ الصافي النهائي المترتب للدفع: " + finalPayable.toLocaleString() + " ل.س\n\n";
    report += "شكراً لك!";

    alert(report);
    return false; // لمنع تحديث الصفحة مشان تضل النتيجة ظاهرة
}
