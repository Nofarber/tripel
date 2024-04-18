import React, { useContext, useEffect, useState } from "react";
import {
  CreateDateFromMinMax,
  createItem,
  deleteItem,
  getItemsWithFilter,
} from "../../../../utils/CRUDService";
import { GeneralContext } from "../../../../context/GeneralContext";
import { CurrentContext } from "../../../../context/CurrentContext";
import { FaCalendarDays } from "react-icons/fa6";
import placeholderImage from "../../../../assets/placeholder.jpg";
import { isWithinInterval } from "date-fns";

function HotelCard({ cardType, hotel, index, openModal }) {
  const { myHotels, setMyHotels } = useContext(GeneralContext);
  const { currentArea, currentTrip } = useContext(CurrentContext);
  const [isChecked, setIsChecked] = useState(false);


  // useEffect
  useEffect(() => {
    const response = checkHotelSelect(hotel);
    setIsChecked(response);
  }, [myHotels]);

  // Functions
  // Adds hotel to trip
  async function addHotelToTrip(data) {
    const overlapExists = checkForOverlap(data)
    if (overlapExists) {
      // Display error message
      openModal(overlapExists.hotelInfo)
    } else {
      // Add hotel to trip
      const response = await createItem("hotel", currentArea.id, data);
      setIsChecked(response.data);
      await CreateDateFromMinMax(data.checkIn, data.checkOut, currentTrip.id, {
        hotelId: response.data.hotel.id,
      });
      // Update myHotels
      getItemsWithFilter("hotel", { areaId: currentArea.id })
    .then((response) => {
      setMyHotels(response.data);
    })
    .catch((err) => console.error(err))
    }
  }

  // Remove hotel from trip
  async function removeHotelFromTrip(data) {
    const hotel = checkHotelSelect(data);
    await deleteItem("hotel", hotel.id);
    setIsChecked(false);
    // Update myHotels
    getItemsWithFilter("hotel", { areaId: currentArea.id })
    .then((response) => {
      setMyHotels(response.data);
    })
    .catch((err) => console.error(err))
  }

  // Checks whether a hotel has been selected
  const checkHotelSelect = (data) => {
    for (const myHotel of myHotels) {
      if (
        myHotel.hotelName === data.hotelName &&
        myHotel.hotelInfo.checkIn === data.checkIn &&
        myHotel.hotelInfo.checkOut === data.checkOut
      ) {
        return myHotel;
      }
    }
    return false;
  };

  // Checks for overlapping hotel scheduling
  const checkForOverlap = (data) => {
    for (const myHotel of myHotels) {
      const overlapExists =
        isWithinInterval(data.checkIn, {
          start: myHotel.hotelInfo.checkIn,
          end: myHotel.hotelInfo.checkOut,
        }) ||
        isWithinInterval(data.checkOut, {
          start: myHotel.hotelInfo.checkIn,
          end: myHotel.hotelInfo.checkOut,
        }) ||
        (data.checkIn < myHotel.hotelInfo.checkIn &&
          data.checkOut > myHotel.hotelInfo.checkOut);
      if (overlapExists) {
        return myHotel;
      }
    }
    return false;
  };

  return (
    <div key={index} className={`${cardType} hotel-card`}>
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
        {isChecked ? (
          <button
            className="outlined-button"
            onClick={() => removeHotelFromTrip(hotel)}
          >
            Remove
          </button>
        ) : (
          <button
            className="primary-button"
            onClick={() => addHotelToTrip(hotel)}
          >
            Select
          </button>
        )}
      </div>
    </div>
  );
}

export default HotelCard;
