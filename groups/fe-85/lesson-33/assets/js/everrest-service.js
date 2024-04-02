export class EverRESTService {
  acceptableStatusCodes = [200, 201, 300];

  constructor(url = "https://api.everrest.educata.dev") {
    this.url = url;
  }

  xhrRequest(method, endpoint, body = {}) {
    const xhr = new XMLHttpRequest();
    xhr.open(method, `${this.url}/${endpoint}`);
    if (method !== "GET") {
      xhr.setRequestHeader("Content-Type", "application/json");
    }
    xhr.send(JSON.stringify(body));
    return new Promise((resolve, reject) => {
      xhr.onerror = () => {
        reject(JSON.parse(xhr.responseText));
      };

      xhr.onload = () => {
        if (this.acceptableStatusCodes.includes(xhr.status)) {
          resolve(JSON.parse(xhr.responseText));
        }

        reject(JSON.parse(xhr.responseText));
      };
    });
  }

  getQRCode(text) {
    return this.xhrRequest("POST", "qrcode/generate", { text });
  }

  generateQrCodeVisual(response) {
    return `
      <div class="qr-code m-auto p-4 shadow rounded" style="width: 100%; max-width: 400px">
        <p>Format: ${response.format}</p>
        <p>ErrorCorrectionLevel: ${response.errorCorrectionLevel}</p>
        <p>Type: ${response.type}</p>
        <p>Text: ${response.text}</p>
        <img class="d-block m-auto w-100" src="${response.result}" alt="${response.text} qr code">
      </div>
    `;
  }

  getProducts(pageIndex = 1, pageSize = 5) {
    return this.xhrRequest(
      "GET",
      `shop/products/all?page_size=${pageSize}&page_index=${pageIndex}`
    );
  }

  getProductVisual(product) {
    return `
      <div class="card" style="width: 18rem;">
        <div class="card-header">
          <p class="text-center muted mb-0">
            ${product.brand} / ${product.category.name}
          </p>
        </div>
        <img src="${product.thumbnail}" class="card-img-top" alt="${
      product.title
    } image">
        <div class="card-body">
          <h5 class="card-title">${product.title}</h5>
          <p class="card-text">${product.description}</p>
          <ul class="list-group list-group-flush">
            <li class="list-group-item">Rating: ${product.rating}</li>
            <li class="list-group-item">Stock: ${product.stock}</li>
            <li class="list-group-item">Warranty: ${product.warranty}</li>
            <li class="list-group-item">
              Price: ${
                product.price.discountPercentage === 0
                  ? product.price.current
                  : `<span>${product.price.discountPercentage}% </span>  <span style="text-decoration: line-through; color: red">${product.price.beforeDiscount}</span> <i class="bi bi-arrow-right"></i> <span style="color: green">${product.price.current}</span>`
              } ${product.price.currency}
            </li>
          </ul>
        </div>
        <div class="card-footer">
          <p class="text-center muted mb-0">
            ${new Date(product.issueDate).toLocaleString()}
          </p>
        </div>
      </div>
    `;
  }
}
