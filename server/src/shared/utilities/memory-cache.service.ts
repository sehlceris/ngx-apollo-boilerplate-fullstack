import { Injectable } from '@nestjs/common';
import { JwtPayloadType } from "../auth/jwt-payload.model";
import { BoundLogger, LogService } from "./log.service";

@Injectable()
export class MemoryCacheService {

  private generalMemoryCache: Map<string, any>;
  private jtiCache: Map<JwtPayloadType, Set<string>>;
  private log: BoundLogger = this.logService.bindToNamespace(MemoryCacheService.name);

  constructor(
    private logService: LogService
  ) {
    this.initializeCache();
  }

  public set(key: string, value: any) {
    this.generalMemoryCache.set(key, value);
  }

  public get(key: string) {
    return this.generalMemoryCache.get(key);
  }

  public addJti(key: JwtPayloadType, jti: string) {
    const jtiSet = this.jtiCache.get(key);
    jtiSet.add(jti);
  }

  public hasJti(key: JwtPayloadType, jti: string) {
    const jtiSet = this.jtiCache.get(key);
    return jtiSet.has(jti);
  }

  public removeJti(key: JwtPayloadType, jti: string) {
    const jtiSet = this.jtiCache.get(key);
    jtiSet.delete(jti);
  }

  public initializeCache() {
    this.generalMemoryCache = new Map();
    this.jtiCache = new Map();
    Object.keys(JwtPayloadType).forEach((key: string) => {
      const payloadType: JwtPayloadType = JwtPayloadType[key];
      const jtiSet = new Set();
      this.jtiCache.set(payloadType, jtiSet);
    });
  }
}
