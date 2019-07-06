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

const updateCar = new Form(updateCarForm, updateCarMessage);
updateCar.handle = async function (e) {
  e.preventDefault();
  this.hideMessage();
  const price = [...e.target].find(el => el.name === 'price').value;
  if (!price.trim()) return this.showMessage('Please enter new price', 'error');
  this.disableForm();
  const car = await Api.updateCarPrice(current, price);
  updateCars(car);
  this.showMessage('Price successfully updated', 'success');
  this.enableForm();
  this.form.reset();
};

const updateOrder = new Form(updateOrderForm, updateOrderMessage);
updateOrder.handle = async function (e) {
  e.preventDefault();
  this.hideMessage();
  const price = [...e.target].find(el => el.name === 'price').value;
  if (!price.trim()) return this.showMessage('Please enter new price', 'error');
  this.disableForm();
  const order = await Api.updateOrderPrice(current, price);
  updateOrders(order);
  this.showMessage('Price successfully updated', 'success');
  this.enableForm();
  this.form.reset();
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
create.handle = async function (e) {
  e.preventDefault();
  this.hideMessage();
  let err = false;
  const data = [...e.target].reduce((obj, el) => {
    if (el.name !== 'submit' && el.name !== 'images') {
      if (!el.value) err = true;
      obj[el.name] = el.value;
    }
    return obj;
  }, {});
  const files = [...e.target].find(el => el.name === 'images').files;
  if (err) return this.showMessage('All fields are required', 'error');
  if (!files.length) return this.showMessage('At least one image is required', 'error');
  if (!validateFiles([...files])) return;
  const fd = new FormData();
  [...files].forEach(file => fd.append("images", file))
  Object.keys(data).forEach(key => fd.append(key, data[key]));
  this.disableForm();
  const res = await Api.createAd(fd);
  this.enableForm();
  if (res.success) {
    this.showMessage(res.message, 'success');
    this.form.reset();
    imagesWrapper.innerHTML = '';
    cars.push(res.car);
    populateCars(cars);
  } else {
    this.showMessage(res.message || 'An error occurred, please try again', 'error');
  }
};

function validateFiles(files) {
  create.hideMessage();
  const types = ['image/png', 'image/jpeg', 'image/jpg'];
  const invalidLength = files.length > 3;
  const invalidType = files.some(file => !types.includes(file.type));
  const invalidSize = files.some(file => file.size / 1024 / 1024 > 1);

  if (invalidLength) {
    create.showMessage('Maximum of 3 images exceeded.', 'error')
    return false;
  }
  if (invalidType) {
    create.showMessage('Only JPEG and PNG files are allowed', 'error');
    return false;
  }
  if (invalidSize) {
    create.showMessage('Files sized must not exceed 1MB', 'error')
    return false;
  }
  return true;
}

async function handleImages(files) {
  imagesWrapper.innerHTML = '';
  if (!this.validateFiles([...files])) return;
  const urls = await Promise.all([...files].map(file => toDataUrl(file)));
  imagesWrapper.innerHTML = urls.map(url => `<img src="${url}"/>`).join('');
}

function toDataUrl(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve(e.target.result);
    }
    reader.readAsDataURL(file);
  })

}

function populateOrders(orders) {
  if (!orders.length) {
    ordersWrapper.innerHTML = `
        <div class="dashboard-item">
            <div class="empty">
                <div class="icon"><i class="fa fa-meh-blank"></i></div>
                <div class="text">No purchases made yet</div>
            </div>
        </div>
                `;
    return;
  }
  ordersWrapper.innerHTML = orders.map(order => `
        <div class="dashboard-item">
            <div class="flex justify-between details">
                <div>
                    <div class="title">${order.car.manufacturer} ${order.car.model} - ${order.car.state}</div>
                    <div class="subtitle">Original Price: &#8358;${order.car.price.toLocaleString()}</div>
                    <div class="subtitle">Price Offered: &#8358;${order.priceOffered.toLocaleString()}</div>
                </div>
                <div class="right">
                    ${order.status === 'pending' ? `<div class="chip yellow">Pending</div>` : ''}
                    ${order.status === 'accepted' ? `<div class="chip green">Accepted</div>` : ''}
                    ${order.status === 'rejected' ? `<div class="chip red">Rejected</div>` : ''}
                </div>
            </div>
            <div class="actions flex justify-between">
                <div>
                    <a href="car.html?id=${order.car.id}" class="btn primary sm outline">View</a>
                    ${order.status === 'pending' ? `
                        <button class="btn primary sm outline" id="updateOrderPriceModalTrigger" data-id="${order.id}">
                            Update Price
                        </button>
                    ` : ''}
                </div>
            </div>
        </div>
    `).join('');
}

function populateCars(cars) {
  if (!cars.length) {
    adsWrapper.innerHTML = `
            <div class="dashboard-item">
                <div class="empty">
                    <div class="icon"><i class="fa fa-meh-blank"></i></div>
                    <div class="text">No ad created yet</div>
                </div>
            </div>
        `;
    return;
  }

  adsWrapper.innerHTML = cars.map(car => `
        <div class="dashboard-item">
            <div class="details flex justify-between">
                <div>
                    <div class="title">${car.manufacturer} ${car.model} - ${car.state}</div>
                    <div class="subtitle">&#8358;${car.price.toLocaleString()}</div>
                </div>
                <div class="right">
                    ${car.status === 'sold' ? `<div class="chip green">Sold <i class="fa fa-check ml-2"></i></div>` : ''}
                    ${car.status === 'available' ? `<button class="btn green outline sm" id="markAsSold" data-id="${car.id}">Mark as sold</button>` : ''}
                </div>
            </div>
            <div class="actions flex justify-between">
                <div class="buttons">
                    <a href="../car/index.html?id=${car.id}" class="btn primary sm outline">View</a>
                    <button class="btn primary sm outline flex-inline" id="offersModalTrigger" data-id="${car.id}">
                        <i class="fas fa-star-half-alt mr-1"></i>
                        Offers
                    </button>
                    ${car.status === 'available' ? `
                        <button class="btn primary sm outline" id="updateCarPriceModalTrigger" data-id="${car.id}">
                            Update Price
                        </button>
                        ` : ''}
                </div>
            </div>
        </div>
    `).join('');
}

function populateOffers(offers) {
  if (!offers.length) {
    offersWrapper.innerHTML = `
            <div class="empty">
                <div class="icon"><i class="fa fa-meh-blank"></i></div>
                <div class="text">There are no offers for this vehicle yet</div>
            </div>
        `;
    return;
  }
  offersWrapper.innerHTML = offers.map(offer => `
        <div class="offer flex justify-between align-center">
            <div>
                <div class="price">&#8358;${offer.priceOffered.toLocaleString()}</div>
                <div class="name"><i class="fa fa-user-circle mr-2"></i> ${offer.buyer.firstName} ${offer.buyer.lastName}</div>
            </div>
            <div class="flex">
                ${offer.status === 'pending' ? `
                    <button class="btn sm primary outline offer-respond" data-id="${offer.id}" data-status="accepted">Accept</button>
                    <button class="btn sm red outline ml-1 offer-respond" data-id="${offer.id}" data-status="rejected">Reject</button>
                    ` : ''}
                ${offer.status === 'accepted' ? `
                    <div class="chip green">Accepted</div>
                    <button class="btn yellow sm outline ml-1 offer-respond" data-id="${offer.id}" data-status="pending">Undo</button>
                    ` : ''}
                ${offer.status === 'rejected' ? `
                    <div class="chip red">Rejected</div>
                    <button class="btn yellow sm outline ml-1 offer-respond" data-id="${offer.id}" data-status="pending">Undo</button>
                ` : ''}
            </div>
        </div>
    `).join('')
}

function updateCars(car) {
  cars = cars.map(_car => {
    if (_car.id === car.id) return car;
    return _car;
  });
  populateCars(cars);
}

function updateOrders(order) {
  orders = orders.map(_order => {
    if (_order.id === order.id) return order;
    return _order;
  });
  populateOrders(orders);
}

function updateOffers(offer) {
  offers = offers.map(_offer => {
    if (_offer.id === offer.id) return offer;
    return _offer;
  });
  populateOffers(offers);
}

async function getOffers(id) {
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
    getOffers(e.target.dataset.id);
  }
  if (e.target.id === 'markAsSold') {
    e.target.disabled = true;
    markAsSold(e.target.dataset.id);
  }
  if (e.target.classList && e.target.classList.contains('offer-respond')) {
    const { id, status } = e.target.dataset;
    document.querySelectorAll('.offer-respond').forEach(el => {
      el.disabled = true
    });
    const offer = await Api.updateOffer(id, { status });
    updateOffers(offer);
  }
}

createForm.addEventListener('submit', (e) => create.handle(e));
createForm.querySelector('input[name="images"]').addEventListener('change', (e) => handleImages(e.target.files));
updateCarForm.addEventListener('submit', (e) => updateCar.handle(e));
updateOrderForm.addEventListener('submit', (e) => updateOrder.handle(e));

window.addEventListener('click', handleClick);

init();