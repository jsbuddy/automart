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
  carWrapper.innerHTML = Markup.singleCar(car);
  const s = new Siema({ selector: '.siema' });
  document.querySelector('.s-button.next').addEventListener('click', (e) => s.next());
  document.querySelector('.s-button.prev').addEventListener('click', (e) => s.prev());
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
