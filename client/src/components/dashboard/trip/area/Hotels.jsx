import React, { useContext, useEffect, useRef, useState } from "react";
import { GeneralContext } from "../../../../context/GeneralContext";
import Map from "../../../general/Map";
import Skeleton from "react-loading-skeleton";
import "./area.css";
import {
  fetchNearHotels,
  fetchPlaceLanLon,
} from "../../../../utils/MapService";
import hotelPNG from "../../../../assets/image.png";
import {
  CreateDateFromMinMax,
  createItem,
} from "../../../../utils/CRUDService";
import { CurrentContext } from "../../../../context/CurrentContext";
import { FaCalendarDays } from "react-icons/fa6";
import placeholderImage from "../../../../assets/placeholder.jpg";

function Hotels() {
  const {
    isGuest,
    setUser,
    hotels,
    setHotels,
    mapRef,
    sendToLocation,
    isLoading,
    setIsLoading,
  } = useContext(GeneralContext);
  const { currentArea, currentTrip } = useContext(CurrentContext);
  const today = new Date();
  const [date, setdate] = useState({
    checkIn: currentArea?.minDate
      ? currentArea?.minDate.toISOString().substring(0, 10)
      : today.toISOString().substring(0, 10),
    checkOut: currentArea?.maxDay
      ? currentArea?.maxDay.toISOString().substring(0, 10)
      : today.toISOString().substring(0, 10),
  });

  useEffect(() => {
    setHotels(JSON.parse(localStorage.getItem("hotelsDisplay")));
    hotels && setIsLoading(false);
  }, []);

  async function handleSubmitHotels(search) {
    console.log(search);
    setIsLoading(true);
    const res = await fetchPlaceLanLon(search);

    if (res.region_id && res.coordinates) {
     
      sendToLocation(res.coordinates);

      const res2 = await fetchNearHotels(res.region_id, date);

      setHotels(res2);
      res2 && localStorage.setItem("hotelsDisplay", JSON.stringify(res2));
      setIsLoading(false);
    }
  }
  async function addHotelToTrip(data) {
    console.log(data);
    const res = await createItem("hotel", currentArea.id, data);
   
    console.log(res.data.hotel.id);
    await CreateDateFromMinMax(data.checkIn, data.checkOut, currentTrip.id, {
      hotelId: res.data.hotel.id,
    });
  }

  return (
    <div>
      <div className="hotels-container">
        <div className="cards-container">
          {isLoading ? (
            // Loader
            <Skeleton className="outlined-card smaller-skeleton" count={20} />
          ) : hotels ? (
            hotels.map((hotel, index) => {
              return (
                <div key={index} className="outlined-card hotel-card">
                  {hotel.image ? (
                    <img src={hotel.image} alt="Hotel image" />
                  ) : (
                    <img src={placeholderImage} alt="Hotel image" />
                  )}
                  <div className="info">
                    <div>
                      <h4 className="bold">{hotel.hotelName}</h4>
                      <div className="dates">
                        <span>
                          <FaCalendarDays />
                          {hotel.checkIn}
                        </span>
                        <span>
                          <FaCalendarDays />
                          {hotel.checkOut}
                        </span>
                      </div>

                      <p>
                        <b>Total Price:</b> {hotel.price}
                      </p>
                    </div>
                    <button
                      className="primary-button"
                      onClick={() => addHotelToTrip(hotel)}
                    >
                      Select
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <p>Location not found, please try again</p>
          )}
        </div>
        <div className="map-container">
          <Map
            mapType={"hotels"}
            handleSubmit={handleSubmitHotels}
            sendToLocation={sendToLocation}
            setdate={setdate}
            today={today}
            PNG={hotelPNG}
          />
        </div>
      </div>
    </div>
  );
}

export default Hotels;
