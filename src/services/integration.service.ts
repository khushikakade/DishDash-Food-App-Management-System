import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const rawFastApiBaseUrl = process.env.FASTAPI_BASE_URL || 'http://localhost:8001';
const FASTAPI_BASE_URL = rawFastApiBaseUrl.startsWith('http')
  ? rawFastApiBaseUrl
  : `http://${rawFastApiBaseUrl}`;

export class IntegrationService {
  async comparePrices(productName: string): Promise<any> {
    try {
      const response = await axios.post(`${FASTAPI_BASE_URL}/compare`, {
        product_name: productName,
      });
      return response.data;
    } catch (error) {
      console.error('Error comparing prices:', error);
      throw error;
    }
  }
}
