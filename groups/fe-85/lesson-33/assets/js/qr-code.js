import { EverRESTService } from "./everrest-service.js";

const qrCodeTextInput = document.querySelector("#qrCodeTextInput");
const qrCodeDisplay = document.querySelector("#qrCodeDisplay");
const qrCodeBtn = document.querySelector("#qrCodeBtn");

const everRESTService = new EverRESTService();

qrCodeBtn.addEventListener("click", () => {
  genareteQrCode(qrCodeTextInput.value);
});

qrCodeTextInput.addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    genareteQrCode(this.value);
  }
});

async function genareteQrCode(value) {
  const text = value.trim();
  qrCodeTextInput.value = "";

  if (text === "") {
    displayAlert("Empty", "warning", "Cant't create qr code with empty text");
    return;
  }

  try {
    const response = await everRESTService.getQRCode(text);
    qrCodeDisplay.innerHTML = everRESTService.generateQrCodeVisual(response);
  } catch (err) {
    displayAlert(err.error, "error", err.errorKeys.join(". "));
  }
}

function displayAlert(title, icon, text = "") {
  Swal.fire({ title, icon, text });
}
