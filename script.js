var btn = document.getElementsByClassName("submit")[0],
  form = document.getElementById("form"),
  msg = document.getElementById("msg"),
  textarea = document.getElementsByName("q")[0];
form.addEventListener("submit", function (a) {
  (btn.style.display = "none"),
    (msg.style.display = "block"),
    a.preventDefault();
  var b = textarea.value;
  fetch("https://formsubmit.co/19905386412a5732d8e2efe33df648e3", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ message: b }),
  }).then((a) => {
    console.log("API Response:", a),
      (textarea.style.display = "none"),
      (msg.textContent =
        "Question received!, I'll respond through my Instagram stories.");
  });
});




var titleText = [
    "riprnv",
    "riprn",
    "ripr",
    "rip",
    "ri",
    "r",
    "ri",
    "rip",
    "ripr",
    "riprn",
  ],
  x = 0;
setInterval(() => {
  document.getElementsByTagName("title")[0].innerHTML =
    titleText[x++ % titleText.length];
}, 350),
  textarea.addEventListener(
    "click",
    function () {
      (textarea.value = ""), (btn.style.display = "block");
    },
    !1
  );
