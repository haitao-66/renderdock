(function () {
  "use strict";

  var toggleButtons = Array.prototype.slice.call(document.querySelectorAll(".toggle-button"));
  var markdownView = document.getElementById("view-markdown");
  var pdfView = document.getElementById("view-pdf");
  var sheet = pdfView.querySelector(".sheet");

  toggleButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var view = btn.getAttribute("data-view");
      toggleButtons.forEach(function (b) {
        b.setAttribute("aria-pressed", String(b === btn));
      });
      markdownView.classList.toggle("is-active", view === "markdown");
      pdfView.classList.toggle("is-active", view === "pdf");
      if (view === "pdf" && sheet) {
        sheet.classList.remove("animate");
        void sheet.offsetWidth; /* restart the animation */
        sheet.classList.add("animate");
      }
    });
  });

  var form = document.getElementById("waitlist-form");
  var error = document.getElementById("waitlist-error");
  var done = document.getElementById("waitlist-done");

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    error.hidden = true;
    var email = form.email.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      form.email.focus();
      return;
    }
    fetch("/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email })
    })
      .then(function (res) {
        if (!res.ok) { throw new Error("server said " + res.status); }
        form.hidden = true;
        done.hidden = false;
      })
      .catch(function () {
        error.hidden = false;
      });
  });
})();
