import { createButtons } from "./util";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
  @property(cc.Prefab)
  prefab: cc.Prefab = null;

  private allAssets: cc.SpriteFrame[] = [];

  onLoad() {
    cc.debug.setDisplayStats(true);
    // @ts-ignore
    cc.gc.init({
      enable: true,
      cycleFrame: 0,
      assetEnable: true,
      assetLimitCount: 1,
      assetLifeFrame: 10,
      removeNodeEnable: false,
      removeNodeLimitCount: 1,
      removeNodeLifeFrame: 10,
    });

    const root = new cc.Node();
    root.name = "buttons";
    root.zIndex = 100;
    this.node.addChild(root);
    createButtons(root, [
      {
        name: "random prefab 100",
        cb: () => {
          this.randomPrefab();
        },
      },
      {
        name: "loadAll",
        cb: () => {
          this.onLoadAll();
        },
      },
      {
        name: "release one",
        cb: () => {
          setInterval(() => {
            if (this.allAssets.length) {
              // @ts-ignore
              cc.gc.protectAsset(this.allAssets[this.allAssets.length - 1], false);
              this.allAssets.pop();
            }
          }, 100);
        },
      },
    ]);
  }

  randomPrefab() {
    const space = 100;
    for (let i = 0; i < 4000; i++) {
      const node = cc.instantiate(this.prefab);
      const size = cc.view.getVisibleSize();
      const x = -size.width / 2 + Math.random() * size.width;
      const y = -size.height / 2 + space + Math.random() * (size.height - space * 2);
      node.setPosition(x, y);
      cc.Canvas.instance.node.addChild(node);
    }
  }
  onLoadAll() {
    cc.loader.loadResDir("large", cc.SpriteFrame, (err: any, res: cc.SpriteFrame[]) => {
      if (err) {
        console.log(err);
        return;
      }
      // @ts-ignore
      res.map((item) => cc.gc.protectAsset(item, true));
      console.log("load finish, total ", res.length);
      this.allAssets = res;
    });
  }
  start() {}

  // update (dt) {}
}
