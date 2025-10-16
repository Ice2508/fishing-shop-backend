'use strict';

/**
 * prod service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::prod.prod');
