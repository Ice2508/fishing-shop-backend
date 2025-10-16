'use strict';

/**
 * prod router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::prod.prod');
