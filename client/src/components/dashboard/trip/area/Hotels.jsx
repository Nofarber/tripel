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
import HotelCard from "./HotelCard";
import { getItemsWithFilter } from "../../../../utils/CRUDService";
import { CurrentContext } from "../../../../context/CurrentContext";
import Modal from "react-modal";
import { format } from "date-fns";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    padding: "2rem 1.5rem",
    borderRadius: "0.5rem",
  },
};

function Hotels() {
  const {
    hotels,
    setHotels,
    setMyHotels,
    mapRef,
    sendToLocation,
    isLoading,
    setIsLoading,
  } = useContext(GeneralContext);
  const { currentArea } = useContext(CurrentContext);
  const today = new Date();
  const [date, setdate] = useState({
    checkIn: today.toISOString().substring(0, 10),
    checkOut: today.toISOString().substring(0, 10),
  });

  // useEffect
  useEffect(() => {
    setHotels(JSON.parse(localStorage.getItem("hotelsDisplay")));
    hotels && setIsLoading(false);
    getItemsWithFilter("hotel", { areaId: currentArea.id })
      .then((response) => {
        setMyHotels(response.data);
      })
      .catch((err) => console.error(err));
  }, [currentArea]);

  // Functions
  // Returns the hotels for the current area and time
  async function handleSubmitHotels(search) {
    setIsLoading(true);
    const res = await fetchPlaceLanLon(search);

    if (res.region_id && res.coordinates) {
      sendToLocation(res.coordinates);
      const res2 = await fetchNearHotels(res.region_id, date);
      console.log(res2);
      setHotels(res2);
      res2 && localStorage.setItem("hotelsDisplay", JSON.stringify(res2));
      setIsLoading(false);
    }
  }

  // React-Modal functions and variables
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [existingHotel, setExistingHotel] = useState(null);
  const openModal = (data) => {
    setIsOpen(true);
    setExistingHotel(data);
  };
  const closeModal = () => {
    setIsOpen(false);
    setExistingHotel(null);
  };

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
                <HotelCard
                  cardType="outlined-card"
                  key={index}
                  hotel={hotel}
                  index={index}
                  openModal={openModal}
                />
              );
            })
          ) : (
            <p>No hotel found within the area, please try again.</p>
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
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Error message"
          appElement={document.getElementById("root")}
        >
          <form className="modal-form">
            <div>
              <h3>Overlapping Hotel Dates</h3>
              <br />
              <p>
                You have selected another hotel within the same dates.
                <br />
                If you wish to override the existing hotel,
                <br />
                please remove it before selecting a new one.
              </p>
              {existingHotel && (
                <div>
                  <br />
                  <div className="overlap-info">
                    <b>{existingHotel.hotelName}</b>{" "}
                    <p>
                      {format(existingHotel.checkIn, "dd/MM/yy")}-
                      {format(existingHotel.checkOut, "dd/MM/yy")}
                    </p>
                  </div>
                </div>
              )}
            </div>
            <button onClick={closeModal} className="primary-button">
              Continue
            </button>
          </form>
        </Modal>
      </div>
    </div>
  );
}

export default Hotels;
