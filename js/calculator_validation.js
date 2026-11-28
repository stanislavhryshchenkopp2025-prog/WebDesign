const calculatorCurrentScoreInput = document.querySelector("#nmt-score");
const calculatorTargetScoreInput = document.querySelector("#target-score");
const calculatorDurationInput = document.querySelector("#duration");

function clearCalculatorFieldState(input) {
    input.classList.remove("error", "success");

    const errorMessage = input.nextElementSibling;
    if (errorMessage?.classList.contains("field-error")) {
        if (input.getAttribute("aria-describedby") === errorMessage.id) {
            input.removeAttribute("aria-describedby");
        }
        errorMessage.remove();
    }

    input.setAttribute("aria-invalid", "false");
}

function showCalculatorError(input, message) {
    input.classList.add("error");
    input.classList.remove("success");
    input.setAttribute("aria-invalid", "true");

    const existingError = input.nextElementSibling;
    if (existingError?.classList.contains("field-error")) {
        existingError.textContent = message;
        input.setAttribute("aria-describedby", existingError.id);
    } else {
        const errorMessage = document.createElement("p");
        errorMessage.className = "field-error";
        errorMessage.id = `${input.id}-error`;
        errorMessage.setAttribute("role", "alert");
        errorMessage.textContent = message;
        input.insertAdjacentElement("afterend", errorMessage);
        input.setAttribute("aria-describedby", errorMessage.id);
    }
}

function showCalculatorSuccess(input) {
    clearCalculatorFieldState(input);
    input.classList.add("success");
}

function isCalculatorScoreInRange(score) {
    return Number.isInteger(score) && score >= 100 && score <= 200;
}

function validateCalculatorCurrentScore() {
    if (calculatorCurrentScoreInput.value === "") {
        return false;
    }

    const currentScore = calculatorCurrentScoreInput.valueAsNumber;
    if (!isCalculatorScoreInRange(currentScore)) {
        showCalculatorError(calculatorCurrentScoreInput, "Поточний бал має бути цілим числом від 100 до 200.");
        return false;
    }

    showCalculatorSuccess(calculatorCurrentScoreInput);
    return true;
}

function validateCalculatorTargetScore() {
    if (calculatorTargetScoreInput.value === "") {
        return false;
    }

    const targetScore = calculatorTargetScoreInput.valueAsNumber;
    if (!isCalculatorScoreInRange(targetScore)) {
        showCalculatorError(calculatorTargetScoreInput, "Бажаний бал має бути цілим числом від 100 до 200.");
        return false;
    }

    const currentScore = calculatorCurrentScoreInput.valueAsNumber;
    if (
        calculatorCurrentScoreInput.value !== "" &&
        isCalculatorScoreInRange(currentScore) &&
        targetScore - currentScore < 5
    ) {
        showCalculatorError(calculatorTargetScoreInput, "Бажаний бал має бути більшим за поточний щонайменше на 5 балів.");
        return false;
    }

    showCalculatorSuccess(calculatorTargetScoreInput);
    return true;
}

function validateCalculatorDuration() {
    if (calculatorDurationInput.value === "") {
        return false;
    }

    const duration = calculatorDurationInput.valueAsNumber;

    if (!Number.isInteger(duration) || duration === 0) {
        showCalculatorError(calculatorDurationInput, "Мінімальна тривалість навчання — 1 місяць.");
        return false;
    }

    showCalculatorSuccess(calculatorDurationInput);
    return true;
}

export function validateCalculatorInputs() {
    const fieldsValid = [
        calculatorCurrentScoreTouched && validateCalculatorCurrentScore(),
        calculatorTargetScoreTouched && validateCalculatorTargetScore(),
        calculatorDurationTouched && validateCalculatorDuration()
    ].every(Boolean);
    const allFieldsFilled = [
        calculatorCurrentScoreInput,
        calculatorTargetScoreInput,
        calculatorDurationInput
    ].every((input) => input.value.trim() !== "");

    return allFieldsFilled && fieldsValid;
}

calculatorCurrentScoreInput.addEventListener("input", () => {
    calculatorCurrentScoreInput.value = calculatorCurrentScoreInput.value.replace(/\D/g, "").slice(0, 3);
});
calculatorTargetScoreInput.addEventListener("input", () => {
    calculatorTargetScoreInput.value = calculatorTargetScoreInput.value.replace(/\D/g, "").slice(0, 3);
});
calculatorDurationInput.addEventListener("input", () => {
    calculatorDurationInput.value = calculatorDurationInput.value.replace(/\D/g, "").slice(0, 1);
});

let calculatorCurrentScoreTouched = false;
let calculatorTargetScoreTouched = false;
let calculatorDurationTouched = false;

function validateCalculatorScoresIfTouched() {
    if (calculatorCurrentScoreTouched) validateCalculatorCurrentScore();
    if (calculatorTargetScoreTouched) validateCalculatorTargetScore();
}

calculatorCurrentScoreInput.addEventListener("blur", () => {
    calculatorCurrentScoreTouched = true;
    validateCalculatorScoresIfTouched();
});
calculatorTargetScoreInput.addEventListener("blur", () => {
    calculatorTargetScoreTouched = true;
    validateCalculatorScoresIfTouched();
});
calculatorCurrentScoreInput.addEventListener("input", validateCalculatorScoresIfTouched);
calculatorTargetScoreInput.addEventListener("input", validateCalculatorScoresIfTouched);

calculatorDurationInput.addEventListener("blur", () => {
    calculatorDurationTouched = true;
    validateCalculatorDuration();
});
calculatorDurationInput.addEventListener("input", () => {
    if (calculatorDurationTouched) validateCalculatorDuration();
});
