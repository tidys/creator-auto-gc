export interface GcOptions {
  /**
   * 是否开启GC
   */
  enable: boolean;
  /**
   * 设置每多少帧进行一次gc操作
   *
   * <=0 意味着每一帧都会进行一次GC
   */
  cycleFrame: number;

  /**
   * 纹理是否开启GC
   */
  textureEnable: boolean;
  /**
   * 每次GC时，释放的纹理数量上限，防止一帧发生大量GC导致卡顿
   *
   * 如果当前帧的GC数量超过上限，则顺延到下一次GC
   */
  textureLimitCount: number;

  /**
   * 纹理多少帧未使用，自动释放该纹理
   */
  textureLifeFrame: number;

  /**
   * remove节点是否开启GC，因为会带来额外的性能消耗，目前只会在CC_DEBUG环境才会进行检测。
   * 查看处于游离态的节点: cc.pool.removeNodes.log()
   */
  removeNodeEnable: boolean;
  /**
   * 每次GC时，释放的节点数量上限
   */
  removeNodeLimitCount: number;
  /**
   * 使用remove删除的节点多少帧后没有再次添加到场景中，自动释放该节点
   */
  removeNodeLifeFrame: number;
}
export class GC {
  private opts: GcOptions | null = null;
  private _inited = false;
  /**
   * 开启关闭GC
   */
  public enable(b: boolean = true) {
    if (this.opts) {
      this.opts.enable = !!b;
    }
  }
  public init(opts: GcOptions) {
    if (this._inited) {
      return;
    }
    this._inited = true;
    opts.textureLifeFrame = Math.abs(opts.textureLifeFrame) || 1;
    opts.textureLimitCount = Math.abs(opts.textureLimitCount) || 10;
    opts.enable = !!opts.enable;
    opts.cycleFrame = Math.max(opts.cycleFrame, 0);
    this.opts = opts;

    let count = 0;
    cc.director.on(cc.Director.EVENT_AFTER_DRAW, () => {
      if (this.opts && this.opts.enable) {
        if (count >= this.opts.cycleFrame) {
          count = 0;
          this.gc();
        }
        count++;
      }
    });
  }
  /**
   * 设置资源是否为受保护状态
   *
   * 如果一个资源即使没有人使用，也不想被释放掉，可以设置`protect`为`true`，主要应用在预加载的需求上。
   *
   * @example
   *    spriteFrame.protect = true;
   *    texture.protect = true;
   */
  public protectAsset(asset: cc.Asset, b: boolean = true) {
    asset.protect = !!b;
  }
  /**
   * 重置所有受保护的资源
   */
  public resetProtectAssets() {
    cc.assetManager.assets.forEach((asset: cc.Asset, key) => {
      asset.protect = false;
    });
  }
  /**
   * 立即执行一次GC
   */
  public gc() {
    if (this.opts.textureEnable) {
      this.gcTexture();
    }
    if (this.opts.removeNodeEnable) {
      this.gcRemoveNode();
    }
  }
  private gcRemoveNode() {
    const total = cc.director.getTotalFrames();

    let releaseNodeCount = 0;
    // 给node也增加一个latestRenderFrame, 用于判断remove的node，是否需要释放
    // @ts-ignore
    const nodes = cc.pool.removeNodes._pool;
    for (let i = 0; i < nodes.length; i++) {
      if (releaseNodeCount >= this.opts.removeNodeLimitCount) {
        break;
      }
      const node = nodes[i];
      if (!node && !node.isValid) {
        continue;
      }

      const diff = total - (node.latestFrame || total);
      const destroy = diff > this.opts.removeNodeLifeFrame;
      if (destroy) {
        cc.log("try remove node: ", node);
        // 这里面会影响nodes的长度，依旧i++会跳过，可能出现问题
        node.destroy && node.destroy();
        releaseNodeCount++;
      }
    }
  }
  private gcTexture() {
    const total = cc.director.getTotalFrames();
    let releaseAssetCount = 0;
    cc.assetManager.assets.forEach((asset: cc.Asset, key) => {
      if (releaseAssetCount >= this.opts.textureLimitCount) {
        return false;
      }
      // 保护资源，不释放
      if (asset.protect === true) {
        return;
      }
      // refCount为0，是通过cc.loader.load动态加载的资源
      if (asset.refCount !== 0) {
        // 不为0，说明有静态引用，比如在场景文件中直接引用的资源，需要通过勾选场景的自动释放来释放资源
        return;
      }
      if (asset.dynamicRefCount <= 0) {
        if (asset instanceof cc.Texture2D || asset instanceof cc.SpriteFrame) {
        } else {
          // asset instanceof cc.Prefab || //暂时不检测cc.Prefab类型的资源
          return;
        }
        if (!asset["getLatestRenderFrame"] || typeof asset["getLatestRenderFrame"] !== "function") {
          debugger;
          return;
        }
        const frame = asset.getLatestRenderFrame();
        const diff = total - frame;
        const bRelease = diff > this.opts.textureLifeFrame;
        if (bRelease) {
          cc.log("try release texture: ", asset.name);
          cc.assetManager.releaseAsset(asset);
          releaseAssetCount++;
        }
      }
    });
  }
}

export const gc = new GC();
