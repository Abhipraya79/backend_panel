import { Request, Response, NextFunction } from 'express';
import { TelemetryService } from '../services/telemetry.service';
import logger from '../utils/logger';
import { publishTest } from '../mqtt/mqtt-test';
import { getSocketIO } from '../socket/socket.server';

export const getLatestTelemetry = async (
  _req: Request,
  res: Response,
  _next: NextFunction,
): Promise<void> => {
  try {
    logger.info('[REST API] GET Latest Telemetry');
    const latest = await TelemetryService.getLatestTelemetry();

    if (!latest) {
      res.status(404).json({
        success: false,
        message: 'No telemetry found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Latest telemetry retrieved successfully',
      data: latest,
    });
  } catch (error: any) {
    logger.error('GET /api/telemetry/latest - Error retrieving telemetry', { error });
    res.status(500).json({
      success: false,
      message: error.message || 'Internal Server Error',
    });
  }
};

export const getTelemetryHistory = async (
  req: Request,
  res: Response,
  _next: NextFunction,
): Promise<void> => {
  try {
    logger.info('[REST API] GET History');

    // Parse query params
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const data = await TelemetryService.getTelemetryHistory(page, limit);

    res.status(200).json({
      success: true,
      message: 'Telemetry history retrieved successfully',
      pagination: {
        page,
        limit,
      },
      data,
    });
  } catch (error: any) {
    logger.error('GET /api/telemetry/history - Error retrieving telemetry history', { error });
    res.status(500).json({
      success: false,
      message: error.message || 'Internal Server Error',
    });
  }
};

export const getDashboard = async (
  _req: Request,
  res: Response,
  _next: NextFunction,
): Promise<void> => {
  try {
    logger.info('[REST API] GET Dashboard');

    const data = await TelemetryService.getDashboardData();

    if (!data) {
      res.status(404).json({
        success: false,
        message: 'No telemetry found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error: any) {
    logger.error('GET /api/dashboard - Error retrieving dashboard data', { error });
    res.status(500).json({
      success: false,
      message: error.message || 'Internal Server Error',
    });
  }
};

export const controlCleaning = async (
  req: Request,
  res: Response,
  _next: NextFunction,
): Promise<void> => {
  try {
    const { action, deviceId = 'panel001' } = req.body;

    if (action !== 'start' && action !== 'stop') {
      res.status(400).json({
        success: false,
        message: 'Invalid action. Action must be either "start" or "stop".',
      });
      return;
    }

    logger.info(`[REST API] POST /api/control/cleaning - Action: ${action}`);

    // 1. Get latest telemetry from Firestore
    let latest = await TelemetryService.getLatestTelemetry();

    // Default if not found
    if (!latest) {
      latest = {
        deviceId,
        temperature: 30,
        voltage: 12,
        current: 0,
        power: 0,
        dust: 0,
        humidity: 50,
        pumpStatus: false,
        wiperStatus: false,
        mode: 'MANUAL',
      };
    }

    // 2. Update telemetry with new status
    const isStarting = action === 'start';
    const updatedPayload = {
      deviceId: latest.deviceId || deviceId,
      temperature: latest.temperature ?? 30,
      voltage: latest.voltage ?? 12,
      current: latest.current ?? 0,
      power: latest.power ?? 0,
      dust: latest.dust ?? 0,
      humidity: latest.humidity ?? 50,
      pumpStatus: isStarting,
      wiperStatus: isStarting,
      mode: 'MANUAL',
      timestamp: new Date().toISOString(),
    };

    // 3. Save telemetry (saves to Firestore and emits to Socket.IO)
    await TelemetryService.saveTelemetry(updatedPayload, 'solar/panel/telemetry');

    // 4. Publish MQTT control commands using publishTest
    try {
      publishTest('solar/panel/control', {
        deviceId: updatedPayload.deviceId,
        command: 'MANUAL_MODE',
      });

      publishTest('solar/panel/control', {
        deviceId: updatedPayload.deviceId,
        command: isStarting ? 'PUMP_ON' : 'PUMP_OFF',
      });

      publishTest('solar/panel/control', {
        deviceId: updatedPayload.deviceId,
        command: isStarting ? 'WIPER_ON' : 'WIPER_OFF',
      });

      logger.info(
        `[MQTT] Successfully published cleaning control commands to topic: solar/panel/control`,
      );
    } catch (mqttError: any) {
      logger.error(`[MQTT] Failed to publish control commands: ${mqttError.message}`);
    }

    res.status(200).json({
      success: true,
      message: `Cleaning ${isStarting ? 'started' : 'stopped'} successfully.`,
      data: {
        pumpStatus: isStarting,
        wiperStatus: isStarting,
        mode: latest.mode || 'MANUAL',
      },
    });
  } catch (error: any) {
    logger.error('POST /api/control/cleaning - Error processing cleaning control', { error });
    res.status(500).json({
      success: false,
      message: error.message || 'Internal Server Error',
    });
  }
};

export const controlMode = async (
  req: Request,
  res: Response,
  _next: NextFunction,
): Promise<void> => {
  try {
    const { mode, deviceId = 'panel001' } = req.body;

    if (mode !== 'AUTO' && mode !== 'MANUAL') {
      res.status(400).json({
        success: false,
        message: 'Invalid mode. Mode must be either "AUTO" or "MANUAL".',
      });
      return;
    }

    logger.info(`[REST API] POST /api/control/mode - Mode: ${mode}`);

    // 1. Get latest telemetry from Firestore
    let latest = await TelemetryService.getLatestTelemetry();

    // Default if not found
    if (!latest) {
      latest = {
        deviceId,
        temperature: 30,
        voltage: 12,
        current: 0,
        power: 0,
        dust: 0,
        humidity: 50,
        pumpStatus: false,
        wiperStatus: false,
        mode: 'MANUAL',
      };
    }

    // 2. Update telemetry with new mode.
    // If switching to AUTO, force turn off pump and wiper as required.
    const isAuto = mode === 'AUTO';
    const updatedPayload = {
      deviceId: latest.deviceId || deviceId,
      temperature: latest.temperature ?? 30,
      voltage: latest.voltage ?? 12,
      current: latest.current ?? 0,
      power: latest.power ?? 0,
      dust: latest.dust ?? 0,
      humidity: latest.humidity ?? 50,
      pumpStatus: isAuto ? false : (latest.pumpStatus ?? false),
      wiperStatus: isAuto ? false : (latest.wiperStatus ?? false),
      mode: mode,
      timestamp: new Date().toISOString(),
    };

    // 3. Save telemetry (saves to Firestore and emits to Socket.IO)
    await TelemetryService.saveTelemetry(updatedPayload, 'solar/panel/telemetry');

    // Emit mode update event to socket.io
    try {
      const io = getSocketIO();
      io.emit('mode:update', { mode: updatedPayload.mode });
      logger.info(`[SOCKET] Mode update emitted: ${updatedPayload.mode}`);
    } catch (socketError: any) {
      logger.error(`[SOCKET] Failed to emit mode update: ${socketError.message}`);
    }

    // 4. Publish MQTT control commands
    try {
      publishTest('solar/panel/control', {
        deviceId: updatedPayload.deviceId,
        command: isAuto ? 'AUTO_MODE' : 'MANUAL_MODE',
      });

      if (isAuto) {
        // If switched to auto, turn off pump & wiper
        publishTest('solar/panel/control', {
          deviceId: updatedPayload.deviceId,
          command: 'PUMP_OFF',
        });
        publishTest('solar/panel/control', {
          deviceId: updatedPayload.deviceId,
          command: 'WIPER_OFF',
        });
      }

      logger.info(
        `[MQTT] Successfully published mode control commands to topic: solar/panel/control`,
      );
    } catch (mqttError: any) {
      logger.error(`[MQTT] Failed to publish mode commands: ${mqttError.message}`);
    }

    res.status(200).json({
      success: true,
      message: `Mode updated to ${mode} successfully.`,
      data: {
        pumpStatus: updatedPayload.pumpStatus,
        wiperStatus: updatedPayload.wiperStatus,
        mode: updatedPayload.mode,
      },
    });
  } catch (error: any) {
    logger.error('POST /api/control/mode - Error processing mode control', { error });
    res.status(500).json({
      success: false,
      message: error.message || 'Internal Server Error',
    });
  }
};
