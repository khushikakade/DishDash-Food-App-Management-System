"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationService = void 0;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const rawFastApiBaseUrl = process.env.FASTAPI_BASE_URL || 'http://localhost:8001';
const FASTAPI_BASE_URL = rawFastApiBaseUrl.startsWith('http')
    ? rawFastApiBaseUrl
    : `http://${rawFastApiBaseUrl}`;
class IntegrationService {
    comparePrices(productName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield axios_1.default.post(`${FASTAPI_BASE_URL}/compare`, {
                    product_name: productName,
                });
                return response.data;
            }
            catch (error) {
                console.error('Error comparing prices:', error);
                throw error;
            }
        });
    }
}
exports.IntegrationService = IntegrationService;
