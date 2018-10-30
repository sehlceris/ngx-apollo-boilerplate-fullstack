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

  public async set(key: string, value: any) {
    this.log.debug(`setting cache for key: ${key}; value: ${value}`);
    this.generalMemoryCache.set(key, value);
  }

  public async get(key: string) {
    const cachedValue = this.generalMemoryCache.get(key);
    this.log.debug(`getting cache for key: ${key}; value: ${cachedValue}`);
    return cachedValue;
  }

  public async addJti(key: JwtPayloadType, jti: string) {
    const jtiSet = this.jtiCache.get(key);
    this.log.debug(`adding JTI for key: ${key}`);
    jtiSet.add(jti);
  }

  public async hasJti(key: JwtPayloadType, jti: string) {
    const jtiSet = this.jtiCache.get(key);
    const hasJti = jtiSet.has(jti);
    this.log.debug(`has JTI for key: ${key} - ${hasJti}`);
    return hasJti;
  }

  public async removeJti(key: JwtPayloadType, jti: string) {
    const jtiSet = this.jtiCache.get(key);
    jtiSet.delete(jti);
    this.log.debug(`removed JTI for key: ${key}`);
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
