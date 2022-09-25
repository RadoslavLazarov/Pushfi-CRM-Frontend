import baseUrl from 'utils/getBaseUrl';
import { authorisedGetRequest, authorisedDeleteRequest, getQueryString } from 'utils/request';

export default {
  async getAllCustomers(filter, sorts, pageNumber, pageSize) {
    return await authorisedGetRequest(baseUrl + `/api/Customer/GetAll${getQueryString(filter, sorts, pageNumber, pageSize)}`, (result) => {
      return result;
    });
  },
  async getBrokerCustomers() {
    return await authorisedGetRequest(baseUrl + `/api/Customer/GetBrokerCustomers`, (result) => {
      return result;
    });
  },
  async deleteCustomer(filter) {
    return await authorisedDeleteRequest(baseUrl + `/api/Customer/DeleteByUserId${getQueryString(filter)}`, (result) => {
      return result;
    });
  }
};
