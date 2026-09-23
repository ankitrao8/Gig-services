"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForecastController = void 0;
const forecastService_1 = require("../services/forecastService");
class ForecastController {
    static async getForecast(req, res) {
        const demandForecast = forecastService_1.ForecastService.getDemandForecast();
        const zoneDemands = forecastService_1.ForecastService.getZoneDemands();
        res.json({
            success: true,
            serviceForecasts: demandForecast,
            zoneDemands,
            modelDetails: {
                methodology: '7-Day Exponential Moving Average + Seasonal Trend Predictor',
                datasetWindowDays: 30,
                lastComputed: new Date().toISOString(),
                upgradePath: 'Python FastAPI Scikit-Learn / Prophet microservice compatible interface'
            }
        });
    }
    static async getWorkforceRecommendations(req, res) {
        const recommendations = forecastService_1.ForecastService.getWorkforceRecommendations();
        res.json({
            success: true,
            ...recommendations
        });
    }
}
exports.ForecastController = ForecastController;
