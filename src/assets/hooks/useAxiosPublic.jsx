import axios from "axios";

const axiosPublic = axios.create({
    baseURL: 'https://bilal-zone-backend.vercel.app',
  });
const useAxiosPublic = () => {
    return axiosPublic;
};

export default useAxiosPublic;