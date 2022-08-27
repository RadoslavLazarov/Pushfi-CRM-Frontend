import baseUrl from 'utils/getBaseUrl';
import { authorisedGetRequest } from 'utils/request';

export default {
  async getAllCustomers() {
    return await authorisedGetRequest(baseUrl + `/api/Customer/GetAll`, (result) => {
      return result;
    });
  },
  async getBrokerCustomers() {
    return await authorisedGetRequest(baseUrl + `/api/Customer/GetBrokerCustomers`, (result) => {
      return result;
    });
  }
};
