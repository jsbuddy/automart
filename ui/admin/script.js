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
    adsWrapper.innerHTML = `
        <div class="dashboard-item">
            <div class="empty">
                <div class="icon"><i class="fa fa-meh-blank"></i></div>
                <div class="text">No ad available.</div>
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
                  <div class="seller flex justify-between mt-2">
                      <div class="name flex align-center"><i class="fa fa-user-circle mr-1"></i>${car.owner.firstName} ${car.owner.lastName}</div>
                  </div>
              </div>
              <div class="right">
                  ${car.status === 'sold' ? `<div class="chip green">Sold</div>` : ''}
                  ${car.status === 'available' ? `<div class="chip blue">Available</div>` : ''}
              </div>
          </div>
          <div class="actions flex justify-between">
              <div>
                  <a href="../car/index.html?id=${car.id}" class="btn primary sm outline">View</a>
                  <button class="btn primary sm outline red" id="deleteCarModalTrigger" data-id="${car.id}">
                      Delete
                  </button>
              </div>
              <div class="right">
              </div>
          </div>
      </div>
  `).join('');
}

function populateFlags(flags) {
  if (!flags.length) {
    flagsWrapper.innerHTML = `
            <div class="dashboard-item">
                <div class="empty">
                    <div class="icon"><i class="fa fa-meh-blank"></i></div>
                    <div class="text">No flagged vehicle.</div>
                </div>
            </div>
        `;
    return;
  }

  flagsWrapper.innerHTML = flags.map(flag => `
        <div class="dashboard-item">
            <div class="details flex justify-between">
                <div>
                    <div class="seller flex justify-between">
                        <div class="name flex align-center">
                            <i class="fa fa-user-circle mr-1"></i>${flag.creator.firstName} ${flag.creator.lastName}&nbsp;
                            <span class="text-italic" style="font-style: italic">on ${formatDate((flag.createdAt))}</span>
                        </div>
                    </div>
                    <div class="title mt-2">${flag.car.manufacturer} ${flag.car.model} - &#8358;${flag.car.price.toLocaleString()}</div>
                    <div class="subtitle">Reason: ${capitalize(flag.reason)}</div>
                    <div class="subtitle">Description: ${flag.description}</div>
                </div>
                <div class="right">
                    ${flag.car.status === 'sold' ? `<div class="chip green">Sold</div>` : ''}
                    ${flag.car.status === 'available' ? `<div class="chip blue">Available</div>` : ''}
                    <div class="chip blue">${capitalize(flag.car.state)}</div>
                </div>
            </div>
            <div class="actions flex justify-between">
                <div>
                    <a href="../car/index.html?id=${flag.car.id}" class="btn primary sm outline">View</a>
                    <button class="btn primary sm outline red" id="deleteCarModalTrigger" data-id="${flag.car.id}">
                        Delete
                    </button>
                </div>
                <div class="right">
                </div>
            </div>
        </div>
    `).join('');
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
