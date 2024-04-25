import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useState, useContext, useEffect } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import useGeoLocation from "../../hooks/useGeoLocation";
import { GeneralContext } from "../../context/GeneralContext";
import hotelPNG from "../../assets/image.png";
import { CurrentContext } from "../../context/CurrentContext";
import { fetchPlaceLanLon } from "../../utils/MapService";
import { addDays } from "date-fns";

export default function Map({
  mapType,
  handleSubmit,
  setdate,
  allEventHotels,
}) {
  const today = new Date();
  const iconUrl = "https://unpkg.com/leaflet@1.6/dist/images/marker-icon.png";
  const [center, setCenter] = useState({ lat: 13.084622, lng: 80.248357 });
  const {
    hotels,
    events,
    setEvents,
    mapRef,
    search,
    setSearch,
    setIsLoading,
    isLoading,
    sendToLocation,
  } = useContext(GeneralContext);
  const { currentArea } = useContext(CurrentContext);
  const ZOOM_LEVEL = 9;
  const location = useGeoLocation();

  const showMyLocation = () => {
    if (location.loaded && !location.error) {
      mapRef.current.flyTo(
        [location.coordinates.lat, location.coordinates.lng],
        ZOOM_LEVEL,
        { animate: true }
      );
    } else {
      alert(location.error.message);
    }
  };

  const eventIcon = new L.Icon({
    //creating a custom icon to use in Marker
    iconUrl: "https://img.icons8.com/3d-fluency/94/marker.png",
    iconSize: [25, 35],
    iconAnchor: [5, 30],
  });
  const hotelIcon = new L.Icon({
    //creating a custom icon to use in Marker
    iconUrl: "https://img.icons8.com/3d-fluency/94/order-delivered.png",
    iconSize: [25, 35],
    iconAnchor: [5, 30],
  });
  const mayLocationIcon = new L.Icon({
    //creating a custom icon to use in Marker
    iconUrl: "https://img.icons8.com/3d-fluency/94/gps-device.png",
    iconSize: [25, 35],
    iconAnchor: [5, 30],
  });

  function MapView({}) {
    let map = useMap();
    return null;
  }

  function renderIntoPopUp(event) {
    if (event) {
      return (
        <>
          <h5>{event.name}</h5>
          <h6>{event.address}</h6>
        </>
      );
    }
  }
  async function fetchCoordinates() {
    const areaCoordinates = await fetchPlaceLanLon(currentArea.areaName);

    mapType === "overview" &&
      areaCoordinates &&
      sendToLocation(areaCoordinates.coordinates);
  }

  //   to search for the first entered location
  useEffect(() => {
    if (search == "" && mapType != "overview") {
      setIsLoading(true);
      setSearch(currentArea.areaName || "")
      setIsLoading(false);
    }

    mapType === "overview" && currentArea.areaName && fetchCoordinates();
    
    // Resets the search on unmount
    return () => {
    setSearch("")
    };
    
    }, [currentArea]);


  return (
    <>
      {mapType !== "overview" && (
        <div className="map-inputs">
          <div>
            <input
              type="text"
              placeholder="Enter Location"
              defaultValue={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div>
              <button
                className="primary-button"
                onClick={() => handleSubmit(search)}
              >
                Submit
              </button>
              <button className="outlined-button" onClick={showMyLocation}>
                Locate Me
              </button>
            </div>
          </div>

          {mapType === "hotels" && (
            <div>
              <label>
                Check-in
                <input
                  type="date"
                  onChange={(e) =>
                    setdate((date) => ({
                      ...date,
                      checkIn: new Date(e.target.value)
                    }))
                  }
                  defaultValue={
                    currentArea?.minDate
                      ? addDays( currentArea?.minDate,1).toISOString().substring(0, 10)
                      : today.toISOString().substring(0, 10)
                  }
                />
              </label>
              <label>
                Check-out
                <input
                  type="date"
                  onChange={(e) =>
                    setdate((date) => ({
                      ...date,
                      checkOut: new Date(e.target.value),
                    }))
                  }
                  defaultValue={
                    currentArea?.maxDay
                      ? addDays( currentArea?.maxDay,1).toISOString().substring(0, 10)
                      : addDays( today,1).toISOString().substring(0, 10)
                  }
                />
              </label>
            </div>
          )}
        </div>
      )}

      <MapContainer
        ref={mapRef}
        className="map"
        center={center}
        zoom={ZOOM_LEVEL}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> 
          contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {location.loaded && !location.error && (
          <Marker
            icon={mayLocationIcon}
            position={[location.coordinates.lat, location.coordinates.lng]}
          >
            <Popup>{"my Location"}</Popup>
          </Marker>
        )}
        {hotels &&
          mapType === "hotels" &&
          hotels.map((hotel, key) => {
            return (
              hotel.lat &&
              hotel.long && (
                <Marker
                  key={key}
                  icon={hotelIcon}
                  position={[hotel.lat, hotel.long]}
                >
                  <Popup>{hotel.hotelName && hotel.hotelName}</Popup>
                </Marker>
              )
            );
          })}
        {events &&
          mapType === "events" &&
          events.map((event, key) => {
            return (
              event?.lat &&
              event?.long && (
                <Marker
                  key={key}
                  icon={eventIcon}
                  position={[event.lat, event.long]}
                >
                  <Popup>{event && renderIntoPopUp(event)}</Popup>
                </Marker>
              )
            );
          })}
        {allEventHotels?.Events &&
          mapType === "overview" &&
          allEventHotels.Events.map((ev, index) => {
            const parseEv = JSON.parse(ev.eventInfo);

            return (
              <Marker
                key={index}
                icon={eventIcon}
                position={[parseEv.lat, parseEv.long]}
              >
                <Popup>{parseEv && renderIntoPopUp(parseEv)}</Popup>
              </Marker>
            );
          })}

        {mapType === "overview" &&
          allEventHotels?.Hotels &&
          allEventHotels.Hotels.map((hotel, key) => {
            return (
              hotel.hotelInfo.lat &&
              hotel.hotelInfo.long && (
                <Marker
                  key={key}
                  icon={hotelIcon}
                  position={[hotel.hotelInfo.lat, hotel.hotelInfo.long]}
                >
                  <Popup>{hotel.hotelName}</Popup>
                </Marker>
              )
            );
          })}

        <MapView />
      </MapContainer>
    </>
  );
}
