import axios from "axios";
import { eachDayOfInterval } from "date-fns";

axios.defaults.withCredentials = true;

export const createItem = async (type, parentId, data) => {
  console.log(type, parentId, data);
  return axios.post(
    `${import.meta.env.VITE_API_URL}/${type}/new/${parentId}`,
    data
  );
};

export const updateItem = async (type, id, data) => {
  return axios.patch(
    `${import.meta.env.VITE_API_URL}/${type}/update/${id}`,
    data
  );
};

export const getItemsWithFilter = async (type, filterObj) => {
  return axios.post(
    `${import.meta.env.VITE_API_URL}/${type}/getall`,
    filterObj
  );
};

export const getItem = async (type, id) => {
  return axios.get(`${import.meta.env.VITE_API_URL}/${type}/${id}`);
};

export const deleteItem = async (type, id) => {
  console.log(type, id);
  return axios.delete(
    `${import.meta.env.VITE_API_URL}/${type}/delete/${id}`,
    null
  );
};

export const removeItem = async (type, id, removedObj) => {
  return axios.post(
    `${import.meta.env.VITE_API_URL}/${type}/remove/${id}`,
    removedObj
  );
};

export const removeDaysFromArea = async (type, id) => {
  return axios.post(
    `${import.meta.env.VITE_API_URL}/${type}/remove-days/${id}`
  );
};

export const CreateDateFromMinMax = async (minDate, maxDate, tripId, data) => {
  try {
    if (data?.areaId){
      // Removes all previous days from the area (if there are any)
      await removeDaysFromArea("area", data.areaId);
    }
    const interval = { start: minDate, end: maxDate };
    const allDates = eachDayOfInterval(interval);
    // Creates new days for each date in the interval
    console.log(allDates);
    for (const date of allDates) {
      await createItem("day", tripId, { ...data, day: date });
    }
  } catch (err) {
    console.log(err);
  }
};

export const findFlights = async (data) => {
  try {
    return axios.post(
      `http://localhost:8001/trip-planner/getFlight/find`,
      data
    );
  } catch (err) {
    console.log(err);
  }
};
