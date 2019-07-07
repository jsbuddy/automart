const id = getUrlParam("id");
// Elements
const carWrapper = document.getElementById('car');
const orderForm = document.getElementById('orderForm');
const orderMessage = document.getElementById('orderMessage');
const reportForm = document.getElementById('reportForm');
const reportMessage = document.getElementById('reportMessage');

function populate(car) {
  if (!car) {
    carWrapper.innerHTML = `
        <div class="empty flex column align-center text-center" style="grid-column: 1/5">
            <div class="icon"><i class="fa fa-car"></i></div>
            <div class="text">The car you're trying to find does not exist.</div>
        </div>
    `;
    return;
  }
  carWrapper.innerHTML = `
      <div class="left">
          <div class="image">
              <img src="${car.images[0] ? car.images[0].url : 'assets/images/placeholder.png'}" alt="">
          </div>
      </div>
      <div class="right flex column align-start">
          <div class="chip blue mb-4">${capitalize(car.state)}</div>
          <div class="seller flex justify-between mb-2">
              <div class="name flex align-center"><i class="fa fa-user-circle mr-1"></i>${car.owner.firstName} ${car.owner.lastName}</div>
          </div>
          <div class="title">${capitalize(car.manufacturer)} ${capitalize(car.model)}</div>
          <div class="subtitle">&#8358;${car.price.toLocaleString()}</div>
          <ul class="details-list">
              <li>Manufacturer: ${capitalize(car.manufacturer)}</li>
              <li>Model: ${capitalize(car.model)}</li>
              <li>Body Type: ${capitalize(car.bodyType)}</li>
          </ul>
          <button class="btn lg primary mt-4 mb-4 modal-trigger" data-id="orderModal">Purchase</button>

          <div class="flex flex-1 align-end modal-trigger" data-id="reportModal">
              <a class="link text-red">
                  <i class="fa fa-exclamation-circle mr-2"></i>
                  <span>Report as fraudulent</span>
              </a>
          </div>
      </div>
  `;
}

function getUrlParam(param) {
  const url = new URL(window.location.href);
  return url.searchParams.get(param);
}

const order = new Form(orderForm, orderMessage);
order.handle = async function (done) {
  const price = this.getFieldValue('price');
  if (!price) return this.showMessage('Please enter a price', 'error');
  this.disableForm();
  const res = await Api.placeOrder(id, price);
  if (res.success) {
    done('Offer sent!');
  } else {
    this.showMessage(res.message || 'An error occurred', 'error');
    this.enableForm();
  }
};

const report = new Form(reportForm, reportMessage);
report.handle = async function (done) {
  const report = this.getValuesAsObject();
  if (this.err) return this.showMessage('All fields are required', 'error');
  this.disableForm();
  const res = await Api.report(id, report);
  if (res.success) {
    done('Complaint sent successfully!');
  } else {
    this.showMessage(res.message || 'An error occurred', 'error');
    this.enableForm();
  }
};

async function init() {
  const car = await Api.getCar(id);
  document.title = `${car.manufacturer} ${car.model}`;
  populate(car);
}

init();

orderForm.addEventListener('submit', e => order.submit(e));
reportForm.addEventListener('submit', e => report.submit(e));
