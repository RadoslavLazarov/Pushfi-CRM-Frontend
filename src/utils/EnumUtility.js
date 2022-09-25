import baseUrl from './getBaseUrl';
import { getRequest } from './request';

export const enums = {};

export async function getRequiredEnums() {
  return await getRequest(baseUrl + '/api/Enum', (result) => {
    for (let i = 0; i < result.length; i++) {
      const item = result[i];
      enums[item.name] = item.values;
    }
    return enums;
  });
}
