// Mock global básico para tests
global.console.error = jest.fn();
global.console.log = jest.fn();

// Mock MUY agresivo para sequelize - evita completamente la inicialización
jest.mock('sequelize', () => ({
  Sequelize: jest.fn(() => ({
    authenticate: jest.fn(() => Promise.resolve()),
    sync: jest.fn(() => Promise.resolve()),
  })),
  DataTypes: {
    STRING: 'STRING', TEXT: 'TEXT', INTEGER: 'INTEGER', BOOLEAN: 'BOOLEAN', DATE: 'DATE',
  },
  Model: {
    init: jest.fn(), // Mock vacío para evitar la inicialización
  },
}));

// Mock para evitar que los modelos se inicialicen
jest.mock('../models/UserModel', () => ({
  __esModule: true,
  default: {
    findOne: jest.fn(),
    create: jest.fn(),
    findByPk: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
    count: jest.fn(),
  },
}));

jest.mock('../models/LikeModel', () => ({
  __esModule: true,
  default: {
    findOne: jest.fn(),
    create: jest.fn(),
    findByPk: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
    count: jest.fn(),
  },
}));

jest.mock('../models/PostModel', () => ({
  __esModule: true,
  default: {
    findOne: jest.fn(),
    create: jest.fn(),
    findByPk: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
    count: jest.fn(),
  },
}));

jest.mock('../models/PostImageModel', () => ({
  __esModule: true,
  default: {
    findOne: jest.fn(),
    create: jest.fn(),
    findByPk: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
    count: jest.fn(),
  },
}));

// Mock para la conexión a la base de datos
jest.mock('../database/db_connection', () => ({
  default: {
    authenticate: jest.fn(() => Promise.resolve()),
    sync: jest.fn(() => Promise.resolve()),
  }
}));
