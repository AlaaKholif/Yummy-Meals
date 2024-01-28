export class Validation {
  constructor() {
    this.nameInput = $("#name");
    this.emailInput = $("#email");
    this.numberInput = $("#number");
    this.ageInput = $("#age");
    this.passwordInput = $("#password");
    this.repasswordInput = $("#repassword");
    this.submitBtn = $("#submitBtn");

    this.nameError = $("#nameError");
    this.emailError = $("#emailError");
    this.numberError = $("#numberError");
    this.ageError = $("#ageError");
    this.passwordError = $("#passwordError");
    this.repasswordError = $("#repasswordError");

    this.setupEventListeners();
  }

  setupEventListeners() {
    this.nameInput.on("input", () => {
      this.validateName();
      this.validateAllFields();
    });
    this.emailInput.on("input", () => {
      this.validateEmail();
      this.validateAllFields();
    });
    this.numberInput.on("input", () => {
      this.validateNumber();
      this.validateAllFields();
    });
    this.ageInput.on("input", () => {
      this.validateAge();
      this.validateAllFields();
    });
    this.passwordInput.on("input", () => {
      this.validatePassword();
      this.validateAllFields();
    });
    this.repasswordInput.on("input", () => {
      this.validateRepassword();
      this.validateAllFields();
    });
  }

  validateAllFields() {
    const nameValid = this.validateName();
    const emailValid = this.validateEmail();
    const numberValid = this.validateNumber();
    const ageValid = this.validateAge();
    const passwordValid = this.validatePassword();
    const repasswordValid = this.validateRepassword();

    // Enable submit button only if all fields are valid
    const allFieldsValid =
      nameValid &&
      emailValid &&
      numberValid &&
      ageValid &&
      passwordValid &&
      repasswordValid;
    this.submitBtn.prop("disabled", !allFieldsValid);

    return allFieldsValid;
  }

  validateName() {
    var nameInput = this.nameInput.val();
    var nameError = this.nameError;

    if (!nameInput.trim()) {
      $(`#nameError`).addClass("d-none");
    } else if (!/^[A-Za-z ]+$/.test(nameInput)) {
      $(`#nameError`).removeClass("d-none");
      nameError.html("Special characters and numbers not allowed");
    } else {
      $(`#nameError`).addClass("d-none");
    }

    return !nameError.is(":visible") && nameInput !== "";
  }

  validateEmail() {
    var emailInput = this.emailInput.val();
    var emailError = this.emailError;

    if (!emailInput.trim()) {
      $(`#emailError`).addClass("d-none");
    } else if (
      !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(emailInput)
    ) {
      $(`#emailError`).removeClass("d-none");
      emailError.html("Email not valid *example@yyy.zzz");
    } else {
      $(`#emailError`).addClass("d-none");
    }

    return !emailError.is(":visible") && emailInput !== "";
  }

  validateNumber() {
    var numberInput = this.numberInput.val();
    var numberError = this.numberError;

    if (!numberInput.trim()) {
      $(`#numberError`).addClass("d-none");
    } else if (!/^[0-9-]+$/.test(numberInput) || numberInput.length < 11) {
      $(`#numberError`).removeClass("d-none");
      numberError.html("Enter valid Phone Number");
    } else {
      $(`#numberError`).addClass("d-none");
    }

    return !numberError.is(":visible") && numberInput !== "";
  }

  validateAge() {
    var ageInput = this.ageInput.val();
    var ageError = this.ageError;

    if (!ageInput.trim()) {
      $(`#ageError`).addClass("d-none");
    } else if (!/^(1[0-1]\d|120|[1-9]\d?)$/.test(ageInput)) {
      $(`#ageError`).removeClass("d-none");
      ageError.html("Enter valid age");
    } else {
      $(`#ageError`).addClass("d-none");
    }

    return !ageError.is(":visible") && ageInput !== "";
  }

  validatePassword() {
    var passwordInput = this.passwordInput.val();
    var passwordError = this.passwordError;

    if (!passwordInput.trim()) {
      $(`#passwordError`).addClass("d-none");
    } else if (
      passwordInput.length < 8 ||
      !/^(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/.test(passwordInput)
    ) {
      $(`#passwordError`).removeClass("d-none");
      passwordError.html(
        "Enter valid password *Minimum eight characters, at least one letter and one number:*"
      );
    } else {
      $(`#passwordError`).addClass("d-none");
    }

    return !passwordError.is(":visible") && passwordInput !== "";
  }

  validateRepassword() {
    var passwordInput = this.passwordInput.val();
    var repasswordInput = this.repasswordInput.val();
    var repasswordError = this.repasswordError;

    if (!passwordInput.trim()) {
      $(`#repasswordError`).addClass("d-none");
    } else if (passwordInput !== repasswordInput) {
      $(`#repasswordError`).removeClass("d-none");
      repasswordError.html("Enter valid repassword");
    } else {
      $(`#repasswordError`).addClass("d-none");
    }

    return !repasswordError.is(":visible") && repasswordInput !== "";
  }
}
