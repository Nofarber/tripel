import { useContext, useEffect, useState } from "react";
import { checkForUser, logout } from "../../../../utils/AuthService";
import { GeneralContext } from "../../../../context/GeneralContext";
import { fetchPlace, fetchPlaceLanLon } from "../../../../utils/MapService";
import eventlPNG from "../../../../assets/event.png";
import Map from "../../../general/Map";
import Skeleton from "react-loading-skeleton";
import {
  createItem,
  getItemsWithFilter,
  deleteItem,
} from "../../../../utils/CRUDService";
import { CurrentContext } from "../../../../context/CurrentContext";
import { FaLink, FaClock, FaPhone } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import placeholderImage from "../../../../assets/placeholder.jpg";

function EventCard({ event, index, cardType }) {
  const { myEvents, setMyEvents } = useContext(GeneralContext);
  const { currentArea } = useContext(CurrentContext);
  const today = new Date();
  const [date, setdate] = useState({
    checkIn: today.toISOString().substring(0, 10),
    checkOut: today.toISOString().substring(0, 10),
  });
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    const response = checkEventSelect(event);
    setIsChecked(response);
  }, []);

  async function eventAddToTrip(data) {
    const response = await createItem("event", currentArea.id, {
      eventName: data.name,
      eventInfo: JSON.stringify(data),
    });
    setIsChecked(response.data);
    console.log(response);
  }

  const checkEventSelect = (data) => {
    for (const event of myEvents) {
      if (event.eventName === data.name) {
        return event;
      }
    }
    return false;
  };

  async function eventRemoveFromTrip(data) {
    const event = checkEventSelect(data);
    const response = await deleteItem("event", event.id);
    setIsChecked(false);
    console.log(response);
  }

  return (
    <div key={index} className={`${cardType} event-card`}>
      {event.image ? (
        <img src={event.image} alt="Event image" />
      ) : (
        <img src={placeholderImage} alt="Event image" />
      )}
      <div>
        <div className="info">
          <div className="event-name">
            <h4 className="bold">{event.name}</h4>
            {event.website && (
              <a href={event.website} target="_blank">
                <FaLink />
              </a>
            )}
          </div>

          {event.openingHours && (
            <>
              <div>
                <p>
                  <FaClock />
                </p>
                <span>{event.openingHours}</span>{" "}
              </div>
            </>
          )}
          {event.contact && (
            <>
              <div>
                <p>
                  <FaPhone />
                </p>
                {event.contact}
              </div>
            </>
          )}
          <div>
            <p>
              <FaLocationDot />
            </p>
            <span>{event.address}</span>{" "}
          </div>
        </div>

        {isChecked ? (
          <button
            className="outlined-button"
            onClick={() => eventRemoveFromTrip(event)}
          >
            Remove
          </button>
        ) : (
          <button
            className="primary-button"
            onClick={() => eventAddToTrip(event)}
          >
            Add Event
          </button>
        )}
      </div>
    </div>
  );
}

export default EventCard;
