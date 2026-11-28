import { validateCalculatorInputs } from "./calculator_validation.js";

const widgetGradeInput = document.querySelector("#grade");
const widgetDurationInput = document.querySelector("#duration");
const widgetCurrentScoreInput = document.querySelector("#nmt-score");
const widgetTargetScoreInput = document.querySelector("#target-score");
const widgetFormatInputs = document.querySelectorAll('input[name="format"]');
const contactGradeInput = document.querySelector("#contact-grade");
const contactDurationInput = document.querySelector("#contact-duration");
const contactFormatInput = document.querySelector("#format");
const contactCurrentScoreInput = document.querySelector("#contact-current-score");
const contactTargetScoreInput = document.querySelector("#contact-target-score");
const contactNameInput = document.querySelector("#name");
const calculatorRequestModeInput = document.querySelector('input[name="request-mode"][value="calculator"]');
const contactStudyInputs = [
    contactGradeInput,
    contactDurationInput,
    contactFormatInput,
    contactCurrentScoreInput,
    contactTargetScoreInput
];

const scoreGainOutput = document.querySelector("#score-gain");
const monthlyTempoOutput = document.querySelector("#monthly-tempo");
const selectedFormatOutput = document.querySelector("#selected-format");
const monthlyPriceOutput = document.querySelector("#monthly-price");
const totalPriceOutput = document.querySelector("#total-price");
const courseScheduleOutput = document.querySelector("#course-schedule");
const sendWarningOutput = document.querySelector("#send-warning");
const calculatorSubmitButton = document.querySelector("#calculator-submit");

const formatLabels = {
    group: "Група",
    "mini-group": "Мінігрупа",
    individual: "1:1"
};

const lessonPrices = {
    group: 150,
    "mini-group": 200,
    individual: 300
};

function formattedPrice(price) {
    return new Intl.NumberFormat("uk-UA", {
        maximumFractionDigits: 0
    }).format(price);
}

function blockSending() {
    sendWarningOutput.hidden = false;
    calculatorSubmitButton.classList.add("blocked");
    calculatorSubmitButton.setAttribute("aria-disabled", "true");
    calculatorSubmitButton.setAttribute("tabindex", "-1");
}

function allowSending() {
    sendWarningOutput.hidden = true;
    calculatorSubmitButton.classList.remove("blocked");
    calculatorSubmitButton.removeAttribute("aria-disabled");
    calculatorSubmitButton.removeAttribute("tabindex");
}

function transferCalculatorData() {
    const selectedFormatInput = Array.from(widgetFormatInputs).find((input) => input.checked);

    contactGradeInput.value = widgetGradeInput.value;
    contactDurationInput.value = widgetDurationInput.value;
    contactFormatInput.value = selectedFormatInput.value;
    contactCurrentScoreInput.value = widgetCurrentScoreInput.value;
    contactTargetScoreInput.value = widgetTargetScoreInput.value;
}

function setContactStudyFieldsLocked(locked) {
    contactStudyInputs.forEach((input) => {
        input.disabled = locked;
    });
}

function goToSending() {
    transferCalculatorData();
    calculatorRequestModeInput.checked = true;
    setContactStudyFieldsLocked(true);
    contactNameInput.focus();

    contactNameInput.classList.remove("error", "success");
    contactCurrentScoreInput.classList.add("success"),
    contactTargetScoreInput.classList.add("success"),
    contactDurationInput.classList.add("success")
}

function validateRealisticTempo(currentScore, targetScore, durationInMonths) {
    const scoreGain = targetScore - currentScore;
    const tempoWarning = document.querySelector("#tempo-warning");

    const minimumDuration = Math.ceil(scoreGain / 12);
    const maximumDuration = Math.ceil(scoreGain / 6);

    if (durationInMonths < minimumDuration) {
        const maximumScore = Math.min(200, currentScore + durationInMonths * 12);
        tempoWarning.textContent =
            `Темп занадто високий: за поточну тривалість можна досягати до ${maximumScore} балів. ` +
            `Рекомендована тривалість: ${minimumDuration} місяців.`;
        tempoWarning.hidden = false;
        return false;
    }

    if (durationInMonths > maximumDuration) {
        const recommendedDuration = Math.ceil(scoreGain / 6);
        const recommendedTarget = Math.min(200, currentScore + durationInMonths * 6);
        tempoWarning.textContent =
            `Темп занадто низький: ціль можна досягти за ${recommendedDuration} місяців. ` +
            `За поточну тривалість реалістичний результат — до ${recommendedTarget} балів.`;
        tempoWarning.hidden = false;
        return false;
    }

    tempoWarning.hidden = true;
    return true;
}

function recomputeIfInputsAreValid() {
    if (!validateCalculatorInputs()) {
        blockSending();
        return;
    }

    const currentScore = Number(widgetCurrentScoreInput.value);
    const targetScore = Number(widgetTargetScoreInput.value);
    const durationInMonths = Math.max(1, Number(widgetDurationInput.value) || 1);

    const selectedFormatInput = Array.from(widgetFormatInputs).find((input) => input.checked);
    const format = selectedFormatInput.value;

    const scoreGain = targetScore - currentScore;
    const gainPerMonth = Math.ceil(scoreGain / durationInMonths);

    scoreGainOutput.textContent = `+${scoreGain} балів`;
    monthlyTempoOutput.textContent = `+${gainPerMonth} балів`;
    selectedFormatOutput.textContent = formatLabels[format];

    if (!validateRealisticTempo(currentScore, targetScore, durationInMonths)) {
        blockSending();
        return;
    }

    const programIsStandard = gainPerMonth < 10;
    const lessonsPerMonth = programIsStandard ? 8 : 12;

    const lessonPrice = lessonPrices[format];
    const monthlyPrice = durationInMonths >= 3
        ? lessonPrice * lessonsPerMonth * 0.9
        : lessonPrice * lessonsPerMonth;
    const coursePrice = monthlyPrice * durationInMonths;

    monthlyPriceOutput.textContent = `${formattedPrice(monthlyPrice)} грн`;
    totalPriceOutput.textContent = `${formattedPrice(coursePrice)} грн`;

    courseScheduleOutput.textContent = programIsStandard
        ? "Звичайна (2 заняття/тиждень)"
        : "Інтенсив (3 заняття/тиждень)";

    allowSending();
}

const calculatorForm = document.querySelector(".calculator-form");
const contactForm = document.querySelector("#contact-form");
calculatorForm.addEventListener("input", recomputeIfInputsAreValid);
calculatorForm.addEventListener("change", recomputeIfInputsAreValid);
calculatorForm.addEventListener("focusout", recomputeIfInputsAreValid);
calculatorSubmitButton.addEventListener("click", goToSending);
contactForm.addEventListener("reset", () => setContactStudyFieldsLocked(false));
document.querySelectorAll('input[name="request-mode"]').forEach((input) => {
    input.addEventListener("change", () => {
        const usingCalculator = calculatorRequestModeInput.checked;
        if (usingCalculator) transferCalculatorData();
        setContactStudyFieldsLocked(usingCalculator);
    });
});

blockSending();
