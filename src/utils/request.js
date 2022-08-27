import accountService from 'services/accountService';

export async function getRequest(url, responseHandler, keepalive) {
  return await makeRequest('GET', url, null, responseHandler, false, keepalive);
}

export async function postRequest(url, body, responseHandler, keepalive) {
  return await makeRequest('POST', url, body, responseHandler, false, keepalive);
}

export async function putRequest(url, body, responseHandler, keepalive) {
  return await makeRequest('PUT', url, body, responseHandler, false, keepalive);
}

export async function patchRequest(url, body, responseHandler, keepalive) {
  return await makeRequest('PATCH', url, body, responseHandler, false, keepalive);
}

export async function deleteRequest(url, responseHandler, keepalive) {
  return await makeRequest('DELETE', url, null, responseHandler, false, keepalive);
}

export async function authorisedGetRequest(url, responseHandler, keepalive) {
  return await makeRequest('GET', url, null, responseHandler, true, keepalive);
}

export async function authorisedPostRequest(url, body, responseHandler, keepalive) {
  return await makeRequest('POST', url, body, responseHandler, true, keepalive);
}

export async function authorisedPutRequest(url, body, responseHandler, keepalive) {
  return await makeRequest('PUT', url, body, responseHandler, true, keepalive);
}

export async function authorisedPatchRequest(url, body, responseHandler, keepalive) {
  return await makeRequest('PATCH', url, body, responseHandler, true, keepalive);
}

export async function authorisedDeleteRequest(url, responseHandler, keepalive) {
  return await makeRequest('DELETE', url, null, responseHandler, true, keepalive);
}

export async function authorisedUploadPostRequest(url, body, responseHandler) {
  return await makeUploadRequest('POST', url, body, responseHandler, true);
}

export async function authorisedUploadPostRequestForObjects(url, body, responseHandler) {
  return await makeUploadRequestForObjects('POST', url, body, responseHandler, true);
}
export async function authorisedUploadPutRequest(url, body, responseHandler) {
  return await makeUploadRequest('Put', url, body, responseHandler, true);
}

export async function authorisedUploadPutRequestForObjects(url, body, responseHandler) {
  return await makeUploadRequestForObjects('Put', url, body, responseHandler, true);
}

export function getQueryString(filter = {}, sorts = [], pageNumber, pageSize) {
  // Prepare filter
  let filterString = '';

  for (var property in filter) {
    const value = filter[property];
    if (Array.isArray(value)) {
      for (let i = 0; i < value.length; i++) {
        filterString += `${property}[${i}]=${encodeURIComponent(value[i])}&`;
      }
    } else if (!string.isNullOrEmpty(value)) {
      filterString += `${property}=${encodeURIComponent(value)}&`;
    }
  }

  if (filterString) {
    filterString = filterString.slice(0, -1);
  }

  // Prepare sorts
  let sortString = '';

  for (let i = 0; i < sorts.length; i++) {
    const sort = sorts[i];
    sortString += `sorts[${i}].field=${encodeURIComponent(sort.field)}&`;
    sortString += `sorts[${i}].dir=${encodeURIComponent(sort.dir)}&`;
  }

  if (!sortString) {
    sortString = sortString.slice(0, -1);
  }

  // Prepare page number
  let pageNumberString = '';

  if (pageNumber) {
    pageNumberString = `pageNumber=${encodeURIComponent(pageNumber)}`;
  }

  // Prepare page size
  let pageSizeString = '';

  if (pageSize) {
    pageSizeString = `pageSize=${encodeURIComponent(pageSize)}`;
  }

  // Prepare result string
  let result = [filterString, sortString, pageNumberString, pageSizeString].filter(Boolean).join('&');

  if (result) {
    result = '?' + result;
  }

  return result;
}

async function makeRequest(method, url, body, responseHandler, isAuthorisedRequest, keepalive = false) {
  const headers = new Headers({
    'Content-Type': 'application/json',
    Accept: 'application/json'
  });

  if (isAuthorisedRequest) {
    headers.append('Authorization', getAuthorizationHeaderValue());
  }

  let requestOptions;

  if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
    requestOptions = {
      method: method,
      headers: headers,
      keepalive: keepalive,
      body: body !== null && body !== undefined ? JSON.stringify(body) : undefined
    };
  } else {
    requestOptions = {
      method: method,
      headers: headers,
      keepalive: keepalive
    };
  }

  return await fetch(url, requestOptions)
    .then(async (result) => {
      const text = await result.text();
      return text ? JSON.parse(text) : null;
    })
    .then(responseHandler);
}

async function makeUploadRequestForObjects(method, url, body, responseHandler, isAuthorisedRequest) {
  const headers = new Headers({});

  if (isAuthorisedRequest) {
    headers.append('Authorization', getAuthorizationHeaderValue());
  }

  const requestOptions = {
    method: method,
    headers: headers,
    body: body
  };

  return await fetch(url, requestOptions)
    .then(async (result) => {
      const text = await result.text();
      return !text ? JSON.parse(text) : null;
    })
    .then(responseHandler);
}

function getAuthorizationHeaderValue() {
  let result = '';
  const accessToken = accountService.getAccessToken();

  if (accessToken) {
    result = `Bearer ${accessToken}`;
  }

  return result;
}

export function getEnumsQueryString(exactEnumValues = []) {
  // Prepare exactEnumValues
  let exactEnumValuesString = '';

  for (let i = 0; i < exactEnumValues.length; i++) {
    exactEnumValuesString += `exactEnumValues[${i}]=${encodeURIComponent(exactEnumValues[i])}&`;
  }
  // if (!string.isNullOrEmpty(exactEnumValuesString)) {
  // 	exactEnumValuesString = exactEnumValuesString.slice(0, -1);
  // }
  return exactEnumValuesString;
}
