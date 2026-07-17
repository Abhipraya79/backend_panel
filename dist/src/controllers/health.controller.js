"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHealth = void 0;
const getHealth = (_req, res, next) => {
    try {
        res.status(200).json({
            status: 'ok',
            service: 'solar-backend',
            time: new Date().toISOString(),
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getHealth = getHealth;
