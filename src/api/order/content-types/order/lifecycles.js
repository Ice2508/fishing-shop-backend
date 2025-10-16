// Файл: api/orders/content-types/orders/lifecycles.js
// Назначение: Заполняет поле items на сервере перед созданием заказа
module.exports = {
  async beforeCreate(event) {
    const { data } = event.params;
    
    console.log('Входящие данные:', JSON.stringify(data, null, 2));
    
    // Принудительно устанавливаем send_status
    
    // Получаем товары из коллекции prods
    const products = await strapi.entityService.findMany('api::prod.prod', {
      filters: { title: { $in: data.name.map(item => item.name) } },
      fields: ['title', 'price', 'isActive'], // Добавляем isActive
    });
    
    console.log('Найденные товары:', JSON.stringify(products, null, 2));
    
    // Проверяем isActive для каждого товара
    const inactiveProducts = products.filter(product => !product.isActive);
    if (inactiveProducts.length > 0) {
      throw new Error(`Нельзя оформить заказ: товары с названиями ${inactiveProducts.map(p => p.title).join(', ')} неактивны`);
    }
    
    // Формируем поле items: name из data.name, price из products
    const items = data.name
      .map(item => {
        const product = products.find(p => p.title === item.name);
        return product ? { name: item.name, price: product.price } : null;
      })
      .filter(item => item !== null);
    
    // Проверяем, есть ли валидные товары
    if (items.length === 0) {
      throw new Error('Ни один товар из заказа не найден в базе');
    }
    
    // Проверяем, что все товары в name существуют
    if (items.length !== data.name.length) {
      throw new Error('Некоторые товары в заказе не найдены');
    }
    
    // Сохраняем items в данные заказа
    data.items = items;
    console.log('Сформированные items:', JSON.stringify(items, null, 2));
  },
};