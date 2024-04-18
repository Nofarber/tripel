import axios from "axios";
import { parse, format } from "date-fns";

axios.defaults.withCredentials = true;

export async function fetchPlaceLanLon(place) {
  try {
    const res = await axios.get(
      `https://hotels-com-provider.p.rapidapi.com/v2/regions?rapidapi-key=${
        import.meta.env.VITE_RAPID_API_KEY
      }&query=${place}&domain=AE&locale=en_GB`
    );


    return {
      coordinates: res.data.data[1].coordinates,
      region_id: res.data.data[1].gaiaId,
    };
  } catch (error) {
    console.log(error);
    console.log("fetchPlaceLanLon error");
  }
}

export async function fetchNearHotels(region_id, data) {
  try {
    const { checkIn, checkOut } = data;
    // let checkInB = parse(checkIn, "MM-dd-yy", new Date());
    // let checkOutB = parse(checkOut, "MM-dd-yy", new Date());
    const checkInB = format(checkIn, "yyyy-MM-dd");
    const checkOutB = format(checkOut, "yyyy-MM-dd");

    const res = await axios.get(
      `https://hotels-com-provider.p.rapidapi.com/v2/hotels/search?rapidapi-key=${
        import.meta.env.VITE_RAPID_API_KEY
      }&checkin_date=${checkInB}&checkout_date=${checkOutB}&locale=en_US&domain=US&adults_number=1&region_id=${region_id}&sort_order=REVIEW&lodging_type=HOTEL,HOSTEL,APART_HOTEL&available_filter=SHOW_AVAILABLE_ONLY`
    );
    console.log(res);
    return res.data.properties.slice(0, 20).map((hotel) => {
      return {
        hotelName: hotel.name,
        lat: hotel.mapMarker.latLong.latitude,
        long: hotel.mapMarker.latLong.longitude,
        image: hotel.propertyImage?.image.url,
        price: hotel.price.lead.formatted,
        checkIn: checkInB,
        checkOut: checkOutB,
      };
    });
  } catch (error) {
    console.log(error.message);
  }
}

// export async function fetchNearHotels({ lat, long }) {
//   try {
//     const res = await axios.get(
//       `https://api.geoapify.com/v2/places?filter=circle:${long},${lat},10000&limit=20&categories=accommodation&apiKey=${import.meta.env.VITE_GEOAPIFY_API_KEY}`
//     );
//    const temp=res.data.features.map((hotel) => {
//       return {
//         lat: hotel.properties.lat,
//         long: hotel.properties.lon,
//         name: hotel.properties.name,
//         contact: hotel.properties.contact,
//         websiteURL: hotel.properties.website,
//         street: hotel.properties.street,
//         hotelId:hotel.properties.hotelId
//       };
//     });

//     // ///////////////////////////

//   } catch (error) {
//     console.log(error);
//   }
// }

// https://api.geoapify.com/v2/places?categories=catering,entertainment,leisure,tourism&filter=rect:34.8418732933046,32.14042138465463,34.9339267066958,32.066151771350775&limit=4&apiKey=e0dd094f7d4b4e26b4993f998c3b7e48
export async function fetchPlace({ lat, long }) {
  const types = "catering,entertainment,leisure,tourism";
  console.log("lat-" + lat + "lon-" + long);

  try {
    const res = await axios.get(
      `https://api.geoapify.com/v2/places?categories=${types}&filter=circle:${long},${lat},10000&limit=20&apiKey=${
        import.meta.env.VITE_GEOAPIFY_API_KEY
      }`
    );
    const path = res.data.features;
    console.log(path[0].properties.contact.phone);
    return res.data.features.map((place) => {
      const kindPath = place.properties.categories[0];
      switch (kindPath) {
        case "natural":
          return {
            type: kindPath,
            lat: place.properties.lat,
            long: place.properties.lon,
            name: place.properties.name,
            openingHours: place.properties.opening_hours,
            image: place.properties.wiki_and_media?.image || null,
            address: place.properties.formatted,
            contact: place.properties.contact?.phone || null,
          };

        case "catering":
          return {
            type: kindPath,
            lat: place.properties.lat,
            long: place.properties.lon,
            name: place.properties.name,
            openingHours: place.properties.opening_hours,
            website: place.properties.website,
            address: place.properties.formatted,
            contact: place.properties.contact?.phone || null,
          };

        case "entertainment":
          return {
            type: kindPath,
            lat: place.properties.lat,
            long: place.properties.lon,
            name: place.properties.name,
            openingHours: place.properties.opening_hours,
            address: place.properties.formatted,
            website: place.properties.website,
            contact: place.properties.contact?.phone || null,
          };
        case "leisure":
          return {
            type: kindPath,
            lat: place.properties.lat,
            long: place.properties.lon,
            name: place.properties.name,
            openingHours: place.properties.opening_hours,
            address: place.properties.formatted,
            image: place.properties.wiki_and_media?.image,
            contact: place.properties.contact?.phone || null,
          };

        case "tourism":
          return {
            type: kindPath,
            lat: place.properties.lat,
            long: place.properties.lon,
            name: place.properties.name,
            image: place.properties.wiki_and_media?.image,
            address: place.properties.formatted,
            contact: place.properties.contact?.phone || null,
          };

        default:
          return {
            type: kindPath,
            lat: place.properties.lat,
            long: place.properties.lon,
            name: place.properties.name,
            openingHours: place.properties.opening_hours || null,
            address: place.properties.formatted || null,
            website: place.properties.website || null,
            image: place.properties.wiki_and_media?.image || null,
            contact: place.properties.contact?.phone || null,
          };

          break;
      }
    });
  } catch (error) {
    console.log(error);
  }
}
const cores = { lat: "41.213", long: "-87.3232" };
