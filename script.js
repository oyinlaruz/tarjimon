const fromLanguage = document.getElementById("fromLanguage");
const toLanguage = document.getElementById("toLanguage");

const inputText = document.getElementById("inputText");
const outputText = document.getElementById("outputText");

const translateBtn = document.getElementById("translateBtn");
const clearBtn = document.getElementById("clearBtn");
const copyBtn = document.getElementById("copyBtn");
const swapBtn = document.getElementById("swapBtn");

const charCount = document.getElementById("charCount");
const status = document.getElementById("status");


// Belgilar sonini hisoblash
inputText.addEventListener("input", function () {

    charCount.textContent = inputText.value.length;

    if (inputText.value.length > 5000) {
        inputText.value = inputText.value.substring(0, 5000);
    }

});


// Tarjima qilish
translateBtn.addEventListener("click", async function () {

    const text = inputText.value.trim();

    const from = fromLanguage.value;
    const to = toLanguage.value;

    if (!text) {
        status.textContent = "⚠️ Avval matn kiriting!";
        return;
    }

    if (from === to) {
        outputText.value = text;
        status.textContent = "✅ Tillar bir xil.";
        return;
    }

    translateBtn.disabled = true;

    translateBtn.textContent = "⏳ Tarjima qilinmoqda...";

    status.textContent = "Tarjima serverdan olinmoqda...";

    try {

        const url =
            `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Server xatosi");
        }

        const data = await response.json();

        if (
            data &&
            data.responseData &&
            data.responseData.translatedText
        ) {

            outputText.value =
                data.responseData.translatedText;

            status.textContent =
                "✅ Tarjima muvaffaqiyatli bajarildi.";

        } else {

            throw new Error("Tarjima topilmadi");

        }

    } catch (error) {

        console.error(error);

        outputText.value = "";

        status.textContent =
            "❌ Tarjima qilishda xatolik yuz berdi.";

    }

    translateBtn.disabled = false;

    translateBtn.textContent = "🌐 Tarjima qilish";

});


// Tillarni almashtirish
swapBtn.addEventListener("click", function () {

    const oldFrom = fromLanguage.value;

    fromLanguage.value = toLanguage.value;

    toLanguage.value = oldFrom;

    const oldText = inputText.value;

    inputText.value = outputText.value;

    outputText.value = oldText;

    charCount.textContent = inputText.value.length;

});


// Tozalash
clearBtn.addEventListener("click", function () {

    inputText.value = "";

    outputText.value = "";

    charCount.textContent = "0";

    status.textContent = "";

});


// Nusxalash
copyBtn.addEventListener("click", async function () {

    if (!outputText.value) {

        status.textContent =
            "⚠️ Nusxalash uchun tarjima mavjud emas.";

        return;
    }

    try {

        await navigator.clipboard.writeText(
            outputText.value
        );

        status.textContent =
            "📋 Tarjima nusxalandi!";

    } catch (error) {

        outputText.select();

        document.execCommand("copy");

        status.textContent =
            "📋 Tarjima nusxalandi!";

    }

});