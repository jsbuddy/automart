const Markup = {
  car: car => `
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
                <button class="btn primary sm outline" id="offersModalTrigger" data-id="${car.id}">
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
  `,
  offer: offer => `
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
                ` : ''}
            ${offer.status === 'rejected' ? `
                <div class="chip red">Rejected</div>
            ` : ''}
        </div>
    </div>
  `,
  order: order => `
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
                <a href="../car/index.html?id=${order.car.id}" class="btn primary sm outline">View</a>
                ${order.status === 'pending' ? `
                    <button class="btn primary sm outline" id="updateOrderPriceModalTrigger" data-id="${order.id}">
                        Update Price
                    </button>
                ` : ''}
            </div>
        </div>
    </div>
  `,
  flagAdmin: flag => `
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
<!--              <button class="btn primary sm outline red" id="deleteCarModalTrigger" data-id="${flag.car.id}">Delete</button>-->
          </div>
          <div class="right">
          </div>
      </div>
  </div>
  `,
  carAdmin: car => `
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
  `,
  singleCar: car => `
    <div class="left">
        <div class="carousel">
            <div class="image siema">
                ${
                    car.images.map((image) => `
                        <div>
                            <img src="${image.url || 'assets/images/placeholder.png'}" alt="">
                        </div>
                    `).join('')
                }
            </div>
            <div class="s-button prev"><i class="fa fa-chevron-left"></i></div>
            <div class="s-button next"><i class="fa fa-chevron-right"></i></div>
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
  `,
  empty: message => `
    <div class="empty">
        <div class="icon"><i class="fa fa-meh-blank"></i></div>
        <div class="text">${message}</div>
    </div>
  `,
};