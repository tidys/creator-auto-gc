export interface GcOptions {
  /**
   * 是否开启GC
   */
  enable: boolean;
  /**
   * 每次GC时，释放的纹理数量上限，防止一帧发生大量GC导致卡顿
   */
  gcReleaseLimitCount: number;

  /**
   * 纹理多少帧未使用，自动释放该纹理
   */
  lifeFrame: number;
}
export class GC {
  private opts: GcOptions | null = null;
  public init(opts: GcOptions) {
    this.opts = opts;
    cc.director.on(cc.Director.EVENT_AFTER_DRAW, () => {
      if (this.opts && this.opts.enable) {
        this.doGc();
      }
    });
  }
  private doGc() {
    let count = 0;
    cc.assetManager.assets.forEach((asset: cc.Asset, key) => {
      if (count >= this.opts.gcReleaseLimitCount) {
        return false;
      }
      // refCount为0，是通过cc.loader.load动态加载的资源
      if (asset.refCount !== 0) {
        // 不为0，说明有静态引用，比如在场景文件中直接引用的资源，需要通过勾选场景的自动释放来释放资源
        return;
      }
      if (asset.dynamicRefCount === 0) {
        asset.latestFrame;
        cc.assetManager.releaseAsset(asset);
        count++;
      }
    });
  }
}

export const gc = new GC();
