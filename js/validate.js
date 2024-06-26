/**
 * PHP Email Form Validation - v3.6
 * URL: https://bootstrapmade.com/php-email-form/
 * Author: BootstrapMade.com
 */

function validateField(name, form) {
  let thisForm = form;
  var selectElement = thisForm.querySelector(`input[name="${name}"]`);

  if (selectElement.value == "") {
    var selectElement = thisForm.querySelector(`input[name="${name}"]`);
    selectElement.classList.add("inputInvalid");

    return false;
  } else {
    selectElement.classList.remove("inputInvalid");
  }

  return true;
}

(function () {
  "use strict";

  let forms = document.querySelectorAll(".php-email-form");

  forms.forEach(function (e) {
    e.addEventListener("submit", function (event) {
      event.preventDefault();

      let thisForm = this;

      let action = thisForm.getAttribute("action");
      let recaptcha = thisForm.getAttribute("data-recaptcha-site-key");

      let formData = new FormData(thisForm);

      let validation = true;

      validation = validateField("name", thisForm);
      validation = validateField("email", thisForm);
      validation = validateField("phone", thisForm);
      validation = validateField("phone", thisForm);
      validation = validateField("subject", thisForm);

      if (!validation) {
        return;
      }

      if (!action) {
        displayError(thisForm, "The form action property is not set!");
        return;
      }
      thisForm.querySelector(".loading").classList.remove("d-none");
      thisForm.querySelector(".error-message").classList.add("d-none");
      thisForm.querySelector(".sent-message").classList.add("d-none");

      let jsonForm = {
        name: formData.get("name"),
        email: formData.get("email"),
        subject: formData.get("subject"),
        phone: formData.get("phone"),
        message: formData.get("message"),
      };

      console.log({ jsonForm });

      if (recaptcha) {
        if (typeof grecaptcha !== "undefined") {
          grecaptcha.ready(function () {
            try {
              grecaptcha
                .execute(recaptcha, { action: "php_email_form_submit" })
                .then((token) => {
                  formData.set("recaptcha-response", token);
                  php_email_form_submit(thisForm, action, formData);
                });
            } catch (error) {
              displayError(thisForm, error);
            }
          });
        } else {
          displayError(
            thisForm,
            "The reCaptcha javascript API url is not loaded!"
          );
        }
      } else {
        php_email_form_submit(thisForm, action, jsonForm);
      }
    });
  });

  function php_email_form_submit(thisForm, action, formData) {
    fetch(action, {
      method: "POST",
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.text();
        } else {
          throw new Error(
            `${response.status} ${response.statusText} ${response.url}`
          );
        }
      })
      .then((stringData) => {
        const data = JSON.parse(stringData);

        thisForm.querySelector(".loading").classList.add("d-none");
        if (data.result == "success") {
          thisForm.querySelector(".sent-message").classList.remove("d-none");
          thisForm.reset();
        } else {
          throw new Error(
            data
              ? data
              : "Form submission failed and no error message returned from: " +
                action
          );
        }
      })
      .catch((error) => {
        displayError(thisForm, error);
      });
  }

  function displayError(thisForm, error) {
    thisForm.querySelector(".loading").classList.add("d-none");
    thisForm.querySelector(".error-message").innerHTML = error;
    thisForm.querySelector(".error-message").classList.remove("d-none");
  }
})();
