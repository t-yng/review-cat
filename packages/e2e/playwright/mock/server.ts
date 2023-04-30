import type http from 'http';
import express, { type Application } from 'express';
import bodyParser from 'body-parser';

export class MockServer {
  private static instance = new MockServer();
  public app: Application;
  public server: http.Server | null;

  private constructor() {
    this.app = express();
    this.app.use(bodyParser.json());
  }

  static getInstance() {
    return this.instance;
  }

  use(...args) {
    this.app.use(...args);
  }

  get(...args) {
    // @ts-ignore
    this.app.get(...args);
  }

  post(...args) {
    // @ts-ignore
    this.app.post(...args);
  }

  listen() {
    this.server = this.app.listen(4400);
  }

  close() {
    if (this.server) {
      this.server.close();
    }
  }
}

export const server = MockServer.getInstance();
