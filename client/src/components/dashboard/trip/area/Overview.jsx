import React, { useContext, useEffect, useState } from "react";
import { checkForUser, logout } from "../../../../utils/AuthService";
import { GeneralContext } from "../../../../context/GeneralContext";
import { CurrentContext } from "../../../../context/CurrentContext";
import { format } from "date-fns";
import { getItemsWithFilter } from "../../../../utils/CRUDService";
import Skeleton from "react-loading-skeleton";
import hotelPNG from "../../../../assets/image.png";
import Map from "../../../general/Map";
import FlightsSummery from "./FlightsSummery";
import { FaLink, FaClock, FaPhone } from "react-icons/fa";
import { FaLocationDot, FaCalendarDays } from "react-icons/fa6";

function Overview() {
  const { user, setUser, areas, setAreas, isLoading, setIsLoading, setGoBack } =
    useContext(GeneralContext);
  const { currentTrip, setCurrentTrip, currentArea, setCurrentArea } =
    useContext(CurrentContext);
  const [allShownDays, setAllShownDays] = useState([]);
  const [allEventHotels, setAllEventHotels] = useState([]);
  const [allHotels, setAllHotels] = useState([]);

  // setGoBack("/dashboard")

  useEffect(() => {
    if (Object.keys(currentTrip).length > 0) {
      if (Object.keys(currentArea).length > 0) {
        const res = getAreaDays();
        res && setIsLoading(false);
      }
    }
  }, [currentTrip, currentArea]);

  const getAreaDays = async () => {
    const alldays = await getItemsWithFilter("area", { id: currentArea.id });
    setAllEventHotels(alldays.data[0]);

    setAllShownDays(alldays.data[0].Days);
    return alldays;
  };

  useEffect(() => {
    console.log(allShownDays);
  }, [allShownDays]);

  const handleCall = (number) => {
    window.location.href = `tel:${number}`;
  };
 
  

  return (
   
      <div className="overview-container">
        <div className="hotels-container">
          <div className="cards-container">
            <div >
              <div className="cards-container">
                {isLoading ? (
                  // Loader
                  <Skeleton className="outlined-card smaller-skeleton" count={20} />
                ) : allShownDays ? (
                  <>
                    {allShownDays.map((day, index) => {
                      return (
                        <div
                          key={index}
                          className="outlined-card overview-card"
                        >
                          <h4 className="bold">
                            Day #{index + 1}{" "}
                            <span>
                              {format(day.day, "EEEE, MMMM do, yyyy")}
                            </span>
                          </h4>
                          <hr />
                          {day?.Flights &&
                            day.Flights.map((flightRawData) => {
                              const flight = JSON.parse(
                                flightRawData.flightInfo
                              );
                              return (
                                <>
                                  <FlightsSummery
                                    flights={flight.flights}
                                    price={flight.price}
                                  />
                                </>
                              );
                            })}
                          {day.Hotel?.hotelInfo && (
                            <div className="hotel-preview">
                              <img
                                src={day.Hotel.hotelInfo.image}
                                alt="Hotel image"
                              />
                              <div className="text-over-image">
                                <h4>{day.Hotel.hotelInfo.hotelName}</h4>
                                <div className="dates">
                                  <span>
                                    <FaCalendarDays />
                                    {day.Hotel.hotelInfo.checkIn}
                                  </span>
                                  <span>
                                    <FaCalendarDays />
                                    {day.Hotel.hotelInfo.checkOut}
                                  </span>
                                </div>
                                <p>
                                  <b>Total Price:</b>{" "}
                                  {day.Hotel.hotelInfo.price}
                                </p>
                              </div>
                            </div>
                          )}
                          {day.Events &&
                            day.Events.map((event, index) => {
                              const parseEv = JSON.parse(event.eventInfo);

                              return (
                                parseEv && (
                                  <div
                                    key={index}
                                    className="filled-card no-click"
                                  >
                                    <div>
                                      <div>
                                        <h4>{parseEv.name}</h4>
                                        <div>
                                          {parseEv.website && (
                                            <a
                                              href={parseEv.website}
                                              target="_blank"
                                            >
                                              <FaLink />
                                            </a>
                                          )}
                                          {parseEv.contact && (
                                            <a href="" target="_blank">
                                              <FaPhone
                                                onClick={(event) => {
                                                  event.stopPropagation();
                                                  handleCall(parseEv.contact);
                                                }}
                                              />
                                            </a>
                                          )}
                                        </div>
                                      </div>
                                      <p>
                                        <FaLocationDot />
                                        {parseEv.address}
                                      </p>
                                    </div>
                                  </div>
                                )
                              );
                            })}
                        </div>
                      );
                    })}
                  </>
                ) : (
                  <p>Location not found, please try again</p>
                )}
              </div>
            </div>
          </div>
          <div className="map-container">
            <Map
              allEventHotels={allEventHotels}
              mapType={"overview"}
              PNG={hotelPNG}
            />
          </div>
        </div>
      </div>
    
  );
}

export default Overview;
