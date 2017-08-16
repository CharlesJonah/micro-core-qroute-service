/**
 * The Server module that set ups the grpc server for the microservice
 *
 * require the following:
 * grpc: the grpc client for node
 * proto: load the proto file that contains the interface definitions for the microservice
 * server: the grpc server client object
 * config: config file that holds server config details
 * sampleController: controllers that handles the microservice endpoints
 */
const grpc = require('grpc');
const navigationController = require('../controllers/navigation');
const protoPath = require('path').join(__dirname, '..', 'micro-shared-qroute');
require('dotenv').config({ silent: true });

const proto = grpc.load(
  { root: protoPath, file: 'core/core-svc.proto' },
  'proto',
  { convertFieldsToCamelCase: true }
);

const server = new grpc.Server();
// setup microservice endpoints and controller functions that processes requests to those endpoints
server.addProtoService(proto.core.CoreService.service, {
  createNavigation: navigationController.create,
});

server.bind(process.env.SERVICE_URL, grpc.ServerCredentials.createInsecure());
module.exports = server;
