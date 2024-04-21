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
  const { currentUser, setCurrentUser } = useContext(CurrentContext);
  const [tripData, setTripData] = useState({});
  const [currentTripId, setCurrentTripId] = useState();

  const navigate = useNavigate();

  const handleCreateTrip = (e) => {
    e.preventDefault();
    console.log(tripData);
    console.log(
      tripInputBudget.current.value + "   " + tripInputName.current.value
    );
    const tripName = tripInputName.current.value;
    const Budget = tripInputBudget.current.value;
    createItem("trip", user.id, { tripName, Budget })
      .then((response) => {
        setCurrentTrip(response.data);
        navigate("trip-planner");
      })
      .catch((err) => console.log(err));
  };

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
  const handleRemoveTrip = (index, id) => {
    const newTrips = [...trips];
    newTrips.splice(index, 1);
    setTrips(newTrips);
    deleteItem("trip", id);
  };

  const handleEditTrip = (e) => {
    e.preventDefault();
    const tripName = tripInputName.current.value;
    updateItem("trip", currentTripId, { tripName }).then((response) => {
      console.log(response);
      setCurrentTrip(response.data);
    });
    closeModal2();
  };

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

  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [modalIsOpen2, setIsOpen2] = React.useState(false);
  function openModal() {
    setIsOpen(true);
  }
  function openModal2(tripId) {
    setCurrentTripId(tripId);
    setIsOpen2(true);
  }
  function closeModal() {
    setIsOpen(false);
  }
  function closeModal2() {
    setIsOpen2(false);
  }

  return (
    <div className="cards-container">
      <div className="dashed-card" onClick={openModal}>
        <p>Start A New Trip</p>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Choose Trip Data Modal"
        appElement={document.getElementById("root")}
      >
        <form className="modal-form" onSubmit={handleCreateTrip}>
          <input
            type="text"
            placeholder="Enter Trip Name..."
            ref={tripInputName}
          />
          <input
            type="number"
            placeholder="Enter Budget..."
            ref={tripInputBudget}
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
                <button
                  className="outlined-button edit icon"
                  onClick={(event) => {
                    event.stopPropagation();
                    openModal2(trip.id, event);
                  }}
                >
                  <MdEdit />
                </button>
                <button
                  className="delete-button icon small-card"
                  onClick={() => handleRemoveTrip(index, trip.id)}
                >
                  <FaTrash />
                </button>
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
        isOpen={modalIsOpen2}
        onRequestClose={closeModal2}
        style={customStyles}
        contentLabel="Edit Trip Data Modal"
        appElement={document.getElementById("root")}
      >
        <form className="modal-form" onSubmit={handleEditTrip}>
          <input
            type="text"
            placeholder="Edit Trip Name..."
            ref={tripInputName}
          />
          <button type="submit" className="primary-button">
            Submit
          </button>
        </form>
      </Modal>
    </div>
  );
}

export default Dashboard;
