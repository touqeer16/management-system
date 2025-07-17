import axios from 'axios';
import { environment } from '../environment';

const wampServer = environment.URL;
export default axios.create({
    withCredentials: true,
    baseURL: wampServer,
})
