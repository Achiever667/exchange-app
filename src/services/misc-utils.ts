import { apiClient } from "@/services/apiClient";
import { ICountry } from "@/types";
import { UTILS_ENDPOINTS } from "@/constants";

class UtilsApiService {
  async getCountries(): Promise<ICountry[]> {
    try {
      const response = await apiClient.get<ICountry[]>(
        UTILS_ENDPOINTS.GET_COUNTRIES
      );

    return response.data as ICountry[];
    } catch (error) {
      throw error;
    }
  }
}

export const utilsApiService = new UtilsApiService();

export default utilsApiService;