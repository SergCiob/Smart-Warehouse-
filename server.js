// Load modules to create gRPC server.
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

// Load protobuf definitions from .proto file.
const packageDefinition = protoLoader.loadSync('warehouse_services.proto', {});
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);

// Access package that contains service definitions.
const warehouseManagement = protoDescriptor.warehouse_management;

// Create new instance of gRPC server.
const server = new grpc.Server();

// Simulated database to store inventory data.
const inventoryDatabase = {};

// Define the services and methods.
server.addService(warehouseManagement.InventoryOperations.service, {
  InspectStock: (call, callback) => {
    // Extract product_id from client request.
    const productId = call.request.product_id;
    // Retrieve product quantity;if not found, default to 0.
    const quantity = inventoryDatabase[productId] || 0;
    // Send quantity back to client.
    callback(null, { quantity });
  },
  ModifyStock: (call, callback) => {
    // Extract product_id and quantity from the request.
    const { product_id, quantity } = call.request;
    // Updating database with new quantity for the product_id.
    updateInventory(product_id, quantity);
    // Confirming update to client.
    callback(null, { success: true });
  }
});

server.addService(warehouseManagement.OrderFulfillment.service, {
  ExecuteOrder: (call, callback) => {
    // Method used to process orders.
    callback(null, { success: true });
  }
});

server.addService(warehouseManagement.ShippingManagement.service, {
  ArrangeShipping: (call, callback) => {
    // Method that handles shipping arrangements.
    callback(null, { scheduled: true });
  }
});

// Bind the server to specific port and  listening to requests.
server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), (error, port) => {
  if (error) {
    console.error('Error binding server:', error);
    return;
  }
  // Starting the server if it's successfully bound to a port.
  server.start();
  console.log(`Server running at http://0.0.0.0:${port}`);
});

// Function to update inventory in the database.
function updateInventory(productId, quantity) {
  inventoryDatabase[productId] = quantity;
  console.log(`Updated stock for product ${productId} with quantity ${quantity}`);
}
