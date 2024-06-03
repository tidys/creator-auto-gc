const { ccclass, property } = cc._decorator;
const FontSize = 20;
@ccclass
export default class NewClass extends cc.Component {
  @property(cc.Node)
  bgNode: cc.Node = null;

  @property(cc.SpriteFrame)
  frame: cc.SpriteFrame = null;
  protected onLoad(): void {
    const root = new cc.Node();
    root.zIndex = 100;
    this.node.addChild(root);
    this.createButtons(root, [
      {
        name: "logAssets",
        cb: () => {
          console.log(cc.assetManager.assets);
        },
      },
      {
        name: "log ref",
        cb: () => {
          let assets = this.frame.getTexture();
          if (assets) {
            console.log(assets.refCount);
          } else {
            console.error("can't get asset");
          }
        },
      },
      {
        name: "set spriteFrame",
        cb: () => {
          const sprite = this.bgNode.getComponent(cc.Sprite);
          if (sprite) {
            debugger;
            sprite.spriteFrame = this.frame;
            sprite.sizeMode = cc.Sprite.SizeMode.CUSTOM;
            this.bgNode.setContentSize(500, 500);
          }
        },
      },
      {
        name: "clean spriteFrame",
        cb: () => {
          if (this.bgNode) {
            this.bgNode.removeFromParent();
            const spr = this.bgNode.getComponent(cc.Sprite);
            if (spr) {
              spr.spriteFrame = null;
            }
          }
        },
      },
      {
        name: "clean asset",
        cb: () => {
          let assets = this.frame.getTexture();
          if (assets) {
            cc.assetManager.releaseAsset(assets);
            console.log("clean success");
          } else {
            console.error("can't get asset");
          }
        },
      },
      {
        name: "2",
        cb: () => {
          cc.director.loadScene("2");
        },
      },
    ]);
  }
  private createButtons(root: cc.Node, list: Array<{ name: string; cb: Function }>) {
    let widget = root.getComponent(cc.Widget);
    if (!widget) {
      widget = root.addComponent(cc.Widget);
    }
    widget.isAlignTop = true;
    widget.isAlignRight = true;
    widget.top = FontSize;
    widget.right = 10;
    widget.alignMode = cc.Widget.AlignMode.ALWAYS;

    let layout = root.getComponent(cc.Layout);
    if (!layout) {
      layout = root.addComponent(cc.Layout);
    }
    layout.type = cc.Layout.Type.VERTICAL;
    layout.spacingY = 5;

    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      const node = new cc.Node();
      node.anchorX = 1;
      node.anchorY = 0.5;
      node.x = 0;
      const label = node.addComponent(cc.Label);
      label.fontSize = FontSize;
      label.lineHeight = FontSize;
      label.string = item.name || "";
      node.on(cc.Node.EventType.TOUCH_START, () => {
        node.color = new cc.Color(Math.random() * 255, Math.random() * 255, Math.random() * 255);
      });
      node.on(cc.Node.EventType.TOUCH_END, () => {
        item.cb && item.cb();
      });
      node.parent = root;
    }
    root.width = 0;
  }
}
