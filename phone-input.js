(function () {
  document.querySelectorAll('input[type="tel"]').forEach((input) => {
    input.inputMode = "numeric";
    input.pattern = "[0-9]{10,11}";
    input.maxLength = 11;
    input.placeholder = "01012345678";
    input.title = "하이픈 없이 숫자 10~11자리로 입력해 주세요.";
    input.addEventListener("input", () => {
      input.value = input.value.replace(/\D/g, "").slice(0, 11);
    });

    if (!input.parentElement.querySelector(".phone-field-hint")) {
      const hint = document.createElement("span");
      hint.className = "field-hint phone-field-hint";
      hint.textContent = "하이픈(-) 없이 숫자만 입력해 주세요.";
      input.insertAdjacentElement("afterend", hint);
    }
  });
})();
