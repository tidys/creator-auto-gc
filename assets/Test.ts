import { gc } from "./gc";

const { ccclass, property } = cc._decorator;
const FontSize = 20;
@ccclass
export default class NewClass extends cc.Component {
  @property(cc.Node)
  bgNode: cc.Node = null;

  @property(cc.SpriteFrame)
  frame: cc.SpriteFrame = null;
  protected onLoad(): void {
    gc.init({
      enable: false,
      cycleFrame: 0,
      textureEnable: true,
      textureLimitCount: 1,
      textureLifeFrame: 10,
      removeNodeEnable: false,
      removeNodeLimitCount: 1,
      removeNodeLifeFrame: 10,
    });
    const root = new cc.Node();
    root.name = "buttons";
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
        name: "log frame dyref",
        cb: () => {
          let assets = this.frame.getTexture();
          if (assets) {
            console.log(assets.dynamicRefCount);
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
            sprite.spriteFrame = this.frame;
            // sprite.sizeMode = cc.Sprite.SizeMode.RAW;
            // this.bgNode.setContentSize(500, 500);
          }
        },
      },
      {
        name: "reset spriteFrame",
        cb: () => {
          if (this.bgNode) {
            const spr = this.bgNode.getComponent(cc.Sprite);
            if (spr) {
              spr.spriteFrame = null;
            }
          }
        },
      },
      {
        name: "remove from parent",
        cb: () => {
          if (this.bgNode) {
            this.bgNode.removeFromParent();
            this.bgNode = null;
          }
        },
      },
      {
        name: "replace by loadRes 1.png",
        cb: () => {
          cc.loader.loadRes("1.png", cc.SpriteFrame, (error: Error, spriteFrame: cc.SpriteFrame) => {
            if (error) {
            } else {
              console.log(spriteFrame.getTexture().refCount);
              this.bgNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
              console.log(spriteFrame.getTexture().refCount);
            }
          });
        },
      },
      {
        name: "get 1.png dyref",
        cb: () => {
          cc.loader.loadRes("1.png", cc.SpriteFrame, (error: Error, spriteFrame: cc.SpriteFrame) => {
            if (error) {
            } else {
              console.log(spriteFrame.dynamicRefCount);
            }
          });
        },
      },
      {
        name: "clean frame",
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
        name: "scene 2",
        cb: () => {
          cc.director.loadScene("2");
        },
      },
      {
        name: "test ondestroy",
        cb: () => {
          this.bgNode.destroy();
        },
      },
      {
        name: "test active=false",
        cb: () => {
          cc.loader.loadRes("assets_resources.png", cc.SpriteFrame, (error: Error, spriteFrame: cc.SpriteFrame) => {
            if (error) {
            } else {
              this.bgNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
              console.log("update spriteFrame success");
              setTimeout(() => {
                console.log("hide node");
                this.bgNode.active = false;
                setTimeout(() => {
                  console.log("show node");
                  this.bgNode.active = true;
                }, 1000);
              }, 1000);
            }
          });
        },
      },
      {
        name: "test removeFromParent",
        cb: () => {
          this.bgNode.removeFromParent();
        },
      },
      {
        name: "test removeAllChildren",
        cb: () => {
          this.bgNode.removeAllChildren();
        },
      },
      {
        name: "test remove&destroy",
        cb: () => {
          this.bgNode.removeFromParent();
          // @ts-ignore
          cc.pool.removeNodes.log();
          this.bgNode.destroy();
          // @ts-ignore
          cc.pool.removeNodes.log();
        },
      },
      {
        name: "test prefab",
        cb: () => {
          cc.loader.loadRes("prefab1", cc.Prefab, (error: Error, prefab: cc.Prefab) => {
            if (error) {
            } else {
              this.bgNode.addChild(cc.instantiate(prefab));
            }
          });
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
