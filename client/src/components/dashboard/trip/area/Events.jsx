import { useContext, useEffect, useState } from "react";
import { checkForUser, logout } from "../../../../utils/AuthService";
import { GeneralContext } from "../../../../context/GeneralContext";
import { fetchPlace, fetchPlaceLanLon } from "../../../../utils/MapService";
import eventPNG from "../../../../assets/event.png";
import Map from "../../../general/Map";
import Skeleton from "react-loading-skeleton";
import { createItem ,getItemsWithFilter, deleteItem} from "../../../../utils/CRUDService";
import { CurrentContext } from "../../../../context/CurrentContext";
import { FaLink, FaClock, FaPhone } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { MdOutlineCheckBox, MdOutlineAddBox } from "react-icons/md";
import EventCard from "./EventCard";

function Events() {
  const {
    isGuest,
    setUser,
    events,
    mapRef,
    sendToLocation,
    setEvents,
    isLoading,
    setIsLoading,
    myEvents,
    setMyEvents
  } = useContext(GeneralContext);
  const { currentArea } = useContext(CurrentContext);
  const today = new Date();
  const [date, setdate] = useState({
    checkIn: today.toISOString().substring(0, 10),
    checkOut: today.toISOString().substring(0, 10),
  });
  
  
  useEffect(() => {
    setEvents(JSON.parse(localStorage.getItem("eventsDisplay")));
 getItemsWithFilter("event", { areaId: currentArea.id })
      .then((response) => {
        setMyEvents(response.data);
      })
      .catch((err) => console.error(err))
  }, [currentArea]); 
  
  async function setItemLocalStorage() {
    localStorage.setItem("eventsDisplay", JSON.stringify(events));
  }


  async function handleSubmitEvents(search) {
    setIsLoading(true);
    const res = await fetchPlaceLanLon(search);
    console.log(search);

    if (res.region_id && res.coordinates) {
      sendToLocation(res.coordinates);

      const res2 = await fetchPlace(res.coordinates);

      if (res2) {
        setEvents(res2.filter((elm) => elm !== null));
        setItemLocalStorage()
        setIsLoading(false);
      }
    }
  }


  return (
    <div>
      <div className="hotels-container">
        <div className="cards-container">
          {isLoading ? (
            // Loader
            <Skeleton className="outlined-card smaller-skeleton" count={20} />
          ) : events ? (
            events.map((event, index) => {
              return (<EventCard cardType="outlined-card" key={index} event={event} index={index} />
              );
            })
          ) : (
            <p >No event found within the area</p>
          )}

          <></>
        </div>
        <div className="map-container">
          <Map
            mapType={"events"}
            handleSubmit={handleSubmitEvents}
            sendToLocation={sendToLocation}
            setdate={setdate}
            today={today}
            PNG={eventPNG}
          />
        </div>
      </div>
    </div>
  );
}

export default Events;
