// Elements
const adsWrapper = document.getElementById('ads');
const flagsWrapper = document.getElementById('flags');
const confirmDelete = document.getElementById('confirmDelete');
const cancelDelete = document.getElementById('cancelDelete');
// Modals
const deleteCarModal = new ModalController(document.getElementById('deleteModal'));
// Data
let cars = [];
let flags = [];

function populateCars(cars) {
  if (!cars.length) {
    adsWrapper.innerHTML = `<div class="dashboard-item">${Markup.empty('No ad available.')}</div>`;
    return;
  }
  adsWrapper.innerHTML = cars.map(car => Markup.carAdmin(car)).join('');
}

function populateFlags(flags) {
  if (!flags.length) {
    flagsWrapper.innerHTML = `<div class="dashboard-item">${Markup.empty('No flagged vehicle.')}</div>`;
    return;
  }
  flagsWrapper.innerHTML = flags.map(flag => Markup.flagAdmin(flag)).join('');
}

function removeCar(id) {
  cars = cars.reduce((_cars, car) => {
    if (car.id !== id) _cars.push(car);
    return _cars;
  }, []);
  populateCars(cars);
}

async function deleteCar() {
  confirmDelete.disabled = true;
  cancelDelete.disabled = true;
  const deleted = await Api.deleteCar(current);
  confirmDelete.disabled = false;
  cancelDelete.disabled = false;
  if (deleted) {
    removeCar(current);
    deleteCarModal.close();
  }
}

async function init() {
  [cars, flags] = await Promise.all([Api.getAllCars(), Api.getFlags()]);
  populateCars(cars);
  populateFlags(flags);
}

init();

window.addEventListener('click', async (e) => {
  if (e.target.id === 'deleteCarModalTrigger') {
    current = e.target.dataset.id;
    deleteCarModal.show();
  }
});

confirmDelete.addEventListener('click', deleteCar);
cancelDelete.addEventListener('click', deleteCarModal.close());
