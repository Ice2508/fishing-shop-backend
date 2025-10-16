'use strict';

/**
 * prod controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::prod.prod');
