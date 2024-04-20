import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GeneralContext } from "../../context/GeneralContext";
import Skeleton from "react-loading-skeleton";
import { FaTrash } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import {
  CreateDateFromMinMax,
  createItem,
  getItemsWithFilter,
  updateItem,
  deleteItem,
} from "../../utils/CRUDService";
import Modal from "react-modal";
import { CurrentContext } from "../../context/CurrentContext";
import { MdEdit } from "react-icons/md";
import "./dashboard.css";
import { format, addDays, min, max, isAfter, isEqual } from "date-fns";
import { GrNext } from "react-icons/gr";

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

function TripPlanner() {
  // CONTEXT
  const {
    user,
    setUser,
    areas,
    setAreas,
    isLoading,
    setIsLoading,
    setGoBack,
    flights,
    setFlights,
  } = useContext(GeneralContext);

  const {
    currentTrip,
    setCurrentTrip,
    currentArea,
    setCurrentArea,
    setCurrentFlight,
  } = useContext(CurrentContext);

  // STATES
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(addDays(new Date(), 1));
  const [areaDays, setAreaDays] = useState([]);
  const [flightsAndAreas, setFlightsAndAreas] = useState([{ areaName: "" }]);
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [areaIndex, setAreaIndex] = useState(-1);
  const [newArea, setNewArea] = useState("");
  const navigate = useNavigate();
  const areaNameRef = useRef();
  const areaStartRef = useRef();
  const areaEndRef = useRef();


  // USE EFFECTS
  useEffect(() => {
    console.log(flightsAndAreas);
   
  }, [flightsAndAreas]);



  useEffect(() => {
    if (user.id) {
      setGoBack("/dashboard");
    }

    if (currentArea.id) {
      getItemsWithFilter("area", { Id: currentArea.id })
        .then((response) => {
          setAreaDays(response.data[0].Days);
        })
        .catch((err) => console.error(err));
    }

    setIsLoading(true);

    getItemsWithFilter("trip", { id: currentTrip.id })
      .then((response) => {
        if (localStorage.getItem("currentTrip") == response.data[0].id) {
          if (response.data[0].Areas.length > 0) {
            setAreas(response.data[0].Areas);
          }
          if (response.data[0].Flights.length > 0) {
            setFlights(response.data[0].Flights);
          }

          if (response.data[0].Areas[0].tripId === currentTrip.id) {
            orderShown(response.data[0].Areas, response.data[0].Flights);
          }
        }
      })
      .finally(() => {
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  }, [currentTrip, currentArea, user.id]);

  // FUNCTIONS
  // MODAL FUNCTIONS
  function openModal(index) {
    setAreaIndex(index);
    setStartDate(getFirstDay());
    setEndDate(getLastDay());
    setIsOpen(true);
  }
  function closeModal() {
    setAreaDays([]);
    setAreaIndex(-1);
    setIsOpen(false);
  }

  // DAYS FUNCTIONS
  const orderShown = (tempAreas, tempFlights) => {
    const tempAllShownArr = tempAreas.concat(tempFlights);
    const arr2 = tempAllShownArr?.map(
      (v) =>
        (v = {
          ...v,
          minDate: min(v?.Days?.map((d) => d?.day)),
          maxDay: max(v?.Days?.map((d) => d?.day)),
        })
    );
    const arr3 = arr2.sort((a, b) =>
      (
        isEqual(a.minDate, b.minDate)
          ? isAfter(a.maxDate, b.maxDate)
            ? true
            : false
          : isAfter(a.minDate, b.minDate)
      )
        ? 1
        : -1
    );
    setFlightsAndAreas(arr3);
  };

  const handleDate = (event) => {
    event.preventDefault()
    console,log(event.target)
    const selectedDate = new Date(event.target.value);
    setStartDate(selectedDate);
    if (selectedDate > endDate) {
      setEndDate(addDays(selectedDate, 1));
    }
  };

  const handleEndDateChange = (event) => {
    const selectedDate = new Date(event.target.value);
    setEndDate(selectedDate);
  };

  const getFirstDay = () => {
    if (areaDays?.length > 0) {
      return areaDays[0]?.day;
    } else {
      return new Date();
    }
  };
  const getLastDay = () => {
    if (areaDays?.length > 0) {
      return areaDays[areaDays.length - 1]?.day;
    } else {
      return addDays(new Date(), 1);
    }
  };

  // AREA FUNCTIONS
  const handleAreaChange = (event) => {
    const updatedFlightsAndAreas = [...flightsAndAreas];
    updatedFlightsAndAreas[areaIndex].areaName = event.target.value;
    setFlightsAndAreas([...updatedFlightsAndAreas]);
    setNewArea(event.target.value);
  };

  const handleChooseArea = (location) => {
    const tempArea = location;
    setCurrentArea(tempArea);
    navigate("area/overview");
  };

  const handleAreaEdit = (event, index) => {
    event.stopPropagation();
    setCurrentArea(flightsAndAreas[index]);
    openModal(index);
  };

  const handleAreaAdd = (index) => {
    openModal(index);
  };

  const handleAreaSubmit = (event) => {
    event.preventDefault()
    const areaName=areaNameRef.current.value
    const startDate=new Date(areaStartRef.current.value)
    const endDate=new Date(areaEndRef.current.value)
    setNewArea(areaName)
  
    

    if (flightsAndAreas[areaIndex].id) {
      updateItem(
        "area",
        flightsAndAreas[areaIndex].id,
        flightsAndAreas[areaIndex]
      )
        .then((response) => {
          CreateDateFromMinMax(startDate, endDate, currentTrip.id, {
            areaId: response.data.id,
          })
            .then(() => {
  
              window.location.reload();
            })
            .catch((err) => console.error(err));
          closeModal();
        })
        .catch((err) => console.error(err));
    }
     else {
      createItem("area", currentTrip.id, { areaName: areaName })
        .then((response) => {
          CreateDateFromMinMax(startDate, endDate, currentTrip.id, {
            areaId: response.data.area.id,
          })
            .then(() => {
            
              window.location.reload()
             
            })
            .catch((err) => console.error(err));
          closeModal();
        })
        .catch((err) => console.error(err));
    }
  };

  // FLIGHT FUNCTIONS
  const handleChooseFlight = (info) => {
    if (info) {
      setCurrentFlight(info);
      navigate("flightShowCase");
    } else {
      navigate("flights");
    }
  };

  // LOCATION FUNCTIONS (AREAS & FLIGHTS)
  const handleAddLocation = (index) => {
    const newAreas = [...flightsAndAreas];
    newAreas.splice(index + 1, 0, { areaName: "" });
    setFlightsAndAreas(newAreas);
  };

  const handleRemoveLocation = (index, id, nextItem) => {
    const newAreas = [...flightsAndAreas];
    newAreas.splice(index, 1);
    setFlightsAndAreas(newAreas);
    deleteItem("area", id);
    if (nextItem?.flightName) {
      deleteItem("flight", nextItem.id);
    }
  };

  const isNotOnlyLocation = () => {
    if (flightsAndAreas.length > 3) {
      return true;
    } else if (flightsAndAreas[0]?.flightInfo) {
      if (flightsAndAreas[2]?.flightInfo && flightsAndAreas.length === 3) {
        return false;
      } else if (flightsAndAreas.length === 2) {
        return false;
      }
    } else {
      if (flightsAndAreas[1]?.flightInfo && flightsAndAreas.length === 2) {
        return false;
      } else if (flightsAndAreas.length === 1) {
        return false;
      }
    }
    return true;
  };

  // PAYMENT FUNCTIONS
  const handlePayment = () => {
    navigate("payment");
  };

  return (
    <div>
      <div className="cards-container-center">
        {isLoading ? (
          <div className="flight-location-container">
            <Skeleton className="filled-card small-card flight-sk" />{" "}
            <Skeleton className="filled-card" />
            <Skeleton className="filled-card small-card flight-sk" />{" "}
            <Skeleton className="filled-card" />
            <Skeleton className="filled-card small-card flight-sk" />{" "}
            <Skeleton className="filled-card" />
            <Skeleton className="filled-card small-card flight-sk" />{" "}
            <Skeleton className="filled-card" />
            <Skeleton className="filled-card small-card flight-sk" />{" "}
            <Skeleton className="filled-card" />
          </div>
        ) : (
          <div className="flight-location-container">
            {flightsAndAreas[0]?.flightName ? (
              <div
                className="filled-card small-card"
                onClick={() => handleChooseFlight(flightsAndAreas[0])}
                style={{ marginLeft: "0.5rem" }}
              >
                <div className="flight-preview">
                  <img
                    src={
                      JSON.parse(flightsAndAreas[0].flightInfo).flights[0]
                        .airline_logo
                    }
                    alt=""
                    className="flight-company-img"
                  />
                  <span>
                    {
                      JSON.parse(flightsAndAreas[0].flightInfo).flights[0]
                        .departure_airport.id
                    }
                  </span>
                  <GrNext />
                  <span>
                    {
                      JSON.parse(flightsAndAreas[0].flightInfo).flights[
                        JSON.parse(flightsAndAreas[0].flightInfo).flights
                          .length - 1
                      ].arrival_airport.id
                    }{" "}
                  </span>
                </div>
              </div>
            ) : (
              <div
                className="filled-card small-card"
                onClick={() => handleChooseFlight(false)}
              >
                <p> Add Flight To...</p>
              </div>
            )}
            
            {flightsAndAreas.length > 0 &&
              flightsAndAreas.map(
                (location, index) =>
                  (location?.areaName || location?.areaName == "") && (
                    <div key={index} className="flight-location-container">
                      {flightsAndAreas[index].areaName == "" ? (
                        <div
                          className="filled-card"
                          onClick={() => handleAreaAdd(index)}
                        >
                          <h2>{newArea!==""?newArea: "Enter Location"}</h2>{" "}
                        </div>
                      ) : (
                        <div
                          className="filled-card"
                          onClick={() => handleChooseArea(location)}
                        >
                          <h2>{location.areaName}</h2>
                          <button
                            className="outlined-button edit icon"
                            onClick={(event) => handleAreaEdit(event, index)}
                          >
                            <MdEdit />
                          </button>
                        </div>
                      )}

                      <div className="flight-location">
                        {flightsAndAreas[index + 1]?.flightName ? (
                          <div
                            className="filled-card small-card"
                            onClick={() =>
                              handleChooseFlight(flightsAndAreas[index + 1])
                            }
                          >
                            <div className="flight-preview">
                              <img
                                src={
                                  JSON.parse(
                                    flightsAndAreas[index + 1].flightInfo
                                  ).flights[0].airline_logo
                                }
                                alt=""
                                className="flight-company-img"
                              />
                              <span>
                                {
                                  JSON.parse(
                                    flightsAndAreas[index + 1].flightInfo
                                  ).flights[0].departure_airport.id
                                }
                              </span>
                              <GrNext />
                              <span>
                                {
                                  JSON.parse(
                                    flightsAndAreas[index + 1].flightInfo
                                  ).flights[
                                    JSON.parse(
                                      flightsAndAreas[index + 1].flightInfo
                                    ).flights.length - 1
                                  ].arrival_airport.id
                                }{" "}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div
                            className="filled-card small-card"
                            onClick={() => handleChooseFlight(false)}
                          >
                            <p> Add Flight To...</p>
                          </div>
                        )}
                        <button
                          className="primary-button icon small-card"
                          onClick={() => handleAddLocation(index)}
                        >
                          <FaPlus />
                        </button>
                        {isNotOnlyLocation() && (
                          <button
                            className="delete-button icon small-card"
                            onClick={() =>
                              handleRemoveLocation(index, location.id)
                            }
                          >
                            <FaTrash />
                          </button>
                        )}
                      </div>
                      {/* MODAL */}
                      <Modal
                        isOpen={modalIsOpen}
                        onRequestClose={closeModal}
                        style={customStyles}
                        contentLabel="Choose Area Modal"
                        appElement={document.getElementById("root")}
                        index={index}
                      >
                        <form className="modal-form" onSubmit={handleDate}>
                          <input
                          ref={areaNameRef}
                            type="text"
                            placeholder="Enter Location..."
                            defaultValue={
                              flightsAndAreas[areaIndex]?.areaName || ""
                            }
                          />
                          <div className="date-inputs">
                            <label htmlFor="start-date">
                              Start Date
                              <input
                                ref={areaStartRef}
                                type="date"
                                id="start-date"
                                defaultValue={format(
                                  getFirstDay(),
                                  "yyyy-MM-dd"
                                )}
                                min={format(new Date(), "yyyy-MM-dd")}
                              />
                            </label>

                            <label htmlFor="end-date">
                              End Date
                              <input
                                ref={areaEndRef}
                                type="date"
                                id="end-date"
                                defaultValue={format(
                                  getLastDay(),
                                  "yyyy-MM-dd"
                                )}
                                min={format(
                                  addDays(new Date(), 1),
                                  "yyyy-MM-dd"
                                )}
                                onChange={handleEndDateChange}
                              />
                            </label>
                          </div>
                          <div className="modal-buttons">
                            <button
                              onClick={closeModal}
                              className="outlined-button"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={handleAreaSubmit}
                              className="primary-button"
                            >
                              Submit
                            </button>
                          </div>
                        </form>
                      </Modal>
                    </div>
                  )
              )}
          </div>
        )}
      </div>
      {/* <button className="primary-button" onClick={handlePayment}>
        Payment
      </button> */}
    </div>
  );
}

export default TripPlanner;
