const dropzone = document.getElementById('dropzone');
// Forms
const createForm = document.getElementById('createForm');
const createMessage = document.getElementById('createMessage');
const updateCarForm = document.getElementById('updateCarForm');
const updateCarMessage = document.getElementById('updateCarMessage');
const updateOrderForm = document.getElementById('updateOrderForm');
const updateOrderMessage = document.getElementById('updateOrderMessage');
// Wrappers
const adsWrapper = document.getElementById('ads');
const ordersWrapper = document.getElementById('orders');
const offersWrapper = document.getElementById('offers');
const imagesWrapper = createForm.querySelector('#images');
// Modals
const updateCarPriceModal = new ModalController(document.getElementById('updateCarPriceModal'));
const updateOrderPriceModal = new ModalController(document.getElementById('updateOrderPriceModal'));
const offersModal = new ModalController(document.getElementById('offersModal'));
// Data
let cars = [];
let orders = [];
let offers = [];
let current;
let images;

const updateCar = new Form(updateCarForm, updateCarMessage);
updateCar.handle = async function (done) {
  const price = this.getFieldValue('price');
  if (!price.trim()) return this.showMessage('Please enter new price', 'error');
  this.disableForm();
  const car = await Api.updateCarPrice(current, price);
  updateCars(car);
  done('Price successfully updated');
};

const updateOrder = new Form(updateOrderForm, updateOrderMessage);
updateOrder.handle = async function (done) {
  const price = this.getFieldValue('price');
  if (!price.trim()) return this.showMessage('Please enter new price', 'error');
  this.disableForm();
  const order = await Api.updateOrderPrice(current, price);
  updateOrders(order);
  done('Price successfully updated');
};

updateCarPriceModal.preClose = () => updateCar.hideMessage();
updateOrderPriceModal.preClose = () => updateOrder.hideMessage();
offersModal.preClose = () => {
  offersWrapper.innerHTML = `
        <div class="align-center flex justify-between offer">
            <div class="skeleton-children">
                <div class="price">Lorem.</div>
                <div class="mt-1 name">Lorem, ipsum dolor.</div>
            </div>
            <div class="flex skeleton-children">
                <div>Lorem.</div>
            </div>
        </div>
        <div class="align-center flex justify-between offer">
            <div class="skeleton-children">
                <div class="price">Lorem.</div>
                <div class="mt-1 name">Lorem, ipsum dolor.</div>
            </div>
            <div class="flex skeleton-children">
                <div>Lorem.</div>
            </div>
        </div>
    `;
};

const create = new Form(createForm, createMessage);
create.handle = async function (done) {
  const data = create.getValuesAsObject();
  if (this.err) return this.showMessage('All fields are required', 'error');
  if (!images.length) return this.showMessage('At least one image is required', 'error');
  if (!validateImages(images)) return;
  const fd = new FormData();
  images.forEach(image => fd.append("images", image || ''));
  Object.keys(data).forEach(key => fd.append(key, data[key]));
  this.disableForm();
  const res = await Api.createAd(fd);
  if (res.success) {
    imagesWrapper.innerHTML = '';
    cars.push(res.data);
    populateCars(cars);
    done(res.message);
  } else {
    this.showMessage(res.error || 'An error occurred, please try again', 'error');
    this.enableForm();
  }
};

function validateImages(files) {
  create.hideMessage();
  const types = ['image/png', 'image/jpeg', 'image/jpg'];
  const invalidLength = files.length > 3;
  const invalidType = files.some(file => !types.includes(file.type));
  const invalidSize = files.some(file => file.size / 1024 / 1024 > 1);

  if (invalidLength) {
    create.showMessage('Maximum of 3 images exceeded.', 'error');
    return false;
  }
  if (invalidType) {
    create.showMessage('Only JPEG and PNG files are allowed', 'error');
    return false;
  }
  if (invalidSize) {
    create.showMessage('Files sized must not exceed 1MB', 'error');
    return false;
  }
  return true;
}

async function handleImages(files) {
  images = [...files];
  imagesWrapper.innerHTML = '';
  if (!this.validateImages([...files])) return;
  const urls = await Promise.all([...files].map(file => toDataUrl(file)));
  imagesWrapper.innerHTML = urls.map(url => `<img src="${url}" alt="Car"/>`).join('');
}

function toDataUrl(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve(e.target.result);
    };
    reader.readAsDataURL(file);
  })

}

function populateOrders(orders) {
  if (!orders.length) {
    ordersWrapper.innerHTML = `<div class="dashboard-item">${Markup.empty('No purchases made yet')}</div>`;
    return;
  }
  ordersWrapper.innerHTML = orders.map(order => Markup.order(order)).join('');
}

function populateCars(cars) {
  if (!cars.length) {
    adsWrapper.innerHTML = `<div class="dashboard-item">${Markup.empty('No ad created yet')}</div>`;
    return;
  }

  adsWrapper.innerHTML = cars.map(car => Markup.car(car)).join('');
}

function populateOffers(_offers) {
  if (!_offers.length) {
    offersWrapper.innerHTML = Markup.empty('There are no offers for this vehicle yet');
    return;
  }
  offersWrapper.innerHTML = _offers.map(offer => Markup.offer(offer)).join('');
}

function updateCars(car) {
  cars = update(cars, car);
  populateCars(cars);
}

function updateOrders(order) {
  orders = update(orders, order);
  populateOrders(orders);
}

function updateOffers(offer) {
  offers = update(offers, offer);
  populateOffers(offers);
}

async function loadOffers(id) {
  offers = await Api.getCarOrders(id);
  populateOffers(offers);
}

async function markAsSold(id) {
  const car = await Api.markAsSold(id);
  updateCars(car);
}

async function init() {
  [cars, orders] = await Promise.all([Api.getUserCars(), Api.getUserOrders()]);
  populateCars(cars);
  populateOrders(orders);
}

async function handleClick(e) {
  if (e.target.id === 'updateCarPriceModalTrigger') {
    current = e.target.dataset.id;
    updateCarPriceModal.show();
  }
  if (e.target.id === 'updateOrderPriceModalTrigger') {
    current = e.target.dataset.id;
    updateOrderPriceModal.show();
  }
  if (e.target.id === 'offersModalTrigger') {
    offersModal.show();
    loadOffers(e.target.dataset.id);
  }
  if (e.target.id === 'markAsSold') {
    e.target.disabled = true;
    markAsSold(e.target.dataset.id);
  }
  if (e.target.classList && e.target.classList.contains('offer-respond')) {
    const { id, status } = e.target.dataset;
    document.querySelectorAll('.offer-respond').forEach((el) => {
      el.disabled = true
    });
    const offer = await Api.updateOffer(id, { status });
    updateOffers(offer);
  }
}

dropzone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropzone.classList.remove('active');
  handleImages(e.dataTransfer.files);
});

dropzone.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropzone.classList.add('active');
})

dropzone.addEventListener('dragleave', (e) => {
  e.preventDefault();
  dropzone.classList.remove('active');
})

createForm.addEventListener('submit', e => create.submit(e));
createForm.querySelector('input[name="file"]').addEventListener('change', e => handleImages(e.target.files));
updateCarForm.addEventListener('submit', e => updateCar.submit(e));
updateOrderForm.addEventListener('submit', e => updateOrder.submit(e));

window.addEventListener('click', handleClick);

init();