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
exports.connectDatabase = exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ override: true });
const dialect = (process.env.DB_DIALECT || 'mysql');
const createSequelizeInstance = () => {
    if (process.env.DATABASE_URL) {
        return new sequelize_1.Sequelize(process.env.DATABASE_URL, {
            dialect,
            logging: false,
        });
    }
    return new sequelize_1.Sequelize(process.env.MYSQL_DATABASE || 'food_delivery', process.env.MYSQL_USER || 'root', process.env.MYSQL_PASSWORD || 'root', {
        host: process.env.MYSQL_HOST || 'localhost',
        port: Number(process.env.MYSQL_PORT || 3306),
        dialect,
        logging: false,
    });
};
exports.sequelize = createSequelizeInstance();
const connectDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (process.env.DATABASE_URL) {
            console.log(`Attempting to connect using ${dialect.toUpperCase()} DATABASE_URL...`);
        }
        else {
            const host = process.env.MYSQL_HOST || 'localhost';
            const port = process.env.MYSQL_PORT || '3306';
            const database = process.env.MYSQL_DATABASE || 'food_delivery';
            const user = process.env.MYSQL_USER || 'root';
            console.log(`Attempting to connect to ${dialect.toUpperCase()} at ${host}:${port}...`);
            console.log(`Database: ${database}`);
            console.log(`User: ${user}`);
        }
        yield exports.sequelize.authenticate();
        console.log(`${dialect.toUpperCase()} connected successfully`);
    }
    catch (error) {
        console.error('Database connection failed:', error);
        process.exit(1);
    }
});
exports.connectDatabase = connectDatabase;
