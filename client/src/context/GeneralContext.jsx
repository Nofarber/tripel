import { createContext, useEffect, useRef, useState } from "react";
import { checkForUser, logout } from "../utils/AuthService";
import { useNavigate } from "react-router-dom";

export const GeneralContext = createContext({
  isLoading: false,
  setIsLoading: () => {},
  isGuest: false,
  setIsGuest: () => {},
  goBack: "",
  setGoBack: () => {},
  user: {},
  setUser: () => {},
  trips: [],
  setTrips: () => {},
  areas: [],
  setAreas: () => {},
  hotels: [],
  setHotels: () => {},
  events: [],
  setEvents: () => {},
  mapRef: {},
  search: "",
  setSearch: () => {},
  sendToLocation: () => {},
  flights: [],
  setFlights: () => {},
  myHotels: [],
  setMyHotels: () => {},
  myEvents: [],
  setMyEvents: () => {},
  myFlights: [],
  setMyFlights: () => {},
  myDays: [],
  setMyDays: () => {},
});

export const GeneralContextProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);
  const [goBack, setGoBack] = useState("");
  const [user, setUser] = useState({});
  const [trips, setTrips] = useState([]);
  const [hotels, setHotels] = useState(localStorage.getItem("hotelsDisplay")?JSON.parse(localStorage.getItem("hotelsDisplay")):[]);
  const [events, setEvents] = useState([]);
 
  const [search, setSearch] = useState("");

  const [myHotels, setMyHotels] = useState([]);
  const [myEvents, setMyEvents] = useState([]);
  const [flights, setFlights] = useState([]);
  const [myFlights, setMyFlights] = useState([]);
  const [myDays, setMyDays] = useState([]);
  const [areas, setAreas] = useState([{ areaName: "" }]);
  const [checkGuestUpdate, setCheckGuestUpdate] = useState(false);
  const mapRef = useRef();
  const navigate = useNavigate();

  const checkForGuest = (bool) => {
    if (bool === false) {
      const guest = JSON.parse(localStorage.getItem("guest"));
      setIsGuest(!!guest);
    } else if (bool === true) {
      localStorage.setItem("guest", JSON.stringify({}));
      setIsGuest(true);
      setCheckGuestUpdate(true);
    }
  };

  useEffect(() => {
    // console.log("TRIPS ", trips);
    // console.log("AREAS ", areas);
  }, [trips, areas]);


  useEffect(() => {
    checkForGuest();
  }, []);

  const fetchUser = async () => {
    const response = await checkForUser();
    if (response.data) {
      setUser(response.data);
    } else if (checkGuestUpdate && !isGuest) {
      logout();
      navigate("/");
    }
    setCheckGuestUpdate(false);
  };

  useEffect(() => {
    fetchUser();
  }, [isGuest]); // Run this effect whenever isGuest state changes

  function sendToLocation({ lat, long }) {
    if (lat && long) {
      mapRef.current.flyTo([lat, long], 9, { animate: true });
    } else {
      alert(location.error.message);
    }
  }

  const contextValue = {
    isLoading,
    setIsLoading,
    isGuest,
    setIsGuest: checkForGuest,
    goBack,
    setGoBack,
    user,
    setUser,
    trips,
    setTrips,
    areas,
    setAreas,
    hotels,
    setHotels,
    events,
    setEvents,
    mapRef,
    search,
    setSearch,
    sendToLocation,
    myHotels,
    setMyHotels,
    myEvents,
    setMyEvents,
    flights,
    setFlights,
    myFlights,
    setMyFlights,
    myDays,
    setMyDays,
  };
  return (
    <GeneralContext.Provider value={contextValue}>
      {children}
    </GeneralContext.Provider>
  );
};
