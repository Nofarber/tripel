import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GeneralContext } from "../../context/GeneralContext";
import Skeleton from "react-loading-skeleton";
import Modal from "react-modal";
import {
  createItem,
  getItemsWithFilter,
  deleteItem,
  updateItem,
} from "../../utils/CRUDService";
import { CurrentContext } from "../../context/CurrentContext";
import { MdEdit } from "react-icons/md";
import { FaTrash } from "react-icons/fa";

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

function Dashboard() {
  const { user, setUser, trips, setTrips, isLoading, setIsLoading } =
    useContext(GeneralContext);
  const tripInputName = useRef();
  const tripInputBudget = useRef();
  const { currentTrip, setCurrentTrip } = useContext(CurrentContext);
  const [tripId, setTripId] = useState();
  const navigate = useNavigate();

  //* useEffect
  useEffect(() => {
    getItemsWithFilter("trip", { userId: localStorage.getItem("currentUser") })
      .then((response) => {
        setTrips(response.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  }, [currentTrip]);

  //* Functions

  // Handles trip submissions
  const handleTripSubmit = (event) => {
    event.preventDefault();
    const tripName = tripInputName.current.value;
    const budget = tripInputBudget.current.value;
    //  If the trip exists then...
    if (tripId) {
      // Update trip
      updateItem("trip", tripId, { tripName, budget })
        .then((response) => {
          setCurrentTrip(response.data);
          closeModal();
        })
        .catch((err) => console.log(err));
      // Else...
    } else {
      // Create a new trip
      createItem("trip", user.id, { tripName, budget })
        .then((response) => {
          setCurrentTrip(response.data);
          navigate("trip-planner");
        })
        .catch((err) => console.log(err));
    }
  };

  // Enter into the trip-planner
  const handlePlanTrip = async (index) => {
    console.log(index);
    if (index === -1) {
      setCurrentTrip({});
    } else {
      const tempTrip = trips[index];
      console.log(tempTrip);
      setCurrentTrip(tempTrip);
    }
    navigate("trip-planner");
  };

  // Removes selected trip
  const handleRemoveTrip = (index, id) => {
    const newTrips = [...trips];
    newTrips.splice(index, 1);
    setTrips(newTrips);
    deleteItem("trip", id);
  };

  // Modal functions
  const [modalIsOpen, setIsOpen] = React.useState(false);
  function openModal(trip) {
    setCurrentTrip(trip);
    setTripId(trip.id || null);
    setIsOpen(true);
  }
  function closeModal() {
    setCurrentTrip(null);
    setTripId(null);
    setIsOpen(false);
  }

  return (
    <div className="cards-container">
      <div className="dashed-card" onClick={openModal}>
        <p>Start A New Trip</p>
      </div>
      <div className="trips">
        {!isLoading ? (
          trips.length > 0 ? (
            trips.map((trip, index) => (
              <div
                className="filled-card"
                key={index}
                onClick={() => handlePlanTrip(index)}
              >
                <h2>{trip.tripName}</h2>
                <div className="trip-buttons">
                  <button
                    className="outlined-button icon"
                    onClick={(event) => {
                      event.stopPropagation();
                      openModal(trip);
                    }}
                  >
                    <MdEdit />
                  </button>
                  <button
                    className="delete-button icon"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleRemoveTrip(index, trip.id);
                    }}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>You haven't planned any trips yet</p>
          )
        ) : (
          <Skeleton count={5} className="filled-card" />
        )}
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Choose Trip Data Modal"
        appElement={document.getElementById("root")}
      >
        <form className="modal-form" onSubmit={handleTripSubmit}>
          <input
            type="text"
            placeholder="Enter Trip Name..."
            ref={tripInputName}
            defaultValue={currentTrip.tripName || ""}
          />
          <input
            type="number"
            placeholder="Enter Budget..."
            ref={tripInputBudget}
            defaultValue={currentTrip.budget || ""}
          />
          <div className="modal-buttons">
            <button onClick={closeModal} className="outlined-button">
              Cancel
            </button>
            <button type="submit" className="primary-button">
              Submit
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default Dashboard;
