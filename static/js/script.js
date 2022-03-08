let originCode = "";
let destinationCode = "";
let departureDate = "";
let fromLocationArray = [];
let toLocationArray = [];
let flights = [];

const fromLocationData = document.getElementById("fromLocationData");
const toLocationData = document.getElementById("toLocationData");
const flightData = document.getElementById("flightData");

function handleFromLocation() {
  let locationEl = "";
  const fromInput = document.getElementById("from").value;
  if (fromInput.length > 1) {
    fetch(`http://localhost:8001/api/v1/flight/select_destination/${fromInput}`)
      .then((response) => response.json())
      .then((data) => (fromLocationArray = data.data));

    if (fromLocationArray) {
      fromLocationData.style.display = "block";
      fromLocationArray.map((location) => {
        locationEl +=
          '<div class="card mb-3 mt-3" onclick="getFromLocation(\'' +
          location.iataCode +
          '\')">\
          <div class="card-header"><b>Name:</b>  ' +
          location.name +
          ' </div>\
          <div class="card-body">\
            City Name:  ' +
          location.address.cityName +
          "\
            <br />\
               Country Name:  " +
          location.address.countryName +
          '\
          </div>\
          <div class="card-footer">\
            <b>SubType:</b>  ' +
          location.subType +
          " \
          </div>\
        </div>";
      });
    }
  }

  fromLocationData.innerHTML = locationEl;
}

function getFromLocation(regionCode) {
  originCode = regionCode;
  console.log(originCode);
  fromLocationData.style.display = "none";
}

function handleToLocation() {
  let locationEl = "";
  const toInput = document.getElementById("to").value;
  if (toInput.length > 1) {
    fetch(`http://localhost:8001/api/v1/flight/select_destination/${toInput}`)
      .then((response) => response.json())
      .then((data) => (toLocationArray = data.data));

    if (toLocationArray) {
      toLocationData.style.display = "block";
      toLocationArray.map((location) => {
        locationEl +=
          '<div class="card mb-3 mt-3" onclick="getToLocation(\'' +
          location.iataCode +
          '\')">\
            <div class="card-header"><b>Name:</b>  ' +
          location.name +
          ' </div>\
            <div class="card-body">\
              City Name:  ' +
          location.address.cityName +
          "\
              <br />\
                 Country Name:  " +
          location.address.countryName +
          '\
            </div>\
            <div class="card-footer">\
              <b>SubType:</b>  ' +
          location.subType +
          " \
            </div>\
          </div>";
      });
    }
  }

  toLocationData.innerHTML = locationEl;
}

function getToLocation(regionCode) {
  destinationCode = regionCode;
  toLocationData.style.display = "none";
}

function handleFindFlight() {
  departureDate = document.getElementById("date").value;
  let flightEl = "";

  fetch(
    `http://localhost:8001/api/v1/flight/search_offers/?originCode=${originCode}&destinationCode=${destinationCode}&departureDate=${departureDate}`
  )
    .then((response) => response.json())
    .then((data) => {
      flights = data.data;

      if (flights) {
        flights.map((flight) => {
         console.log(flight)
          flightEl +=
            '\
         <div class="card mb-3 mt-3" >\
         <div class="card-header">\
           <b>Price:</b>  ' +
            flight.price.total +
            "  (\
           " +
            flight.price.currency +
            ' )\
         </div>\
         <div class="card-body">\
           Number of Seats Available:  ' +
            flight.numberOfBookableSeats +
            "\
           <br />\
           Last Ticketing Date:  " +
            flight.lastTicketingDate +
            "\
           <hr />\
           <h5>Itineraries</h5>\
           Duration:  " +
            flight.itineraries[0].duration +
            ' \
           <hr />\
           <h5>Enter your details:</h5>\
           <input type="text" id="first" placeholder="Your first Name" class="form-control"/>\
           <br />\
           <input type="text" id="last" placeholder="Your Last Name" class="form-control"/>\
         </div>\
         <div class="card-footer">\
           <button class="btn btn-primary" onclick="BookFlight(flight)">Book Flight</button>\
         </div>\
       </div>'
        });
        flightData.innerHTML = flightEl;
      } else {
        alert("No flight Data found");
      }
    });
}

function BookFlight(flight) {
  const first = document.getElementById("first").value;
  const last = document.getElementById("last").value;

  fetch("http://localhost:8001/api/v1/flight/price_offers", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      flight,
    }),
  })
    .then((response) => response.json())
    .then((dataObject) => {
      console.log("Success:", dataObject);

      fetch("http://localhost:8001/api/v1/flight/book_flight/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          flight,
          traveler: { first, last },
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Success:", data);
          flights = [];
        })
        .catch((error) => {
          alert(error);
        });
    })
    .catch((error) => {
      console.error("Error:", error);
      alert(error);
    });
}
