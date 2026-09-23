import { Request, Response } from 'express';
import { ForecastService } from '../services/forecastService';

export class ForecastController {
  public static async getForecast(req: Request, res: Response): Promise<void> {
    const demandForecast = ForecastService.getDemandForecast();
    const zoneDemands = ForecastService.getZoneDemands();

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

  public static async getWorkforceRecommendations(req: Request, res: Response): Promise<void> {
    const recommendations = ForecastService.getWorkforceRecommendations();
    res.json({
      success: true,
      ...recommendations
    });
  }
}
