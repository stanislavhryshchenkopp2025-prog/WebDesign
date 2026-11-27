const phoneRegex = /^\+380\d{9}$/;

const contactForm = document.querySelector("#contact-form");
const nameInput = document.querySelector("#name");
const phoneInput = document.querySelector("#phone");
const currentScoreInput = document.querySelector("#contact-current-score");
const targetScoreInput = document.querySelector("#contact-target-score");
const consentCheckbox = document.querySelector("#personal-data-consent");
const successDialog = document.querySelector("#success-dialog");
const closeSuccessDialogButton = document.querySelector("#close-success-dialog");

// Прибирає класи стану та попереднє повідомлення про помилку.
function clearFieldState(input) {
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

// Позначає поле помилковим і створює повідомлення або оновлює вже наявне.
function showError(input, message) {
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

// Прибирає повідомлення про помилку та встановлює клас успішного стану.
function showSuccess(input) {
    clearFieldState(input);
    input.classList.add("success");
}

function validateName() {
    if (nameInput.value.trim().length < 2) {
        showError(nameInput, "Ім’я має містити щонайменше 2 символи.");
        return false;
    }

    showSuccess(nameInput);
    return true;
}

function validatePhone() {
    if (!phoneRegex.test(phoneInput.value.trim())) {
        showError(phoneInput, "Введіть номер у форматі +380XXXXXXXXX.");
        return false;
    }

    showSuccess(phoneInput);
    return true;
}

function isScoreInRange(score) {
    return Number.isInteger(score) && score >= 100 && score <= 200;
}

function validateCurrentScore() {
    const currentScore = currentScoreInput.valueAsNumber;
    if (!isScoreInRange(currentScore)) {
        showError(currentScoreInput, "Поточний бал має бути цілим числом від 100 до 200.");
        return false;
    }

    const targetScore = targetScoreInput.valueAsNumber;
    const targetScoreEntered = targetScoreInput.value !== "";
    if (targetScoreEntered && isScoreInRange(targetScore) && currentScore >= targetScore) {
        showError(currentScoreInput, "Поточний бал має бути меншим за бажаний.");
        return false;
    }

    showSuccess(currentScoreInput);
    return true;
}

function validateTargetScore() {
    const targetScore = targetScoreInput.valueAsNumber;
    if (!isScoreInRange(targetScore)) {
        showError(targetScoreInput, "Бажаний бал має бути цілим числом від 100 до 200.");
        return false;
    }

    const currentScore = currentScoreInput.valueAsNumber;
    const currentScoreEntered = currentScoreInput.value !== "";
    if (currentScoreEntered && isScoreInRange(currentScore) && targetScore <= currentScore) {
        showError(targetScoreInput, "Бажаний бал має бути більшим за поточний.");
        return false;
    }

    showSuccess(targetScoreInput);
    return true;
}

function validateCkeckbox() {
    const errorId = `${consentCheckbox.id}-error`;
    let errorMessage = document.getElementById(errorId);

    if (!consentCheckbox.checked) {
        consentCheckbox.setAttribute("aria-invalid", "true");
        if (!errorMessage) {
            errorMessage = document.createElement("p");
            errorMessage.className = "field-error";
            errorMessage.id = errorId;
            errorMessage.setAttribute("role", "alert");
            errorMessage.textContent = "Надайте згоду на обробку персональних даних.";
            consentCheckbox.parentElement.append(errorMessage);
        }
        consentCheckbox.setAttribute("aria-describedby", errorId);
        return false;
    }

    consentCheckbox.setAttribute("aria-invalid", "false");
    consentCheckbox.removeAttribute("aria-describedby");
    errorMessage?.remove();
    return true;
}

// валідація номера телефону під час введення
phoneInput.addEventListener("input", () => {
    const digits = phoneInput.value.replace(/\D/g, "");

    if (digits.startsWith("380380")) {
        phoneInput.value = "+" + digits.slice(3, 15);
    } else if (digits.startsWith("380")) {
        phoneInput.value = "+" + digits.slice(0, 12);
    } else {
        phoneInput.value = "+380" + digits.slice(2, 11);
    }
});

// дозволяє вводити лише цифри у поля поточного та бажаного балу
const leaveOnlyDigits = (input) => input.value = input.value.replace(/\D/g, "");
currentScoreInput.addEventListener("input", () => leaveOnlyDigits(currentScoreInput));
targetScoreInput.addEventListener("input", () => leaveOnlyDigits(targetScoreInput));

let nameTouched = false;
let phoneTouched = false;
let currentScoreTouched = false;
let targetScoreTouched = false;
let consentTouched = false;

consentCheckbox.addEventListener("change", () => {
    if (consentTouched) validateCkeckbox();
});

nameInput.addEventListener("blur", () => {
    nameTouched = true;
    validateName();
});
nameInput.addEventListener("input", () => {
    if (nameTouched) validateName();
});

phoneInput.addEventListener("blur", () => {
    phoneTouched = true;
    validatePhone();
});
phoneInput.addEventListener("input", () => {
    if (phoneTouched) validatePhone();
});

function validateScoresIfTouched() {
    if (currentScoreTouched) validateCurrentScore();
    if (targetScoreTouched) validateTargetScore();
}

currentScoreInput.addEventListener("blur", () => {
    currentScoreTouched = true;
    validateScoresIfTouched();
});
targetScoreInput.addEventListener("blur", () => {
    targetScoreTouched = true;
    validateScoresIfTouched();
});
currentScoreInput.addEventListener("input", validateScoresIfTouched);
targetScoreInput.addEventListener("input", validateScoresIfTouched);

function resetContactForm() {
    contactForm.reset();
    [nameInput, phoneInput, currentScoreInput, targetScoreInput].forEach(clearFieldState);
    nameTouched = false;
    phoneTouched = false;
    currentScoreTouched = false;
    targetScoreTouched = false;
    consentTouched = false;
}

contactForm.addEventListener("submit", (event) => {
    nameTouched = true;
    phoneTouched = true;
    currentScoreTouched = true;
    targetScoreTouched = true;
    consentTouched = true;

    const validationResults = [
        validateName(),
        validatePhone(),
        validateCurrentScore(),
        validateTargetScore(),
        validateCkeckbox()
    ];

    event.preventDefault();

    if (validationResults.every(Boolean)) {
        resetContactForm();
        successDialog.showModal();
    } else {
        contactForm.querySelector('[aria-invalid="true"]').focus();
    }
});

closeSuccessDialogButton.addEventListener("click", () => {
    successDialog.close();
});

successDialog.addEventListener("click", (event) => {
    if (event.target === event.currentTarget) successDialog.close();
});

successDialog.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        event.preventDefault();
        successDialog.close();
    }
});

successDialog.addEventListener("close", () => {
    contactForm.querySelector('button[type="submit"]').focus();
});
