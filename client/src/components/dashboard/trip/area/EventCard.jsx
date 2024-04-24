import { useContext, useEffect, useState } from "react";
import { GeneralContext } from "../../../../context/GeneralContext";
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

  // useEffect
  useEffect(() => {
    const response = checkEventSelect(event);
    setIsChecked(response);
  }, []);

  // Functions
    // Fetch marked events within the area
  async function fetchMyEvents() {
    getItemsWithFilter("event", { areaId: currentArea.id })
      .then((response) => {
        setMyEvents(response.data);
      })
      .catch((err) => console.error(err));
  }

    // Assign event to an area
  async function eventAddToTrip(data) {
    const response = await createItem("event", currentArea.id, {
      eventName: data.name,
      eventInfo: JSON.stringify(data),
    });
    setIsChecked(response.data);
    fetchMyEvents()
    console.log(response);
  }
  
    // Check if an event is assigned
  const checkEventSelect = (data) => {
    for (const event of myEvents) {
      if (event.eventName === data.name) {
        return event;
      }
    }
    return false;
  };
  
    // Unassign event from an area
  async function eventRemoveFromTrip(data) {
    const event = checkEventSelect(data);
    const response = await deleteItem("event", event.id);
    setIsChecked(false);
    fetchMyEvents()
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
