import { Injectable } from '@nestjs/common';

@Injectable()
export class MemoryCacheService {

  private generalMemoryCache: Map<string, any>;
  private jtiCache: Map<string, Set<string>>;

  constructor() {
    this.initializeCache();
  }

  public set(key: string, value: any) {
    this.generalMemoryCache.set(key, value);
  }

  public get(key: string) {
    return this.generalMemoryCache.get(key);
  }

  public addJti(key: string, jti: string) {
    let jtiSet = this.jtiCache.get(key);
    if (!jtiSet) {
      jtiSet = new Set();
      this.jtiCache.set(key, jtiSet);
    }
    jtiSet.add(jti);
  }

  public hasJti(key: string, jti: string) {
    let jtiSet = this.jtiCache.get(key);
    if (!jtiSet) {
      jtiSet = new Set();
      this.jtiCache.set(key, jtiSet);
    }
    return jtiSet.has(jti);
  }

  public removeJti(key: string, jti: string) {
    let jtiSet = this.jtiCache.get(key);
    if (!jtiSet) {
      jtiSet = new Set();
      this.jtiCache.set(key, jtiSet);
    }
    jtiSet.delete(jti);
  }

  public initializeCache() {
    this.generalMemoryCache = new Map();
    this.jtiCache = new Map();
  }
}
