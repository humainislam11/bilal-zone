import axios from "axios";

const axiosPublic = axios.create({
    baseURL: 'https://bilal-zone-backend.onrender.com',
  });
const useAxiosPublic = () => {
    return axiosPublic;
};

export default useAxiosPublic;