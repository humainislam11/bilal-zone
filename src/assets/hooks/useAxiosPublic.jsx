import axios from "axios";

const axiosPublic = axios.create({
    baseURL: 'https://bilalzone-backend.xyz',
  });
const useAxiosPublic = () => {
    return axiosPublic;
};

export default useAxiosPublic;