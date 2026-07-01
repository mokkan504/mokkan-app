(function () {
  function option(value, label) {
    return `<option value="${value}">${label}</option>`;
  }

  function initialize(container) {
    const hidden = container.querySelector('input[name="birthDate"]');
    const year = container.querySelector("[data-birth-year]");
    const month = container.querySelector("[data-birth-month]");
    const day = container.querySelector("[data-birth-day]");
    const currentYear = new Date().getFullYear();

    year.max = String(currentYear);
    month.innerHTML = option("", "월") + Array.from({ length: 12 }, (_, index) => option(index + 1, `${index + 1}월`)).join("");

    function updateDays() {
      const selected = day.value;
      const count = year.value && month.value ? new Date(Number(year.value), Number(month.value), 0).getDate() : 31;
      day.innerHTML = option("", "일") + Array.from({ length: count }, (_, index) => option(index + 1, `${index + 1}일`)).join("");
      if (selected && Number(selected) <= count) day.value = selected;
    }

    function sync() {
      updateDays();
      const validYear = Number(year.value) >= 1900 && Number(year.value) <= currentYear;
      hidden.value = validYear && month.value && day.value
        ? `${year.value}-${String(month.value).padStart(2, "0")}-${String(day.value).padStart(2, "0")}`
        : "";
    }

    year.addEventListener("input", sync);
    month.addEventListener("change", sync);
    day.addEventListener("change", sync);
    updateDays();
    container._setBirthdate = (value) => {
      const [y = "", m = "", d = ""] = String(value || "").split("-");
      year.value = y; month.value = m ? String(Number(m)) : ""; updateDays(); day.value = d ? String(Number(d)) : ""; sync();
    };
    if (hidden.value) container._setBirthdate(hidden.value);
  }

  document.querySelectorAll("[data-birthdate]").forEach(initialize);
  window.MokkanBirthdate = {
    set(form, value) { form.querySelector("[data-birthdate]")?._setBirthdate(value); }
  };
})();
