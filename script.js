'use strict';

const sideBar = document.querySelector('.sidebar');
const myLocationToggle = document.querySelector('.toggle-checkbox');

const dealerList = [
  {
    company: 'Thermoluxe',
    id: 1,
    address: '501 Oakdale Rd, Toronto, Ontario, M3N 1W7',
    phone: '1 (416) 736-7276',
    email: 'info@thermoluxe.com',
    website: '<a href="https://thermoluxe.com/">https://thermoluxe.com/</a>',
    coords: [43.7499021, -79.5283706],
    img: 'thermoluxe-logo.png',
  },
  {
    company: 'Northview',
    id: 2,
    address: '501 Oakdale Rd, Toronto, Ontario, M3N 1W7',
    phone: '1 (416) 736-7276',
    email: 'info@northviewcanada.com',
    website:
      '<a href="https://northviewcanada.com/">https://northviwcanada.com/</a>',
    coords: [43.5, -78],
    img: 'nv-group-logo.png',
  },
  {
    company: 'Factory Direct',
    id: 3,
    address: '1190 Rue Bégin, Saint-Laurent, QC H4R 1X1',
    phone: '514 387-0001',
    email: 'info@factorydirectMTL.ca',
    website:
      '<a href="https://www.factorydirectmontreal.ca">www.factorydirectmontreal.ca</a>',
    coords: [45.4931772, -73.7143227],
    img: 'factory-direct.png',
  },
];

// initial map rendering
let map = L.map('map').setView(
  [dealerList[0].coords[0], dealerList[0].coords[1]],
  5
);

// dealers icon setup
const dealersMarker = L.icon({
  iconUrl: '/img/markers/blue-marker.png',

  iconSize: [36, 36],
  shadowSize: [50, 64],
  iconAnchor: [22, 94],
  shadowAnchor: [4, 62],
  popupAnchor: [-3, -76],
});

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

// user location
let userMarker;
function onLocationFound(e) {
  const userMarkerIcon = L.icon({
    iconUrl: '/img/markers/green-marker.png',
    iconSize: [36, 36],
    shadowSize: [50, 64],
    iconAnchor: [22, 94],
    shadowAnchor: [4, 62],
    popupAnchor: [-3, -76],
  });

  userMarker = L.marker(e.latlng, { icon: userMarkerIcon })
    .addTo(map)
    .bindPopup('You are here')
    .openPopup();
}

myLocationToggle.addEventListener('change', function (e) {
  if (myLocationToggle.checked) {
    map.locate({ setView: true, maxZoom: 5 });
    map.on('locationfound', onLocationFound);
  } else {
    map.removeLayer(userMarker);
    pinsRendering(dealerList);
  }
});

// Rendering a company
const renderingCompany = function (company) {
  const [lat, lng] = company.coords;
  L.marker([lat, lng], { icon: dealersMarker })
    .addTo(map)
    .bindPopup(`${company.company}`)
    .openPopup();
};

// Rendering all pins
const pinsRendering = function (arr) {
  arr.forEach(element => {
    renderingCompany(element);
  });
};

const sideBarList = function (arr) {
  arr.forEach(element => {
    sideBar.insertAdjacentHTML(
      'beforeend',
      `<div class="company-block" data-set=${element.id}>
      <div class="company-info">
      <div class="company-logo">
      <img src="img/${element.img}" />
    </div>
    <h2>${element.company}</h2>
    <p><strong>Address</strong>: ${element.address}</p>
    <p><strong>Phone:</strong> ${element.phone}</p>
    <p><strong>Email:</strong> ${element.email}</p>
    <p><strong>Website:</strong> ${element.website}</p>
    </div>
    </div>
    <br/>`
    );
  });
};

const moveToPin = function (e) {
  const companyEl = e.target.closest('.company-block');
  const allCompanyBlocks = document.querySelectorAll('.company-block');

  if (!companyEl) return;

  const company = dealerList.find(
    el => el.id === parseInt(companyEl.dataset.set)
  );

  renderingCompany(company);
  const [lat, lng] = company.coords;
  map.setView([lat, lng], 5, {
    animate: true,
    pan: {
      duration: 1,
    },
  });

  (function clearActiveStyle(arr) {
    arr.forEach(element => {
      element.classList.remove('active-block');
    });
  })(allCompanyBlocks);

  companyEl.classList.add('active-block');
};

sideBar.addEventListener('click', moveToPin);
pinsRendering(dealerList);
sideBarList(dealerList);
