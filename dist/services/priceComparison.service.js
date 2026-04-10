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
exports.deletePriceComparison = exports.updatePriceComparison = exports.getPriceComparisonById = exports.getPriceComparisons = exports.createPriceComparison = void 0;
const priceComparison_model_1 = __importDefault(require("../models/priceComparison.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const platform_model_1 = __importDefault(require("../models/platform.model"));
const createPriceComparison = (priceComparisonData) => __awaiter(void 0, void 0, void 0, function* () {
    return priceComparison_model_1.default.create(priceComparisonData);
});
exports.createPriceComparison = createPriceComparison;
const getPriceComparisons = () => __awaiter(void 0, void 0, void 0, function* () {
    return priceComparison_model_1.default.findAll({
        include: [user_model_1.default, platform_model_1.default],
    });
});
exports.getPriceComparisons = getPriceComparisons;
const getPriceComparisonById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return priceComparison_model_1.default.findByPk(id, {
        include: [user_model_1.default, platform_model_1.default],
    });
});
exports.getPriceComparisonById = getPriceComparisonById;
const updatePriceComparison = (id, priceComparisonData) => __awaiter(void 0, void 0, void 0, function* () {
    const [affectedCount] = yield priceComparison_model_1.default.update(priceComparisonData, {
        where: { id },
    });
    if (affectedCount > 0) {
        return priceComparison_model_1.default.findByPk(id, {
            include: [user_model_1.default, platform_model_1.default],
        });
    }
    return null;
});
exports.updatePriceComparison = updatePriceComparison;
const deletePriceComparison = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return priceComparison_model_1.default.destroy({
        where: { id },
    });
});
exports.deletePriceComparison = deletePriceComparison;
