import { createContext, useEffect, useState } from "react";
import { getItem } from "../utils/CRUDService";
import lightLogo from "../assets/tripel/secondary-secondary-light.png";
import darkLogo from "../assets/tripel/secondary-secondary-dark.png";

export const CurrentContext = createContext({
  setTrips: () => {},
  currentTrip: {},
  setCurrentTrip: () => {},
  currentArea: {},
  setCurrentArea: () => {},
  currentHotel: {},
  setCurrentHotel: () => {},
  currentFlight: {},
  setCurrentFlight: () => {},
  currentDay: {},
  setCurrentDay: () => {},
  currentLogo: null,
  setCurrentLogo: () => {},
  currentUser: {},
  setCurrentUser: () => {},
});

export const CurrentContextProvider = ({ children }) => {
  const [currentTrip, setCurrentTrip] = useState({});
  const [currentArea, setCurrentArea] = useState({});
  const [currentHotel, setCurrentHotel] = useState({});
  const [currentFlight, setCurrentFlight] = useState({});
  const [currentDay, setCurrentDay] = useState({});
  const [currentLogo, setCurrentLogo] = useState(null);
  const [currentUser, setCurrentUser] = useState({});

  useEffect(() => {
    saveTripLocally({});
    saveUserLocally("fail")
    const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)");
    if (isDarkMode.matches) {
      setCurrentLogo(darkLogo);
    }else{
      setCurrentLogo(lightLogo)
    }
  }, []);

  useEffect(() => {
    // Load initial state from localStorage for each piece of state
    const loadInitialState = async () => {
      const tripId = localStorage.getItem("currentTrip");
      const areaId = localStorage.getItem("currentArea");
      const hotelId = localStorage.getItem("currentHotel");
      const flightId = localStorage.getItem("currentFlight");
      const dayId = localStorage.getItem("currentDay");
      const userId = localStorage.getItem("currentUser");

      // Load each piece of state if it exists in localStorage
      if (tripId) {
        const response = await getItem("trip", tripId);
        setCurrentTrip(response.data);
      }
      if (areaId) {
        const response = await getItem("area", areaId);
        setCurrentArea(response.data);
      }
      if (hotelId) {
        const response = await getItem("hotel", hotelId);
        setCurrentHotel(response.data);
      }
      if (flightId) {
        const response = await getItem("flight", flightId);
        setCurrentFlight(response.data);
      }
      if (dayId) {
        const response = await getItem("day", dayId);
        setCurrentDay(response.data);
      }
      if(userId){
        const response = await getItem("users", userId);
        setCurrentUser(response.data.id);
      }
    };

    loadInitialState();
  }, []);

  const saveUserLocally = async (userData) => {
    const myItem = localStorage.getItem("currentUser");
    if (userData !=="fail") {
      localStorage.setItem("currentUser", JSON.stringify(userData));
      setCurrentUser(userData);
    } else if (myItem !== null) {
      const newId = JSON.parse(localStorage.getItem("currentUser"));
      const response = await getItem("users", newId);
      setCurrentUser(response.data.id);
    } 
  }

  const saveTripLocally = async (tripData) => {
    const myItem = localStorage.getItem("currentTrip");
    if (Object.keys(tripData).length !== 0) {
      localStorage.setItem("currentTrip", JSON.stringify(tripData.id));
      setCurrentTrip(tripData);
    } else if (myItem !== null) {
      const newId = JSON.parse(localStorage.getItem("currentTrip"));
      const response = await getItem("trip", newId);
      setCurrentTrip(response.data);
    } 
  };


  const saveAreaLocally = async (areaData) => {
    const myItem = localStorage.getItem("currentArea");
    if (Object.keys(areaData).length !== 0) {
      localStorage.setItem("currentArea", JSON.stringify(areaData.id));
      setCurrentArea(areaData);
    } else if (myItem !== "undefined") {
      const newId = JSON.parse(localStorage.getItem("currentArea"));
      const response = await getItem("area", newId);
      setCurrentArea(response.data);
    } 
  };
  const saveHotelLocally = async (hotelData) => {
    const myItem = localStorage.getItem("currentHotel");
    if (Object.keys(hotelData).length !== 0) {
      localStorage.setItem("currentHotel", JSON.stringify(hotelData.id));
      setCurrentHotel(hotelData);
    } else if (myItem !== "undefined") {
      const newId = JSON.parse(localStorage.getItem("currentHotel"));
      const response = await getItem("hotel", newId);
      setCurrentHotel(response.data);
    } 
  };
  const saveFlightLocally = async (flightData) => {
    console.log(flightData);
    const myItem = localStorage.getItem('currentFlight');
    if(Object.keys(flightData).length !== 0){
      localStorage.setItem("currentFlight",JSON.stringify(flightData))
      setCurrentFlight(flightData)
    }else if(myItem !== "undefined"){
      const newId=JSON.parse(localStorage.getItem("currentFlight"));
      const response = await getItem("flight", newId)
      setCurrentFlight(response.data)
    } 
  };
  const saveDayLocally = async (dayData) => {
    // Check if dayData is not undefined or null before proceeding
    if (dayData) {
      const myItem = localStorage.getItem("currentDay");
      if (Object.keys(dayData).length !== 0) {
        localStorage.setItem("currentDay", JSON.stringify(dayData.id));
        setCurrentDay(dayData);
      } else if (myItem !== "undefined") {
        const newId = JSON.parse(localStorage.getItem("currentDay"));
        const response = await getItem("day", newId);
        setCurrentDay(response.data);
      } 
    } else {
      console.log("dayData is undefined or null");
    }
  };


  const contextValue = {
    currentTrip,
    setCurrentTrip: saveTripLocally,
    currentArea,
    setCurrentArea: saveAreaLocally,
    currentHotel,
    setCurrentHotel: saveHotelLocally,
    currentFlight,
    setCurrentFlight: saveFlightLocally,
    currentDay,
    setCurrentDay: saveDayLocally,
    currentUser,
    setCurrentUser: saveUserLocally,
    currentLogo,
    setCurrentLogo,
   
  };
  return (
    <CurrentContext.Provider value={contextValue}>
      {children}
    </CurrentContext.Provider>
  );
};
