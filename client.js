// Import modules for gRPC client.
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

// Loading protobuf definitions for client-side use.
const packageDefinition = protoLoader.loadSync('warehouse_services.proto', {});
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);

// Access services defined in protobuf file.
const warehouseManagement = protoDescriptor.warehouse_management;

// Creating clients for services to interact with server.
const inventoryClient = new warehouseManagement.InventoryOperations('localhost:50051', grpc.credentials.createInsecure());
const orderFulfillmentClient = new warehouseManagement.OrderFulfillment('localhost:50051', grpc.credentials.createInsecure());
const shippingManagementClient = new warehouseManagement.ShippingManagement('localhost:50051', grpc.credentials.createInsecure());

// Function to check stock.
function inspectStock(productId) {
  inventoryClient.InspectStock({ product_id: productId }, (error, response) => {
    console.log('Inventory Status:', response);
  });
}

// Function to update stock.
function modifyStock(productId, quantity) {
  inventoryClient.ModifyStock({ product_id: productId, quantity: quantity }, (error, response) => {
    console.log('Update Result:', response);
  });
}

// Function to execute an order.
function executeOrder(productId, orderQuantity) {
  orderFulfillmentClient.ExecuteOrder({ product_id: productId, order_quantity: orderQuantity }, (error, response) => {
    console.log('Order Execution Result:', response);
  });
}

// Function to arrange shippingr.
function arrangeShipping(orderId) {
  shippingManagementClient.ArrangeShipping({ order_id: orderId }, (error, response) => {
    console.log('Shipping Arrangement Result:', response);
  });
}

// Command-line arguments to decide which function to call.
const command = process.argv[2];
const productId = process.argv[3];
const quantity = process.argv[4];
const orderQuantity = process.argv[4];
const orderId = process.argv[3];

if (command === 'inspectStock') {
  inspectStock(productId);
} else if (command === 'modifyStock') {
  modifyStock(productId, quantity);
} else if (command === 'executeOrder') {
  executeOrder(productId, orderQuantity);
} else if (command === 'arrangeShipping') {
  arrangeShipping(orderId);
} else {
  console.error('Invalid command. Please use these commands: inspectStock, modifyStock, executeOrder, arrangeShipping');
}
