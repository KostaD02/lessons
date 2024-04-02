import { EverRESTService } from "./everrest-service.js";

const paginationDisplay = document.querySelector("#paginationDisplay");
const productsDisplay = document.querySelector("#productsDisplay");

const everRESTService = new EverRESTService();

const config = {
  limit: 5,
  page: 1,
  total: 0,
  skip: 0,
  pageCount: 0,
  cachedProducts: [],
};

everRESTService
  .getProducts(config.page, config.limit)
  .then((response) => {
    updateConfig(response);
    paginationDisplay.innerHTML = `
      <ul class="pagination justify-content-center">
        <li class="page-item">
          <span class="page-link paginator" aria-label="Previous">
            <span aria-hidden="true">&laquo;</span>
          </span>
        </li>
        ${new Array(config.pageCount)
          .fill("")
          .map(
            (_, index) =>
              `<li class="page-item">
              <span class="paginator page-link${
                index === 0 ? " active" : ""
              }">${index + 1}</span></li>`
          )
          .join("")}
        <li class="page-item">
          <span class="paginator page-link" aria-label="Next">
            <span aria-hidden="true">&raquo;</span>
          </span>
        </li>
      </ul>
    `;
    document
      .querySelectorAll(".paginator")
      .forEach((paginator, index, self) => {
        paginator.addEventListener("click", () => {
          let page =
            index === 0
              ? config.page - 1
              : index + 1 === self.length
              ? config.page + 1
              : index;

          if (page === 0 || page === config.pageCount + 1) {
            return;
          }

          navigate(page);
        });
      });
    displayCurrentProducts();
  })
  .catch((err) => {
    displayAlert(err.error, "error", err.errorKeys.join(". "));
  });

function displayAlert(title, icon, text = "") {
  Swal.fire({ title, icon, text });
}

async function navigate(page) {
  config.page = page;
  const paginators = document.querySelectorAll(".paginator");
  paginators.forEach((paginator, index) => {
    paginator.classList.remove("active");

    if (index === page) {
      paginator.classList.add("active");
    }
  });

  const cachedProduct = config.cachedProducts.find(
    (cache) => cache.index === page
  );

  if (cachedProduct) {
    displayCurrentProducts();
    return;
  }

  try {
    const response = await everRESTService.getProducts(
      config.page,
      config.limit
    );
    updateConfig(response);
    displayCurrentProducts();
  } catch (err) {
    displayAlert(err.error, "error", err.errorKeys.join(". "));
  }
}

function displayCurrentProducts() {
  const cachedProducts = config.cachedProducts.find(
    (cache) => cache.index === config.page
  );

  productsDisplay.innerHTML = "";

  cachedProducts.products.forEach((product) => {
    productsDisplay.innerHTML += everRESTService.getProductVisual(product);
  });
}

function updateConfig(response) {
  const { limit, page, total, skip, products } = response;
  config.page = page;
  config.limit = limit;
  config.total = total;
  config.skip = skip;
  config.pageCount = Math.ceil(config.total / config.limit);
  config.cachedProducts.push({
    products,
    index: page,
  });
}
